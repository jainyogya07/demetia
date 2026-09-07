import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Phone } from 'lucide-react';

import AvatarSlot from '../../components/AvatarSlot';

import {
  LiveDot,
  SyncBar,
  Stat,
  Badge,
  Panel,
  DataTable,
  TaskRow,
  TimelineRail,
  AppLink,
} from '../../components/clinic/LiveChrome';

import {
  CG_PROFILE,
  CG_PATIENT,
  CG_CALENDAR,
  CG_REFILLS,
  CG_CIRCLE,
  CG_MESSAGES,
  CG_DOCS,
  CG_DOCTOR_NOTES,
  CG_ROUTINE,
  CG_BRAIN_GAMES,
  getLiveInfo,
  getTodayTasks,
  getRoutineState,
  toggleRoutineItem,
  getCaregiverMedicines,
  getSafetyData,
  getCheckins,
  addCheckin,
  createCaregiverPing,
  getDynamicEngagement,
} from '../../data/caregiverPlaceholders';


/* =========================================================
   Helpers
========================================================= */

function medTone(status) {
  if (
    status === 'Taken' ||
    status === 'Done' ||
    status === 'completed'
  ) {
    return 'stable';
  }

  if (
    status === 'Due' ||
    status === 'Now'
  ) {
    return 'urgent';
  }

  return 'watch';
}


/*
|--------------------------------------------------------------------------
| Hook: live caregiver data
|--------------------------------------------------------------------------
|
| This allows different caregiver pages to update when localStorage
| changes or another component changes a routine/check-in.
|
*/

function useCaregiverData() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setVersion((value) => value + 1);
    };

    window.addEventListener(
      'smriti-saarthi-caregiver-update',
      refresh
    );

    window.addEventListener('storage', refresh);

    const timer = setInterval(() => {
      setVersion((value) => value + 1);
    }, 60000);

    return () => {
      window.removeEventListener(
        'smriti-saarthi-caregiver-update',
        refresh
      );

      window.removeEventListener('storage', refresh);

      clearInterval(timer);
    };
  }, []);

  return version;
}


/* =========================================================
   Today Tasks
========================================================= */

function TodayTasks({ compact = false }) {
  useCaregiverData();

  const [done, setDone] = useState(() => getRoutineState());

  useEffect(() => {
    setDone(getRoutineState());
  }, []);

  const refreshTasks = () => {
    setDone(getRoutineState());
  };

  const handleToggle = (id) => {
    toggleRoutineItem(id);
    refreshTasks();
  };

  const rows = getTodayTasks();

  if (compact) {
    return (
      <div className="os-task-stack">
        {rows.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            checked={!!done[task.id]}
            onToggle={() => handleToggle(task.id)}
            extra={`${task.time} · ${task.detail}`}
          />
        ))}
      </div>
    );
  }

  return (
    <DataTable
      empty="No household tasks for today."
      columns={[
        {
          key: 'check',
          label: '',
          narrow: true,

          render: (row) => (
            <input
              type="checkbox"
              checked={!!done[row.id]}
              onChange={() => handleToggle(row.id)}
              aria-label={`Mark ${row.title} as ${
                done[row.id] ? 'pending' : 'done'
              }`}
            />
          ),
        },

        {
          key: 'time',
          label: 'Time',
          narrow: true,
        },

        {
          key: 'kind',
          label: 'Type',
          narrow: true,

          render: (row) => (
            <Badge>
              {row.kind}
            </Badge>
          ),
        },

        {
          key: 'title',
          label: 'Task',

          render: (row) => (
            <span>
              <strong>{row.title}</strong>
              <em className="os-sub">
                {row.detail}
              </em>
            </span>
          ),
        },

        {
          key: 'state',
          label: 'Status',

          render: (row) => (
            <Badge
              tone={medTone(
                done[row.id]
                  ? 'Done'
                  : row.state
              )}
            >
              {done[row.id]
                ? 'Done'
                : row.state}
            </Badge>
          ),
        },
      ]}
      rows={rows}
    />
  );
}


/* =========================================================
   Patient strip
========================================================= */

function PersonStrip() {
  useCaregiverData();

  const patient = {
    ...CG_PATIENT,
  };

  const safety = getSafetyData();

  const handlePing = () => {
    createCaregiverPing('Home');
  };

  return (
    <section className="os-chart-strip">

      <AvatarSlot
        name={patient.name}
        photoUrl={patient.photo || ''}
        size={56}
        label="Patient photo placeholder"
      />

      <div className="os-chart-id">
        <p className="os-kicker">
          Your person · {patient.relation}
        </p>

        <h2>
          {patient.name}
        </h2>

        <p>
          {patient.age} · {patient.place}
        </p>
      </div>

      <div className="os-chart-actions">

        <Badge tone="stable">
          {safety.zone}
        </Badge>

        <AppLink to="/user">
          Open her dashboard
          <ExternalLink size={12} />
        </AppLink>

      </div>

      <div className="os-chip-row">

        <button
          type="button"
          onClick={handlePing}
          className="os-mini-link"
        >
          Ping patient
        </button>

        <span>
          Last check-in: {safety.lastCheckIn}
        </span>

      </div>

    </section>
  );
}


/* =========================================================
   Overview
========================================================= */

export function CgOverview() {
  useCaregiverData();

  const live = getLiveInfo();
  const tasks = getTodayTasks();
  const engagement = getDynamicEngagement();
  const checkins = getCheckins();

  const open = tasks.filter(
    (task) => !task.done
  ).length;

  const today = CG_CALENDAR.find(
    (day) => day.today
  );

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${live.asOf} · ${live.clock}`}
        lastSync={live.lastSync}
        extra={live.ping}
      />

      <PersonStrip />

      <div className="os-kpis">

        <Stat
          label="Safety"
          value="Home"
          hint={getSafetyData().lastCheckIn}
        />

        <Stat
          label="Open tasks"
          value={open}
          hint="Today's checklist"
        />

        <Stat
          label="Voice this week"
          value={`${engagement.voiceMinutes} min`}
          hint={`${engagement.gamesThisWeek} games`}
        />

        <Stat
          label="Story beats"
          value={engagement.storyBeats}
          hint="Held, not scored"
        />

      </div>

      <div className="os-split">

        <Panel
          title="Today's checklist"
          action={
            <Link to="/caregiver/routine">
              Full routine
            </Link>
          }
        >
          <TodayTasks />
        </Panel>

        <div className="os-rail-col">

          <Panel
            title="Today on the week"
            action={
              <Link to="/caregiver/calendar">
                Calendar
              </Link>
            }
          >
            {today?.items?.map((item) => (
              <p
                key={item.t}
                className="os-today-line"
              >
                <strong>{item.t}</strong>{' '}
                {item.label}
              </p>
            ))}
          </Panel>

          <Panel
            title="Safety live"
            action={
              <Link to="/caregiver/safety">
                Map
              </Link>
            }
          >
            <p className="os-safety-ok">
              <LiveDot
                label={getSafetyData().zone}
              />
            </p>

            <p className="os-meta">
              {checkins[0]?.rel || 'No recent check-in'} ·{' '}
              {checkins[0]?.place || 'Home'}
            </p>
          </Panel>

          <Panel title="Note for Dr. Sharma">

            <p className="os-note-body">
              {CG_DOCTOR_NOTES[0]?.text}
            </p>

            <p className="os-meta">
              {CG_DOCTOR_NOTES[0]?.rel} ·{' '}
              {CG_DOCTOR_NOTES[0]?.date}
            </p>

          </Panel>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   Routine
========================================================= */

export function CgRoutine() {
  useCaregiverData();

  const tasks = getTodayTasks();

  const due = tasks.filter(
    (task) => !task.done
  ).length;

  const medicines = getCaregiverMedicines();

  const nextMedicine =
    medicines.find(
      (medicine) =>
        medicine.status !== 'Taken'
    );

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra={`${due} still open`}
      />

      <PersonStrip />

      <div className="os-kpis">

        <Stat
          label="Next"
          value={nextMedicine?.time || 'Done'}
          hint={
            nextMedicine?.name ||
            'No medicine due'
          }
        />

        <Stat
          label="Open"
          value={due}
          hint="Tick as you go"
        />

        <Stat
          label="Night tablet"
          value="8:00 PM"
          hint={
            medicines.find(
              (m) => m.id === 'night'
            )?.status || 'Scheduled'
          }
        />

      </div>

      <div className="os-split">

        <div className="os-main">

          <Panel title="Day plan">

            <DataTable
              columns={[
                {
                  key: 'time',
                  label: 'Time',
                  narrow: true,
                },

                {
                  key: 'title',
                  label: 'Step',
                },

                {
                  key: 'status',
                  label: 'Status',

                  render: (row) => {
                    const current =
                      tasks.find(
                        (task) =>
                          task.id === row.id
                      );

                    const isDone =
                      current?.done;

                    return (
                      <Badge
                        tone={medTone(
                          isDone
                            ? 'Done'
                            : 'Pending'
                        )}
                      >
                        {isDone
                          ? 'Done'
                          : 'Pending'}
                      </Badge>
                    );
                  },
                },
              ]}
              rows={CG_ROUTINE}
            />

          </Panel>

          <Panel title="Checklist with times">
            <TodayTasks compact />
          </Panel>

        </div>

        <div className="os-rail-col">

          <Panel title="Medicines">

            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Medicine',
                },

                {
                  key: 'time',
                  label: 'When',
                  narrow: true,
                },

                {
                  key: 'status',
                  label: '',

                  render: (row) => (
                    <Badge
                      tone={medTone(
                        row.status
                      )}
                    >
                      {row.status}
                    </Badge>
                  ),
                },
              ]}
              rows={medicines}
            />

          </Panel>

          <Panel title="Upcoming refills">

            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Item',
                },

                {
                  key: 'left',
                  label: 'Left',
                  narrow: true,
                },

                {
                  key: 'due',
                  label: 'Due',
                  narrow: true,
                },
              ]}
              rows={CG_REFILLS.map(
                (row) => ({
                  ...row,
                  id: row.name,
                })
              )}
            />

            <p className="os-meta">
              Clinic / chemist on the file —
              NPHCE OPD and Jan Aushadhi,
              Jorhat.
            </p>

          </Panel>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   Safety
========================================================= */

export function CgSafety() {
  useCaregiverData();

  const safety = getSafetyData();
  const checkins = getCheckins();

  const handleCheckIn = () => {
    addCheckin(
      'Home',
      'Caregiver requested a fresh check-in.'
    );
  };

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra={`${safety.zone}`}
      />

      <div className="os-kpis">

        <Stat
          label="Zone"
          value="Home"
          hint="Courtyard + verandah"
        />

        <Stat
          label="Last ping"
          value={safety.lastCheckIn}
          hint={checkins[0]?.place || 'Home'}
        />

        <Stat
          label="Status"
          value={safety.status}
          hint="No wander flag"
        />

      </div>

      <div className="os-split">

        <Panel title="Home zone">

          <div
            className="os-map"
            aria-hidden="true"
          >
            <div className="os-map-grid" />
            <div className="os-map-zone" />
            <div className="os-map-pin">
              Home
            </div>

            <p className="os-map-caption">
              <LiveDot
                label={`Live ping · ${safety.lastCheckIn}`}
              />
            </p>
          </div>

          <button
            type="button"
            className="os-full-btn"
            onClick={handleCheckIn}
          >
            Request fresh check-in
          </button>

        </Panel>

        <div className="os-rail-col">

          <Panel title="Check-ins">

            <TimelineRail
              items={checkins.map(
                (row) => ({
                  when: row.time,
                  rel: `${row.rel} · ${row.time}`,
                  place: row.place,
                  text: row.note,
                })
              )}
            />

          </Panel>

          <Panel title="Call">

            <a
              className="os-full-btn"
              href="tel:9435011820"
            >
              <Phone size={15} />
              Call Rina (primary)
            </a>

            <a
              className="os-full-btn"
              href="tel:112"
            >
              Emergency 112
            </a>

          </Panel>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   Progress
========================================================= */

export function CgProgress() {
  useCaregiverData();

  const engagement =
    getDynamicEngagement();

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra="Week engagement"
      />

      <div className="os-kpis">

        <Stat
          label="Games"
          value={engagement.gamesThisWeek}
          hint="Available activities"
        />

        <Stat
          label="Voice"
          value={`${engagement.voiceMinutes} min`}
          hint="Companion + stories"
        />

        <Stat
          label="Story beats"
          value={engagement.storyBeats}
          hint="Held kindly"
        />

      </div>

      <div className="os-split">

        <Panel title="How the days felt">

          <p className="os-meta">
            Support for the household —
            not a test score or a diagnosis.
          </p>

          <div className="os-bar-row">

            {engagement.days.map(
              (day) => (
                <div
                  key={day.d}
                  className="os-bar-col"
                >
                  <div
                    className="os-bar"
                    style={{
                      height: `${Math.max(
                        day.v * 0.9,
                        8
                      )}px`,
                    }}
                  />

                  <span>
                    {day.d}
                  </span>
                </div>
              )
            )}

          </div>

          <p className="os-note-body">
            {engagement.moodNote}
          </p>

        </Panel>

        <Panel title="Notes for the doctor">

          {CG_DOCTOR_NOTES.map(
            (note) => (
              <article
                key={note.date}
                className="os-note-card"
              >
                <header>
                  <strong>
                    {note.date}
                  </strong>

                  <span>
                    {note.rel}
                  </span>
                </header>

                <p>
                  {note.text}
                </p>
              </article>
            )
          )}

        </Panel>

      </div>

    </div>
  );
}


/* =========================================================
   Care circle
========================================================= */

export function CgCircle() {
  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra="Family · ASHA · clinic"
      />

      <div className="os-split">

        <Panel title="People">

          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Person',

                render: (row) => (
                  <span className="os-person">

                    <AvatarSlot
                      name={row.name}
                      size={32}
                    />

                    <span>
                      <strong>
                        {row.name}
                      </strong>

                      <em>
                        {row.role}
                      </em>
                    </span>

                  </span>
                ),
              },

              {
                key: 'status',
                label: 'Status',

                render: (row) => (
                  <Badge
                    tone={
                      row.status === 'Here'
                        ? 'stable'
                        : 'watch'
                    }
                  >
                    {row.status}
                  </Badge>
                ),
              },

              {
                key: 'note',
                label: 'Note',
              },

              {
                key: 'phone',
                label: '',
                narrow: true,

                render: (row) =>
                  row.phone ? (
                    <a
                      className="os-mini-link"
                      href={`tel:${row.phone.replace(
                        /\D/g,
                        ''
                      )}`}
                    >
                      Call
                    </a>
                  ) : null,
              },
            ]}
            rows={CG_CIRCLE}
          />

        </Panel>

        <Panel title="Messages">

          {CG_MESSAGES.map(
            (msg) => (
              <article
                key={msg.time}
                className="os-note-card"
              >
                <header>
                  <strong>
                    {msg.from}
                  </strong>

                  <span>
                    {msg.rel}
                  </span>
                </header>

                <p>
                  {msg.text}
                </p>

              </article>
            )
          )}

        </Panel>

      </div>

    </div>
  );
}


/* =========================================================
   Documents
========================================================= */

export function CgDocuments() {
  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra="Shared file room"
      />

      <Panel title="Files the circle can see">

        <DataTable
          empty="No files shared yet."
          columns={[
            {
              key: 'name',
              label: 'File',
            },

            {
              key: 'kind',
              label: 'Kind',
              narrow: true,

              render: (row) => (
                <Badge>
                  {row.kind}
                </Badge>
              ),
            },

            {
              key: 'updated',
              label: 'Updated',
              narrow: true,
            },

            {
              key: 'shared',
              label: 'Shared with',
            },
          ]}
          rows={CG_DOCS.map(
            (doc) => ({
              ...doc,
              id: doc.name,
            })
          )}
        />

        <p className="os-meta">
          Files are currently stored as
          caregiver-side records. Backend
          document storage can be connected
          later.
        </p>

      </Panel>

    </div>
  );
}


/* =========================================================
   Calendar
========================================================= */

export function CgCalendar() {
  const today = CG_CALENDAR.find(
    (day) => day.today
  );

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra="Household week"
      />

      <div className="os-kpis">

        <Stat
          label="Today"
          value={today?.day || 'Today'}
          hint={
            today?.items?.[0]?.label ||
            'No scheduled item'
          }
        />

        <Stat
          label="Clinic"
          value="10:15"
          hint="Dr. Sharma · OPD"
        />

        <Stat
          label="Story"
          value="16:00"
          hint="Stay for the whole breath"
        />

      </div>

      <Panel title="Household week">
        <WeekBoard />
      </Panel>

    </div>
  );
}


/* =========================================================
   Week board
========================================================= */

function WeekBoard() {
  return (
    <div className="os-week">

      {CG_CALENDAR.map(
        (col) => (
          <div
            key={col.day}
            className={`os-week-col ${
              col.today
                ? 'today'
                : ''
            }`}
          >

            <header>
              <span>
                {col.day}
              </span>

              {col.today ? (
                <LiveDot label="Today" />
              ) : null}
            </header>

            {col.items.length === 0 ? (
              <p className="os-empty">
                Quiet
              </p>
            ) : (
              col.items.map(
                (item) => (
                  <article
                    key={`${col.day}-${item.t}-${item.label}`}
                    className="os-slot"
                  >
                    <span className="os-slot-time">
                      {item.t}
                    </span>

                    <Badge>
                      {item.kind}
                    </Badge>

                    <span>
                      {item.label}
                    </span>

                  </article>
                )
              )
            )}

          </div>
        )
      )}

    </div>
  );
}


/* =========================================================
   Profile
========================================================= */

export function CgProfile() {
  useCaregiverData();

  const patient = CG_PATIENT;
  const tasks = getTodayTasks();
  const safety = getSafetyData();

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra={CG_PROFILE.place}
      />

      <section className="os-chart-strip">

        <AvatarSlot
          name={CG_PROFILE.name}
          photoUrl={CG_PROFILE.photoUrl}
          size={72}
          label="Caregiver photo placeholder"
        />

        <div className="os-chart-id">

          <p className="os-kicker">
            Caregiver file
          </p>

          <h2>
            {CG_PROFILE.name}
          </h2>

          <p>
            {CG_PROFILE.role}
          </p>

        </div>

        <div className="os-chart-actions">

          <Badge tone="stable">
            Primary · here
          </Badge>

          <AppLink to="/user">
            Open {patient.name}'s dashboard
            <ExternalLink size={12} />
          </AppLink>

        </div>

      </section>

      <div className="os-split">

        <Panel title="About you">

          <dl className="os-kv">

            <div>
              <dt>Role</dt>
              <dd>
                {CG_PROFILE.role}
              </dd>
            </div>

            <div>
              <dt>Place</dt>
              <dd>
                {CG_PROFILE.place}
              </dd>
            </div>

            <div>
              <dt>Phone</dt>
              <dd>
                <a
                  href={`tel:${CG_PROFILE.phone.replace(
                    /\D/g,
                    ''
                  )}`}
                >
                  {CG_PROFILE.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt>Person in care</dt>
              <dd>
                {patient.name} ·{' '}
                {patient.relation}
              </dd>
            </div>

          </dl>

          <p className="os-meta">
            Patient identity is linked to the
            patient dashboard data source.
          </p>

        </Panel>

        <Panel title="Right now">

          <p className="os-today-line">
            <strong>
              {safety.lastCheckIn}
            </strong>{' '}
            {safety.zone}
          </p>

          <p className="os-today-line">

            <strong>
              Open
            </strong>{' '}

            {
              tasks.filter(
                (task) => !task.done
              ).length
            }{' '}
            household tasks

          </p>

          <p className="os-meta">
            {patient.place} ·{' '}
            {patient.age} years
          </p>

        </Panel>

      </div>

    </div>
  );
}

/* =========================================================
   Settings
========================================================= */

export function CgSettings() {
  useCaregiverData();

  const tasks = getTodayTasks();

  const nightMedicine =
    tasks.find(
      (task) => task.id === 'med-pm'
    );

  return (
    <div className="os-page">

      <SyncBar
        asOf={`${getLiveInfo().asOf} · ${getLiveInfo().clock}`}
        lastSync="Just now"
        extra="Household preferences"
      />

      <Panel title="How this space behaves">

        <dl className="os-kv">

          <div>
            <dt>
              Evening tablet reminder
            </dt>

            <dd>
              {nightMedicine?.done
                ? 'Completed today'
                : 'On · 8:00 PM'}
            </dd>
          </div>

          <div>
            <dt>
              Share location
            </dt>

            <dd>
              On · Rina and Doom
            </dd>
          </div>

          <div>
            <dt>
              Safe-zone radius
            </dt>

            <dd>
              Home + courtyard
            </dd>
          </div>

          <div>
            <dt>
              Patient dashboard
            </dt>

            <dd>
              Separate — no role switcher
              there
            </dd>
          </div>

        </dl>

      </Panel>

    </div>
  );
}