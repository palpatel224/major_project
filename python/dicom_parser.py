import os
import glob
import json
import uuid
import pydicom
from pydicom.errors import InvalidDicomError
import numpy as np

# WHY: We need to parse a directory of DICOM files, extract the raw pixel arrays,
# and write them as raw binary buffers to disk. This is necessary because we use
# CornerstoneJS on the frontend, which will read these raw buffers efficiently
# via our custom image loader (`oct-asset://`). This avoids the overhead of
# passing heavy image arrays through Tauri's IPC as base64 or JSON.

def find_dicom_files(study_path: str) -> list[str]:
    """
    Scans the given directory recursively for .dcm files or files containing DICOM data.
    """
    # WHY: DICOM files don't always have a .dcm extension. We will check all files,
    # but for optimization, we can also use glob if there are specific patterns.
    # For now, we will traverse all files in the directory.
    dicom_files = []
    print(f"Scanning directory: {study_path}", flush=True)
    
    for root, _, files in os.walk(study_path):
        for file in files:
            file_path = os.path.join(root, file)
            # Skip hidden files or obvious non-dicom
            if file.startswith('.'):
                continue
            dicom_files.append(file_path)
            
    print(f"Found {len(dicom_files)} potential files.", flush=True)
    return dicom_files

def sort_dicom_dataset(datasets: list[tuple[str, pydicom.dataset.FileDataset]]) -> list[tuple[str, pydicom.dataset.FileDataset]]:
    """
    Sorts a list of (filepath, dataset) tuples.
    """
    # WHY: We sort by InstanceNumber or SliceLocation rather than filename because
    # DICOM doesn't guarantee filenames are ordered by acquisition sequence.
    def sort_key(item):
        _, ds = item
        # Try Instance Number
        if hasattr(ds, 'InstanceNumber') and ds.InstanceNumber is not None:
            return float(ds.InstanceNumber)
        # Try Slice Location
        if hasattr(ds, 'SliceLocation') and ds.SliceLocation is not None:
            return float(ds.SliceLocation)
        # Fallback to filename
        return item[0]
        
    sorted_datasets = sorted(datasets, key=sort_key)
    return sorted_datasets

def parse_study(study_path: str):
    """
    Main entry point for parsing a study directory. Reads all DICOMs, extracts
    metadata and pixel data, writes them as raw binary files, and outputs a manifest.json.
    """
    # WHY: We need a coordinated process that reads, sorts, and exports the DICOM data
    # to a specific temporary location that the Tauri backend can serve.
    potential_files = find_dicom_files(study_path)
    
    datasets = []
    for fpath in potential_files:
        try:
            ds = pydicom.dcmread(fpath, force=True)
            # Ensure it actually has pixel data before we consider it an image slice
            if hasattr(ds, 'PixelData'):
                datasets.append((fpath, ds))
        except (InvalidDicomError, TypeError, OSError):
            continue
            
    print(f"Successfully loaded {len(datasets)} DICOM files with pixel data.", flush=True)
    
    if not datasets:
        print("No valid DICOM files found in study path.", flush=True)
        return
        
    datasets = sort_dicom_dataset(datasets)
    
    # Generate a unique study ID to prevent collisions
    study_id = str(uuid.uuid4())
    output_dir = f"/tmp/oct-insight/{study_id}"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Created output directory: {output_dir}", flush=True)
    
    # Extract study metadata from the first valid slice
    # WHY: We assume all slices in a series share the same basic dimensions and metadata.
    reference_ds = datasets[0][1]
    
    width = getattr(reference_ds, 'Columns', 0)
    height = getattr(reference_ds, 'Rows', 0)
    bits_allocated = getattr(reference_ds, 'BitsAllocated', 8)
    pixel_spacing = getattr(reference_ds, 'PixelSpacing', [1.0, 1.0])
    
    if isinstance(pixel_spacing, pydicom.multival.MultiValue):
        pixel_spacing = [float(x) for x in pixel_spacing]
    
    laterality = getattr(reference_ds, 'ImageLaterality', getattr(reference_ds, 'Laterality', 'Unknown'))
    study_date = getattr(reference_ds, 'StudyDate', 'Unknown')
    
    slice_files = []
    
    for idx, (fpath, ds) in enumerate(datasets):
        try:
            arr = ds.pixel_array
            
            # Write to raw binary format
            raw_filename = f"slice_{idx:03d}.raw"
            raw_filepath = os.path.join(output_dir, raw_filename)
            
            # Ensure it's contiguous and write it directly as bytes
            with open(raw_filepath, "wb") as f:
                f.write(np.ascontiguousarray(arr).tobytes())
                
            slice_files.append(raw_filename)
            
            if idx % 10 == 0 or idx == len(datasets) - 1:
                print(f"Processed slice {idx + 1}/{len(datasets)}: {arr.shape}, type={arr.dtype}", flush=True)
                
        except Exception as e:
            print(f"Error processing slice {fpath}: {e}", flush=True)
            
    manifest = {
        "studyId": study_id,
        "width": width,
        "height": height,
        "bitDepth": bits_allocated,
        "sliceCount": len(slice_files),
        "sliceFiles": slice_files,
        "pixelSpacing": pixel_spacing,
        "laterality": laterality,
        "studyDate": study_date
    }
    
    manifest_path = os.path.join(output_dir, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
        
    print(f"Wrote manifest to {manifest_path}", flush=True)
    print(f"Finished parsing study. Output location: {output_dir}", flush=True)
