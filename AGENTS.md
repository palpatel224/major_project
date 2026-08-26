# AI Agent & Developer Workflow

> **Note to AI Agents**: You MUST read and follow these steps for every prompt you receive in this project. 
> **Note to Developers**: Reference this file in your prompts (e.g., "@AI_AGENT_WORKFLOW.md") to ensure consistent behavior from your AI coding assistants across the team.

This project is built by a team of multiple developers, each utilizing AI agents. To maintain a coherent, bug-free, and highly readable codebase, every task must follow this strict 4-step workflow.

---

## Step 1: Read and Understand Context FIRST
Before writing or modifying any code, you must:
1. Read the user's prompt carefully.
2. Read the `docs/CONTRIBUTING.md` file to understand the strict architectural boundaries (Frontend vs. Tauri Rust vs. Python Sidecar).
3. Check the `docs/` folder for any existing documentation related to the component you are modifying.
4. If you are unsure about the architecture or intent, **ask clarifying questions** before proceeding.

## Step 2: Execute Code Changes
When writing code, you must respect the project boundaries:
- **Frontend (`/frontend`)**: Strictly UI and CornerstoneJS rendering. No heavy data processing.
- **Backend (`/tauri`)**: Strictly OS bridging, process management, and IPC. No ML logic.
- **Sidecar (`/python`)**: Strictly ML execution and DICOM/OCT parsing. No UI popups.

## Step 3: Enforce Comments and Extensive Logging
The code must be understandable by a different developer tomorrow.
1. **Block Comments**: Add descriptive comments before every major logic block, function, or class. Comments must explain the *WHY* behind the code, not just the *WHAT*.
2. **Extensive Logging**: 
   - *Python*: Use `print(..., flush=True)` or the `logging` module extensively to track inference stages, hardware detection, and buffer writes.
   - *Rust*: Use `println!`/`eprintln!` or the `log` crate to track IPC commands, file I/O operations, and sidecar lifecycle events.
   - *Frontend*: Use `console.debug()` and `console.error()` for Tauri command invocations and state changes.

## Step 4: Update Documentation
Code and documentation must evolve together in the same step.
- Did you add a new Python dependency? Update `python/pyproject.toml` and the setup instructions in the `README.md`.
- Did you introduce a new IPC command in Rust? Document it in a new or existing Markdown file in the `docs/` folder.
- Did you change how a UI component receives data? Update the relevant documentation.
- Never complete a task without asking yourself: *"Does the team's documentation accurately reflect the code I just wrote?"*

---
**Agent Check-off**: By executing tasks in this repository, you acknowledge that you will read the docs, enforce logging/comments, and update documentation before concluding your response.
