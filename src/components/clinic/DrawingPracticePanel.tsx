// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { getDrawingGameForPatient, subscribeAssessmentChange } from '../../lib/assessmentStore';
import { getShapeById } from '../../data/shapeDrawCatalog';
import { Badge, Panel, Stat } from './LiveChrome';
import './DrawingPracticePanel.css';

function toneForScore(pct) {
  if (pct == null) return 'neutral';
  if (pct >= 75) return 'stable';
  if (pct >= 50) return 'watch';
  return 'urgent';
}

function formatWhen(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return null;
  }
}

function shapeName(shapeId) {
  const shape = getShapeById(shapeId);
  return shape?.nameEn || shapeId || 'Shape';
}

/**
 * Warm lakeside panel — patient Shape Draw accuracy for caregiver / doctor.
 * Live via ss-assessment-updated + storage (same bus as Memory Quiz assessment).
 */
export default function DrawingPracticePanel({
  patientId = 'aita',
  patientFirstName = 'Latveria',
  variant = 'care', // 'care' | 'clinic'
}) {
  const [drawing, setDrawing] = useState(() => getDrawingGameForPatient(patientId));

  useEffect(() => {
    setDrawing(getDrawingGameForPatient(patientId));
  }, [patientId]);

  useEffect(() => subscribeAssessmentChange((detail) => {
    if (!detail || detail.patientId === patientId) {
      setDrawing(getDrawingGameForPatient(patientId));
    }
  }), [patientId]);

  const pct = drawing && Number.isFinite(Number(drawing.averageScore))
    ? Math.round(Number(drawing.averageScore))
    : null;
  const scores = Array.isArray(drawing?.scores) ? drawing.scores : [];
  const when = formatWhen(drawing?.completedAt);
  const title = variant === 'clinic'
    ? 'Shape draw (motor practice)'
    : 'Shape practice';
  const emptyCopy = variant === 'clinic'
    ? `No drawing session yet. When ${patientFirstName} finishes Shape Draw on the patient app, accuracy appears here for chart review — not a diagnosis.`
    : `No shape practice yet. When ${patientFirstName} finishes drawing on the patient app, the average shows here — gentle practice, not a test.`;

  return (
    <div className={variant === 'clinic' ? 'dp-panel-gap' : undefined}>
    <Panel title={title}>
      {pct != null ? (
        <div className="dp-body">
          <div className="dp-hero">
            <div className="dp-ring" style={{ '--dp-pct': `${pct}%` }} aria-hidden>
              <span className="dp-ring-value">{pct}%</span>
            </div>
            <div className="dp-hero-copy">
              <div className="dp-title-row">
                <span className="dp-icon" aria-hidden>
                  <Pencil size={18} />
                </span>
                <strong className="dp-headline">
                  {variant === 'clinic' ? 'Last session accuracy' : 'Last practice average'}
                </strong>
                <Badge tone={toneForScore(pct)}>
                  {pct >= 75 ? 'Steady' : pct >= 50 ? 'Warming up' : 'Needs soft practice'}
                </Badge>
              </div>
              <p className="dp-caption">Shape practice · not a diagnosis</p>
              <div className="dp-kpis">
                <Stat
                  label="Average"
                  value={`${pct}%`}
                  hint={drawing.shapeCount ? `${drawing.shapeCount} shapes` : 'Session'}
                />
                <Stat
                  label="When"
                  value={when || 'Recently'}
                  hint={variant === 'clinic' ? 'Patient app · local' : 'From her patient app'}
                />
              </div>
            </div>
          </div>

          {scores.length > 0 ? (
            <div className="dp-shapes">
              <p className="dp-shapes-label">Per shape</p>
              <ul className="dp-shape-list">
                {scores.map((row, i) => {
                  const s = Math.round(Number(row.score) || 0);
                  return (
                    <li key={`${row.shapeId || 's'}-${i}`} className="dp-shape-row">
                      <span className="dp-shape-name">{shapeName(row.shapeId)}</span>
                      <span className="dp-shape-track" aria-hidden>
                        <span className="dp-shape-fill" style={{ width: `${Math.max(4, s)}%` }} />
                      </span>
                      <strong className="dp-shape-pct">{s}%</strong>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="os-meta dp-empty">{emptyCopy}</p>
      )}
    </Panel>
    </div>
  );
}

/** Compact KPI for Progress strips — same live source. */
export function useDrawingGame(patientId = 'aita') {
  const [drawing, setDrawing] = useState(() => getDrawingGameForPatient(patientId));
  useEffect(() => {
    setDrawing(getDrawingGameForPatient(patientId));
  }, [patientId]);
  useEffect(() => subscribeAssessmentChange((detail) => {
    if (!detail || detail.patientId === patientId) {
      setDrawing(getDrawingGameForPatient(patientId));
    }
  }), [patientId]);
  return drawing;
}
