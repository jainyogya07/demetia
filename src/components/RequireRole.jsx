import { useAuth } from '../context/AuthContext';
import AuthFlow from '../pages/AuthFlow';

const ROLE_NAMES = {
  user: 'Patient',
  caregiver: 'Caregiver',
  doctor: 'Doctor',
};

/** Gate a dashboard by auth role. Patient can browse as guest; caregiver/doctor must sign in. */
export default function RequireRole({ role, children, allowGuest = false }) {
  const { session, signOut, homeForRole } = useAuth();

  if (!session?.verified) {
    if (allowGuest) return children;
    return (
      <div className="ss-theme" style={{ minHeight: '100vh' }}>
        <AuthFlow variant="page" requireAccount defaultRole={role} />
      </div>
    );
  }

  if (session.role !== role) {
    const currentName = ROLE_NAMES[session.role] || session.role;
    const requiredName = ROLE_NAMES[role] || role;

    return (
      <div className="ss-theme" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 440, width: '100%', background: '#fff', borderRadius: 16, padding: '32px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 8px', color: '#24292f' }}>{requiredName} Access Required</h2>
          <p style={{ fontSize: '0.9rem', color: '#57606a', margin: '0 0 20px', lineHeight: 1.5 }}>
            You are currently signed in as <strong>{session.name || session.phone}</strong> ({currentName}). To access the {requiredName} portal, please switch or sign in with a {requiredName} account.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className="os-full-btn"
              style={{ padding: '10px 16px', fontSize: '0.92rem', borderRadius: 8, cursor: 'pointer' }}
              onClick={signOut}
            >
              Sign in as {requiredName}
            </button>
            <button
              type="button"
              style={{ padding: '10px 16px', fontSize: '0.9rem', borderRadius: 8, border: '1px solid #d0d7de', background: '#fff', color: '#24292f', cursor: 'pointer' }}
              onClick={() => window.location.href = homeForRole(session.role)}
            >
              Return to {currentName} dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
