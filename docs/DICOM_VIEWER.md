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

## Responsive Workspace & Laptop Compatibility

To support clinicians working on laptops of varying display dimensions (13", 14", 16", MacBook Retina scaling, 1080p, 768p/800p height, or tiled/split-screen windows), the frontend implements an adaptive layout architecture:

1. **CornerstoneJS Dynamic Canvas Resizing (`ResizeObserver`)**:
   - `CornerstoneViewport` binds a `ResizeObserver` to each viewport container element.
   - Whenever window dimensions change or sidebars are toggled, `renderingEngine.resize(true, false)` is triggered automatically to ensure zero aspect-ratio distortion or pixel stretching.

2. **Adaptive Layout Modes**:
   - **Dual View (Side-by-Side)**: Default mode on widescreen laptops (>= 1024px).
   - **Stacked View (Top/Bottom)**: Optimized for vertical laptop orientations, narrow windows, or tall aspect ratios.
   - **Single View**: Maximizes either the Source OCT or AI Model Output to 100% of the viewport container, with single-click tab switching.

3. **Collapsible Panels for Maximum Medical Real Estate**:
   - **Collapsible Study Navigator**: Can be collapsed via the AppBar toggle button or sidebar header chevron to liberate up to 284px of horizontal space for B-scans.
   - **Collapsible Quantitative Insights Tray**: Bounded in maximum height with an expandable drawer design. When collapsed to a single ~34px summary strip, viewports retain 85%+ of total screen height on 768p/800p displays.

4. **Adaptive Controls**:
   - `SliceScrubber` includes tactile step buttons (`<` / `>`) alongside the range slider for trackpad navigation.
   - `AppBar` and `ViewerToolbar` employ flexible truncation, overflow prevention, and responsive padding.

## Limitations
- This is a viewer-only implementation. No ML models are executed.
- Currently expects grayscale OCT images.
- Hardcoded to save temp files to `/tmp/oct-insight/` which may have issues on Windows unless mapped to a temp directory or `%TEMP%`.

