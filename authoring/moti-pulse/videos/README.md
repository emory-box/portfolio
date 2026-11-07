# Recording-loop sources

Each numbered folder is a self-contained HyperFrames 0.9.13 project.
`assets/original.mp4` preserves the original recording, including audio,
timing and aspect ratio. The only addition is the approved 0.6-second loop
return after the complete original content.

`manifest.json` records source hashes and timing. `validation.json` records
the delivered files and their content/boundary verification.

The live MP4s are in `projects/moti-pulse/video/` from repository root.
Temporary `renders/` output is ignored and can be removed after delivery.
See [authoring instructions](../README.md) for commands and publishing.
