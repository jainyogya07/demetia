import { Link } from 'react-router-dom';

export function LiveDot({ label = 'Live' }) {
  return (
    <span className="os-live">
      <span className="os-live-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function SyncBar({ asOf, lastSync, extra }) {
  return (
    <div className="os-sync">
      <LiveDot />
      <span>Updated {lastSync}</span>
      <span className="os-sync-clock">{asOf}</span>
      {extra ? <span className="os-sync-extra">{extra}</span> : null}
    </div>
  );
}

export function Stat({ label, value, hint }) {
  return (
    <div className="os-stat">
      <span className="os-stat-label">{label}</span>
      <strong className="os-stat-value">{value}</strong>
      {hint ? <em className="os-stat-hint">{hint}</em> : null}
    </div>
  );
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`os-badge ${tone}`}>{children}</span>;
}

export function Panel({ title, action, children, flush }) {
  return (
    <section className={`os-panel ${flush ? 'flush' : ''}`}>
      {(title || action) ? (
        <header className="os-panel-head">
          {title ? <h3>{title}</h3> : <span />}
          {action || null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function DataTable({ columns, rows, empty = 'Nothing on this board.' }) {
  if (!rows.length) {
    return <p className="os-empty">{empty}</p>;
  }
  return (
    <div className="os-table-wrap">
      <table className="os-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.narrow ? 'narrow' : undefined}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className={col.narrow ? 'narrow' : undefined}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TaskRow({ task, checked, onToggle, extra }) {
  return (
    <label className={`os-task ${task.priority || task.kind || ''} ${checked ? 'done' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span className="os-task-body">
        <span className="os-task-title">{task.title}</span>
        <span className="os-task-meta">{extra}</span>
      </span>
      {task.priority ? <Badge tone={task.priority}>{task.priority}</Badge> : null}
    </label>
  );
}

export function TimelineRail({ items }) {
  if (!items.length) return <p className="os-empty">No events on this chart.</p>;
  return (
    <ol className="os-rail">
      {items.map((item) => (
        <li key={`${item.when}-${item.text}`}>
          <span className="os-rail-dot" aria-hidden="true" />
          <div>
            <p className="os-rail-when">{item.rel || item.when}{item.place ? ` · ${item.place}` : ''}</p>
            <p className="os-rail-text">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Spark({ rows, field }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r[field]), 1);
  const pts = rows.map((r, i) => {
    const x = (i / Math.max(rows.length - 1, 1)) * 140;
    const y = 38 - (r[field] / max) * 30;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="os-spark" viewBox="0 0 140 42" aria-hidden="true">
      <polyline fill="none" stroke="#2F5C63" strokeWidth="2.2" points={pts} />
    </svg>
  );
}

export function AppLink({ to, children }) {
  if (!to) return <span className="os-muted">App view not linked</span>;
  return <Link className="os-link-btn" to={to}>{children}</Link>;
}
