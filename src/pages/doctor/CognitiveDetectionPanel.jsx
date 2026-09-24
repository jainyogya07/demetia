import { useEffect, useState } from 'react';
import { Cpu, RefreshCw, AlertTriangle, Sliders, ShieldCheck } from 'lucide-react';
import {
  FAQ_QUESTIONS,
  evaluateTelemetry,
  getAssessmentForPatient,
  getLatestEvaluation,
  subscribeAssessmentChange,
} from '../../lib/assessmentStore';
import { Badge, Panel, Stat } from '../../components/clinic/LiveChrome';

export default function CognitiveDetectionPanel({ patient }) {
  const [assessment, setAssessment] = useState(() => getAssessmentForPatient(patient.id));
  const [report, setReport] = useState(() => getLatestEvaluation(patient.id));
  const [loading, setLoading] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simValues, setSimValues] = useState(() => (assessment?.functional || {}));

  useEffect(() => {
    const data = getAssessmentForPatient(patient.id);
    setAssessment(data);
    setSimValues(data.functional || {});
    setReport(getLatestEvaluation(patient.id));
  }, [patient.id]);

  useEffect(() => subscribeAssessmentChange((detail) => {
    if (!detail || detail.patientId === patient.id) {
      const data = getAssessmentForPatient(patient.id);
      setAssessment(data);
      setSimValues(data.functional || {});
      setReport(getLatestEvaluation(patient.id));
    }
  }), [patient.id]);

  const handleRunEval = async () => {
    setLoading(true);
    try {
      const res = await evaluateTelemetry({
        patient_id: patient.id,
        demographics: {
          age: assessment.age || patient.age || 75,
          education_years: assessment.education_years ?? 0,
        },
        motor: assessment.motor,
        functional: simValues,
        memoryQuiz: assessment.memoryQuiz,
      });
      setReport(res);
    } finally {
      setLoading(false);
    }
  };

  const severityTone = !report
    ? 'neutral'
    : report.severity_band === 'NORMAL'
      ? 'stable'
      : report.severity_band === 'MILD_COGNITIVE_CONCERN'
        ? 'watch'
        : 'urgent';

  return (
    <Panel
      title="Cognitive-motor detection & severity"
      action={(
        <button type="button" className="os-full-btn" style={{ width: 'auto', padding: '6px 14px' }} onClick={handleRunEval} disabled={loading}>
          {loading ? <RefreshCw size={14} /> : <Cpu size={14} />}
          {loading ? 'Evaluating…' : 'Run evaluation'}
        </button>
      )}
    >
      <div className="os-kpis tight" style={{ marginBottom: 16 }}>
        <Stat
          label="Severity band"
          value={<Badge tone={severityTone}>{report?.severity_band?.replace(/_/g, ' ') || 'Not run yet'}</Badge>}
        />
        <Stat label="Calibrated index" value={report ? String(report.calibrated_risk_score) : '—'} />
        <Stat label="Age / schooling offset" value={report ? `-${report.demographic_adjustment}` : '—'} />
      </div>
      {report?.domain_sub_indices && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
          {Object.entries(report.domain_sub_indices).map(([name, sub]) => (
            <div key={name} style={{ background: '#f6f8fa', border: '1px solid #e1e4e8', padding: 12, borderRadius: 10 }}>
              <strong style={{ fontSize: 13 }}>{name}</strong>
              <Badge tone={sub.risk_level === 'LOW' ? 'stable' : sub.risk_level === 'MILD' ? 'watch' : 'urgent'}>{sub.risk_level}</Badge>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#57606a' }}>{sub.clinical_summary}</p>
            </div>
          ))}
        </div>
      )}
      {report?.critical_flags?.length ? (
        report.critical_flags.map((flag) => (
          <div key={flag.code} style={{ background: '#fff5f5', border: '1px solid #ffc8c8', padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <strong style={{ color: '#cf222e' }}><AlertTriangle size={14} /> [{flag.severity}] {flag.code}</strong>
            <p style={{ margin: '4px 0 0', fontSize: 13 }}>{flag.message}</p>
          </div>
        ))
      ) : report ? (
        <div style={{ background: '#dafbe1', padding: 10, borderRadius: 8, marginBottom: 12, color: '#1a7f37', fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center' }}>
          <ShieldCheck size={16} /> No critical functional alarms.
        </div>
      ) : null}
      <button type="button" onClick={() => setSimulatorOpen((open) => !open)} style={{ border: 0, background: 'transparent', color: '#0969da', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <Sliders size={16} /> {simulatorOpen ? 'Hide FAQ simulator' : 'Open FAQ simulator'}
      </button>
      {simulatorOpen && (
        <div style={{ background: '#f6f8fa', padding: 14, borderRadius: 10, marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {FAQ_QUESTIONS.map((question) => (
              <div key={question.id} style={{ background: '#fff', padding: 8, borderRadius: 8, border: '1px solid #e1e4e8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{question.title}</span>
                  <strong>{simValues[question.id] ?? 0}/3</strong>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0, 1, 2, 3].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setSimValues((prev) => ({ ...prev, [question.id]: score }))}
                      style={{
                        flex: 1,
                        borderRadius: 6,
                        border: `1px solid ${(simValues[question.id] ?? 0) === score ? '#0969da' : '#d0d7de'}`,
                        background: (simValues[question.id] ?? 0) === score ? '#ddf4ff' : '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <button type="button" className="os-full-btn" style={{ width: 'auto', padding: '8px 18px' }} onClick={handleRunEval} disabled={loading}>
              Apply simulation
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}
