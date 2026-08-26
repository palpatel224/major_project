# Product Requirements Document: OCT Insight Desktop

**Status:** Draft v1.0  
**Date:** 13 August 2026  
**Product type:** Offline-first desktop application  
**Initial modality:** Ophthalmic Optical Coherence Tomography (OCT)  
**Primary users:** Ophthalmologists, optometrists, clinical researchers, and ML developers supporting them  
**Working title:** OCT Insight Desktop

## 1. Executive summary

OCT Insight Desktop is a clinician-friendly toolbox for reviewing OCT studies and the outputs of locally installed machine-learning models. A user imports an OCT study, selects a compatible model, runs inference on the local machine, and reviews the original and processed volumes side by side. Both viewports remain locked to the same B-scan slice so that scrolling advances the input and output together.

The application is intentionally model-agnostic. A local plug-in contract lets different OCT models declare their supported inputs, preprocessing requirements, outputs, and result statistics. The viewer adapts to different image dimensions, slice counts, pixel spacing, bit depths, and aspect ratios without stretching or cropping clinically relevant content.

The first release is a review and research tool, not an autonomous diagnostic system. It displays model provenance, inference state, confidence/quality information, and visible warnings so clinicians can distinguish source data from generated results.

## 2. Problem statement

OCT ML workflows are commonly fragmented across scripts, notebooks, model-specific tools, and image viewers. This creates four core problems:

1. Clinicians cannot easily compare the source B-scan with the corresponding model result at the same slice.
2. Each model tends to require a custom UI or custom preprocessing workflow.
3. OCT studies vary in resolution, slice count, spacing, orientation, bit depth, and export format.
4. General-purpose medical image viewers are powerful but do not provide a focused, approachable workflow for local OCT model inference and result review.

## 3. Research grounding

- OCT provides high-resolution, cross-sectional ophthalmic imaging. Anterior-segment OCT is non-contact and supports both qualitative assessment and quantitative measurements, while important landmarks or deeper structures may not always be visible. The UI must therefore preserve the source image, communicate image quality, and avoid implying that a model result replaces clinical interpretation. See [EyeWiki: Anterior Segment Optical Coherence Tomography](https://eyewiki.org/Anterior_Segment_Optical_Coherence_Tomography).
- Iris cyst assessment may use AS-OCT, but posterior shadowing can limit visualization; UBM may be more suitable for characterizing some cysts. The application should present model outputs as supporting information and make modality limitations visible. See [EyeWiki: Iris Cysts](https://eyewiki.org/Iris_Cysts).
- Established DICOM viewers make rapid series browsing, synchronized comparison, zoom/pan, windowing, ROI tools, metadata inspection, and export readily accessible. These interaction patterns inform the desktop viewer, while the scope remains OCT-specific. See [RadiAnt Viewer features](https://www.radiantviewer.com/dicom-viewer-manual/radiant_dicom_viewer_features.html) and [RadiAnt series navigation](https://www.radiantviewer.com/dicom-viewer-manual/browse_series_and_images.html).
- DICOM defines an Ophthalmic Tomography Image IOD for single-frame and multi-frame ophthalmic images. It also notes that pixel and slice spacing may vary across a volume, so the application must not assume uniform geometry. See [DICOM Ophthalmic Tomography Image IOD](https://dicom.nema.org/medical/dicom/2024e/output/chtml/part03/sect_A.52.html) and [DICOM Ophthalmic Tomography Image Module](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_c.8.17.7.html).

## 4. Product vision

Make local OCT model evaluation feel like using a modern clinical imaging workstation: open a study, run a model, review synchronized evidence, understand the result, and export a traceable summary without leaving the desktop.

## 5. Goals

### 5.1 Primary goals

- Display OCT volumes reliably across differing resolutions, slice counts, orientations, and aspect ratios.
- Provide synchronized input-versus-output comparison at the same slice.
- Support mouse wheel, trackpad, keyboard, scrollbar, and direct slice entry for volume navigation.
- Load and run compatible ML models entirely on the local machine.
- Make models plug-and-play through a versioned manifest and result contract.
- Show scan metadata, quality indicators, model provenance, and model-produced statistics.
- Provide an interface that is calm, modern, readable, and safe for clinicians under time pressure.
- Preserve source data and clearly distinguish raw, derived, and annotated content.

### 5.2 Secondary goals

- Allow overlays such as segmentation masks, probability maps, anatomical boundaries, and points.
- Provide basic measurement and annotation tools when physical calibration is available.
- Save a review session locally and export selected images or a summary report.
- Make the architecture extensible to future OCT tasks without redesigning the core viewer.

### 5.3 Non-goals for MVP

- Cloud inference, server-side storage, or remote model execution.
- PACS/RIS integration, DICOM query/retrieve, or hospital-wide worklists.
- Support for modalities other than ophthalmic OCT.
- Automated diagnosis, treatment recommendation, or replacement of clinical judgment.
- Model training, fine-tuning, dataset labeling at scale, or experiment tracking.
- Full 3D volume rendering, advanced MPR, or vendor-proprietary raw formats without an available parser.
- Regulatory certification or production clinical deployment in the initial research release.

## 6. Users and jobs to be done

### 6.1 Ophthalmologist / clinician

**Job:** Review an OCT study and determine whether a model output is plausible, useful, and consistent across slices.

Needs:

- Minimal setup and obvious primary actions.
- Fast, synchronized scrolling.
- Legible case and laterality context.
- One-click visibility control for overlays.
- Clear separation between source image and AI-derived result.
- Confidence and quality warnings that do not obscure the image.

### 6.2 Clinical researcher

**Job:** Compare model behavior across studies and capture traceable examples for research review.

Needs:

- Model/version provenance.
- Repeatable local inference.
- Slice-level and volume-level statistics.
- Export of de-identified images and structured results.

### 6.3 ML engineer / model integrator

**Job:** Add a new OCT model without building a new desktop UI.

Needs:

- A documented plug-in manifest.
- Input validation and compatibility reporting.
- Standardized output types.
- Logs and actionable error messages.
- Isolation between application UI and model runtime.

### 6.4 Application administrator / lab lead

**Job:** Install approved models and understand what versions are available locally.

Needs:

- Model inventory, version, checksum, runtime requirements, and enable/disable control.
- Clear local storage locations and disk usage.
- No silent network transfer.

## 7. Product principles

1. **Source first:** The original OCT is always available and never silently modified.
2. **Same slice, same moment:** Linked viewports default to the identical slice index and spatial presentation.
3. **Clinical context stays visible:** Patient/case identifier, laterality, scan date, series, slice, and model state remain accessible.
4. **AI is inspectable:** Every output identifies its model, version, run time, status, and limitations.
5. **Progressive disclosure:** Common actions remain visible; advanced metadata and settings live in inspectors.
6. **No hidden resizing:** The viewer preserves aspect ratio and provides explicit Fit, Fill, and 1:1 pixel modes.
7. **Offline by default:** Images, PHI, models, results, and logs remain local unless the user explicitly exports them.

## 8. Terminology

- **Study:** A patient imaging examination that may contain one or more OCT series.
- **Series / volume:** An ordered set of OCT B-scans belonging to one acquisition.
- **Slice / B-scan / frame:** One cross-sectional image within the ordered volume.
- **Anatomical layer:** A tissue boundary or region such as a retinal or corneal layer; this is not the same as a volume slice.
- **Overlay:** Model- or user-generated information drawn over an image, such as a mask, contour, boundary, or marker.
- **Processed output:** Any model-generated image, mask, probability map, measurement set, or label associated with the input study.

## 9. Information architecture

### 9.1 Primary desktop workspace

- **App bar:** Product identity, current case context, model state, import/run/export actions.
- **Study navigator:** Study and series list with thumbnails, laterality, modality, dimensions, and slice count.
- **Comparison workspace:** Two equally weighted viewports: Original and Model Output.
- **Shared slice navigator:** Slice number, total slices, scrollbar/scrubber, previous/next controls, and link state.
- **Viewer toolbar:** Fit, 1:1, zoom, pan, brightness/contrast, reset, overlay visibility, and measurement tools.
- **Inspector:** Model selection, output layers, opacity, run provenance, and warnings.
- **Statistics tray:** Scan metadata, image quality, volume-level findings, per-slice values, and a small trend plot.
- **Status bar:** Load/inference progress, device/runtime, memory warnings, and local/offline status.

### 9.2 Supporting screens

- Welcome / import study.
- Model manager.
- Model installation and validation.
- Inference progress and failure details.
- Export dialog.
- Preferences and keyboard shortcuts.

## 10. Core workflow

1. User opens the application.
2. User selects **Open OCT study** and chooses a DICOM file/folder, multi-frame object, or supported image stack.
3. The app scans metadata, groups frames into series, validates ordering and dimensions, and shows a non-blocking import summary.
4. User selects a series; the original volume becomes scrollable immediately.
5. The app lists locally installed models compatible with the selected series.
6. User selects a model and reviews its version, expected input, and declared outputs.
7. User runs inference. Progress is visible and cancellable; the original remains reviewable.
8. When complete, the output viewport opens at the same current slice.
9. User scrolls through the volume. Input and output advance together by default.
10. User toggles masks/boundaries, changes opacity, inspects statistics, adds optional measurements or notes, and flags uncertain slices.
11. User exports selected images and/or a de-identified result summary with model provenance.

## 11. Functional requirements

Priority uses **P0 = required for MVP**, **P1 = important next**, and **P2 = future**.

### FR-01 Import and study validation — P0

- Import a DICOM file, DICOM folder/series, multi-frame ophthalmic tomography object, or ordered PNG/TIFF image stack.
- Recursively inspect a chosen folder only after user confirmation.
- Group files by study/series metadata where available.
- Detect inconsistent frame dimensions, missing slices, duplicate frames, unsupported compression, and missing ordering information.
- Show a validation summary before inference if issues may affect the model.
- Never alter source files during import.

**Acceptance:** A valid study opens into a scrollable volume; invalid or ambiguous inputs produce a clear explanation and recovery path.

### FR-02 Resolution-agnostic image handling — P0

- Accept variable width, height, bit depth, slice count, and pixel spacing.
- Preserve original aspect ratio and orientation metadata.
- Default to Fit-to-viewport without upscaling beyond a configurable threshold.
- Offer 1:1 pixel view and visible zoom percentage.
- Use physical units for measurement only when trustworthy calibration metadata is available.
- Record every preprocessing transformation supplied to the model, including resize, crop, padding, normalization, and orientation changes.
- Map model outputs back into the source-image coordinate space before display.
- Support non-uniform slice spacing in metadata and avoid presenting an incorrect uniform physical depth.

**Acceptance:** Input and output alignment remains correct for portrait, landscape, square, high-resolution, low-resolution, and non-uniformly spaced studies.

### FR-03 Volume and slice navigation — P0

- Scroll one slice per mouse-wheel/trackpad step by default.
- Support Up/Down arrows for one slice and Page Up/Page Down for a larger jump.
- Provide a vertical or horizontal scrubber with current slice and total count.
- Allow direct numeric slice entry.
- Provide first/last and previous/next controls.
- Debounce rendering so rapid scrolling stays responsive.
- Keep current slice visible in both viewer headers.

**Acceptance:** A clinician can move from any slice to an adjacent slice with one consistent action and without losing view alignment.

### FR-04 Synchronized side-by-side comparison — P0

- Show Original and Model Output simultaneously.
- Lock slice index by default; one scroll updates both panels.
- Lock zoom and pan by default when source/output coordinates match.
- Allow link states to be independently disabled for slice, zoom, and pan.
- Provide a one-click **Reset linked view** action.
- Make the active viewport visually clear without overpowering the image.
- Display a placeholder when a model has no output for the current slice.

**Acceptance:** With linking enabled, both panels always display the same slice and compatible viewport transform.

### FR-05 Image presentation tools — P0/P1

P0:

- Fit, 1:1, zoom, pan, reset, invert, brightness/contrast, and overlay visibility.
- High-quality grayscale rendering with appropriate bit-depth handling.
- Full-screen/distraction-reduced mode.

P1:

- Length, area, and angle measurement when calibrated.
- Arrow, point, and free-text annotation.
- Image presets and keyboard/mouse tool assignment.

### FR-06 Local model discovery and management — P0

- Scan a user-configured local model directory at startup and on demand.
- Read a versioned model manifest without executing model code.
- Show model name, task, version, publisher, supported input types, expected runtime, device requirements, and checksum.
- Mark models as Compatible, Compatible with preprocessing, or Incompatible for the selected study.
- Allow an administrator/user to enable, disable, add, update, or remove a local model package.
- Do not download models automatically.

**Acceptance:** Installing a conforming local package makes it selectable without changing the core UI.

### FR-07 Local inference — P0

- Execute inference in a separate worker process so a model crash does not crash the viewer.
- Support CPU execution; optional GPU backends may be declared by the model.
- Show queued, loading, preprocessing, running, postprocessing, completed, cancelled, and failed states.
- Keep source-image review responsive during inference.
- Allow cancellation.
- Capture local logs with timestamps, model version, runtime, and sanitized error details.
- Never send data or telemetry to a server by default.

**Acceptance:** A failed or cancelled model run leaves the study usable and provides a retryable error state.

### FR-08 Standard model output types — P0

A model may return one or more of:

- Processed image volume aligned to the source volume.
- Binary or multiclass segmentation mask.
- Probability/heat map.
- Anatomical layer boundaries or contours.
- Slice-level classification and confidence.
- Volume-level classification and confidence.
- Per-slice numeric metrics.
- Volume-level summary metrics.
- Quality flags, warnings, and unsupported-slice markers.

Every output must declare:

- Name, type, coordinate space, dimensions, data type, classes/labels, palette recommendation, range, unit where relevant, and whether it is safe to interpolate.

### FR-09 Overlay and result inspection — P0

- List each model output layer with visibility, opacity, and legend.
- Allow masks to be shown as fill, contour, or both when available.
- Provide a cursor readout for source intensity and model value where meaningful.
- Display slice-level results next to the current slice.
- Show model warnings in the inspector rather than permanently covering the image.
- Include a clear **AI-generated** label on derived outputs.

### FR-10 Statistics tray — P0

Minimum sections:

- **Scan:** dimensions, slice count, bit depth, pixel/slice spacing, acquisition date, laterality, device/vendor when present.
- **Quality:** missing metadata, clipping/noise indicator if provided, excluded slices, import warnings.
- **Model:** model name/version, run duration, device, completion time, preprocessing summary.
- **Findings:** model-defined volume-level metrics and current-slice metrics.
- **Trend:** a compact per-slice plot for one selected numeric metric.

The stats area must handle absent values with “Not available”; it must not fabricate measurements.

### FR-11 Session persistence — P1

- Save a local session containing source references, selected series, model run provenance, results, view state, annotations, and notes.
- On reopen, detect moved or changed source files using path plus checksum.
- Never embed source PHI into an exported session unless explicitly chosen.

### FR-12 Export — P1

- Export current paired view, current image, selected slices, or the full result series.
- Support PNG/TIFF for images and CSV/JSON for structured metrics.
- Provide a PDF summary in a later iteration.
- Include or exclude annotations and patient identifiers via explicit choices.
- Always include model name/version and an “AI-generated result” marker when exporting model output.
- Preserve original data separately; never overwrite the imported study.

### FR-13 Keyboard and accessibility — P0

- All core actions are keyboard reachable.
- Visible focus state for every interactive control.
- Minimum 40 × 40 px target, with 44 × 44 px preferred for frequent clinical actions.
- Do not use color alone for status, class, warning, or overlay identity.
- Support 100–200% UI scaling without clipping essential controls.
- Use high contrast for image annotations on dark viewports.
- Provide tooltips and a shortcut reference.

### FR-14 Error handling — P0

Errors must state:

1. What happened.
2. Whether source data is safe.
3. What the user can do next.
4. Where technical details can be viewed or copied.

Required cases include unsupported file, corrupt file, missing metadata, incompatible model, missing runtime, insufficient memory, GPU unavailable, output dimension mismatch, worker crash, and cancelled run.

## 12. Model plug-in contract

### 12.1 Package concept

A model plug-in is a local folder or signed archive containing:

- `manifest.json` describing compatibility and behavior.
- Model weights and required static resources.
- A local inference entry point.
- Optional isolated runtime/environment declaration.
- Optional labels, palettes, help text, and sample validation data.
- Checksum/signature information.

### 12.2 Manifest fields

Required fields:

- `schema_version`
- `plugin_id`
- `name`
- `model_version`
- `task_type`
- `publisher`
- `entrypoint`
- `runtime`
- `supported_modalities` (must include OCT for v1)
- `supported_input_formats`
- `input_contract`
- `preprocessing`
- `output_contracts`
- `device_requirements`
- `license`
- `checksum`

Recommended fields:

- Clinical/research intended-use statement.
- Known limitations and contraindicated inputs.
- Expected inference duration and memory.
- Minimum application API version.
- Citation/model-card location.
- Sample study and expected-output checksum for installation validation.

### 12.3 Input contract

The input contract declares:

- Single slice, ordered slice batch, or full volume.
- Accepted dimensions: fixed, ranged, or dynamic.
- Required channel count and color interpretation.
- Supported bit depths/data types.
- Required orientation/laterality metadata.
- Allowed slice counts.
- Pixel-spacing requirements.
- Whether missing/variable spacing is accepted.
- Normalization, resize, crop, padding, denoising, and intensity transforms.

### 12.4 Output contract

Each output declares:

- Stable output ID and human-readable name.
- Output kind: image, mask, heat map, contour, scalar, label, table, or warning.
- Scope: slice or volume.
- Coordinate space: source pixel, model input, physical, or independent.
- Shape and data type.
- Class definitions, color recommendations, range, unit, and display defaults.
- Mapping required to return to source coordinates.
- Whether values can be interpolated during resizing.

### 12.5 Execution boundary

- The desktop application launches the model in a separate process.
- Communication uses a versioned local protocol over standard input/output or a local IPC channel.
- The app supplies a temporary, access-limited working directory.
- The worker has no network requirement; network access should be disabled or visibly declared.
- The worker returns structured progress, outputs, warnings, and errors.
- The application validates all output shapes and metadata before display.

## 13. Resolution-agnostic behavior

Resolution agnosticism means more than resizing the image.

1. **Ingestion:** Retain native dimensions, bit depth, spacing, orientation, and frame ordering.
2. **Display:** Preserve aspect ratio; letterbox when necessary; never stretch to fill.
3. **Preprocessing:** Apply only model-declared transforms and record the full transform chain.
4. **Output mapping:** Reverse crop/pad/resize operations into source coordinates.
5. **Measurement:** Use physical units only when spacing and calibration are trustworthy.
6. **Comparison:** Link zoom/pan only after confirming compatible coordinate mappings.
7. **Statistics:** Calculate areas/volumes using physical spacing when available; otherwise label values as pixels or voxels.
8. **Performance:** Decode and cache near the current slice rather than loading every rendered frame at full display resolution.

## 14. UX behavior details

### 14.1 Default workspace

- Dark image canvases sit inside a light-neutral application shell to reduce eye strain while keeping controls readable.
- The Original viewport uses neutral labeling.
- The Model Output viewport uses a restrained violet/teal accent and an **AI-generated** badge.
- The shared slice scrubber is visually central and always available.
- Statistics are collapsed to a compact tray on smaller screens and expanded on wide displays.

### 14.2 Scroll behavior

- Wheel/trackpad over either viewer changes the shared slice when the Browse tool is active.
- Ctrl/Cmd + wheel changes zoom.
- Shift + wheel pans horizontally when zoomed.
- Holding a modifier temporarily unlinks the active viewport only if enabled in preferences.
- Slice changes update the image first; expensive statistics may update a fraction later with a subtle loading state.

### 14.3 Empty states

- No study: explain supported inputs and show **Open OCT study**.
- Study loaded, no model: keep full original viewer and prompt to choose a compatible local model.
- Model running: preserve original viewer; show staged progress in the output panel.
- No result for slice: show “No output for slice N” with the model-provided reason.

### 14.4 Warning hierarchy

- **Info:** Non-blocking metadata or preprocessing notes.
- **Caution:** Quality issue or missing metadata that may reduce reliability.
- **Blocking:** Incompatible input, unsafe alignment, corrupt output, or failed inference.

## 15. Non-functional requirements

### 15.1 Performance targets to validate

- First viewable slice appears within 2 seconds for a typical local study on the reference machine.
- Adjacent cached slice renders within 100 ms.
- Rapid scrolling maintains a perceived 30 fps or better using preview-resolution frames, followed by full-resolution refinement.
- UI input remains responsive during model loading and inference.
- Studies larger than available memory use bounded caching rather than failing immediately.

Final numeric targets must be validated against representative devices and study sizes.

### 15.2 Reliability

- A model worker crash cannot corrupt the imported study or terminate the viewer.
- Session and result writes are atomic where possible.
- Incomplete inference outputs are marked incomplete and are not shown as final.
- Every model run has a unique local run ID and reproducible provenance record.

### 15.3 Compatibility

- Initial target: Windows 10/11, because many clinical imaging workflows are Windows-based.
- Architecture should not prevent later macOS/Linux support.
- Support standard mouse, trackpad, keyboard, and high-DPI displays.

### 15.4 Privacy and security

- Offline by default; no background upload or analytics.
- Local logs avoid patient-identifying fields by default.
- Export requires an explicit identifier choice.
- Model packages are inspected through their manifest before execution.
- Clearly warn when a plug-in requests network access or an unsupported runtime capability.
- Store user preferences separately from patient/study data.

## 16. Clinical safety and trust requirements

- The initial release displays **For research/review use — not for autonomous diagnosis** in About, model details, and exported result summaries.
- The Original viewport remains accessible whenever a result is shown.
- Derived images and overlays must never be visually indistinguishable from the source.
- Confidence is displayed only when the model supplies a defined confidence value; the application does not invent or reinterpret it.
- Missing metadata, alignment failures, unsupported slices, and incomplete outputs are visible.
- The user can inspect model name, version, checksum, preprocessing, and run time from the result screen.
- Deleting a model does not delete prior result provenance.
- Clinical terminology and model claims require review by a qualified ophthalmology stakeholder before release.

## 17. MVP scope

### Included

- Import one local OCT study at a time.
- DICOM ophthalmic tomography and ordered PNG/TIFF stacks.
- One selected OCT series and one selected model output at a time.
- Original/output side-by-side synchronized B-scan navigation.
- Fit, 1:1, zoom, pan, brightness/contrast, invert, reset.
- Segmentation/heat-map/image output overlays with opacity and legend.
- Local plug-in discovery, compatibility check, inference, progress, cancellation, and logs.
- Scan/model/findings statistics tray.
- Local-only storage and basic de-identified screenshot export.
- Keyboard navigation and high-DPI scaling.

### Deferred

- PACS and worklists.
- Multiple studies or longitudinal comparison.
- Full annotation suite and structured reporting.
- 3D/en-face synchronized views.
- Multi-model ensemble comparison.
- Admin policy, model signing authority, and enterprise deployment.
- Cloud collaboration or remote inference.

## 18. Success metrics

### Usability

- At least 90% of representative clinicians can import a study, select a model, run inference, and reach a specified slice without assistance.
- Median time from app launch to first original slice under 30 seconds, excluding file selection time.
- Median time to compare a specified input/output slice under 60 seconds after inference completes.
- System Usability Scale target: 80 or higher in formative testing.

### Reliability

- 99% of supported, validated studies open without application crash.
- 100% of detected model-output alignment mismatches are blocked from overlay display.
- Cancelling or crashing a model leaves the study usable in all test cases.

### Extensibility

- A new conforming model can be installed and exposed in the UI without modifying core application code.
- At least three materially different output types work through the same contract: mask, processed image, and scalar/table metrics.

## 19. MVP acceptance scenario

Given a 128-slice OCT volume and a locally installed cyst-segmentation model:

1. The user imports the study and sees its dimensions, laterality, spacing status, and slice count.
2. The app marks the model compatible and describes any preprocessing.
3. The user runs inference and can continue scrolling the original volume.
4. On completion, the original and segmentation result open side by side at the current slice.
5. Mouse-wheel navigation advances both panels from slice 48 to 49.
6. Zooming and panning one panel updates the other while links are enabled.
7. The user changes mask opacity and switches between fill and contour.
8. The stats tray updates current-slice cyst area and shows a per-slice trend, if supplied by the model.
9. The model name/version and AI-generated status remain visible.
10. The user exports a de-identified paired screenshot without altering the source files.

## 20. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Vendor-specific OCT formats | Studies fail to load | Prioritize standard DICOM/image stacks; add parsers through a separate importer interface. |
| Incorrect slice ordering | Misleading comparison | Validate metadata, filenames, positions, and duplicates; block ambiguous inference until resolved. |
| Output misregistration after preprocessing | Unsafe overlay | Require transform metadata; validate output dimensions and coordinate mapping before display. |
| Model runtime conflicts | Installation/inference failures | Separate worker process and isolated environment declaration. |
| Large volumes exceed memory/GPU | Crashes or freezing | Bounded cache, tiled/preview rendering, preflight resource estimate, CPU fallback where declared. |
| Clinician over-trust in AI result | Safety issue | Persistent AI labeling, source always visible, provenance and limitations, no autonomous diagnosis claim. |
| Color overlays hide anatomy | Reduced interpretability | Opacity control, contour mode, accessible palette, one-click hide-all overlays. |
| Missing physical spacing | Invalid measurements | Disable physical units and label pixel/voxel values explicitly. |
| PHI leakage through export/logs | Privacy breach | Local-only defaults, identifier controls, de-identified export preset, sanitized logs. |

## 21. Open questions for stakeholder review

1. Is the first target posterior retinal OCT, anterior-segment OCT, or both?
2. Which exact devices/vendors and export formats must be supported in the first demonstration?
3. Does “CYST” output a processed image, binary mask, multiclass mask, probability map, or a combination?
4. What hardware is available in the clinical setting: CPU only, NVIDIA GPU, or mixed?
5. Should MVP run one model at a time or support several results for the same study?
6. Which statistics are clinically meaningful for the first model: count, area, volume, confidence, location, or anatomical layer involvement?
7. Is patient identity required in the prototype, or should the default sample experience be de-identified?
8. Is Windows the confirmed first platform?
9. Who is allowed to install models, and must packages be signed or allowlisted?
10. What is the intended regulatory/research classification of the first deployable build?

## 22. Design handoff assumptions for the first Figma concept

- Desktop frame: 1600 × 1000 px, designed to scale down to 1366 × 768.
- Light-neutral application chrome with dark image canvases.
- Left study navigator, central dual viewer, right model/overlay inspector, lower statistics tray.
- Sample state: one macular OCT series, slice 48 of 128, CYST Segmentation v1.4 completed locally.
- Sample output: cyan cyst mask with contour plus confidence and area metrics.
- Main interaction emphasis: linked scrolling, visible slice index, hide/show overlay, opacity, and local-model provenance.

