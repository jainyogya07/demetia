import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Phone } from 'lucide-react';
import AvatarSlot from '../../components/AvatarSlot';
import {
  LiveDot, SyncBar, Stat, Badge, Panel, DataTable, TaskRow, TimelineRail, AppLink,
} from '../../components/clinic/LiveChrome';
import {
  CG_LIVE, CG_PROFILE, CG_PATIENT, CG_TODAY, CG_MEDS, CG_ROUTINE, CG_ENGAGEMENT, CG_CIRCLE,
  CG_MESSAGES, CG_DOCS, CG_CHECKINS, CG_CALENDAR, CG_REFILLS, CG_DOCTOR_NOTES,
} from '../../data/caregiverPlaceholders';

function medTone(status) {
  if (status === 'Taken' || status === 'Done') return 'stable';
  if (status === 'Due' || status === 'Now') return 'urgent';
  return 'watch';
}

function TodayTasks({ compact }) {
  const [done, setDone] = useState(() => Object.fromEntries(CG_TODAY.map((t) => [t.id, t.done])));
  const rows = CG_TODAY.map((task) => ({ ...task, done: !!done[task.id] }));
  if (compact) {
    return (
      <div className="os-task-stack">
        {rows.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            checked={!!done[task.id]}
            onToggle={() => setDone((d) => ({ ...d, [task.id]: !d[task.id] }))}
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
              onChange={() => setDone((d) => ({ ...d, [row.id]: !d[row.id] }))}
            />
          ),
        },
        { key: 'time', label: 'Time', narrow: true },
        { key: 'kind', label: 'Type', narrow: true, render: (row) => <Badge>{row.kind}</Badge> },
        { key: 'title', label: 'Task', render: (row) => <span><strong>{row.title}</strong><em className="os-sub">{row.detail}</em></span> },
        { key: 'state', label: 'Status', render: (row) => <Badge tone={medTone(done[row.id] ? 'Done' : row.state)}>{done[row.id] ? 'Done' : row.state}</Badge> },
      ]}
      rows={rows}
    />
  );
}

function WeekBoard() {
  return (
    <div className="os-week">
      {CG_CALENDAR.map((col) => (
        <div key={col.day} className={`os-week-col ${col.today ? 'today' : ''}`}>
          <header>
            <span>{col.day}</span>
            {col.today ? <LiveDot label="Today" /> : null}
          </header>
          {col.items.length === 0 ? <p className="os-empty">Quiet</p> : col.items.map((item) => (
            <article key={`${col.day}-${item.t}-${item.label}`} className="os-slot">
              <span className="os-slot-time">{item.t}</span>
              <Badge>{item.kind}</Badge>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}

function PersonStrip() {
  return (
    <section className="os-chart-strip">
      <AvatarSlot name={CG_PATIENT.name} photoUrl={CG_PATIENT.photoUrl} size={56} label="Patient photo placeholder" />
      <div className="os-chart-id">
        <p className="os-kicker">Your person · {CG_PATIENT.relation}</p>
        <h2>{CG_PATIENT.name}</h2>
        <p>{CG_PATIENT.age} · {CG_PATIENT.place} · {CG_PATIENT.mood}</p>
      </div>
      <div className="os-chart-actions">
        <Badge tone="stable">{CG_PATIENT.zone}</Badge>
        <AppLink to={CG_PATIENT.appPath}>Open her dashboard <ExternalLink size={12} /></AppLink>
      </div>
      <div className="os-chip-row">
        <span>Ping {CG_PATIENT.lastCheckIn}</span>
        <span>{CG_LIVE.ping}</span>
      </div>
    </section>
  );
}

export function CgOverview() {
  const open = CG_TODAY.filter((t) => !t.done).length;
  const today = CG_CALENDAR.find((d) => d.today);
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={CG_LIVE.ping} />
      <PersonStrip />
      <div className="os-kpis">
        <Stat label="Safety" value="Home" hint={CG_PATIENT.lastCheckIn} />
        <Stat label="Open tasks" value={open} hint="Today’s checklist" />
        <Stat label="Voice this week" value={`${CG_ENGAGEMENT.voiceMinutes} min`} hint={`${CG_ENGAGEMENT.gamesThisWeek} games`} />
        <Stat label="Story beats" value={CG_ENGAGEMENT.storyBeats} hint="Held, not scored" />
      </div>
      <div className="os-split">
        <Panel title="Today’s checklist" action={<Link to="/caregiver/routine">Full routine</Link>}>
          <TodayTasks />
        </Panel>
        <div className="os-rail-col">
          <Panel title="Today on the week" action={<Link to="/caregiver/calendar">Calendar</Link>}>
            {today?.items.map((item) => (
              <p key={item.t} className="os-today-line"><strong>{item.t}</strong> {item.label}</p>
            ))}
          </Panel>
          <Panel title="Safety live" action={<Link to="/caregiver/safety">Map</Link>}>
            <p className="os-safety-ok"><LiveDot label={CG_PATIENT.zone} /></p>
            <p className="os-meta">{CG_CHECKINS[0].rel} · {CG_CHECKINS[0].place}</p>
          </Panel>
          <Panel title="Note for Dr. Sharma">
            <p className="os-note-body">{CG_DOCTOR_NOTES[0].text}</p>
            <p className="os-meta">{CG_DOCTOR_NOTES[0].rel} · {CG_DOCTOR_NOTES[0].date}</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function CgRoutine() {
  const due = CG_TODAY.filter((t) => !t.done).length;
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={`${due} still open`} />
      <PersonStrip />
      <div className="os-kpis">
        <Stat label="Next" value="1:30 PM" hint="Calcium + D3" />
        <Stat label="Open" value={due} hint="Tick as you go" />
        <Stat label="Night tablet" value="8:30 PM" hint="With dinner" />
      </div>
      <div className="os-split">
        <div className="os-main">
          <Panel title="Day plan">
            <DataTable
              columns={[
                { key: 'time', label: 'Time', narrow: true },
                { key: 'title', label: 'Step' },
                { key: 'status', label: 'Status', render: (row) => <Badge tone={medTone(row.status)}>{row.status}</Badge> },
              ]}
              rows={CG_ROUTINE.map((row) => ({ ...row, id: row.time }))}
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
                { key: 'name', label: 'Medicine' },
                { key: 'time', label: 'When', narrow: true },
                { key: 'status', label: '', render: (row) => <Badge tone={medTone(row.status)}>{row.status}</Badge> },
              ]}
              rows={CG_MEDS}
            />
          </Panel>
          <Panel title="Upcoming refills">
            <DataTable
              columns={[
                { key: 'name', label: 'Item' },
                { key: 'left', label: 'Left', narrow: true },
                { key: 'due', label: 'Due', narrow: true },
              ]}
              rows={CG_REFILLS.map((row) => ({ ...row, id: row.name }))}
            />
            <p className="os-meta">Clinic / chemist on the file — NPHCE OPD and Jan Aushadhi, Jorhat.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function CgSafety() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={CG_LIVE.ping} />
      <div className="os-kpis">
        <Stat label="Zone" value="Home" hint="Courtyard + verandah" />
        <Stat label="Last ping" value={CG_PATIENT.lastCheckIn} hint={CG_CHECKINS[0].place} />
        <Stat label="Status" value="Safe" hint="No wander flag" />
      </div>
      <div className="os-split">
        <Panel title="Home zone">
          <div className="os-map" aria-hidden="true">
            <div className="os-map-grid" />
            <div className="os-map-zone" />
            <div className="os-map-pin">Home</div>
            <p className="os-map-caption"><LiveDot label={`Live ping · ${CG_LIVE.ping}`} /></p>
          </div>
        </Panel>
        <div className="os-rail-col">
          <Panel title="Check-ins">
            <TimelineRail
              items={CG_CHECKINS.map((row) => ({
                when: row.time,
                rel: `${row.rel} · ${row.time}`,
                place: row.place,
                text: row.note,
              }))}
            />
          </Panel>
          <Panel title="Call">
            <a className="os-full-btn" href="tel:9435011820"><Phone size={15} /> Call Rina (primary)</a>
            <a className="os-full-btn" href="tel:112">Emergency 112</a>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function CgProgress() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Week engagement" />
      <div className="os-kpis">
        <Stat label="Games" value={CG_ENGAGEMENT.gamesThisWeek} hint="This week" />
        <Stat label="Voice" value={`${CG_ENGAGEMENT.voiceMinutes} min`} hint="Companion + stories" />
        <Stat label="Story beats" value={CG_ENGAGEMENT.storyBeats} hint="Held kindly" />
      </div>
      <div className="os-split">
        <Panel title="How the days felt">
          <p className="os-meta">Support for the household — not a test score or a diagnosis.</p>
          <div className="os-bar-row">
            {CG_ENGAGEMENT.days.map((day) => (
              <div key={day.d} className="os-bar-col">
                <div className="os-bar" style={{ height: `${Math.max(day.v * 0.9, 8)}px` }} />
                <span>{day.d}</span>
              </div>
            ))}
          </div>
          <p className="os-note-body">{CG_ENGAGEMENT.moodNote}</p>
        </Panel>
        <Panel title="Notes for the doctor">
          {CG_DOCTOR_NOTES.map((note) => (
            <article key={note.date} className="os-note-card">
              <header>
                <strong>{note.date}</strong>
                <span>{note.rel}</span>
              </header>
              <p>{note.text}</p>
            </article>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function CgCircle() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Family · ASHA · clinic" />
      <div className="os-split">
        <Panel title="People">
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Person',
                render: (row) => (
                  <span className="os-person">
                    <AvatarSlot name={row.name} size={32} />
                    <span>
                      <strong>{row.name}</strong>
                      <em>{row.role}</em>
                    </span>
                  </span>
                ),
              },
              { key: 'status', label: 'Status', render: (row) => <Badge tone={row.status === 'Here' ? 'stable' : 'watch'}>{row.status}</Badge> },
              { key: 'note', label: 'Note' },
              {
                key: 'phone',
                label: '',
                narrow: true,
                render: (row) => row.phone
                  ? <a className="os-mini-link" href={`tel:${row.phone.replace(/\D/g, '')}`}>Call</a>
                  : null,
              },
            ]}
            rows={CG_CIRCLE}
          />
        </Panel>
        <Panel title="Messages">
          {CG_MESSAGES.map((msg) => (
            <article key={msg.time} className="os-note-card">
              <header>
                <strong>{msg.from}</strong>
                <span>{msg.rel}</span>
              </header>
              <p>{msg.text}</p>
            </article>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function CgDocuments() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Shared file room" />
      <Panel title="Files the circle can see">
        <DataTable
          empty="No files shared yet."
          columns={[
            { key: 'name', label: 'File' },
            { key: 'kind', label: 'Kind', narrow: true, render: (row) => <Badge>{row.kind}</Badge> },
            { key: 'updated', label: 'Updated', narrow: true },
            { key: 'shared', label: 'Shared with' },
          ]}
          rows={CG_DOCS.map((doc) => ({ ...doc, id: doc.name }))}
        />
        <p className="os-meta">Placeholder files. Upload arrives with the family photo and live backend.</p>
      </Panel>
    </div>
  );
}

export function CgCalendar() {
  const today = CG_CALENDAR.find((d) => d.today);
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Week 24–30 Aug" />
      <div className="os-kpis">
        <Stat label="Today" value={today?.day || 'Tue 25'} hint={today?.items[0]?.label} />
        <Stat label="Clinic" value="10:15" hint="Dr. Sharma · OPD" />
        <Stat label="Story" value="16:00" hint="Stay for the whole breath" />
      </div>
      <Panel title="Household week">
        <WeekBoard />
      </Panel>
    </div>
  );
}

export function CgProfile() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={CG_PROFILE.place} />
      <section className="os-chart-strip">
        <AvatarSlot name={CG_PROFILE.name} photoUrl={CG_PROFILE.photoUrl} size={72} label="Caregiver photo placeholder" />
        <div className="os-chart-id">
          <p className="os-kicker">Caregiver file</p>
          <h2>{CG_PROFILE.name}</h2>
          <p>{CG_PROFILE.role}</p>
        </div>
        <div className="os-chart-actions">
          <Badge tone="stable">Primary · here</Badge>
          <AppLink to={CG_PATIENT.appPath}>Open {CG_PATIENT.name}’s dashboard <ExternalLink size={12} /></AppLink>
        </div>
      </section>
      <div className="os-split">
        <Panel title="About you">
          <dl className="os-kv">
            <div><dt>Role</dt><dd>{CG_PROFILE.role}</dd></div>
            <div><dt>Place</dt><dd>{CG_PROFILE.place}</dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${CG_PROFILE.phone.replace(/\D/g, '')}`}>{CG_PROFILE.phone}</a></dd></div>
            <div><dt>Person in care</dt><dd>{CG_PATIENT.name} · {CG_PATIENT.relation}</dd></div>
          </dl>
          <p className="os-meta">Photo slot ready. Companion voice gender stays on her app — not on this household desk.</p>
        </Panel>
        <Panel title="Right now">
          <p className="os-today-line"><strong>{CG_PATIENT.lastCheckIn}</strong> {CG_LIVE.ping}</p>
          <p className="os-today-line"><strong>Open</strong> {CG_TODAY.filter((t) => !t.done).length} household tasks</p>
          <p className="os-meta">{CG_PATIENT.mood}</p>
        </Panel>
      </div>
    </div>
  );
}

export function CgSettings() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Household preferences" />
      <Panel title="How this space behaves">
        <dl className="os-kv">
          <div><dt>Evening tablet reminder</dt><dd>On · 8:30 PM</dd></div>
          <div><dt>Share location</dt><dd>On · Rina and Doom</dd></div>
          <div><dt>Safe-zone radius</dt><dd>Home + courtyard</dd></div>
          <div><dt>Patient dashboard</dt><dd>Separate — no role switcher there</dd></div>
        </dl>
      </Panel>
    </div>
  );
}
