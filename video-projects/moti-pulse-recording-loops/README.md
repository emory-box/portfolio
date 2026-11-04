# Moti-Pulse recording loops

This is the approved content-preserving version. It uses all eight original recordings, not the earlier UI reconstruction draft.

The original recordings are copied without modification into each project's assets/original.mp4 and checked against their source SHA-256. Every screen, action, value, timing and audio segment remains intact. The only added edit is a 0.5-second dissolve back to the first frame after the original recording completes, followed by a 0.1-second hold.

No scene is removed or rearranged. No music, narration, captions, invented UI, crops, grades or playback-speed changes are added. Original dimensions and 30 fps are retained.

## Files

| Project | Original recording | Output duration | Canvas |
|---|---|---|---|
| 01-life-mission | Screen Recording 2026-06-21 171341.mp4 | 40.467 s | 478×884 |
| 02-goal-motivation | Screen Recording 2026-06-21 221742.mp4 | 41.267 s | 448×880 |
| 03-create-goal | Screen Recording 2026-06-21 223224.mp4 | 34.867 s | 474×892 |
| 04-create-task | Screen Recording 2026-06-21 223346.mp4 | 37.633 s | 458×880 |
| 05-priority-subtasks | Screen Recording 2026-06-21 230326.mp4 | 33.733 s | 446×874 |
| 06-schedule | Screen Recording 2026-06-21 235239.mp4 | 60.767 s | 450×880 |
| 07-pomodoro | Screen Recording 2026-06-22 000905.mp4 | 36.467 s | 444×878 |
| 08-reports | Screen Recording 2026-06-22 001153.mp4 | 33.933 s | 448×880 |

The eight delivery MP4s are in renders/. Open index.html through the portfolio server for the loop gallery. The source project for every file is the corresponding numbered folder.

## Editing and rendering

From any numbered folder:

```powershell
npx hyperframes@0.9.13 preview --background
npx hyperframes@0.9.13 check --json
npm run render
```

Preview uses a paused, seekable HyperFrames timeline. The gallery alone uses normal HTML video controls and loop playback; those controls are not part of the video composition.

On Windows, configure HYPERFRAMES_FFMPEG_PATH and HYPERFRAMES_FFPROBE_PATH if FFmpeg is not on PATH. No runtime package is added to the portfolio website.

Delivery checks are recorded in REVIEW.md and validation.json. Rendered videos are local deliverables; the static portfolio page has not been changed to embed them.
