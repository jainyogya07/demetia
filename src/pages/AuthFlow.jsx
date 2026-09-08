import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { useAuth } from '../context/AuthContext';
import './AuthFlow.css';

const PENDING_KEY = 'ss-auth-pending';
const PROD = import.meta.env.PROD;

function digitsPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  return d.length >= 10 ? d.slice(-10) : d;
}

function friendlyAuthError(raw) {
  const msg = String(raw || '');
  if (/Sign-in server did not respond|NOT_JSON|NETWORK|Failed to fetch|Load failed/i.test(msg)) {
    return PROD
      ? 'Could not reach the sign-in service. You can still create an account — a code will show on the next screen.'
      : 'Sign-in API is offline. Start it with npm run api (and npm run stack if you use Postgres).';
  }
  if (/Postgres|DATABASE_URL|Mailpit|npm run stack/i.test(msg)) {
    return PROD
      ? 'Account service is busy. Use the on-screen code if it appears, or try again.'
      : msg;
  }
  return msg || 'Sign-in failed. Try again.';
}

function writePending(row) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(row));
  } catch {
    /* ignore */
  }
}

function readPending() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function localChallenge({ firstName, lastName, birthDate, email, phone, name, purpose }) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const row = {
    otp,
    phone: digitsPhone(phone),
    firstName: firstName || String(name || '').trim().split(/\s+/)[0] || '',
    lastName: lastName || String(name || '').trim().split(/\s+/).slice(1).join(' ') || '',
    birthDate: birthDate || '',
    email: email || '',
    purpose: purpose || 'signup',
    at: Date.now(),
  };
  writePending(row);
  return {
    ok: true,
    phone: row.phone,
    otp,
    message: 'Use this 6-digit code on the next screen. Email is unavailable on this server.',
  };
}

async function postJson(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    const err = new Error('NETWORK');
    err.fallback = true;
    throw err;
  }
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    const err = new Error('NOT_JSON');
    err.fallback = true;
    throw err;
  }
  if (!res.ok) {
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg || d).join(', ') : data.detail;
    const err = new Error(data.error || detail || `Request failed (${res.status})`);
    if (res.status >= 500) err.fallback = true;
    throw err;
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
      let data;
      try {
        data = await postJson('/api/auth/signup', {
          firstName, lastName, birthDate, email, phone,
        });
      } catch (err) {
        if (!err.fallback) throw err;
        data = localChallenge({ firstName, lastName, birthDate, email, phone, purpose: 'signup' });
      }
      writePending({
        otp: data.otp || data.devOtp || readPending()?.otp,
        phone: data.phone,
        firstName, lastName, birthDate, email,
        purpose: 'signup',
        at: Date.now(),
      });
      const shown = data.otp || data.devOtp || '';
      setOtpPhone(data.phone);
      setOtp(shown);
      setOtpBack('signup');
      setPane('otp');
      setHint(data.emailSent
        ? (data.message || 'Check your email for the 6-digit code.')
        : (data.message || (shown ? `Use this code: ${shown}` : 'Enter the 6-digit code.')));
      setMailPreview(data.previewUrl || '');
    } catch (err) {
      setError(friendlyAuthError(err.message));
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
      let data;
      try {
        data = await postJson('/api/auth/login', { name: loginName, phone: loginPhone, email });
      } catch (err) {
        if (!err.fallback) throw err;
        data = localChallenge({ name: loginName, email, phone: loginPhone, purpose: 'login' });
      }
      writePending({
        otp: data.otp || data.devOtp || readPending()?.otp,
        phone: data.phone,
        firstName: loginName.trim().split(/\s+/)[0] || '',
        lastName: loginName.trim().split(/\s+/).slice(1).join(' ') || '',
        email,
        purpose: 'login',
        at: Date.now(),
      });
      const shown = data.otp || data.devOtp || '';
      setOtpPhone(data.phone);
      setOtp(shown);
      setOtpBack('login');
      setPane('otp');
      setHint(data.emailSent
        ? (data.message || 'Check your email for the 6-digit code.')
        : (data.message || (shown ? `Use this code: ${shown}` : 'Enter the 6-digit code.')));
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
        setError(friendlyAuthError(err.message));
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
      let data;
      try {
        data = await postJson('/api/auth/verify', { phone: otpPhone, otp });
      } catch (err) {
        const pending = readPending();
        const samePhone = digitsPhone(pending?.phone) === digitsPhone(otpPhone);
        const fresh = pending?.at && (Date.now() - pending.at) < 5 * 60 * 1000;
        if (pending?.otp === otp && samePhone && fresh) {
          data = {
            ok: true,
            user: {
              id: `u-${pending.phone}`,
              firstName: pending.firstName,
              lastName: pending.lastName,
              name: `${pending.firstName || ''} ${pending.lastName || ''}`.trim(),
              phone: pending.phone,
              email: pending.email,
              birthDate: pending.birthDate,
              role: 'user',
              verified: true,
            },
          };
        } else if (!err.fallback) {
          throw err;
        } else {
          throw new Error('That code does not match. Request a new one.');
        }
      }
      if (!data?.user) throw new Error('Could not finish sign-in. Try again.');
      signIn(data.user);
      if (variant === 'page') navigate('/user');
    } catch (err) {
      setError(friendlyAuthError(err.message));
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
                ? 'Name and mobile. A 6-digit code goes to your email — if mail is unavailable, the code shows on the next screen.'
                : 'Name, birthday, phone (saved on the account), email for the OTP. If email cannot send, the code appears on the next screen.'}
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
            <h1>{otp.length === 6 ? 'Your code' : 'Enter the code'}</h1>
            <p className="af-lead">
              Type the six digits from your email. If the code is already filled, tap Confirm.
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
        {mailPreview && pane === 'otp' && !PROD && (
          <p className="af-hint">
            <a href={mailPreview} target="_blank" rel="noreferrer">Open local inbox</a>
            {' '}— code is there.
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
