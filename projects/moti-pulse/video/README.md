# Hi-Fi function demo assets

These eight MP4s are deployed media assets for the static case study. They
are the sole retained delivery copies, validated against the original recordings.
The authoring project's `manifest.json` and `validation.json` record the source
recordings, hashes, native dimensions, frame counts and export validation.

| File | Feature |
|---|---|
| `01-life-mission.mp4` | Life mission |
| `02-goal-motivation.mp4` | Add motivation to a goal |
| `03-create-goal.mp4` | Create a goal |
| `04-create-task.mp4` | Create a task |
| `05-priority-subtasks.mp4` | Priority and subtasks |
| `06-schedule.mp4` | Schedule a task |
| `07-pomodoro.mp4` | Pomodoro settings and task selection |
| `08-reports.mp4` | Reports and date selection |

Posters are the original first frames, kept in `posters/` with matching names.
Video content and timing remain unchanged. The delivered clips include only
the previously approved appended return to the first frame.

Playback is muted, inline and looped. JavaScript selects
one sufficiently visible demo nearest the viewport center; it pauses previous
or offscreen demos, preserves positions and respects manual pause. Document
visibility pauses playback. Reduced motion disables autoplay and leaves
manual playback available. Enhanced players have an external Play/Pause, seek,
sound and fullscreen toolbar. No JavaScript uses native controls only.

Per-video `--phone-inset` values in the page mask only the outer white canvas
to the device silhouette; the app screens and MP4 bytes remain untouched.
The bounds were measured from each supplied first-frame poster. Recheck these
values when replacing a recording or changing its framing.

These files are intentionally tracked so GitHub Pages publishes them.
Temporary render/editor output remains ignored in the authoring project.
