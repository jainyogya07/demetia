# Smriti Saarthi — `amongus` Branch Integration Guide

> **Branch:** `amongus`  
> **Target Branch:** `main`  
> **Author:** Yashvardhan Dubey (`yashvardhandubey123@gmail.com`)  
> **Status:** ✅ Clean working tree, 0 merge conflicts, production build verified (`vite build` passed).

---

## 1. Executive Summary

The `amongus` branch delivers three foundational pillars to the Smriti Saarthi platform:

1. **Saarthi Care Partner Live Agent (`feat(caregiver)`):**  
   An AI caregiver assistant combining fast offline local NLP intent resolution with real-time Gemini streaming and automated action dispatch (updating calendars, checklist tasks, routine meds, running cognitive assessments, and training AI memories).
2. **Unified Reactive Notification System (`feat(notifications)` & `fix(notifications)`):**  
   A multi-role notification architecture featuring header notification bells with unread badge counters, Web Audio dynamic sound synthesis, background upcoming alarm polling (advance medication reminders), and a dedicated `/caregiver/notifications` management center with live simulation capabilities.
3. **Cross-Role Doctor-to-Caregiver Loop (`feat(doctor)`):**  
   Enables clinicians in the Doctor Dashboard (`/doctor`) to draft clinical notes and immediately dispatch high-priority notifications to the patient's care circle and primary caregiver.

All 4 commits are directly rebased onto `main` (`f596e86`), introducing **18 changed files (+3,808 lines / -50 lines)** with zero regressions or breaking database/schema dependencies.

---

## 2. Commit Log Summary

| Commit Hash | Timestamp | Message | Scope / Key Additions |
| :--- | :--- | :--- | :--- |
| **`2a65b29`** | Wed Sep 23 00:11:57 2026 | `feat(caregiver): add Saarthi Care Partner live agent with action automation` | `CaregiverAssistModal`, `caregiverAssistCatalog`, `caregiverStore`, `TrainAiPage` refactor |
| **`d6bdded`** | Wed Sep 23 00:33:56 2026 | `feat(notifications): add header notification bell, history page, and upcoming alarm reminders` | `notificationStore`, `NotificationBell`, `upcomingAlarmNotifier`, `NotificationsPage`, routing |
| **`c9b8a74`** | Wed Sep 23 00:41:32 2026 | `fix(notifications): elevate simulate demo menu above stat cards with backdrop` | Fixed z-index layering, backdrop dismissal, ESC & outside-click handlers |
| **`718d6e8`** | Wed Sep 23 01:03:19 2026 | `feat(doctor): notify caregiver circle when doctor adds note` | Clinical note authoring in Doctor tab; auto-trigger high-priority notifications to caregiver circle |

---

## 3. Detailed Feature Breakdown

### A. Saarthi Care Partner Live Agent (Caregiver Voice & Action Agent)
- **Component:** `src/components/CaregiverAssistModal.jsx`
- **Catalog & Resolver:** `src/lib/caregiverAssistCatalog.js`, `src/lib/caregiverAssist.js`
- **Store & Knowledge Base:** `src/lib/caregiverStore.js`, `src/pages/caregiver/TrainAiPage.jsx`
- **Capabilities:**
  - **Hybrid NLP Engine:** Instantly parses common commands in English and Hinglish offline (e.g., *"Patient status summary batao"*, *"Where is Latveria right now? Safety check karo"*, *"Add task: Pick up Donepezil"*, *"Routine mein Donepezil 5mg add karo"*) while routing open-ended dialogue to Gemini Live.
  - **Structured Action Tags:** Automatically intercepts and executes action tags:
    - `<<NAVIGATE:path>>` — Instant screen transitions across the caregiver dashboard.
    - `<<CALENDAR_ADD:day,time,label,kind>>` — Creates visits in the weekly care calendar.
    - `<<TASK_ADD:title,time,detail>>` — Appends to today's care checklist.
    - `<<TASK_TOGGLE:title>>` — Checks off completed care items.
    - `<<ROUTINE_ADD:time,title,note>>` — Adds daily routine medication or wellness steps.
    - `<<TRAIN_AI:category,text>>` — Teaches the AI companion new habits and patient preferences.
    - `<<RUN_ASSESSMENT>>` — Initiates clinical cognitive telemetry.
    - `<<STATUS>>` & `<<SAFETY>>` — Retrieves immediate vitals, location, and geofence status.
  - **Train AI Integration:** `TrainAiPage.jsx` is wired to `caregiverStore` so caregivers can view, teach, and delete memory facts across 6 categories: *About, Routine, People, Confusion, Responses, Avoid*.

---

### B. Reactive Notification Architecture & Advance Alarm Reminders
- **Store:** `src/lib/notificationStore.js`
- **Upcoming Watcher:** `src/lib/upcomingAlarmNotifier.js`
- **Header Bell:** `src/components/NotificationBell.jsx` & `NotificationBell.css`
- **Full History Page:** `src/pages/NotificationsPage.jsx` & `NotificationsPage.css`
- **Capabilities:**
  - **Event-Driven Store:** Backed by localStorage with cross-tab sync (`storage` listener) and local dispatch (`ss-notifications-updated`).
  - **Web Audio Chimes:** Generates synthetic chime chords directly in the browser via `AudioContext` and `OscillatorNode` (high-urgency chime for clinical/safety alerts, mellow chime for standard updates) without external audio file overhead.
  - **Header Notification Bell:** Mounted in `UserWorkspace`, `CaregiverLayout`, and `DoctorLayout` with pulse badge animations, dropdown previews, and quick actions.
  - **Advance Alarm Watcher (`startUpcomingAlarmWatcher`):** Runs continuously via `App.jsx`, querying scheduled alarms from `src/lib/alarms.js` and notifying the caregiver/patient 10–15 minutes before scheduled medications.
  - **Interactive Notification Center:** Available at `/caregiver/notifications` and `/notifications`. Features text search, category filters (Doctor Notes, Alarms, Safety, AI Training), unread filters, bulk read/delete, and a live simulation dropdown to test push alerts on demand.

---

### C. Clinical Loop: Doctor Notes to Caregiver Alerts
- **Component:** `src/pages/doctor/DoctorPages.jsx` (`NotesTab`)
- **Store Integration:** `src/lib/caregiverStore.js` (`upsertDoctorNote`, `upsertMessage`, `upsertDoc`)
- **Capabilities:**
  - Clinicians can now compose session notes directly on a patient's chart.
  - Submitting a note immediately writes to `caregiverStore` and automatically dispatches a **high-priority alert** to the caregiver (`type: 'doctor'`, link to `/caregiver/circle`).
  - When the caregiver clicks the notification, it deep-links directly to the Care Circle to read the doctor's recommendations.

---

## 4. File-by-File Change Directory

| File | Change Type | Description |
| :--- | :---: | :--- |
| `src/App.jsx` | Modified | Mounts `startUpcomingAlarmWatcher`, registers `/notifications` and `/caregiver/notifications` routes, adds `NotificationBell` to user header. |
| `src/components/CaregiverAssistModal.jsx` | **New** | Floating Saarthi Care Partner voice & command modal for caregivers with quick chips and action execution. |
| `src/components/NotificationBell.jsx` | **New** | Header bell icon with live unread badge, popup preview list, and direct action triggers. |
| `src/components/NotificationBell.css` | **New** | Styling, pulse animations, and high z-index dropdown overlays for the bell component. |
| `src/hooks/useGeminiLive.js` | Modified | Extended live streaming hook with action tag interception. |
| `src/lib/alarms.js` | Modified | Helper query methods for upcoming alarm time windows. |
| `src/lib/caregiverAssist.js` | **New** | Live assistant orchestrator bridging local NLP with Gemini API. |
| `src/lib/caregiverAssistCatalog.js` | **New** | Command alias dictionary, tag parsing expressions, and route mapping for caregivers. |
| `src/lib/caregiverStore.js` | Modified | Added reactive events, AI knowledge CRUD, and automatic notification triggers when notes/messages/docs are saved. |
| `src/lib/notificationStore.js` | **New** | Notification state management, localStorage persistence, Web Audio synthesizer chime, and CRUD utilities. |
| `src/lib/upcomingAlarmNotifier.js` | **New** | Background polling service checking for alarms scheduled in the next 15 minutes. |
| `src/pages/NotificationsPage.jsx` | **New** | Full notification history page with filtering, search, stats cards, and live simulation menu. |
| `src/pages/NotificationsPage.css` | **New** | Dedicated responsive styling, backdrop modals, and glassmorphism cards for notifications. |
| `src/pages/caregiver/CaregiverLayout.jsx` | Modified | Embedded `NotificationBell` in header and floating `CaregiverAssistModal` toggle. |
| `src/pages/caregiver/TrainAiPage.jsx` | Modified | Bound to reactive `caregiverStore` so AI memory facts sync live with the assistant. |
| `src/pages/doctor/DoctorLayout.jsx` | Modified | Embedded `NotificationBell` in doctor dashboard navigation. |
| `src/pages/doctor/DoctorPages.jsx` | Modified | Added clinical note composer in `NotesTab` that updates the patient chart and notifies caregivers. |
| `.gitignore` | Modified | Ensured temporary voice recordings and build artifacts stay untracked. |

---

## 5. Architectural Flow Diagram

```
                                      ┌─────────────────────────────────┐
                                      │        Doctor Dashboard         │
                                      │   (DoctorPages.jsx - NotesTab)  │
                                      └────────────────┬────────────────┘
                                                       │ writes note
                                                       ▼
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│       Saarthi Care Partner      │           │        caregiverStore.js        │
│    (CaregiverAssistModal.jsx)   │──────────►│  (Notes, Calendar, Routine, AI) │
└────────────────┬────────────────┘  mutates  └────────────────┬────────────────┘
                 │                                             │ triggers event &
                 │ executes actions                            │ auto-notification
                 ▼                                             ▼
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│      Upcoming Alarm Watcher     │           │      notificationStore.js       │
│   (upcomingAlarmNotifier.js)    │──────────►│ (Storage, Web Audio Chime, APIs)│
└─────────────────────────────────┘  detects  └────────────────┬────────────────┘
                                     upcoming                  │
                                     alarms                    │ broadcast updates
                                                               ▼
                                              ┌─────────────────────────────────┐
                                              │   Notification Bell & History   │
                                              │   - NotificationBell.jsx        │
                                              │   - NotificationsPage.jsx       │
                                              └─────────────────────────────────┘
```

---

## 6. How to Integrate into `main`

The `amongus` branch is clean and sits directly ahead of `main` with no diverging conflicts. The lead can choose any of the standard integration methods:

### Option A: Merge via GitHub Pull Request (Recommended for Code Review)

1. Ensure the `amongus` branch is pushed:
   ```bash
   git push origin amongus
   ```
2. Navigate to GitHub and create a Pull Request from `amongus` into `main`.
3. Title: `feat: add Saarthi Care Partner live agent, reactive notifications, and doctor-to-caregiver notes`
4. The PR will show **Able to merge automatically** (0 conflicts).
5. Select **Merge pull request** (or **Squash and merge** / **Rebase and merge** per team convention).

---

### Option B: Fast-Forward CLI Merge (Direct Merge into Local `main`)

Since `amongus` is strictly ahead of `origin/main` by 4 commits, a fast-forward merge will cleanly advance `main` without creating an extra merge commit:

```bash
# 1. Switch to main and sync with remote
git checkout main
git pull origin main

# 2. Fast-forward merge the amongus branch
git merge --ff-only amongus

# 3. Verify the build
npm run build

# 4. Push updated main to remote
git push origin main
```

---

### Option C: Rebase and Merge (If `main` has received new commits since)

If other team members have pushed new commits to `main` in the interim:

```bash
# 1. Switch to amongus and rebase on top of latest main
git checkout amongus
git fetch origin main
git rebase origin/main

# 2. Test the build
npm run build

# 3. Fast-forward merge into main
git checkout main
git merge --ff-only amongus
git push origin main
```

---

## 7. Verification & Testing Checklist for the Project Lead

After merging into `main`, perform this quick 5-minute smoke test:

1. **Build & Startup:**
   ```bash
   npm install
   npm run build   # Must output dist/ with zero errors
   npm run dev     # Starts Vite dev server
   ```
2. **Saarthi Care Partner Agent:**
   - Navigate to `http://localhost:5173/caregiver`.
   - Click the floating **Caregiver Assist** button in the bottom right corner (or header toggle).
   - Click any chip (e.g. *📅 Add Dr. Visit (Wed)* or *💊 Add Routine Med*).
   - Check `http://localhost:5173/caregiver/calendar` or `routine` to confirm the item was automatically inserted.
3. **Notification Bell & Full Page:**
   - Look at the top navigation bar to see the `NotificationBell`.
   - Click the bell: check dropdown preview, unread count badge, and click *View all notifications*.
   - On `http://localhost:5173/caregiver/notifications`, click the **Simulate Notification** button and trigger a *Geofence Breach* or *Upcoming Medication*.
   - Verify the synthetic Web Audio chime sounds and the notification appears instantly.
4. **Doctor-to-Caregiver Loop:**
   - Navigate to `http://localhost:5173/doctor`.
   - Click on the patient (e.g. Latveria), open the **Notes** tab.
   - Enter a message (e.g. *"Increase hydration; schedule follow-up next Monday."*) and click **Send Note to Caregiver**.
   - Notice the bell immediately increments, and opening notifications shows the high-priority note with a link to `/caregiver/circle`.
