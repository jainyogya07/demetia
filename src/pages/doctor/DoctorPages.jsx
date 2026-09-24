import { useEffect, useState } from 'react';
import { Link, NavLink, useParams, Navigate, useSearchParams } from 'react-router-dom';
import { Search, ExternalLink, CalendarDays, ClipboardCheck, HeartPulse, ShieldCheck, UserRound } from 'lucide-react';
import AvatarSlot from '../../components/AvatarSlot';
import CognitiveDetectionPanel from './CognitiveDetectionPanel';
import {
  LiveDot, SyncBar, Stat, Badge, Panel, DataTable, TaskRow, TimelineRail, Spark, AppLink,
} from '../../components/clinic/LiveChrome';
import {
  DR_LIVE, DR_CLINIC, DR_PATIENTS, DR_TASKS, DR_CALENDAR, DR_COGNITIVE, DR_MEDS,
  DR_NOTES, DR_ALERTS, DR_REPORTS, DR_CAREPLAN, DR_TIMELINE, DR_MESSAGES,
} from '../../data/doctorPlaceholders';
import { loadDoctorDashboard, loadDoctorProfile } from '../../lib/doctorDashboardApi';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'cognitive', label: 'Cognitive' },
  { id: 'meds', label: 'Meds' },
  { id: 'notes', label: 'Notes' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'reports', label: 'Reports' },
  { id: 'care-plan', label: 'Care plan' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'calendar', label: 'Calendar' },
];

function statusTone(status) {
  if (status === 'urgent') return 'urgent';
  if (status === 'watch') return 'watch';
  return 'stable';
}

function patientName(id) {
  return DR_PATIENTS.find((p) => p.id === id)?.name || 'Clinic';
}

function useTaskState() {
  const [done, setDone] = useState(() => Object.fromEntries(DR_TASKS.map((t) => [t.id, t.done])));
  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  return { done, toggle };
}

function ClinicTasks({ filterId, compact }) {
  const { done, toggle } = useTaskState();
  const rows = DR_TASKS.filter((t) => !filterId || t.patientId === filterId);
  if (compact) {
    return (
      <div className="os-task-stack">
        {rows.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            checked={!!done[task.id]}
            onToggle={() => toggle(task.id)}
            extra={`${task.dueRel} · ${patientName(task.patientId)}`}
          />
        ))}
      </div>
    );
  }
  return (
    <DataTable
      empty="No open clinic tasks for today — a calm board."
      columns={[
        {
          key: 'check',
          label: '',
          narrow: true,
          render: (row) => (
            <input type="checkbox" checked={!!done[row.id]} onChange={() => toggle(row.id)} />
          ),
        },
        { key: 'kind', label: 'Type', narrow: true, render: (row) => <Badge>{row.kind}</Badge> },
        { key: 'title', label: 'Task' },
        {
          key: 'who',
          label: 'Patient',
          render: (row) => row.patientId
            ? <Link to={`/doctor/patients/${row.patientId}/profile`}>{patientName(row.patientId)}</Link>
            : 'Board',
        },
        { key: 'dueRel', label: 'Due' },
        { key: 'priority', label: 'Priority', render: (row) => <Badge tone={row.priority}>{row.priority}</Badge> },
      ]}
      rows={rows}
    />
  );
}

function WeekBoard({ filterWho }) {
  return (
    <div className="os-week">
      {DR_CALENDAR.map((col) => {
        const items = filterWho ? col.items.filter((item) => item.who === filterWho) : col.items;
        return (
          <div key={col.day} className={`os-week-col ${col.today ? 'today' : ''}`}>
            <header>
              <span>{col.day}</span>
              {col.today ? <LiveDot label="Today" /> : null}
            </header>
            {items.length === 0 ? <p className="os-empty">Quiet day — no named slots</p> : items.map((item) => (
              <article key={`${col.day}-${item.t}-${item.label}`} className="os-slot">
                <span className="os-slot-time">{item.t}</span>
                <Badge>{item.kind}</Badge>
                {item.who ? (
                  <Link to={`/doctor/patients/${item.who}/profile`}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </article>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ChartStrip({ patient }) {
  const statusLabel = patient.status === 'urgent'
    ? 'Needs attention'
    : patient.status === 'watch'
      ? 'Watch kindly'
      : 'Steady';
  return (
    <section className="os-chart-strip">
      <AvatarSlot name={patient.name} photoUrl={patient.photoUrl} size={56} label={patient.name} />
      <div className="os-chart-id">
        <p className="os-kicker">{patient.village} · in Dr. Sharma’s care</p>
        <h2>{patient.name}</h2>
        <p>{patient.age}{patient.sex} · Caregiver: {patient.caregiver} ({patient.caregiverRole})</p>
        {patient.cognitiveNote ? <p className="os-meta">{patient.cognitiveNote}</p> : null}
      </div>
      <div className="os-chart-actions">
        <Badge tone={statusTone(patient.status)}>{statusLabel}</Badge>
        {patient.appPath ? (
          <AppLink to={patient.appPath}>Open {patient.name.split(' ')[0]}’s app <ExternalLink size={12} /></AppLink>
        ) : null}
      </div>
      <div className="os-chip-row">
        <span>BP {patient.bp}</span>
        <span>HR {patient.hr}</span>
        <span>Sugar {patient.sugar}</span>
        <span>MMSE {patient.mmse}</span>
      </div>
    </section>
  );
}

function ChartShell({ patient, children, rail }) {
  return (
    <>
      <ChartStrip patient={patient} />
      <div className="os-split">
        <div className="os-main">{children}</div>
        <aside className="os-rail-col">{rail}</aside>
      </div>
    </>
  );
}

function LiveDoctorPatients({ patients }) {
  return (
    <div className="os-page">
      <SyncBar asOf="Live Supabase data" lastSync="just now" extra="Accepted doctor relationships only" />
      <section className="doctor-welcome-card">
        <div>
          <p className="os-kicker">Patient directory</p>
          <h2>Your connected care community</h2>
          <p>Each profile brings together the person’s routine progress and latest functional assessment in one calm, secure place.</p>
        </div>
        <div className="doctor-welcome-mark"><ShieldCheck size={28} /><span>Private<br />care records</span></div>
      </section>
      <div className="os-kpis">
        <Stat label="People in care" value={patients.length} hint="Connected patient records" />
        <Stat label="Assessments saved" value={patients.filter((patient) => patient.assessmentAt).length} hint="Latest ADL snapshots" />
        <Stat label="Routine items done" value={patients.reduce((sum, patient) => sum + patient.routineDone, 0)} hint="Across connected patients today" />
        <Stat label="Access" value="Secure" hint="Row-level protected records" />
      </div>
      <section className="doctor-profile-grid" aria-label="Connected patient profiles">
        {patients.map((patient) => {
          const completion = patient.routineTotal ? Math.round((patient.routineDone / patient.routineTotal) * 100) : 0;
          return (
            <Link key={patient.id} className="doctor-patient-card" to={`/doctor/patients/${patient.id}/profile`}>
              <header>
                <AvatarSlot name={patient.name} size={52} label={patient.name} />
                <div><h3>{patient.name}</h3><p>{patient.age ? `${patient.age} years` : 'Age not added'} · Connected patient</p></div>
                <span className="doctor-card-arrow">›</span>
              </header>
              <div className="doctor-card-stats">
                <span><CalendarDays size={15} /><b>{patient.routineDone}/{patient.routineTotal}</b> today</span>
                <span><ClipboardCheck size={15} /><b>{patient.adlScore ?? '—'}</b> latest ADL</span>
              </div>
              <div className="doctor-progress"><i style={{ width: `${completion}%` }} /></div>
              <footer>
                <span>{patient.routineTotal ? `${completion}% routine completion` : 'No routine added yet'}</span>
                {patient.riskBand ? <Badge tone="watch">{patient.riskBand.replace(/_/g, ' ')}</Badge> : <span className="os-muted">Awaiting review</span>}
              </footer>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

export function DoctorPatients() {
  const [livePatients, setLivePatients] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [q, setQ] = useState('');
  const [pane, setPane] = useState('list');
  const [params] = useSearchParams();
  const focusAlert = params.get('alert');
  const list = DR_PATIENTS.filter((p) => {
    const blob = `${p.name} ${p.village} ${p.stage} ${p.status}`.toLowerCase();
    return blob.includes(q.trim().toLowerCase());
  });
  const liveAlerts = DR_ALERTS.filter((a) => a.open);
  const today = DR_CALENDAR.find((d) => d.today) || DR_CALENDAR[1];

  useEffect(() => {
    let alive = true;
    loadDoctorDashboard()
      .then((patients) => {
        if (alive) setLivePatients(patients);
      })
      .catch(() => {
        if (alive) setLivePatients([]);
      })
      .finally(() => {
        if (alive) setLiveLoading(false);
      });
    return () => { alive = false; };
  }, []);

  if (livePatients?.length) return <LiveDoctorPatients patients={livePatients} />;

  return (
    <div className="os-page">
      <SyncBar asOf={liveLoading ? 'Connecting to secure care records…' : `${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra={DR_LIVE.feed} />
      <div className="os-kpis">
        <Stat label="People in care" value={DR_PATIENTS.length} hint="Latveria, Binod, Moni" />
        <Stat label="Tasks due" value={DR_TASKS.filter((t) => !t.done).length} hint="Today + held" />
        <Stat label="Open alerts" value={liveAlerts.length} hint="Watch + urgent" />
        <Stat label="Next slot" value="10:15" hint="Latveria Devi · review" />
      </div>
      <div className="ss-focus-bar ss-focus-bar-clinic" role="tablist" aria-label="Clinic today">
        <button type="button" role="tab" aria-selected={pane === 'list'} className={pane === 'list' ? 'is-on' : ''} onClick={() => setPane('list')}>
          <strong>People</strong>
          <span>Who you see today</span>
        </button>
        <button type="button" role="tab" aria-selected={pane === 'due'} className={pane === 'due' ? 'is-on' : ''} onClick={() => setPane('due')}>
          <strong>Due</strong>
          <span>Tasks today</span>
        </button>
        <button type="button" role="tab" aria-selected={pane === 'watch'} className={pane === 'watch' ? 'is-on' : ''} onClick={() => setPane('watch')}>
          <strong>Watch</strong>
          <span>Alerts and clinic day</span>
        </button>
      </div>
      {pane === 'list' && (
        <Panel
          title="People in Dr. Sharma’s care"
          action={(
            <label className="os-search">
              <Search size={14} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Latveria, Golaghat, Tura…" />
            </label>
          )}
        >
          <DataTable
            empty="No one matches that search — try a name or village."
            columns={[
              {
                key: 'name',
                label: 'Person',
                render: (row) => (
                  <Link className="os-person" to={`/doctor/patients/${row.id}/profile`}>
                    <AvatarSlot name={row.name} photoUrl={row.photoUrl} size={32} label={row.name} />
                    <span>
                      <strong>{row.name}</strong>
                      <em>{row.age}{row.sex} · {row.village}</em>
                    </span>
                  </Link>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <Badge tone={statusTone(row.status)}>
                    {row.status === 'urgent' ? 'Needs attention' : row.status === 'watch' ? 'Watch kindly' : 'Steady'}
                  </Badge>
                ),
              },
              { key: 'lastSeenRel', label: 'Last seen', render: (row) => <span>{row.lastSeenRel}<em className="os-sub">{row.lastSeenPlace}</em></span> },
              { key: 'mmse', label: 'MMSE', narrow: true },
              { key: 'bp', label: 'BP', narrow: true },
              {
                key: 'alerts',
                label: 'Alerts',
                render: (row) => row.alerts
                  ? <Link className="os-alert-n" to={`/doctor/patients/${row.id}/alerts`}>{row.alerts}</Link>
                  : <span className="os-muted">0</span>,
              },
            ]}
            rows={list}
          />
        </Panel>
      )}
      {pane === 'due' && (
        <Panel title="Due today" action={<Link to="/doctor/tasks">All tasks</Link>}>
          <ClinicTasks compact />
        </Panel>
      )}
      {pane === 'watch' && (
        <div className="os-rail-col">
          <Panel title="Alert feed" action={<Link to="/doctor/alerts">Board</Link>}>
            <ul className="os-alert-feed">
              {liveAlerts.map((a) => (
                <li key={a.id} className={focusAlert === a.id ? 'flash' : ''}>
                  <Link to={`/doctor/patients/${a.patientId}/alerts`}>
                    <Badge tone={a.level.toLowerCase()}>{a.level}</Badge>
                    <strong>{a.title}</strong>
                    <span>{a.when} · {patientName(a.patientId)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Today in clinic" action={<Link to="/doctor/calendar">Week</Link>}>
            {today.items.map((item) => (
              <p key={item.t} className="os-today-line">
                <strong>{item.t}</strong> {item.label}
              </p>
            ))}
          </Panel>
        </div>
      )}
    </div>
  );
}

function ProfileTab({ patient }) {
  const note = (DR_NOTES[patient.id] || [])[0];
  return (
    <PatientRecordLayout
      patient={patient}
      details={[
        ['Sex', patient.sex || 'Not recorded'], ['Care stage', patient.stage], ['Caregiver', patient.caregiver],
        ['Last OPD', patient.lastVisit], ['Last check-in', patient.lastSeenRel], ['Location', patient.lastSeenPlace],
      ]}
      vitals={[
        ['Blood pressure', patient.bp, 'Last OPD'], ['Heart rate', patient.hr, 'beats per minute'],
        ['Blood sugar', patient.sugar, 'Latest reading'], ['MMSE score', patient.mmse, patient.lastVisit],
      ]}
      historyTitle="Recent care history"
      history={note?.text || `No session note yet for ${patient.name.split(' ')[0]} — add one after OPD.`}
      historyMeta={note ? `${note.date} · ${note.by}` : 'Awaiting a first clinical note'}
    />
  );
}

function CognitiveTab({ patient }) {
  const rows = DR_COGNITIVE[patient.id] || [];
  const last = rows[rows.length - 1] || {};
  return (
    <ChartShell
      patient={patient}
      rail={(
        <Panel title="How to read">
          <p className="os-note-body">Engagement from games and voice. Age- and language-adjusted for the file — not a diagnosis or a test score.</p>
        </Panel>
      )}
    >
      <CognitiveDetectionPanel patient={patient} />
      <Panel title="Four-week trend">
        <div className="os-kpis tight">
          <Stat label="Memory (W4)" value={last.memory} hint={<Spark rows={rows} field="memory" />} />
          <Stat label="Attention (W4)" value={last.attention} hint={<Spark rows={rows} field="attention" />} />
          <Stat label="Engagement (W4)" value={last.engagement} hint={<Spark rows={rows} field="engagement" />} />
        </div>
        <DataTable
          columns={[
            { key: 'week', label: 'Week' },
            { key: 'memory', label: 'Memory' },
            { key: 'attention', label: 'Attention' },
            { key: 'engagement', label: 'Engagement' },
          ]}
          rows={rows.map((row) => ({ ...row, id: row.week }))}
        />
      </Panel>
    </ChartShell>
  );
}

function MedsTab({ patient }) {
  const rows = (DR_MEDS[patient.id] || []).map((med, i) => ({ ...med, id: `${med.name}-${i}` }));
  return (
    <ChartShell
      patient={patient}
      rail={<Panel title="Signing"><p className="os-note-body">Items marked Sign wait on today’s OPD close. A review queue, not a prescription pad.</p></Panel>}
    >
      <Panel title="Current medicines">
        <DataTable
          empty={`No medicines listed for ${patient.name.split(' ')[0]} yet.`}
          columns={[
            { key: 'name', label: 'Medicine' },
            { key: 'dose', label: 'Dose', narrow: true },
            { key: 'reason', label: 'Indication' },
            { key: 'from', label: 'Since', narrow: true },
            { key: 'sign', label: 'Status', render: (row) => row.sign ? <Badge tone="watch">Sign</Badge> : <Badge tone="stable">Active</Badge> },
          ]}
          rows={rows}
        />
      </Panel>
    </ChartShell>
  );
}

function NotesTab({ patient }) {
  const rows = DR_NOTES[patient.id] || [];
  return (
    <ChartShell
      patient={patient}
      rail={<Panel title="Author"><p className="os-note-body">Session notes stay with Dr. Meera Sharma. Family sees a share when signed.</p></Panel>}
    >
      <Panel title={`Notes about ${patient.name.split(' ')[0]}`}>
        {rows.length === 0 ? (
          <p className="os-empty">No session notes yet — write the first after you see {patient.name.split(' ')[0]}.</p>
        ) : (
          <div className="os-note-stack">
            {rows.map((note) => (
              <article key={note.date} className="os-note-card">
                <header>
                  <strong>{note.date}</strong>
                  <span>{note.by}</span>
                </header>
                <p>{note.text}</p>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </ChartShell>
  );
}

function AlertsTab({ patient }) {
  const rows = DR_ALERTS.filter((a) => a.patientId === patient.id);
  return (
    <ChartShell
      patient={patient}
      rail={<Panel title="Last ping"><p>{patient.lastSeenRel}</p><p className="os-meta">{patient.lastSeenPlace}</p></Panel>}
    >
      <Panel title="Safety alerts">
        <DataTable
          empty={`${patient.name.split(' ')[0]} has a clear safety board — no open alerts.`}
          columns={[
            { key: 'level', label: 'Level', render: (row) => <Badge tone={row.level.toLowerCase()}>{row.level}</Badge> },
            { key: 'title', label: 'Alert' },
            { key: 'when', label: 'When', narrow: true },
            { key: 'detail', label: 'Detail' },
          ]}
          rows={rows}
        />
      </Panel>
    </ChartShell>
  );
}

function ReportsTab({ patient }) {
  const rows = DR_REPORTS
    .filter((d) => !d.patientId || d.patientId === patient.id)
    .map((d, i) => ({ ...d, id: `${d.name}-${i}` }));
  return (
    <ChartShell patient={patient} rail={<Panel title="Exports"><p className="os-note-body">PDFs stay on the clinic file. Share Ready rows with family.</p></Panel>}>
      <Panel title="Reports">
        <DataTable
          columns={[
            { key: 'name', label: 'File' },
            { key: 'kind', label: 'Kind' },
            { key: 'date', label: 'Date', narrow: true },
            { key: 'status', label: 'Status', render: (row) => <Badge tone={row.status === 'Draft' ? 'watch' : 'stable'}>{row.status}</Badge> },
          ]}
          rows={rows}
        />
      </Panel>
    </ChartShell>
  );
}

function CarePlanTab({ patient }) {
  const first = patient.name.split(' ')[0];
  const plan = DR_CAREPLAN[patient.id] || [];
  const msgs = DR_MESSAGES.filter((m) => m.re.includes(first));
  return (
    <ChartShell
      patient={patient}
      rail={(
        <Panel title="Message caregiver">
          {msgs.map((m) => (
            <article key={m.to} className="os-note-card">
              <header><strong>To {m.to}</strong><span>{m.sent}</span></header>
              <p>{m.text}</p>
            </article>
          ))}
        </Panel>
      )}
    >
      <Panel title="Care plan">
        <DataTable
          columns={[
            { key: 'item', label: 'Action' },
            { key: 'owner', label: 'Owner', narrow: true },
            { key: 'by', label: 'When', narrow: true },
          ]}
          rows={plan.map((row, i) => ({ ...row, id: `${i}-${row.item}` }))}
        />
      </Panel>
      <Panel title="Chart tasks">
        <ClinicTasks filterId={patient.id} compact />
      </Panel>
    </ChartShell>
  );
}

function TimelineTab({ patient }) {
  const items = DR_TIMELINE[patient.id] || [];
  return (
    <ChartShell patient={patient} rail={<Panel title="Source"><p className="os-note-body">Home pings, OPD, and caregiver marks for {patient.name.split(' ')[0]}. Live as of {DR_LIVE.lastSync}.</p></Panel>}>
      <Panel title={`${patient.name.split(' ')[0]}’s timeline`}>
        {items.length === 0 ? (
          <p className="os-empty">No check-ins yet for {patient.name.split(' ')[0]} — home pings will land here.</p>
        ) : (
          <TimelineRail items={items} />
        )}
      </Panel>
    </ChartShell>
  );
}

function CalendarTab({ patient }) {
  return (
    <ChartShell patient={patient} rail={<Panel title="This week"><p className="os-note-body">Slots that name {patient.name.split(' ')[0]} on the clinic board.</p></Panel>}>
      <Panel title="Clinic calendar">
        <WeekBoard filterWho={patient.id} />
      </Panel>
    </ChartShell>
  );
}

export function DoctorPatient() {
  const { patientId, tab } = useParams();
  const [livePatients, setLivePatients] = useState(null);
  useEffect(() => {
    let alive = true;
    loadDoctorDashboard().then((rows) => { if (alive) setLivePatients(rows); }).catch(() => { if (alive) setLivePatients([]); });
    return () => { alive = false; };
  }, []);
  const patient = DR_PATIENTS.find((row) => row.id === patientId);
  const livePatient = livePatients?.find((row) => row.id === patientId);
  if (livePatient && !tab) return <Navigate to={`/doctor/patients/${patientId}/profile`} replace />;
  if (livePatient && tab === 'profile') return <LivePatientProfile patient={livePatient} />;
  if (!patient) return <Navigate to="/doctor" replace />;
  const active = TABS.some((item) => item.id === tab) ? tab : 'profile';
  if (!tab) return <Navigate to={`/doctor/patients/${patientId}/profile`} replace />;

  return (
    <div className="os-page">
      <SyncBar asOf={`${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra={patient.lastSeenRel} />
      <nav className="os-tabs" role="tablist">
        {TABS.map((item) => (
          <NavLink
            key={item.id}
            to={`/doctor/patients/${patientId}/${item.id}`}
            role="tab"
            aria-selected={active === item.id}
            className={({ isActive }) => `os-tab ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      {active === 'profile' && <ProfileTab patient={patient} />}
      {active === 'cognitive' && <CognitiveTab patient={patient} />}
      {active === 'meds' && <MedsTab patient={patient} />}
      {active === 'notes' && <NotesTab patient={patient} />}
      {active === 'alerts' && <AlertsTab patient={patient} />}
      {active === 'reports' && <ReportsTab patient={patient} />}
      {active === 'care-plan' && <CarePlanTab patient={patient} />}
      {active === 'timeline' && <TimelineTab patient={patient} />}
      {active === 'calendar' && <CalendarTab patient={patient} />}
    </div>
  );
}

function LivePatientProfile({ patient }) {
  const completion = patient.routineTotal ? Math.round((patient.routineDone / patient.routineTotal) * 100) : 0;
  return (
    <div className="os-page">
      <SyncBar asOf="Live Supabase data" lastSync="just now" extra="Connected patient profile" />
      <Link className="doctor-back-link" to="/doctor">← Back to patient directory</Link>
      <PatientRecordLayout
        patient={patient}
        live
        details={[
          ['Age', patient.age ? `${patient.age} years` : 'Not recorded'], ['Care relationship', 'Accepted doctor access'],
          ['Routine plan', patient.routineTotal ? `${patient.routineTotal} items today` : 'Not yet created'],
          ['Routine completion', patient.routineTotal ? `${completion}% today` : '—'],
          ['Latest review', patient.riskBand?.replace(/_/g, ' ') || 'No review yet'],
          ['Record access', 'Securely shared'],
        ]}
        vitals={[
          ['Routine completed', `${patient.routineDone}/${patient.routineTotal || 0}`, 'Today'],
          ['Latest ADL', patient.adlScore ?? '—', patient.assessmentAt ? new Date(patient.assessmentAt).toLocaleDateString() : 'Not recorded'],
          ['Care review', patient.riskBand?.replace(/_/g, ' ') || '—', 'Latest assessment'],
          ['Record status', 'Active', 'Secure connection'],
        ]}
        historyTitle="Care summary"
        history={patient.routineTotal ? `${patient.name.split(' ')[0]} has completed ${patient.routineDone} of ${patient.routineTotal} planned routine items today.` : 'A daily routine has not yet been added to this patient’s record.'}
        historyMeta="Live information from the securely shared care record"
      />
    </div>
  );
}

function PatientRecordLayout({ patient, details, vitals, historyTitle, history, historyMeta, live = false }) {
  return (
    <>
      <div className="patient-breadcrumb">Patients <span>›</span> Patient details <span>›</span> {patient.name}</div>
      <section className="patient-identity-card">
        <div className="patient-identity-main">
          <AvatarSlot name={patient.name} photoUrl={patient.photoUrl} size={92} label={patient.name} />
          <div><p className="os-kicker">{live ? 'Live patient record' : 'Patient record'}</p><h1>{patient.name}</h1><p>{live ? 'Securely shared care profile' : `${patient.age || ''}${patient.sex || ''} · Care profile`}</p><Badge tone={live ? 'stable' : statusTone(patient.status)}>{live ? 'Active record' : patient.status === 'urgent' ? 'Needs attention' : patient.status === 'watch' ? 'Watch kindly' : 'Steady'}</Badge></div>
        </div>
        <dl className="patient-detail-grid">
          {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>
      <section className="patient-section"><h2>Patient care snapshot</h2><div className="patient-vitals-grid">
        {vitals.map(([label, value, helper]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{helper}</small></article>)}
      </div></section>
      <section className="patient-section patient-history"><div className="patient-history-head"><h2>{historyTitle}</h2><span>Secure patient file</span></div><article><div className="patient-history-dot" /><div><p>{history}</p><small>{historyMeta}</small></div></article></section>
    </>
  );
}

export function DoctorAlerts() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra="Safety board" />
      <Panel title="Safety board">
        <DataTable
          columns={[
            { key: 'level', label: 'Level', render: (row) => <Badge tone={row.level.toLowerCase()}>{row.level}</Badge> },
            {
              key: 'title',
              label: 'Alert',
              render: (row) => <Link to={`/doctor/patients/${row.patientId}/alerts`}>{row.title}</Link>,
            },
            { key: 'who', label: 'Patient', render: (row) => patientName(row.patientId) },
            { key: 'when', label: 'When', narrow: true },
            { key: 'detail', label: 'Detail' },
          ]}
          rows={DR_ALERTS}
        />
      </Panel>
    </div>
  );
}

export function DoctorReports() {
  return (
    <div className="os-page">
      <SyncBar asOf={`${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra="File room" />
      <Panel title="File exports">
        <DataTable
          columns={[
            { key: 'name', label: 'File' },
            { key: 'kind', label: 'Kind' },
            { key: 'date', label: 'Date', narrow: true },
            { key: 'status', label: 'Status', render: (row) => <Badge tone={row.status === 'Draft' ? 'watch' : 'stable'}>{row.status}</Badge> },
            {
              key: 'who',
              label: 'Patient',
              render: (row) => row.patientId
                ? <Link to={`/doctor/patients/${row.patientId}/reports`}>{patientName(row.patientId)}</Link>
                : 'Clinic',
            },
          ]}
          rows={DR_REPORTS.map((d, i) => ({ ...d, id: `${d.name}-${i}` }))}
        />
      </Panel>
    </div>
  );
}

export function DoctorTasks() {
  const open = DR_TASKS.filter((t) => !t.done).length;
  return (
    <div className="os-page">
      <SyncBar asOf={`${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra={`${open} open`} />
      <div className="os-kpis">
        <Stat label="Open" value={open} hint="Checkable clinic work" />
        <Stat label="High" value={DR_TASKS.filter((t) => t.priority === 'high').length} hint="Close before OPD ends" />
        <Stat label="Next" value="11:00" hint="MMSE · Latveria Devi" />
      </div>
      <Panel title="Work to close">
        <ClinicTasks />
      </Panel>
    </div>
  );
}

export function DoctorCalendar() {
  const today = DR_CALENDAR.find((d) => d.today);
  return (
    <div className="os-page">
      <SyncBar asOf={`${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra="Week 24–30 Aug" />
      <div className="os-kpis">
        <Stat label="Today" value={today?.day || 'Tue 25'} hint={today?.items[1]?.label} />
        <Stat label="OPD hours" value="09:00–13:30" hint={DR_CLINIC.site} />
        <Stat label="Tele-MANAS" value="15:00" hint="Moni Sangma" />
      </div>
      <Panel title="Clinic week">
        <WeekBoard />
      </Panel>
    </div>
  );
}

export function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [patientCount, setPatientCount] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([loadDoctorProfile(), loadDoctorDashboard()]).then(([doctor, patients]) => {
      if (!alive) return;
      setProfile(doctor);
      setPatientCount(patients.length);
    }).catch(() => { if (alive) setPatientCount(0); });
    return () => { alive = false; };
  }, []);
  if (profile) return <LiveDoctorProfile profile={profile} patientCount={patientCount} />;
  return (
    <div className="os-page">
      <SyncBar asOf={`${DR_LIVE.asOf} · ${DR_LIVE.clock}`} lastSync={DR_LIVE.lastSync} extra={DR_CLINIC.site} />
      <section className="os-chart-strip">
        <AvatarSlot name={DR_CLINIC.name} photoUrl={DR_CLINIC.photoUrl} size={72} label={DR_CLINIC.name} />
        <div className="os-chart-id">
          <p className="os-kicker">Clinician file</p>
          <h2>{DR_CLINIC.name}</h2>
          <p>{DR_CLINIC.title} · {DR_CLINIC.degrees}</p>
        </div>
        <Badge tone="stable">On OPD</Badge>
      </section>
      <div className="os-split">
        <Panel title="Credentials">
          <dl className="os-kv">
            <div><dt>Site</dt><dd>{DR_CLINIC.site}</dd></div>
            <div><dt>Hospital</dt><dd>{DR_CLINIC.hospital}</dd></div>
            <div><dt>City</dt><dd>{DR_CLINIC.city}</dd></div>
            <div><dt>Registration</dt><dd>{DR_CLINIC.reg}</dd></div>
            <div><dt>Hours</dt><dd>{DR_CLINIC.hours}</dd></div>
            <div><dt>Tele-MANAS</dt><dd>{DR_CLINIC.tele}</dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${DR_CLINIC.phone.replace(/\D/g, '')}`}>{DR_CLINIC.phone}</a></dd></div>
            <div><dt>Email</dt><dd>{DR_CLINIC.email}</dd></div>
          </dl>
          <p className="os-meta">Voice for Care Agent stays on Latveria’s patient app — not on this clinic desk.</p>
        </Panel>
        <Panel title="Today’s board">
          <p className="os-today-line"><strong>10:15</strong> Latveria Devi · review</p>
          <p className="os-today-line"><strong>15:00</strong> Tele-MANAS · Moni</p>
          <p className="os-meta">{DR_CLINIC.opdToday}</p>
        </Panel>
      </div>
    </div>
  );
}

function LiveDoctorProfile({ profile, patientCount }) {
  return (
    <div className="os-page">
      <SyncBar asOf="Your secure profile" lastSync="just now" extra="Supabase account" />
      <section className="doctor-live-profile doctor-personal-profile">
        <AvatarSlot name={profile.name} size={78} label={profile.name} />
        <div><p className="os-kicker">Doctor profile</p><h2>{profile.name}</h2><p>{profile.email}</p>{profile.phone ? <p>{profile.phone}</p> : null}</div>
        <UserRound size={24} className="doctor-profile-icon" />
      </section>
      <div className="doctor-detail-grid">
        <Panel title="Your care access"><div className="doctor-metric"><ShieldCheck size={20} /><div><strong>{patientCount ?? '—'} connected patient{patientCount === 1 ? '' : 's'}</strong><span>Only accepted doctor relationships appear in your directory.</span></div></div></Panel>
        <Panel title="Account"><div className="doctor-metric"><ClipboardCheck size={20} /><div><strong>Verified sign-in</strong><span>Your email link is managed by Supabase Authentication.</span></div></div></Panel>
      </div>
    </div>
  );
}
