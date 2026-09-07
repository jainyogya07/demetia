import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { homeForRole, useAuth } from '../context/AuthContext';
import {
  isFirebaseConfigured,
  createRecaptchaVerifier,
  sendFirebasePhoneOtp,
} from '../lib/firebase';
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
    if (res.status === 405) {
      throw new Error(data.error || detail || 'Authentication server error (405). Ensure the auth server is running.');
    }
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
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifierRef = useRef(null);

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
    if (defaultRole) setRole(defaultRole);
  }, [defaultRole]);

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
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) throw new Error('Enter a 10-digit mobile number.');
      setOtpPhone(cleanPhone);
      setOtpBack('signup');

      if (isFirebaseConfigured()) {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = createRecaptchaVerifier('recaptcha-container');
        }
        const formatted = `+91${cleanPhone}`;
        const confirmation = await sendFirebasePhoneOtp(formatted, recaptchaVerifierRef.current);
        setConfirmationResult(confirmation);
        setPane('otp');
        setHint(`SMS verification code sent to ${formatted}`);
        if (role === 'user') {
          setHouseholdHint('After you confirm the code, you will get a household code to share with caregiver and doctor.');
        } else if (familyCode) {
          setHouseholdHint(`Linking to household ${familyCode} once confirmed.`);
        } else {
          setHouseholdHint('Creating an unlinked account. You can connect to a patient household anytime later.');
        }
      } else {
        const data = await postJson('/auth-api/auth/signup', {
          firstName, lastName, birthDate, email, phone, role, familyCode,
        });
        const shown = data.otp || data.devOtp || '';
        setOtp(shown);
        setPane('otp');
        const delivered = Boolean(data.whatsappSent || data.emailSent);
        setHint(data.message || (delivered
          ? (data.whatsappSent ? 'Check WhatsApp for the 6-digit code.' : 'Check your email for the 6-digit code.')
          : (shown ? `Code did not send. Use this code: ${shown}` : 'Enter the 6-digit code.')));
        setMailPreview(data.previewUrl || '');
        if (role === 'user') {
          setHouseholdHint('After you confirm the code, you will get a household code to share with caregiver and doctor.');
        } else if (familyCode) {
          setHouseholdHint(`Linking to household ${familyCode} once confirmed.`);
        } else {
          setHouseholdHint('Creating an unlinked account. You can connect to a patient household anytime later.');
        }
      }
    } catch (err) {
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch (_) {}
        recaptchaVerifierRef.current = null;
      }
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
      const cleanPhone = loginPhone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) throw new Error('Enter a 10-digit mobile number.');
      setOtpPhone(cleanPhone);
      setOtpBack('login');

      if (isFirebaseConfigured()) {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = createRecaptchaVerifier('recaptcha-container');
        }
        const formatted = `+91${cleanPhone}`;
        const confirmation = await sendFirebasePhoneOtp(formatted, recaptchaVerifierRef.current);
        setConfirmationResult(confirmation);
        setPane('otp');
        setHint(`SMS verification code sent to ${formatted}`);
      } else {
        const data = await postJson('/auth-api/auth/login', { name: loginName, phone: loginPhone, email });
        const shown = data.otp || data.devOtp || '';
        setOtp(shown);
        setPane('otp');
        const delivered = Boolean(data.whatsappSent || data.emailSent);
        setHint(data.message || (delivered
          ? (data.whatsappSent ? 'Check WhatsApp for the 6-digit code.' : 'Check your email for the 6-digit code.')
          : (shown ? `Code did not send. Use this code: ${shown}` : 'Enter the 6-digit code.')));
        setMailPreview(data.previewUrl || '');
      }
    } catch (err) {
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch (_) {}
        recaptchaVerifierRef.current = null;
      }
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
      let verifiedByFirebase = false;
      let firebaseUid = '';

      if (confirmationResult) {
        const userCredential = await confirmationResult.confirm(otp);
        verifiedByFirebase = true;
        firebaseUid = userCredential.user?.uid || '';
      }

      const data = await postJson('/auth-api/auth/verify', {
        phone: otpPhone,
        otp,
        verified: verifiedByFirebase,
        firebaseUid,
        firstName: firstName || loginName,
        lastName,
        birthDate,
        email,
        role,
        familyCode,
      });

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
              One household links patient, caregiver, and doctor. Verification code sent via SMS, WhatsApp, or email.
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
                Household code (optional)
                <input
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                  placeholder="Optional — to link with a patient"
                  autoComplete="off"
                />
              </label>
            )}
            <label>
              Mobile
              <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="10-digit number" autoComplete="tel" />
            </label>
            <label>
              Email (optional)
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional backup email" autoComplete="email" />
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
              Email (optional)
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" autoComplete="email" />
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
              Check your mobile for the SMS / WhatsApp verification code (or email inbox if provided).
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
        <div id="recaptcha-container"></div>

        {!requireAccount && (
          <button type="button" className="af-guest" onClick={skip}>
            Continue without an account
          </button>
        )}
      </div>
    </div>
  );
}
