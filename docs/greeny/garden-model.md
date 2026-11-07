# Greeny — current approved garden model

The owner approved the smooth clay garden for the live scroll story. The
repository keeps one live GLB, its editable current scene and the base scene
needed by the exporter. Superseded studies/previews were removed at the
owner's request; this document is the current specification.

## Appearance and placement

- Twelve two-leaf seedlings on a smooth taupe bed, a rounded lawn tile,
  two-sided low fence, sparse clay tufts and small white flowers.
- Canopy cloth `#1B6799`; seedling leaves `#8EBE50` / `#AFD182`, stems
  `#6C9537`. Organic tubular Y sensor remains `#6C9537`.
- Floating fan centered between the left bay's posts at web coordinates
  `(-3,1.78,0)`. Three identical swept, rounded blades at 120° intervals,
  smooth center cap, clearance within the shroud, no stand or crossing pipe.
- Two capsule irrigation heads with rounded L-shaped arms and small white
  couplers to the side roof tracks. Two separate lamps hang from the rear beam.
- Cream rounded hub on the right, with a green pill indicator; amber during
  the existing receiving demonstration state, accompanied by text.
- Two added grass tufts at X/Z `(3.75,-.55)` and `(3.85,.85)`, separated on
  the empty lawn beside the hub. Other device positions remain unchanged.

## Files and rebuild

| Path from repository root | Role |
| --- | --- |
| `authoring/greeny/export-garden.py` | Current exporter and approved refinements |
| `authoring/greeny/garden_geometry.py` | Geometry helpers actually used |
| `authoring/greeny/source/garden-base.blend` | Required baseline input |
| `authoring/greeny/garden.blend` | Editable current result |
| `authoring/greeny/renders/` | Current retracted/deployed render output |
| `projects/greeny/models/garden.glb` | Live model |
| `projects/greeny/models/garden.json` | Palette, counts and source hashes |
| `projects/greeny/models/colors.json` | Approved web-only color overrides |
| `projects/greeny/img/story/garden-fallback.png` | Live image fallback |

See the [authoring guide](../../authoring/greeny/README.md) for the exact
Blender command. Coordinates are illustrative, not manufacturing dimensions.
Preserve device group names and fan/canopy pivots. The exporter starts from
the required base scene; editing its result alone does not update the source.
The renderer has separate effect anchors; device movement requires checking
them. This cleanup does not change those interactions.

Color-only web changes use [the review workflow](color-review.md); the
native/baked palette here remains the base until a native authoring change.

## Verification

Current geometry: 113,448 triangles, 48 mesh objects. Native checks cover
provenance, exact pigments, twelve seedlings, the two added tufts, aligned
fan blades and shroud clearance, pivots, framing and GLB re-import.
Browser checks cover all eight stops at 360, 768, 1280 and 1920px, readings
after sensing, projected lights, pause, reduced motion and static fallbacks.
No root frontend build, typecheck or npm test runner is configured.
Physical mobile GPUs, Safari/Firefox and native screen-reader speech remain
unverified. Run the documented checks after changing the source.
