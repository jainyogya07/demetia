import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { useAuth } from '../context/AuthContext';
import './AuthFlow.css';

async function postJson(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Sign-in server did not respond. Start Postgres + Mailpit (npm run stack) then npm run dev.');
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
            const joined = next.join('').replace(/\D/g, '').slice(0, 6);
            setDigits(joined);
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

export default function AuthFlow({ variant = 'page', onSkip, requireAccount = false }) {
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

  const sendSignup = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setHint('');
    try {
      const data = await postJson('/api/auth/signup', {
        firstName, lastName, birthDate, email, phone,
      });
      const shown = data.otp || data.devOtp || '';
      setOtpPhone(data.phone);
      setOtp(shown);
      setOtpBack('signup');
      setPane('otp');
      setHint(data.emailSent
        ? (data.previewUrl
          ? `${data.message || 'Code sent.'}`
          : (data.message || 'Check your email for the 6-digit code.'))
        : (data.message || (shown ? `Email did not send. Use this code: ${shown}` : 'Enter the 6-digit code.')));
      setMailPreview(data.previewUrl || '');
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
      const data = await postJson('/api/auth/login', { name: loginName, phone: loginPhone, email });
      const shown = data.otp || data.devOtp || '';
      setOtpPhone(data.phone);
      setOtp(shown);
      setOtpBack('login');
      setPane('otp');
      setHint(data.emailSent
        ? (data.previewUrl
          ? `${data.message || 'Code sent.'}`
          : (data.message || 'Check your email for the 6-digit code.'))
        : (data.message || (shown ? `Email did not send. Use this code: ${shown}` : 'Enter the 6-digit code.')));
      setMailPreview(data.previewUrl || '');
    } catch (err) {
      if (/No account/i.test(err.message || '')) {
        const parts = loginName.trim().split(/\s+/);
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || parts[0] || '');
        setPhone(loginPhone);
        setPane('signup');
        setError('No account yet — add your birthday and tap Sign up.');
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
      const data = await postJson('/api/auth/verify', { phone: otpPhone, otp });
      signIn(data.user);
      if (variant === 'page') navigate('/user');
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
              {pane === 'login'
                ? 'Name and mobile. A 6-digit code goes to your email (Mailpit locally, or real SMTP).'
                : 'Name, birthday, phone (saved on the account), email for the OTP. Phone SMS vendors are not used.'}
            </p>
          </>
        )}

        {pane === 'signup' && (
          <form className="af-form" onSubmit={sendSignup}>
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
            <label>
              Date of birth
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required max={new Date().toISOString().slice(0, 10)} />
            </label>
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
              The code is in your email inbox (Mailpit at localhost:8025 when running locally). Type the six digits.
            </p>
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
