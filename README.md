# OCT Insight Desktop

OCT Insight Desktop is a local-first medical imaging application designed for visualizing and analyzing Optical Coherence Tomography (OCT) studies alongside AI model inference results. It features a Rust-based Tauri backend, a React/Tailwind frontend powered by CornerstoneJS, and a Python sidecar for robust, local machine learning execution.

## Project Structure

The repository is modularized into three distinct environments:

- **`frontend/`**: The React + TypeScript user interface. Handles user interactions, web-based DICOM/OCT rendering (via CornerstoneJS), and styling (Tailwind CSS v4).
- **`tauri/`**: The Rust backend. Manages the native application window, spawns the Python sidecar, handles OS-level file buffering, and serves raw image data to the frontend via the `oct-asset://` custom protocol.
- **`python/`**: The local inference engine sidecar. Parses arguments, auto-detects hardware acceleration (CUDA/MPS/CPU), runs the model execution, and dumps raw results to disk for the Tauri backend to consume.
- **`docs/`**: Documentation repository detailing architecture, guidelines, and project rules.

## Developer Workflow

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Rust & Cargo](https://rustup.rs/) (v1.75+)
- [Python](https://www.python.org/) (3.10+)
- [uv](https://astral.sh/uv) (Python package manager)

### 1. Setup

First, install dependencies for the frontend:
```bash
cd frontend
npm install
```

Install dependencies for the Python sidecar:
```bash
cd python
uv sync
```
*Note: The sidecar uses `pydicom` to parse DICOM files.*

### 2. Loading a DICOM Study
To use the DICOM Viewer:
1. Run the application (see instructions below).
2. Click **Open study** in the top AppBar.
3. Select a folder containing `.dcm` files.
4. The Python sidecar will parse the files into `.raw` buffers in `/tmp/oct-insight/`.
5. The frontend will render them using CornerstoneJS. Use your mouse wheel to scroll through slices.

### 2. Development

To run the application in development mode (with hot-reloading for both React and Rust):
```bash
cd tauri
cargo tauri dev
# Alternatively, from the frontend directory:
# npm run tauri dev
```

*Note: In development, the Tauri backend expects to spawn a binary named `sidecar`. You may need to compile the Python script using PyInstaller into `tauri/binaries/sidecar` to test the full pipeline end-to-end, or temporarily modify `tauri/src/lib.rs` to invoke the `python` interpreter directly for rapid iteration.*

## Documentation

See the [docs/](./docs/) directory for detailed guidelines on how to navigate the codebase, styling rules, and contribution standards. Start with [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).
