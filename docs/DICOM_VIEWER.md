# DICOM Viewer Architecture

This document explains the architecture and functionality of the MVP OCT DICOM Viewer implemented in OCT Insight Desktop.

## Data Pipeline Pipeline
To avoid passing large medical images over Tauri IPC (which can be slow when serializing to JSON or Base64), we use a hybrid approach:

1. **Python Parsing**: The Python sidecar (using `pydicom`) parses a selected directory of `.dcm` files. It extracts the raw pixel arrays and saves them directly to disk as contiguous binary `.raw` files in `/tmp/oct-insight/<study-id>/`. It also outputs a `manifest.json` containing the metadata (dimensions, slice count).
2. **Tauri IPC**: Tauri provides the native file dialog (`open_study_folder`), spawns the sidecar (`parse_dicom_study`), and reads back the `manifest.json` (`read_study_manifest`).
3. **Asset Serving**: Tauri serves the raw buffers via a custom `oct-asset://` protocol.
4. **Frontend Rendering**: CornerstoneJS uses a custom image loader (`octAsset`) to fetch these raw bytes over the local `oct-asset://` protocol and construct `IImage` objects for fast rendering.

## IPC Commands
- `open_study_folder`: Opens a native directory picker using `tauri-plugin-dialog`.
- `parse_dicom_study`: Spawns the Python sidecar in `--mode parse-dicom`. Streams stdout/stderr events to the UI.
- `read_study_manifest`: Reads the JSON metadata after parsing completes.

## Navigation and Shortcuts
- **Scroll Wheel / Trackpad**: Scroll up/down to navigate slices.
- **Up/Right Arrow**: Next slice.
- **Down/Left Arrow**: Previous slice.
- **Page Up/Down**: Jump 10 slices forward/backward.
- **Home/End**: Jump to first/last slice.

## Limitations
- This is a viewer-only implementation. No ML models are executed.
- Currently expects grayscale OCT images.
- Hardcoded to save temp files to `/tmp/oct-insight/` which may have issues on Windows unless mapped to a temp directory or `%TEMP%`.
