// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Phone } from 'lucide-react';
import AvatarSlot from '../../components/AvatarSlot';
import {
  LiveDot, SyncBar, Stat, Badge, Panel, DataTable, TaskRow, TimelineRail, AppLink,
} from '../../components/clinic/LiveChrome';
import {
  CG_LIVE, CG_PATIENT, CG_MEDS, CG_ENGAGEMENT, CG_REFILLS,
  getMemoryQuizResult,
} from '../../data/caregiverPlaceholders';
import {
  getCaregiverProfile,
  saveCaregiverProfile,
  getCircle,
  upsertCircleMember,
  removeCircleMember,
  getMessages,
  upsertMessage,
  removeMessage,
  getCheckins,
  upsertCheckin,
  removeCheckin,
  getDoctorNotes,
  upsertDoctorNote,
  removeDoctorNote,
  getDocs,
  upsertDoc,
  removeDoc,
  getCalendar,
  upsertCalendarItem,
  removeCalendarItem,
  getTodayTasks,
  upsertTodayTask,
  getTodayDone,
  toggleTodayDone,
  getRoutine,
  upsertRoutineStep,
  removeRoutineStep,
  uid,
  subscribeCaregiverStore,
} from '../../lib/caregiverStore';
import {
  RowActions, AddButton, CrudForm, Field, useConfirmRemove,
} from './CaregiverCrud';
import DrawingPracticePanel, { useDrawingGame } from '../../components/clinic/DrawingPracticePanel';
import { subscribeAssessmentChange } from '../../lib/assessmentStore';
import { bffFetch, bffSilent } from '../../lib/bff';

function medTone(status) {
  if (status === 'Taken' || status === 'Done') return 'stable';
  if (status === 'Due' || status === 'Now') return 'urgent';
  return 'watch';
}

function useStoreTick() {
  const [, setTick] = useState(0);
  useEffect(() => subscribeCaregiverStore(() => setTick((n) => n + 1)), []);
}

/** Caregiver Progress also listens for patient assessment / Shape Draw writes. */
function useAssessmentTick() {
  const [, setTick] = useState(0);
  useEffect(() => subscribeAssessmentChange(() => setTick((n) => n + 1)), []);
}

function TodayTasks({ compact }) {
  useStoreTick();
  const tasks = getTodayTasks();
  const done = getTodayDone();
  const [editing, setEditing] = useState<unknown>(null);
  const [draft, setDraft] = useState({ title: '', detail: '', time: '', kind: 'Care' });

  const rows = tasks.map((task) => ({ ...task, done: !!done[task.id] }));

  const startEdit = (task) => {
    setEditing(task.id);
    setDraft({
      title: task.title || '',
      detail: task.detail || '',
      time: task.time || '',
      kind: task.kind || 'Care',
    });
  };

  const saveEdit = () => {
    if (!editing || !draft.title.trim()) return;
    upsertTodayTask({
      id: editing,
      title: draft.title.trim(),
      detail: draft.detail.trim(),
      time: draft.time.trim() || '—',
      kind: draft.kind.trim() || 'Care',
    });
    setEditing(null);
  };

  const form = editing ? (
    <CrudForm title="Edit checklist note" onSubmit={saveEdit} onCancel={() => setEditing(null)}>
      <Field label="Title">
        <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
      </Field>
      <Field label="Time">
        <input value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
      </Field>
      <Field label="Note">
        <textarea value={draft.detail} onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))} rows={2} />
      </Field>
    </CrudForm>
  ) : null;

  if (compact) {
    return (
      <div className="os-task-stack">
        {rows.map((task) => (
          <div key={task.id}>
            <div className="cg-note-card-actions">
              <TaskRow
                task={task}
                checked={!!done[task.id]}
                onToggle={() => toggleTodayDone(task.id)}
                extra={`${task.time} · ${task.detail}`}
              />
              <RowActions onEdit={() => startEdit(task)} />
            </div>
            {editing === task.id ? form : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <DataTable
        empty="Nothing on Latveria’s list right now — a quiet stretch of the day."
        columns={[
          {
            key: 'check',
            label: '',
            narrow: true,
            render: (row) => (
              <input
                type="checkbox"
                checked={!!done[row.id]}
                onChange={() => toggleTodayDone(row.id)}
              />
            ),
          },
          { key: 'time', label: 'Time', narrow: true },
          { key: 'kind', label: 'Type', narrow: true, render: (row) => <Badge>{row.kind}</Badge> },
          {
            key: 'title',
            label: 'Task',
            render: (row) => (
              <span>
                <strong>{row.title}</strong>
                <em className="os-sub">{row.detail}</em>
              </span>
            ),
          },
          {
            key: 'state',
            label: 'Status',
            render: (row) => (
              <Badge tone={medTone(done[row.id] ? 'Done' : row.state)}>
                {done[row.id] ? 'Done' : row.state}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: '',
            narrow: true,
            render: (row) => <RowActions onEdit={() => startEdit(row)} />,
          },
        ]}
        rows={rows}
      />
      <AnimatePresence>{editing ? form : null}</AnimatePresence>
    </>
  );
}

function WeekBoard() {
  useStoreTick();
  const calendar = getCalendar();
  const confirm = useConfirmRemove();
  const [editing, setEditing] = useState<unknown>(null);
  const [draft, setDraft] = useState({ t: '', kind: '', label: '' });

  const startEdit = (day, item) => {
    setEditing({ day, id: item.id });
    setDraft({ t: item.t || '', kind: item.kind || '', label: item.label || '' });
  };

  const startAdd = (day) => {
    const id = uid('cal');
    setEditing({ day, id, isNew: true });
    setDraft({ t: '09:00', kind: 'Care', label: '' });
  };

  const saveEdit = () => {
    if (!editing || !draft.label.trim()) return;
    upsertCalendarItem(editing.day, {
      id: editing.id,
      t: draft.t.trim() || '—',
      kind: draft.kind.trim() || 'Care',
      label: draft.label.trim(),
    });
    setEditing(null);
  };

  return (
    <>
      <div className="os-week">
        {calendar.map((col) => (
          <div key={col.day} className={`os-week-col ${col.today ? 'today' : ''}`}>
            <header>
              <span>{col.day}</span>
              {col.today ? <LiveDot label="Today" /> : null}
            </header>
            {col.items.length === 0 ? <p className="os-empty">Quiet</p> : col.items.map((item) => (
              <motion.article
                key={item.id}
                layout
                className="os-slot cg-slot-editable"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
              >
                <span className="os-slot-time">{item.t}</span>
                <Badge>{item.kind}</Badge>
                <span>{item.label}</span>
                <RowActions
                  onEdit={() => startEdit(col.day, item)}
                  onRemove={() => confirm.askRemove(`${col.day}::${item.id}`, item.label)}
                />
                {editing?.day === col.day && editing?.id === item.id ? (
                  <CrudForm title="Edit calendar item" onSubmit={saveEdit} onCancel={() => setEditing(null)}>
                    <Field label="Time">
                      <input value={draft.t} onChange={(e) => setDraft((d) => ({ ...d, t: e.target.value }))} />
                    </Field>
                    <Field label="Kind">
                      <input value={draft.kind} onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value }))} />
                    </Field>
                    <Field label="Label">
                      <input value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} required />
                    </Field>
                  </CrudForm>
                ) : null}
              </motion.article>
            ))}
            {editing?.day === col.day && editing?.isNew ? (
              <CrudForm title={`Add for ${col.day}`} onSubmit={saveEdit} onCancel={() => setEditing(null)} submitLabel="Add">
                <Field label="Time">
                  <input value={draft.t} onChange={(e) => setDraft((d) => ({ ...d, t: e.target.value }))} />
                </Field>
                <Field label="Kind">
                  <input value={draft.kind} onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value }))} />
                </Field>
                <Field label="Label">
                  <input value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} required />
                </Field>
              </CrudForm>
            ) : (
              <AddButton label="Add" onClick={() => startAdd(col.day)} />
            )}
          </div>
        ))}
      </div>
      <confirm.Confirm
        onConfirm={(key) => {
          const [day, itemId] = String(key).split('::');
          if (day && itemId) removeCalendarItem(day, itemId);
        }}
      />
    </>
  );
}

function PersonStrip({ lead }) {
  return (
    <section className="os-chart-strip">
      <AvatarSlot name={CG_PATIENT.name} photoUrl={CG_PATIENT.photoUrl} size={56} label={CG_PATIENT.name} />
      <div className="os-chart-id">
        <p className="os-kicker">{lead || `Your mother · ${CG_PATIENT.relation}`}</p>
        <h2>{CG_PATIENT.dayTitle || `${CG_PATIENT.shortName}'s day`}</h2>
        <p>{CG_PATIENT.name} · {CG_PATIENT.age} · {CG_PATIENT.place}</p>
        <p className="os-meta">{CG_PATIENT.mood}</p>
      </div>
      <div className="os-chart-actions">
        <Badge tone="stable">{CG_PATIENT.zone}</Badge>
        <AppLink to={CG_PATIENT.appPath}>Open Latveria’s dashboard <ExternalLink size={12} /></AppLink>
      </div>
      <div className="os-chip-row">
        <span>Ping {CG_PATIENT.lastCheckIn}</span>
        <span>{CG_LIVE.ping}</span>
      </div>
    </section>
  );
}

export function CgOverview() {
  useStoreTick();
  const [pane, setPane] = useState('tasks');
  const [overview, setOverview] = useState<unknown>(null);
  useEffect(() => {
    bffFetch('/api/v1/caregiver/overview').then(setOverview);
  }, []);
  const done = getTodayDone();
  const tasks = getTodayTasks();
  const checkins = getCheckins();
  const doctorNotes = getDoctorNotes();
  const calendar = getCalendar();
  const open = tasks.filter((t) => !done[t.id]).length;
  const today = calendar.find((d) => d.today);
  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={CG_LIVE.ping} />
      <PersonStrip lead="Household desk · mother in care" />
      <div className="os-kpis">
        <Stat label="Latveria" value="Home" hint={CG_PATIENT.lastCheckIn} />
        <Stat label="Still open" value={overview?.routineOpen ?? open} hint="Today’s checklist" />
        <Stat label="Voice this week" value={`${CG_ENGAGEMENT.voiceMinutes} min`} hint={`${CG_ENGAGEMENT.gamesThisWeek} games`} />
        <Stat label="Story beats" value={CG_ENGAGEMENT.storyBeats} hint="Held, not scored" />
      </div>
      <div className="ss-focus-bar ss-focus-bar-clinic" role="tablist" aria-label="Today sections">
        <button type="button" role="tab" aria-selected={pane === 'tasks'} className={pane === 'tasks' ? 'is-on' : ''} onClick={() => setPane('tasks')}>
          <strong>Checklist</strong>
          <span>Latveria’s day</span>
        </button>
        <button type="button" role="tab" aria-selected={pane === 'week'} className={pane === 'week' ? 'is-on' : ''} onClick={() => setPane('week')}>
          <strong>Week</strong>
          <span>What is on today</span>
        </button>
        <button type="button" role="tab" aria-selected={pane === 'watch'} className={pane === 'watch' ? 'is-on' : ''} onClick={() => setPane('watch')}>
          <strong>Watch</strong>
          <span>Safety and Dr. Sharma</span>
        </button>
      </div>
      {pane === 'tasks' && (
        <Panel title="Latveria’s checklist" action={<Link to="/caregiver/routine">Full routine</Link>}>
          <TodayTasks />
        </Panel>
      )}
      {pane === 'week' && (
        <Panel title="Today on the week" action={<Link to="/caregiver/calendar">Calendar</Link>}>
          {today?.items.map((item) => (
            <p key={item.id} className="os-today-line"><strong>{item.t}</strong> {item.label}</p>
          ))}
        </Panel>
      )}
      {pane === 'watch' && (
        <div className="os-rail-col">
          <Panel title="Where Latveria is" action={<Link to="/caregiver/safety">Map</Link>}>
            <p className="os-safety-ok"><LiveDot label={CG_PATIENT.zone} /></p>
            {checkins[0] ? (
              <>
                <p className="os-meta">{checkins[0].rel} · {checkins[0].place}</p>
                <p className="os-note-body">{checkins[0].note}</p>
              </>
            ) : null}
          </Panel>
          <Panel title="Note for Dr. Meera Sharma">
            {doctorNotes[0] ? (
              <>
                <p className="os-note-body">{doctorNotes[0].text}</p>
                <p className="os-meta">{doctorNotes[0].rel} · {doctorNotes[0].date}</p>
              </>
            ) : (
              <p className="os-empty">No doctor notes yet.</p>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

export function CgRoutine() {
  useStoreTick();
  const done = getTodayDone();
  const tasks = getTodayTasks();
  const routine = getRoutine();
  const due = tasks.filter((t) => !done[t.id]).length;
  const confirm = useConfirmRemove();
  const [editing, setEditing] = useState<unknown>(null);
  const [draft, setDraft] = useState({ time: '', title: '', status: 'Next', note: '' });

  const startEdit = (row) => {
    setEditing(row.id);
    setDraft({
      time: row.time || '',
      title: row.title || '',
      status: row.status || 'Next',
      note: row.note || '',
    });
  };

  const startAdd = () => {
    setEditing('__new__');
    setDraft({ time: '', title: '', status: 'Next', note: '' });
  };

  const saveEdit = () => {
    if (!draft.title.trim()) return;
    const id = editing === '__new__' ? uid('rt') : editing;
    upsertRoutineStep({
      id,
      time: draft.time.trim() || '—',
      title: draft.title.trim(),
      status: draft.status.trim() || 'Next',
      note: draft.note.trim(),
    });
    setEditing(null);
  };

  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={`${due} still open for Latveria`} />
      <PersonStrip lead="Routine · meds, meals, walk" />
      <div className="os-kpis">
        <Stat label="Next" value="1:30 PM" hint="Calcium + D3" />
        <Stat label="Open" value={due} hint="Tick as you go" />
        <Stat label="Night tablet" value="8:30 PM" hint="With dinner" />
      </div>
      <div className="os-split">
        <div className="os-main">
          <Panel
            title="Latveria’s day plan"
            action={<AddButton label="Add step" onClick={startAdd} />}
          >
            <DataTable
              columns={[
                { key: 'time', label: 'Time', narrow: true },
                {
                  key: 'title',
                  label: 'Step',
                  render: (row) => (
                    <span>
                      <strong>{row.title}</strong>
                      {row.note ? <em className="os-sub">{row.note}</em> : null}
                    </span>
                  ),
                },
                { key: 'status', label: 'Status', render: (row) => <Badge tone={medTone(row.status)}>{row.status}</Badge> },
                {
                  key: 'actions',
                  label: '',
                  narrow: true,
                  render: (row) => (
                    <RowActions
                      onEdit={() => startEdit(row)}
                      onRemove={() => confirm.askRemove(row.id, row.title)}
                    />
                  ),
                },
              ]}
              rows={routine}
            />
            <AnimatePresence>
              {editing ? (
                <CrudForm
                  title={editing === '__new__' ? 'Add routine step' : 'Edit routine step'}
                  onSubmit={saveEdit}
                  onCancel={() => setEditing(null)}
                  submitLabel={editing === '__new__' ? 'Add' : 'Save'}
                >
                  <Field label="Time">
                    <input value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
                  </Field>
                  <Field label="Step">
                    <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
                  </Field>
                  <Field label="Status">
                    <select value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
                      <option>Done</option>
                      <option>Now</option>
                      <option>Next</option>
                      <option>Due</option>
                    </select>
                  </Field>
                  <Field label="Note">
                    <textarea value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} rows={2} />
                  </Field>
                </CrudForm>
              ) : null}
            </AnimatePresence>
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
      <confirm.Confirm onConfirm={(id) => removeRoutineStep(id)} />
    </div>
  );
}

export function CgSafety() {
  useStoreTick();
  const checkins = getCheckins();
  const confirm = useConfirmRemove();
  const [editing, setEditing] = useState<unknown>(null);
  const [draft, setDraft] = useState({ time: '', place: '', note: '', rel: 'Just now' });

  const startEdit = (row) => {
    setEditing(row.id);
    setDraft({
      time: row.time || '',
      place: row.place || '',
      note: row.note || '',
      rel: row.rel || '',
    });
  };

  const startAdd = () => {
    setEditing('__new__');
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    setDraft({ time, place: 'Home', note: '', rel: 'Just now' });
  };

  const saveEdit = () => {
    if (!draft.note.trim()) return;
    const id = editing === '__new__' ? uid('chk') : editing;
    upsertCheckin({
      id,
      time: draft.time.trim() || '—',
      place: draft.place.trim() || 'Home',
      note: draft.note.trim(),
      rel: draft.rel.trim() || 'Just now',
    });
    setEditing(null);
  };

  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={CG_LIVE.ping} />
      <PersonStrip lead="Safety · where Latveria is" />
      <div className="os-kpis">
        <Stat label="Zone" value="Home" hint="Courtyard + verandah" />
        <Stat label="Last ping" value={CG_PATIENT.lastCheckIn} hint={checkins[0]?.place || '—'} />
        <Stat label="Status" value="Safe" hint="No wander flag" />
      </div>
      <div className="os-split">
        <Panel title="Latveria’s home zone">
          <div className="os-map" aria-hidden="true">
            <div className="os-map-grid" />
            <div className="os-map-zone" />
            <div className="os-map-pin">Home</div>
            <p className="os-map-caption"><LiveDot label={`Live ping · ${CG_LIVE.ping}`} /></p>
          </div>
        </Panel>
        <div className="os-rail-col">
          <Panel title="Today’s check-ins" action={<AddButton label="Add check-in" onClick={startAdd} />}>
            <div className="cg-stack-cards">
              <AnimatePresence initial={false}>
                {checkins.map((row) => (
                  <motion.article
                    key={row.id}
                    className="os-note-card"
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <header className="cg-note-card-actions">
                      <div>
                        <strong>{row.time}</strong>
                        <span style={{ display: 'block' }}>{row.rel} · {row.place}</span>
                      </div>
                      <RowActions
                        onEdit={() => startEdit(row)}
                        onRemove={() => confirm.askRemove(row.id, row.note.slice(0, 40))}
                      />
                    </header>
                    <p>{row.note}</p>
                    {editing === row.id ? (
                      <CrudForm title="Edit check-in" onSubmit={saveEdit} onCancel={() => setEditing(null)}>
                        <Field label="Time">
                          <input value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
                        </Field>
                        <Field label="Place">
                          <input value={draft.place} onChange={(e) => setDraft((d) => ({ ...d, place: e.target.value }))} />
                        </Field>
                        <Field label="Note">
                          <textarea value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} rows={2} required />
                        </Field>
                      </CrudForm>
                    ) : null}
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            {editing === '__new__' ? (
              <CrudForm title="Add check-in" onSubmit={saveEdit} onCancel={() => setEditing(null)} submitLabel="Add">
                <Field label="Time">
                  <input value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
                </Field>
                <Field label="Place">
                  <input value={draft.place} onChange={(e) => setDraft((d) => ({ ...d, place: e.target.value }))} />
                </Field>
                <Field label="Note">
                  <textarea value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} rows={2} required />
                </Field>
              </CrudForm>
            ) : null}
            {!checkins.length && editing !== '__new__' ? (
              <TimelineRail items={[]} />
            ) : null}
          </Panel>
          <Panel title="Call the circle">
            <a className="os-full-btn" href="tel:9435011820"><Phone size={15} /> Call Rina (primary)</a>
            <a className="os-full-btn" href="tel:9864022118"><Phone size={15} /> Call Doom (Guwahati)</a>
            <a className="os-full-btn" href="tel:112">Emergency 112</a>
          </Panel>
        </div>
      </div>
      <confirm.Confirm onConfirm={(id) => removeCheckin(id)} />
    </div>
  );
}

export function CgProgress() {
  useStoreTick();
  useAssessmentTick();
  const quiz = getMemoryQuizResult();
  const quizPct = quiz
    ? (quiz.percentage ?? Math.round(((quiz.score || 0) / (quiz.totalQuestions || 1)) * 100))
    : null;
  const drawing = useDrawingGame('aita');
  const drawingPct = drawing && Number.isFinite(Number(drawing.averageScore))
    ? Math.round(Number(drawing.averageScore))
    : null;
  const doctorNotes = getDoctorNotes();
  const confirm = useConfirmRemove();
  const [editing, setEditing] = useState<unknown>(null);
  const [draft, setDraft] = useState({ date: '', rel: '', text: '' });

  const startEdit = (note) => {
    setEditing(note.id);
    setDraft({ date: note.date || '', rel: note.rel || '', text: note.text || '' });
  };

  const startAdd = () => {
    setEditing('__new__');
    setDraft({ date: 'Today', rel: 'Just now', text: '' });
  };

  const saveEdit = () => {
    if (!draft.text.trim()) return;
    const id = editing === '__new__' ? uid('dn') : editing;
    upsertDoctorNote({
      id,
      date: draft.date.trim() || 'Today',
      rel: draft.rel.trim() || 'Just now',
      text: draft.text.trim(),
    });
    setEditing(null);
  };

  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="How Latveria’s week felt" />
      <PersonStrip lead="Progress · support, not a score" />
      <div className="os-kpis">
        <Stat label="Games" value={CG_ENGAGEMENT.gamesThisWeek} hint="This week with Latveria" />
        <Stat label="Voice" value={`${CG_ENGAGEMENT.voiceMinutes} min`} hint="Companion + stories" />
        <Stat
          label="Memory check"
          value={quizPct != null ? `${quizPct}%` : 'Not yet'}
          hint={quizPct != null ? 'From her patient app · not a diagnosis' : 'When she finishes the quiz'}
        />
        <Stat
          label="Shape practice"
          value={drawingPct != null ? `${drawingPct}%` : 'Not yet'}
          hint={drawingPct != null ? 'Drawing accuracy · not a diagnosis' : 'When she finishes Shape Draw'}
        />
      </div>
      <div className="os-split">
        <Panel
          title="How Latveria’s days felt"
          action={<Link to="/caregiver/assessment">Severity & FAQ check-in</Link>}
        >
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
          <p className="os-meta" style={{ marginTop: 12 }}>
            Memory Quiz, Shape Draw, and FAQ answers feed the severity band on{' '}
            <Link to="/caregiver/assessment">Assessment</Link>
            {' '}— for monitoring with Dr. Sharma, not a verdict.
          </p>
        </Panel>
        <DrawingPracticePanel patientId="aita" patientFirstName="Latveria" variant="care" />
      </div>
      <div className="os-split" style={{ marginTop: 16 }}>
        <Panel title="Notes for Dr. Meera Sharma" action={<AddButton label="Add note" onClick={startAdd} />}>
          <div className="cg-stack-cards">
            <AnimatePresence initial={false}>
              {doctorNotes.map((note) => (
                <motion.article
                  key={note.id}
                  className="os-note-card"
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <header className="cg-note-card-actions">
                    <div>
                      <strong>{note.date}</strong>
                      <span style={{ display: 'block' }}>{note.rel}</span>
                    </div>
                    <RowActions
                      onEdit={() => startEdit(note)}
                      onRemove={() => confirm.askRemove(note.id, note.text.slice(0, 36))}
                    />
                  </header>
                  <p>{note.text}</p>
                  {editing === note.id ? (
                    <CrudForm title="Edit doctor note" onSubmit={saveEdit} onCancel={() => setEditing(null)}>
                      <Field label="When">
                        <input value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
                      </Field>
                      <Field label="Relative">
                        <input value={draft.rel} onChange={(e) => setDraft((d) => ({ ...d, rel: e.target.value }))} />
                      </Field>
                      <Field label="Note">
                        <textarea value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} rows={3} required />
                      </Field>
                    </CrudForm>
                  ) : null}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          {editing === '__new__' ? (
            <CrudForm title="Add doctor note" onSubmit={saveEdit} onCancel={() => setEditing(null)} submitLabel="Add">
              <Field label="When">
                <input value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
              </Field>
              <Field label="Note">
                <textarea value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} rows={3} required />
              </Field>
            </CrudForm>
          ) : null}
        </Panel>
      </div>
      <confirm.Confirm onConfirm={(id) => removeDoctorNote(id)} />
    </div>
  );
}

export function CgCircle() {
  useStoreTick();
  const people = getCircle();
  const messages = getMessages();
  const confirm = useConfirmRemove();
  const [editingPerson, setEditingPerson] = useState<unknown>(null);
  const [personDraft, setPersonDraft] = useState({ name: '', role: '', phone: '', note: '', status: 'Away' });
  const [editingMsg, setEditingMsg] = useState<unknown>(null);
  const [msgDraft, setMsgDraft] = useState({ from: '', text: '', rel: 'Just now', time: '' });

  const startEditPerson = (row) => {
    setEditingPerson(row.id);
    setPersonDraft({
      name: row.name || '',
      role: row.role || '',
      phone: row.phone || '',
      note: row.note || '',
      status: row.status || 'Away',
    });
  };

  const startAddPerson = () => {
    setEditingPerson('__new__');
    setPersonDraft({ name: '', role: '', phone: '', note: '', status: 'Away' });
  };

  const savePerson = () => {
    if (!personDraft.name.trim()) return;
    const existing = people.find((p) => p.id === editingPerson);
    const id = editingPerson === '__new__' ? uid('person') : editingPerson;
    upsertCircleMember({
      id,
      name: personDraft.name.trim(),
      role: personDraft.role.trim() || 'Family',
      phone: personDraft.phone.trim(),
      note: personDraft.note.trim(),
      status: personDraft.status.trim() || 'Away',
      photoUrl: existing?.photoUrl || '',
    });
    bffSilent('POST', '/api/v1/care-circle', {
      id,
      name: personDraft.name.trim(),
      role: personDraft.role.trim() || 'Family',
      phone: personDraft.phone.trim(),
    });
    setEditingPerson(null);
  };

  const startEditMsg = (msg) => {
    setEditingMsg(msg.id);
    setMsgDraft({
      from: msg.from || '',
      text: msg.text || '',
      rel: msg.rel || '',
      time: msg.time || '',
    });
  };

  const startAddMsg = () => {
    setEditingMsg('__new__');
    setMsgDraft({ from: '', text: '', rel: 'Just now', time: 'Now' });
  };

  const saveMsg = () => {
    if (!msgDraft.text.trim() || !msgDraft.from.trim()) return;
    const id = editingMsg === '__new__' ? uid('msg') : editingMsg;
    upsertMessage({
      id,
      from: msgDraft.from.trim(),
      text: msgDraft.text.trim(),
      rel: msgDraft.rel.trim() || 'Just now',
      time: msgDraft.time.trim() || 'Now',
    });
    setEditingMsg(null);
  };

  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Family · ASHA · Dr. Sharma" />
      <PersonStrip lead="Care circle · people who show up for Latveria" />
      <div className="os-split">
        <Panel title="People around Latveria" action={<AddButton label="Add person" onClick={startAddPerson} />}>
          <div className="cg-stack-cards">
            <AnimatePresence initial={false}>
              {people.map((row) => (
                <motion.div
                  key={row.id}
                  className="cg-person-card"
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="os-person">
                    <AvatarSlot name={row.name} photoUrl={row.photoUrl} size={40} label={row.name} />
                    <span>
                      <strong>{row.name}</strong>
                      <em>{row.role}</em>
                    </span>
                  </span>
                  <div className="cg-person-meta">
                    <Badge tone={row.status === 'Here' ? 'stable' : 'watch'}>{row.status}</Badge>
                    <strong>Note</strong>
                    {row.note || '—'}
                    {row.phone ? (
                      <a className="os-mini-link" href={`tel:${row.phone.replace(/\D/g, '')}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                        Call
                      </a>
                    ) : null}
                  </div>
                  <RowActions
                    onEdit={() => startEditPerson(row)}
                    onRemove={() => confirm.askRemove(`person:${row.id}`, row.name)}
                  />
                  {editingPerson === row.id ? (
                    <div style={{ width: '100%' }}>
                      <CrudForm title="Edit person" onSubmit={savePerson} onCancel={() => setEditingPerson(null)}>
                        <Field label="Name">
                          <input value={personDraft.name} onChange={(e) => setPersonDraft((d) => ({ ...d, name: e.target.value }))} required />
                        </Field>
                        <Field label="Role">
                          <input value={personDraft.role} onChange={(e) => setPersonDraft((d) => ({ ...d, role: e.target.value }))} />
                        </Field>
                        <Field label="Phone / note for calling">
                          <input value={personDraft.phone} onChange={(e) => setPersonDraft((d) => ({ ...d, phone: e.target.value }))} />
                        </Field>
                        <Field label="Status">
                          <input value={personDraft.status} onChange={(e) => setPersonDraft((d) => ({ ...d, status: e.target.value }))} />
                        </Field>
                        <Field label="Note">
                          <textarea value={personDraft.note} onChange={(e) => setPersonDraft((d) => ({ ...d, note: e.target.value }))} rows={2} />
                        </Field>
                      </CrudForm>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {editingPerson === '__new__' ? (
            <CrudForm title="Add person" onSubmit={savePerson} onCancel={() => setEditingPerson(null)} submitLabel="Add">
              <Field label="Name">
                <input value={personDraft.name} onChange={(e) => setPersonDraft((d) => ({ ...d, name: e.target.value }))} required />
              </Field>
              <Field label="Role">
                <input value={personDraft.role} onChange={(e) => setPersonDraft((d) => ({ ...d, role: e.target.value }))} />
              </Field>
              <Field label="Phone">
                <input value={personDraft.phone} onChange={(e) => setPersonDraft((d) => ({ ...d, phone: e.target.value }))} />
              </Field>
              <Field label="Note">
                <textarea value={personDraft.note} onChange={(e) => setPersonDraft((d) => ({ ...d, note: e.target.value }))} rows={2} />
              </Field>
            </CrudForm>
          ) : null}
          {!people.length ? <p className="os-empty">No one listed yet — add family when you are ready.</p> : null}
        </Panel>
        <Panel title="Messages from the circle" action={<AddButton label="Add message" onClick={startAddMsg} />}>
          {messages.length === 0 && editingMsg !== '__new__' ? (
            <p className="os-empty">No messages yet — Doom, Anita, or Dr. Sharma will show here.</p>
          ) : null}
          <div className="cg-stack-cards">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.article
                  key={msg.id}
                  className="os-note-card"
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <header className="cg-note-card-actions">
                    <div>
                      <strong>{msg.from}</strong>
                      <span style={{ display: 'block' }}>{msg.rel}</span>
                    </div>
                    <RowActions
                      onEdit={() => startEditMsg(msg)}
                      onRemove={() => confirm.askRemove(`msg:${msg.id}`, msg.from)}
                    />
                  </header>
                  <p>{msg.text}</p>
                  {editingMsg === msg.id ? (
                    <CrudForm title="Edit message" onSubmit={saveMsg} onCancel={() => setEditingMsg(null)}>
                      <Field label="From">
                        <input value={msgDraft.from} onChange={(e) => setMsgDraft((d) => ({ ...d, from: e.target.value }))} required />
                      </Field>
                      <Field label="Message">
                        <textarea value={msgDraft.text} onChange={(e) => setMsgDraft((d) => ({ ...d, text: e.target.value }))} rows={3} required />
                      </Field>
                    </CrudForm>
                  ) : null}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          {editingMsg === '__new__' ? (
            <CrudForm title="Add message" onSubmit={saveMsg} onCancel={() => setEditingMsg(null)} submitLabel="Add">
              <Field label="From">
                <input value={msgDraft.from} onChange={(e) => setMsgDraft((d) => ({ ...d, from: e.target.value }))} required />
              </Field>
              <Field label="Message">
                <textarea value={msgDraft.text} onChange={(e) => setMsgDraft((d) => ({ ...d, text: e.target.value }))} rows={3} required />
              </Field>
            </CrudForm>
          ) : null}
        </Panel>
      </div>
      <confirm.Confirm
        onConfirm={(key) => {
          const [kind, id] = String(key).split(':');
          if (kind === 'person') removeCircleMember(id);
          if (kind === 'msg') removeMessage(id);
        }}
      />
    </div>
  );
}

export function CgDocuments() {
  useStoreTick();
  const docs = getDocs();
  const confirm = useConfirmRemove();
  const [editing, setEditing] = useState<unknown>(null);
  const [draft, setDraft] = useState({ name: '', kind: 'PDF', shared: 'Circle', updated: 'Today' });

  const startEdit = (doc) => {
    setEditing(doc.id);
    setDraft({
      name: doc.name || '',
      kind: doc.kind || 'PDF',
      shared: doc.shared || 'Circle',
      updated: doc.updated || 'Today',
    });
  };

  const startAdd = () => {
    setEditing('__new__');
    setDraft({ name: '', kind: 'PDF', shared: 'Circle', updated: 'Today' });
  };

  const saveEdit = () => {
    if (!draft.name.trim()) return;
    const id = editing === '__new__' ? uid('doc') : editing;
    upsertDoc({
      id,
      name: draft.name.trim(),
      kind: draft.kind.trim() || 'PDF',
      shared: draft.shared.trim() || 'Circle',
      updated: draft.updated.trim() || 'Today',
    });
    setEditing(null);
  };

  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra="Shared file room" />
      <Panel title="Files the circle can see" action={<AddButton label="Add file" onClick={startAdd} />}>
        <DataTable
          empty="No files shared yet."
          columns={[
            { key: 'name', label: 'File' },
            { key: 'kind', label: 'Kind', narrow: true, render: (row) => <Badge>{row.kind}</Badge> },
            { key: 'updated', label: 'Updated', narrow: true },
            { key: 'shared', label: 'Shared with' },
            {
              key: 'actions',
              label: '',
              narrow: true,
              render: (row) => (
                <RowActions
                  onEdit={() => startEdit(row)}
                  onRemove={() => confirm.askRemove(row.id, row.name)}
                />
              ),
            },
          ]}
          rows={docs}
        />
        <AnimatePresence>
          {editing ? (
            <CrudForm
              title={editing === '__new__' ? 'Add file name' : 'Rename / update file'}
              onSubmit={saveEdit}
              onCancel={() => setEditing(null)}
              submitLabel={editing === '__new__' ? 'Add' : 'Save'}
            >
              <Field label="File name">
                <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
              </Field>
              <Field label="Kind">
                <select value={draft.kind} onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value }))}>
                  <option>PDF</option>
                  <option>Image</option>
                  <option>Note</option>
                </select>
              </Field>
              <Field label="Shared with">
                <input value={draft.shared} onChange={(e) => setDraft((d) => ({ ...d, shared: e.target.value }))} />
              </Field>
            </CrudForm>
          ) : null}
        </AnimatePresence>
        <p className="os-meta">Shared with Rina, Doom, and Dr. Meera Sharma — prescriptions Latveria’s circle can open.</p>
      </Panel>
      <confirm.Confirm onConfirm={(id) => removeDoc(id)} />
    </div>
  );
}

export function CgCalendar() {
  useStoreTick();
  const calendar = getCalendar();
  const today = calendar.find((d) => d.today);
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
  useStoreTick();
  const profile = getCaregiverProfile();
  const done = getTodayDone();
  const tasks = getTodayTasks();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: profile.name,
    role: profile.role,
    place: profile.place,
    phone: profile.phone,
    note: profile.note || '',
  });
  const [savedFlash, setSavedFlash] = useState(false);

  const openEdit = () => {
    setDraft({
      name: profile.name,
      role: profile.role,
      place: profile.place,
      phone: profile.phone,
      note: profile.note || '',
    });
    setEditing(true);
  };

  const save = () => {
    if (!draft.name.trim()) return;
    saveCaregiverProfile({
      name: draft.name.trim(),
      role: draft.role.trim(),
      place: draft.place.trim(),
      phone: draft.phone.trim(),
      note: draft.note.trim(),
    });
    setEditing(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div className="os-page">
      <SyncBar asOf={`${CG_LIVE.asOf} · ${CG_LIVE.clock}`} lastSync={CG_LIVE.lastSync} extra={profile.place} />
      <section className="os-chart-strip">
        <AvatarSlot name={profile.name} photoUrl={profile.photoUrl} size={72} label={profile.name} />
        <div className="os-chart-id">
          <p className="os-kicker">Caregiver · daughter</p>
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
        </div>
        <div className="os-chart-actions">
          <Badge tone="stable">Primary · here</Badge>
          <AppLink to={CG_PATIENT.appPath}>Open Latveria’s dashboard <ExternalLink size={12} /></AppLink>
          {!editing ? (
            <button type="button" className="cg-btn cg-btn-add" onClick={openEdit}>
              Edit profile
            </button>
          ) : null}
        </div>
      </section>
      <div className="os-split">
        <Panel title="About Rina">
          {!editing ? (
            <>
              <dl className="os-kv">
                <div><dt>Role</dt><dd>{profile.role}</dd></div>
                <div><dt>Place</dt><dd>{profile.place}</dd></div>
                <div><dt>Phone</dt><dd><a href={`tel:${String(profile.phone).replace(/\D/g, '')}`}>{profile.phone}</a></dd></div>
                <div><dt>Person in care</dt><dd>{CG_PATIENT.name} · {CG_PATIENT.relation}</dd></div>
              </dl>
              <p className="os-meta">{profile.note || 'Companion voice stays on Latveria’s app — not on this household desk.'}</p>
              {savedFlash ? <p className="os-meta" style={{ color: 'var(--ss-teal)' }}>Saved on this device.</p> : null}
            </>
          ) : (
            <CrudForm title="Edit your profile" onSubmit={save} onCancel={() => setEditing(false)}>
              <Field label="Name">
                <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
              </Field>
              <Field label="Role">
                <input value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} />
              </Field>
              <Field label="Place">
                <input value={draft.place} onChange={(e) => setDraft((d) => ({ ...d, place: e.target.value }))} />
              </Field>
              <Field label="Phone">
                <input value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
              </Field>
              <Field label="Note">
                <textarea value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} rows={3} />
              </Field>
            </CrudForm>
          )}
        </Panel>
        <Panel title="Latveria right now">
          <p className="os-today-line"><strong>{CG_PATIENT.lastCheckIn}</strong> {CG_LIVE.ping}</p>
          <p className="os-today-line"><strong>Open</strong> {tasks.filter((t) => !done[t.id]).length} household tasks</p>
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
