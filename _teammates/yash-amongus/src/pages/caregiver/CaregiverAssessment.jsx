import { useState, useEffect } from 'react';
import {
  Flame, Pill, Coins, Compass, Bus, Phone, Calendar, Sparkles, Utensils, KeyRound,
  CheckCircle2, AlertTriangle, Cpu, RefreshCw, Info,
} from 'lucide-react';
import {
  FAQ_QUESTIONS, DEMO_PATIENTS, getAssessmentForPatient, saveAssessmentForPatient,
  evaluateTelemetry, getLatestEvaluation, subscribeAssessmentChange,
} from '../../lib/assessmentStore';
import AvatarSlot from '../../components/AvatarSlot';
import { Badge, Panel, Stat } from '../../components/clinic/LiveChrome';

const ICON_MAP = {
  Flame, Pill, Coins, Compass, Bus, Phone, Calendar, Sparkles, Utensils, KeyRound,
};

export default function CaregiverAssessment() {
  const [selectedPatientId, setSelectedPatientId] = useState('aita');
  const [assessment, setAssessment] = useState(() => getAssessmentForPatient('aita'));
  const [report, setReport] = useState(() => getLatestEvaluation('aita'));
  const [evaluating, setEvaluating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const data = getAssessmentForPatient(selectedPatientId);
    setAssessment(data);
    setReport(getLatestEvaluation(selectedPatientId));
  }, [selectedPatientId]);

  useEffect(() => {
    return subscribeAssessmentChange((detail) => {
      if (!detail || detail.patientId === selectedPatientId) {
        setAssessment(getAssessmentForPatient(selectedPatientId));
        setReport(getLatestEvaluation(selectedPatientId));
      }
    });
  }, [selectedPatientId]);

  const handleScoreChange = (qId, score) => {
    const nextFunctional = { ...assessment.functional, [qId]: score };
    const updated = saveAssessmentForPatient(selectedPatientId, { functional: nextFunctional });
    setAssessment(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    try {
      const res = await evaluateTelemetry({
        patient_id: selectedPatientId,
        demographics: {
          age: assessment.age,
          education_years: assessment.education_years,
        },
        motor: assessment.motor,
        functional: assessment.functional,
      });
      setReport(res);
    } finally {
      setEvaluating(false);
    }
  };

  const functional = assessment.functional || {};
  const answeredCount = Object.keys(functional).length;
  const patientMeta = DEMO_PATIENTS[selectedPatientId] || DEMO_PATIENTS.aita;

  // Active Critical Warnings
  const activeHazards = [];
  if (functional.faq_cooking_stove_safety >= 2) {
    activeHazards.push({
      title: 'Stove Fire Hazard Triggered',
      desc: 'Caregiver reported burner unattended. Immediate automated stove shut-off recommended.',
      severity: 'critical',
    });
  }
  if (functional.faq_medication_compliance >= 2) {
    activeHazards.push({
      title: 'Medication Non-Adherence Alert',
      desc: 'Missed or duplicate doses reported. Caregiver-managed locked pill organizer advised.',
      severity: 'critical',
    });
  }
  if (functional.faq_orientation_time_space >= 2) {
    activeHazards.push({
      title: 'Spatial Disorientation / Wandering Risk',
      desc: 'Hesitation on familiar routes. GPS perimeter alarms and door alerts recommended.',
      severity: 'warning',
    });
  }

  return (
    <div className="os-page ss-assessment-page" style={{ padding: '0 24px 32px' }}>
      {/* 1. Header & Patient Switcher */}
      <div className="os-chart-strip" style={{ marginTop: 16 }}>
        <AvatarSlot name={patientMeta.name} size={52} />
        <div className="os-chart-id">
          <p className="os-kicker">Caregiver Observation · 10-Item FAQ (ADL)</p>
          <h2>{patientMeta.name}</h2>
          <p>{patientMeta.age} Years · {patientMeta.village} · Education: {patientMeta.education_label}</p>
        </div>
        <div className="os-chart-actions">
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: 6 }}>Look up patient:</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle, #d0d7de)',
              background: 'var(--card-bg, #fff)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            <option value="aita">Latveria Devi (78yo, Illiterate)</option>
            <option value="binod">Binod Kalita (81yo, Primary Ed.)</option>
            <option value="sarala_mci">Sarala Barua (68yo, MCI Former Teacher)</option>
          </select>
        </div>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="os-kpis" style={{ marginTop: 16 }}>
        <Stat label="Assessment Progress" value={`${answeredCount} / 10`} hint="Standard Clinical FAQ" />
        <Stat
          label="AI Risk Band"
          value={report ? report.severity_band.replace(/_/g, ' ') : 'Ready to Run'}
          hint={report ? `Calibrated Index: ${report.calibrated_risk_score}` : 'Click Evaluate'}
        />
        <Stat
          label="Demographic Bias Offset"
          value={report ? `-${report.demographic_adjustment}` : `-${(patientMeta.education_years === 0 ? 0.09 : 0.04) + Math.max(0, (patientMeta.age - 65) * 0.0035).toFixed(4)}`}
          hint="Age & schooling penalty removed"
        />
        <Stat label="Active Safety Alarms" value={activeHazards.length} hint={activeHazards.length ? 'Attention needed' : 'All clear'} />
      </div>

      {/* 3. Urgent Hazard Warnings Banner if any */}
      {activeHazards.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeHazards.map((haz, idx) => (
            <div
              key={idx}
              style={{
                background: haz.severity === 'critical' ? '#ffebe9' : '#fff8c5',
                border: `1px solid ${haz.severity === 'critical' ? '#ff8182' : '#d4a72c'}`,
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <AlertTriangle size={20} color={haz.severity === 'critical' ? '#cf222e' : '#9a6700'} />
              <div style={{ flex: 1 }}>
                <strong style={{ color: haz.severity === 'critical' ? '#82071e' : '#633c01' }}>
                  {haz.title}
                </strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.88rem', color: '#24292f' }}>
                  {haz.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Main Grid: Questions on Left, AI Telemetry Report on Right */}
      <div className="os-split" style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <div>
          <Panel
            title="10-Item Activities of Daily Living Questionnaire"
            action={
              savedSuccess && (
                <span style={{ fontSize: '0.85rem', color: '#1a7f37', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={15} /> Saved
                </span>
              )
            }
          >
            <p className="os-meta" style={{ marginBottom: 16 }}>
              Select the score that best reflects what you observe in daily home routines.
              Scores update live and calibrate against age and schooling.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FAQ_QUESTIONS.map((q, qIndex) => {
                const IconComponent = ICON_MAP[q.icon] || Info;
                const currentScore = functional[q.id] ?? 0;
                const isAlert = (q.hazard && currentScore >= 2);

                return (
                  <div
                    key={q.id}
                    style={{
                      border: `1px solid ${isAlert ? '#ff8182' : 'var(--border-subtle, #e1e4e8)'}`,
                      background: isAlert ? '#fffafa' : 'var(--card-bg, #ffffff)',
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isAlert ? '#ffebe9' : '#f0f3f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isAlert ? '#cf222e' : '#24292f',
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#57606a', textTransform: 'uppercase' }}>
                            Item {qIndex + 1} · {q.domain}
                          </span>
                          {isAlert && <Badge tone="urgent">Safety Hazard</Badge>}
                        </div>
                        <h4 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 600 }}>{q.title}</h4>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#57606a' }}>
                      {q.desc}
                    </p>

                    {/* 4 Option Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {q.options.map((opt) => {
                        const isSelected = currentScore === opt.score;
                        let btnBorder = 'var(--border-subtle, #d0d7de)';
                        let btnBg = 'var(--subtle-bg, #f6f8fa)';
                        let btnText = '#24292f';

                        if (isSelected) {
                          if (opt.score === 0) {
                            btnBg = '#dafbe1';
                            btnBorder = '#4ac26b';
                            btnText = '#1a7f37';
                          } else if (opt.score === 1) {
                            btnBg = '#ddf4ff';
                            btnBorder = '#54aeff';
                            btnText = '#0969da';
                          } else if (opt.score === 2) {
                            btnBg = '#fff8c5';
                            btnBorder = '#d4a72c';
                            btnText = '#9a6700';
                          } else {
                            btnBg = '#ffebe9';
                            btnBorder = '#ff8182';
                            btnText = '#cf222e';
                          }
                        }

                        return (
                          <button
                            key={opt.score}
                            type="button"
                            onClick={() => handleScoreChange(q.id, opt.score)}
                            style={{
                              border: `1.5px solid ${btnBorder}`,
                              background: btnBg,
                              color: btnText,
                              borderRadius: 8,
                              padding: '8px 6px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                              {opt.score} — {opt.label}
                            </span>
                            <span style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: 2 }}>
                              {opt.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button
                type="button"
                className="os-full-btn"
                onClick={handleRunEvaluation}
                disabled={evaluating}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--brand-accent, #0969da)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {evaluating ? <RefreshCw size={16} className="spin" /> : <Cpu size={16} />}
                {evaluating ? 'Running ONNX Edge Model...' : 'Run Cognitive Evaluation'}
              </button>
            </div>
          </Panel>
        </div>

        {/* Right Rail: Real-time Evaluation Report */}
        <div className="os-rail-col" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="AI Clinical Telemetry Summary">
            {report ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 10,
                    background:
                      report.severity_band === 'NORMAL' ? '#dafbe1' :
                      report.severity_band === 'MILD_COGNITIVE_CONCERN' ? '#ddf4ff' :
                      report.severity_band === 'MODERATE_IMPAIRMENT' ? '#fff8c5' : '#ffebe9',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.8 }}>
                    Risk Classification
                  </p>
                  <h3 style={{ margin: '4px 0 6px', fontSize: '1.25rem', fontWeight: 700 }}>
                    {report.severity_band.replace(/_/g, ' ')}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    Calibrated Risk: <strong>{report.calibrated_risk_score}</strong> (Raw: {report.raw_risk_score})
                  </p>
                </div>

                <div style={{ background: '#f6f8fa', padding: 12, borderRadius: 8, fontSize: '0.84rem' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Demographic Fairness Layer:</p>
                  <p style={{ margin: 0, color: '#57606a' }}>
                    Mitigated <strong>-{report.demographic_adjustment}</strong> offset for patient age ({report.demographics?.age}yo) and education status ({report.demographics?.education_status}) to eliminate rural false-positive bias.
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', fontWeight: 600 }}>
                    Domain Sub-indices (TreeSHAP):
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {report.domain_sub_indices && Object.entries(report.domain_sub_indices).map(([name, sub]) => {
                      const pct = Math.round(sub.normalized_score * 100);
                      return (
                        <div key={name} style={{ background: '#fff', border: '1px solid #e1e4e8', padding: 10, borderRadius: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <strong style={{ fontSize: '0.85rem' }}>{name}</strong>
                            <Badge tone={sub.risk_level === 'LOW' ? 'stable' : sub.risk_level === 'MILD' ? 'watch' : 'urgent'}>
                              {sub.risk_level} ({pct}%)
                            </Badge>
                          </div>
                          <div style={{ height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${pct}%`,
                                background: sub.risk_level === 'LOW' ? '#2da44e' : sub.risk_level === 'MILD' ? '#0969da' : '#cf222e',
                              }}
                            />
                          </div>
                          <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#57606a' }}>
                            {sub.clinical_summary}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {report.critical_flags?.length > 0 && (
                  <div>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 600, color: '#cf222e' }}>
                      Critical Action Flags:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {report.critical_flags.map((flag) => (
                        <div key={flag.code} style={{ background: '#fff5f5', border: '1px solid #ffc8c8', padding: 10, borderRadius: 8 }}>
                          <strong style={{ fontSize: '0.85rem', color: '#cf222e' }}>{flag.code}</strong>
                          <p style={{ margin: '3px 0 0', fontSize: '0.82rem' }}>{flag.message}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#57606a' }}>
                            <strong>Action:</strong> {flag.recommended_action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: '#8c959f', textAlign: 'center' }}>
                  Model runtime: {report.model_runtime}
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: '#57606a' }}>
                <Cpu size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                <p style={{ margin: '0 0 12px', fontSize: '0.9rem' }}>
                  No evaluation calculated yet. Tap below to run local inference.
                </p>
                <button
                  type="button"
                  className="os-full-btn"
                  onClick={handleRunEvaluation}
                  disabled={evaluating}
                >
                  Run Baseline Evaluation
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Caregiver Guidance">
            <p className="os-note-body">
              This 10-item Activities of Daily Living survey is linked to Dr. Sharma’s OPD file at JMCH. When you update questions here, the clinic receives immediate notifications of safety flags like stove unattendance or missed pills.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
