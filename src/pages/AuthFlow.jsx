import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { homeForRole, useAuth } from '../context/AuthContext';
import './AuthFlow.css';

const ROLES = [
  { id: 'user', label: 'Patient' },
  { id: 'caregiver', label: 'Caregiver' },
  { id: 'doctor', label: 'Doctor' },
];

async function postJson(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Python auth server offline. Run: npm run stack && npm run auth');
  }
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Sign-in server did not respond. Start Postgres + Mailpit (npm run stack) then npm run auth.');
  }
  if (!res.ok) {
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg || d).join(', ') : data.detail;
    throw new Error(data.error || detail || `Request failed (${res.status})`);
  }
  return data;
}

function OtpBoxes({ value, onChange }) {
  const refs = useRef([]);
  const chars = Array.from({ length: 6 }, (_, i) => value[i] || '');
  const focusAt = (i) => refs.current[i]?.focus();
  const setDigits = (next) => onChange(next.replace(/\D/g, '').slice(0, 6));

  return (
    <div className="af-otp" role="group" aria-label="One-time code">
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="af-otp-cell"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={ch}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            const next = value.split('');
            next[i] = d;
            setDigits(next.join('').replace(/\D/g, '').slice(0, 6));
            if (d && i < 5) focusAt(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !chars[i] && i > 0) {
              e.preventDefault();
              setDigits(value.slice(0, i - 1));
              focusAt(i - 1);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            setDigits(e.clipboardData.getData('text'));
          }}
        />
      ))}
    </div>
  );
}

export default function AuthFlow({ variant = 'page', onSkip, requireAccount = false, defaultRole = 'user' }) {
  const { signIn, authMode } = useAuth();
  const navigate = useNavigate();
  const [pane, setPane] = useState(authMode === 'login' ? 'login' : 'signup');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [mailPreview, setMailPreview] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpBack, setOtpBack] = useState('signup');
  const [householdHint, setHouseholdHint] = useState('');

  const [role, setRole] = useState(defaultRole);
  const [familyCode, setFamilyCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  useEffect(() => {
    setPane(authMode === 'login' ? 'login' : 'signup');
  }, [authMode]);

  const skip = () => {
    if (onSkip) onSkip();
    else navigate('/user');
  };

  const afterAuth = (user) => {
    const row = signIn(user);
    if (variant === 'page') navigate(homeForRole(row.role));
  };

  const sendSignup = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setHint('');
    setHouseholdHint('');
    try {
      const data = await postJson('/auth-api/auth/signup', {
        firstName, lastName, birthDate, email, phone, role, familyCode,
      });
      const shown = data.otp || data.devOtp || '';
      setOtpPhone(data.phone);
      setOtp(shown);
      setOtpBack('signup');
      setPane('otp');
      setHint(data.emailSent
        ? (data.message || 'Check your email for the 6-digit code.')
        : (data.message || (shown ? `Email did not send. Use this code: ${shown}` : 'Enter the 6-digit code.')));
      setMailPreview(data.previewUrl || '');
      if (role === 'user') {
        setHouseholdHint('After you confirm the code, you will get a household code to share with caregiver and doctor.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const sendLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setHint('');
    try {
      const data = await postJson('/auth-api/auth/login', { name: loginName, phone: loginPhone, email });
      const shown = data.otp || data.devOtp || '';
      setOtpPhone(data.phone);
      setOtp(shown);
      setOtpBack('login');
      setPane('otp');
      setHint(data.emailSent
        ? (data.message || 'Check your email for the 6-digit code.')
        : (data.message || (shown ? `Email did not send. Use this code: ${shown}` : 'Enter the 6-digit code.')));
      setMailPreview(data.previewUrl || '');
    } catch (err) {
      if (/No account/i.test(err.message || '')) {
        const parts = loginName.trim().split(/\s+/);
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || parts[0] || '');
        setPhone(loginPhone);
        setPane('signup');
        setError('No account yet — pick a role and tap Sign up.');
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await postJson('/auth-api/auth/verify', { phone: otpPhone, otp });
      if (data.user?.householdCode && data.user?.role === 'user') {
        setHouseholdHint(`Household code ${data.user.householdCode} — share with caregiver & doctor.`);
      }
      afterAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`af ${variant === 'modal' ? 'af-modal' : ''}`}>
      <div className="af-card">
        <BrandLogo />
        {pane !== 'otp' && (
          <>
            <h1>{pane === 'login' ? 'Log in' : 'Create account'}</h1>
            <p className="af-lead">
              One household links patient, caregiver, and doctor. OTP goes to email (Mailpit locally).
            </p>
          </>
        )}

        {pane === 'signup' && (
          <form className="af-form" onSubmit={sendSignup}>
            <fieldset className="af-roles">
              <legend>I am signing up as</legend>
              <div className="af-role-row">
                {ROLES.map((r) => (
                  <label key={r.id} className={`af-role-chip ${role === r.id ? 'is-on' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={r.id}
                      checked={role === r.id}
                      onChange={() => setRole(r.id)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="af-row">
              <label>
                First name
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
              </label>
              <label>
                Last name
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
              </label>
            </div>
            {role === 'user' && (
              <label>
                Date of birth
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required max={new Date().toISOString().slice(0, 10)} />
              </label>
            )}
            {role !== 'user' && (
              <label>
                Household code
                <input
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                  required
                  placeholder="From patient account"
                  autoComplete="off"
                />
              </label>
            )}
            <label>
              Mobile
              <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="10-digit number" autoComplete="tel" />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Code will be mailed here" autoComplete="email" />
            </label>
            <button type="submit" className="af-primary" disabled={busy}>{busy ? 'Please wait…' : 'Sign up'}</button>
            <button type="button" className="af-text" onClick={() => { setPane('login'); setError(''); }}>
              Have an account? Log in
            </button>
          </form>
        )}

        {pane === 'login' && (
          <form className="af-form" onSubmit={sendLogin}>
            <label>
              Name
              <input value={loginName} onChange={(e) => setLoginName(e.target.value)} required autoComplete="name" placeholder="First name or full name" />
            </label>
            <label>
              Mobile
              <input type="tel" inputMode="numeric" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} required placeholder="10-digit number" autoComplete="tel" />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Where we mailed your last code" autoComplete="email" />
            </label>
            <button type="submit" className="af-primary" disabled={busy}>{busy ? 'Please wait…' : 'Log in'}</button>
            <button type="button" className="af-text" onClick={() => { setPane('signup'); setError(''); }}>
              New here? Create account
            </button>
          </form>
        )}

        {pane === 'otp' && (
          <form className="af-form" onSubmit={verify}>
            <p className="af-kicker">Enter code</p>
            <h1>Enter the code</h1>
            <p className="af-lead">
              The code is in your email inbox (Mailpit at localhost:8025 when running locally).
            </p>
            {householdHint && <p className="af-hint">{householdHint}</p>}
            <OtpBoxes value={otp} onChange={setOtp} />
            <label>
              Or type all 6 digits
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
              />
            </label>
            <button type="submit" className="af-primary" disabled={busy || otp.length !== 6}>
              {busy ? 'Checking…' : 'Confirm'}
            </button>
            <button
              type="button"
              className="af-text"
              onClick={() => { setPane(otpBack); setOtp(''); setError(''); }}
            >
              Back
            </button>
          </form>
        )}

        {hint && pane === 'otp' && <p className="af-hint">{hint}</p>}
        {mailPreview && pane === 'otp' && (
          <p className="af-hint">
            <a href={mailPreview} target="_blank" rel="noreferrer">Open Mailpit inbox</a>
            {' '}— open-source mail, code is there.
          </p>
        )}
        {error && <p className="af-error">{error}</p>}

        {!requireAccount && (
          <button type="button" className="af-guest" onClick={skip}>
            Continue without an account
          </button>
        )}
      </div>
    </div>
  );
}
