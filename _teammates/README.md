# Teammate snapshots (not wired into the live app)

Live Smriti Saarthi stays on `wannasleep`. These folders are **copies of Git branches**. Do not import them into `src/` until we agree what to wire.

| Folder | Person | Branch | Commit | Notes |
|---|---|---|---|---|
| `granth/` | Granth | `origin/granth` | `ed6a5f6` | Full Granth repo snapshot |
| `granth-memoryquiz/` | Granth | `origin/granth-memoryquiz` | `0265746` | Memory Journey game, CaregiverMemorySetup, Guide walk-through, memoryJourneyStore/Voice, Memory quiz fixes |
| `yash-amongus/` | Yashvardhan | `origin/amongus` | `259e2df` | Auth / household / alarms (currently same commit as detection) |
| `yash-detection/` | Yashvardhan | `origin/detection-system` | `259e2df` | ONNX detection under `backend/detection/` — **not wired** |
| `yashvardhan/` | Yashvardhan | older snapshot | — | Previous copy; prefer `yash-detection` |
| `niyati/` | niyati | `origin/research` | `9a2cb4c` | Dashboard + doctor booking |

Detection model files (leave untouched until wiring discussion):

- `_teammates/yash-detection/backend/detection/engine.py`
- `_teammates/yash-detection/backend/detection/onnx_runner.py`
- `_teammates/yash-detection/backend/detection/artifacts/detection_model.onnx`
