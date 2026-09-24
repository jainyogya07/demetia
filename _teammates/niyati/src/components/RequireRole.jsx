import { Navigate, useLocation } from 'react-router-dom';
import { homeForRole, useAuth } from '../context/AuthContext';
import AuthFlow from '../pages/AuthFlow';

/** Gate a dashboard by auth role. Patient can browse as guest; caregiver/doctor must sign in. */
export default function RequireRole({ role, children, allowGuest = false }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session?.verified) {
    if (allowGuest) return children;
    return (
      <div className="ss-theme" style={{ minHeight: '100vh' }}>
        <AuthFlow variant="page" requireAccount defaultRole={role} />
      </div>
    );
  }

  if (session.role !== role) {
    return <Navigate to={homeForRole(session.role)} replace state={{ from: location.pathname }} />;
  }

  return children;
}
