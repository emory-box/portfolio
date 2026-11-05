# Greeny garden model and scroll storyboard

Status: concept for owner review. The existing Greeny case study is unchanged.
The review page is `projects/greeny/3d/index.html`.

## Story

One garden stays present through four moments. A gentle 28-degree total turn
reveals how the physical garden connects to the Greeny app. The narrative
is a demonstration of the documented product, with no live sensor feed or
invented performance metrics.

| Beat | Scroll position | Land rotation | Action and composition |
| --- | ---: | ---: | --- |
| Meet the garden | 0% | 0° | Wide miniature garden; the existing opening message leads. |
| Sense | 33% | −12° | Highlight the integrated sensor; show one connection to the hub. |
| Respond | 67% | −24° | Sensor cue settles; sprinkler sends short water arcs into the beds. |
| Control | 100% | −28° | Garden settles beside the existing app dashboard; return to the case study. |

On the eventual website, scroll progress sets animation progress directly.
Stopping scroll holds the pose; reverse scrolling reverses the sequence.
One persistent 3D scene serves these beats. Reading remains native page scroll.
On mobile, reframe the same model above the copy with a shorter scene stage.
Reduced motion uses static views and directly readable text. Unsupported 3D
uses the rendered garden image. These are integration requirements, not a
claim that the rendered storyboard preview is already a WebGL implementation.

`projects/greeny/3d/storyboard.json` records the shot poses, captions and images.
The review page lets the owner compare the four rendered keyframes by scrolling
or choosing a numbered moment. Its overview sheet is also downloadable.

## Evidence and reconstruction

| Feature | Evidence | Treatment |
| --- | --- | --- |
| Brand palette and typography | Root DESIGN.md and original Greeny deck | Dark background, existing green ramp, Nunito/Inter. |
| Fork-shaped plant sensor | Deck slides 6–7 | Simplified illustrative geometry; that deck credits its sensor reference to Parrot Flower Power. |
| Sprinkler | Deck slides 6–7 and existing system section | Simplified pop-up sprinkler, watering demonstration. |
| Sensor readings and irrigation behavior | Existing Greeny system section | Soil moisture, temperature, air humidity and light; threshold/schedule irrigation. No new readings. |
| Hub role | Existing system and Wi-Fi mesh explanation | Concept housing; physical industrial design is unspecified. |
| App dashboard | Existing HTML-rendered Greeny hero dashboard | Screenshot of the current interface for the final storyboard beat. |
| Terrain, bed placement, tree and plants | Owner's miniature-land reference and requested garden | New concept composition; proportions are illustrative. |
| Gentle turn across scroll | Owner's Fizzi reference | Four key poses; proposed continuous movement for integration. |

The model includes three planting beds, small vegetation, one fruit tree,
a path, the source-inspired sensor, a sprinkler and a concept hub. Other
documented Greeny devices are outside this first model study. Plant size stays
fixed during watering; no accelerated growth or numerical benefit is implied.

## Model and authoring

- `projects/greeny/3d/garden.py`: procedural Blender source; seeded layout.
- `projects/greeny/3d/model/greeny-garden.blend`: editable geometry and animation.
- `projects/greeny/3d/model/greeny-garden.glb`: model and animation for later web use.
- `projects/greeny/3d/model/manifest.json`: Blender version, source hashes and render settings.
- `projects/greeny/3d/renders/`: the four rendered keyframes and app reference.

The model has named groups for `Garden_Root`, `Terrain`, `Planting_Beds`,
`Plants`, `Path`, `Devices`, `Sensor`, `Sprinkler`, `Hub_Concept`,
`Sensor_Indicator`, `Connection_FX` and `Water_FX`. Rotation and effect scales
are keyframed at Blender frames 1, 49, 97 and 145. The GLB excludes cameras
and render lights, so lighting remains controllable by the web renderer.

Rebuild with the existing installation, from the repository root:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup --disable-autoexec --python-exit-code 1 --python projects/greeny/3d/garden.py -- --size 1440 --samples 64
```

The script overwrites only its own named model/renders. The default GPU mode
uses CUDA; `--device CPU` is available on machines without a CUDA device.
`--shots garden respond --size 900 --samples 24` makes a quick subset proof.
All four poses should be rebuilt before delivery after geometry changes.

Blender is already installed. No skills, browser runtime libraries, Python
packages, framework or hosted service were added for this model study.
Three.js/scroll-library integration remains a separate step for review.

## Review decisions

Review the land composition, planting density, device visibility, gentle turn
and the four-beat explanation before final website integration. Device
housing shapes remain concepts until the owner confirms them.

## Verification

- Final render: four 1440 × 1123 PNGs, 64 Cycles samples, using the installed
  NVIDIA GPU. The latest full build and export completed successfully.
- Model: approximately 17,300 exported triangles and a 1.45 MB self-contained
  GLB. One scene animation contains the turn and effect channels. No cameras,
  render lights or external texture files are required by the web export.
- Blender proof: opened the editable file, checked all four exact poses and
  effect scales, and confirmed the full garden stays inside the camera frame.
  Re-imported the GLB successfully with its named parts and animated groups.
- Browser proof: four moment controls, scroll and reverse scroll, keyboard
  focus, reduced motion, no JavaScript, model links and local assets passed.
  Checked 320, 360, 768, 1280 and 1920px with no horizontal overflow,
  missing requests or script errors. The overview sheet was captured from the
  final review page. Source hashes match the delivered model manifest.
- JavaScript syntax and `git diff --check` passed. DESIGN.md validation passed
  with zero errors and 19 pre-existing warnings. There is no root
  typecheck/test/build pipeline. Standards and Spec reviews have no remaining
  findings after restoring the documented container and heading treatment.

Native screen-reader speech, Safari/Firefox and live Three.js rendering have
not been verified. The review page displays rendered keyframes, while the
delivered `.blend` and `.glb` contain the actual geometry and animation.
