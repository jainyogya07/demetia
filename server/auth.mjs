/** Phone OTP + Postgres users. Email send is optional (FastAPI). */

import { sendAppMail, isSmtpConfigured, mailPreviewUrl } from './mail.mjs';
const AUTH_DEV_MODE = String(process.env.AUTH_DEV_MODE || 'false').toLowerCase();
const DEV_MODE = AUTH_DEV_MODE !== 'false' && AUTH_DEV_MODE !== '0' && AUTH_DEV_MODE !== 'no';
const memOtps = new Map();
const memUsers = new Map();
const SHOW_OTP = DEV_MODE || !isSmtpConfigured() || Boolean(process.env.VERCEL);

function dbHint(err) {
  return `Postgres is required for accounts. Run: npm run stack && npm run db:migrate. ${err ? `(${err})` : ''}`.trim();
}

export function digitsPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length >= 10) return d.slice(-10);
  return d;
}

function namesMatch(given, user) {
  const a = String(given || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!a) return false;
  const full = `${user.first_name || ''} ${user.last_name || ''}`.trim().toLowerCase().replace(/\s+/g, ' ');
  const display = String(user.display_name || '').trim().toLowerCase();
  const first = String(user.first_name || '').trim().toLowerCase();
  return a === full || a === display || a === first || full.startsWith(a) || a.includes(first);
}

function newCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function publicUser(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    name: row.display_name || `${row.first_name} ${row.last_name}`.trim(),
    phone: row.phone,
    email: row.email || '',
    birthDate: row.birth_date ? String(row.birth_date).slice(0, 10) : '',
    role: row.role || 'user',
    verified: Boolean(row.verified),
  };
}

async function deliverOtp({ email, otp }) {
  if (!email) return { emailSent: false, reason: 'no-email' };
  if (!isSmtpConfigured()) return { emailSent: false, reason: 'no-smtp' };
  const mail = await sendAppMail({
    to: email,
    subject: 'स्मृति सारथी — your sign-in code',
    text: `Your Smriti Saarthi code is ${otp}. It expires in 5 minutes.\n\nIf you did not ask for this, ignore the mail.`,
  });
  return { emailSent: Boolean(mail.ok), reason: mail.reason || null, previewUrl: mail.previewUrl || mailPreviewUrl() };
}

export function createAuthHandlers({ withDb, json, readBody }) {
  async function saveOtp(phone, code, purpose, pending) {
    const db = await withDb(async (client) => {
      await client.query(
        `INSERT INTO otp_challenges (phone, code, purpose, pending_json, created_at)
         VALUES ($1,$2,$3,$4::jsonb, NOW())
         ON CONFLICT (phone) DO UPDATE SET
           code = EXCLUDED.code, purpose = EXCLUDED.purpose,
           pending_json = EXCLUDED.pending_json, created_at = NOW()`,
        [phone, code, purpose, JSON.stringify(pending || {})],
      );
    });
    if (!db.ok) {
      memOtps.set(phone, { code, purpose, pending_json: pending || {}, created_at: new Date().toISOString() });
      return { ok: true, source: 'memory' };
    }
    return { ok: true, source: 'postgres' };
  }

  async function readOtp(phone) {
    const db = await withDb(async (client) => {
      const { rows } = await client.query(
        `SELECT code, purpose, pending_json, created_at FROM otp_challenges WHERE phone = $1`,
        [phone],
      );
      return rows[0] || null;
    });
    if (db.ok && db.result) return db.result;
    return memOtps.get(phone) || null;
  }

  async function clearOtp(phone) {
    await withDb(async (client) => {
      await client.query('DELETE FROM otp_challenges WHERE phone = $1', [phone]);
    });
  }

  async function getUserByPhone(phone) {
    const db = await withDb(async (client) => {
      const { rows } = await client.query('SELECT * FROM app_users WHERE phone = $1', [phone]);
      return rows[0] || null;
    });
    if (db.ok) return { ok: true, user: db.result };
    return { ok: true, user: memUsers.get(phone) || null };
  }

  async function upsertUser(fields, verified) {
    const id = fields.id || `u-${fields.phone}`;
    const row = {
      id,
      first_name: fields.first_name || fields.firstName || '',
      last_name: fields.last_name || fields.lastName || '',
      display_name: fields.display_name || fields.displayName
        || `${fields.first_name || fields.firstName || ''} ${fields.last_name || fields.lastName || ''}`.trim(),
      phone: fields.phone,
      email: fields.email || null,
      birth_date: fields.birth_date || fields.birthDate || null,
      role: fields.role || 'user',
      verified,
    };
    const db = await withDb(async (client) => {
      await client.query(
        `INSERT INTO app_users
           (id, first_name, last_name, display_name, phone, email, birth_date, role, verified, last_login_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, CASE WHEN $9 THEN NOW() ELSE NULL END)
         ON CONFLICT (phone) DO UPDATE SET
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           display_name = EXCLUDED.display_name,
           email = COALESCE(EXCLUDED.email, app_users.email),
           birth_date = COALESCE(EXCLUDED.birth_date, app_users.birth_date),
           verified = EXCLUDED.verified,
           last_login_at = CASE WHEN EXCLUDED.verified THEN NOW() ELSE app_users.last_login_at END
         RETURNING *`,
        [row.id, row.first_name, row.last_name, row.display_name, row.phone, row.email, row.birth_date, row.role, row.verified],
      );
      const { rows } = await client.query('SELECT * FROM app_users WHERE phone = $1', [row.phone]);
      return rows[0];
    });
    if (db.ok && db.result) return { source: 'postgres', user: db.result };
    memUsers.set(row.phone, row);
    return { source: 'memory', user: row };
  }

  async function startSignup(body) {
    const phone = digitsPhone(body.phone);
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const birthDate = String(body.birthDate || '').trim();
    const email = String(body.email || '').trim();
    if (phone.length !== 10) return { status: 400, body: { error: 'Enter a 10-digit mobile number.' } };
    if (!firstName || !lastName) return { status: 400, body: { error: 'First and last name are required.' } };
    if (!birthDate) return { status: 400, body: { error: 'Choose your date of birth.' } };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { status: 400, body: { error: 'Enter a working email. The code is sent there, not by SMS.' } };
    }
    const existing = await getUserByPhone(phone);
    if (existing.user?.verified) {
      return { status: 409, body: { error: 'This number already has an account. Log in instead.' } };
    }
    const code = newCode();
    const pending = { firstName, lastName, birthDate, email, phone, role: 'user' };
    const store = await saveOtp(phone, code, 'signup', pending);
    if (!store.ok) return { status: 503, body: { error: dbHint(store.error) } };
    const delivered = await deliverOtp({ email, otp: code });
    const preview = delivered.previewUrl || '';
    const mailNote = delivered.emailSent
      ? (preview ? `Code sent. Open ${preview} to read the OTP.` : `Code mailed to ${email}. Check inbox and spam.`)
      : 'Could not email the code. Use the 6-digit code on this screen.';
    const payload = {
      ok: true,
      source: store.source,
      phone,
      previewUrl: preview,
      message: mailNote,
    };
    if (SHOW_OTP || !delivered.emailSent) {
      payload.otp = code;
      payload.devOtp = code;
    }
    return { status: 200, body: payload };
  }

  async function startLogin(body) {
    const phone = digitsPhone(body.phone);
    const name = String(body.name || '').trim();
    if (phone.length !== 10) return { status: 400, body: { error: 'Enter a 10-digit mobile number.' } };
    if (!name) return { status: 400, body: { error: 'Enter the name on the account.' } };
    const found = await getUserByPhone(phone);
    if (!found.ok) return { status: 503, body: { error: dbHint(found.error) } };
    const user = found.user;
    if (!user) return { status: 404, body: { error: 'No account for this number. Create one.' } };
    if (!namesMatch(name, user)) {
      return { status: 403, body: { error: 'Name does not match this number.' } };
    }
    const mailTo = String(body.email || user.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailTo)) {
      return { status: 400, body: { error: 'This account needs an email. Enter the email to receive the code.' } };
    }
    const code = newCode();
    const store = await saveOtp(phone, code, 'login', {
      firstName: user.first_name,
      lastName: user.last_name,
      email: mailTo,
      phone,
    });
    if (!store.ok) return { status: 503, body: { error: dbHint(store.error) } };
    const delivered = await deliverOtp({ email: mailTo, otp: code });
    const preview = delivered.previewUrl || '';
    const mailNote = delivered.emailSent
      ? (preview ? `Code sent. Open ${preview} to read the OTP.` : `Code mailed to ${mailTo}. Check inbox and spam.`)
      : 'Could not email the code. Use the 6-digit code on this screen.';
    const bodyOut = {
      ok: true,
      source: store.source,
      phone,
      previewUrl: preview,
      message: mailNote,
    };
    if (SHOW_OTP || !delivered.emailSent) {
      bodyOut.otp = code;
      bodyOut.devOtp = code;
    }
    return { status: 200, body: bodyOut };
  }

  async function verify(body) {
    const phone = digitsPhone(body.phone);
    const otp = String(body.otp || '').replace(/\D/g, '');
    if (phone.length !== 10 || otp.length !== 6) {
      return { status: 400, body: { error: 'Enter the 6-digit code.' } };
    }
    const row = await readOtp(phone);
    if (!row) return { status: 400, body: { error: 'No code found. Request a new one.' } };
    const age = Date.now() - new Date(row.created_at).getTime();
    if (age > 5 * 60 * 1000) return { status: 400, body: { error: 'Code expired. Request a new one.' } };
    if (row.code !== otp) return { status: 400, body: { error: 'That code does not match.' } };
    const pending = typeof row.pending_json === 'string'
      ? JSON.parse(row.pending_json)
      : (row.pending_json || {});
    const saved = await upsertUser({
      firstName: pending.firstName,
      lastName: pending.lastName,
      phone,
      email: pending.email,
      birthDate: pending.birthDate,
    }, true);
    if (!saved.user) {
      return { status: 503, body: { error: 'Could not save the account. Try again.' } };
    }
    await clearOtp(phone);
    memOtps.delete(phone);
    return {
      status: 200,
      body: { ok: true, source: saved.source, user: publicUser(saved.user) },
    };
  }

  const AUTH_POST = new Set(['/api/auth/signup', '/api/auth/login', '/api/auth/verify']);

  return {
    async handle(req, res, path) {
      if (req.method === 'GET' && path === '/api/auth/health') {
        json(res, 200, {
          ok: true,
          database: Boolean(process.env.DATABASE_URL?.trim()),
          devMode: DEV_MODE,
          smtp: isSmtpConfigured(),
        });
        return true;
      }
      if (req.method !== 'POST' || !AUTH_POST.has(path)) return false;
      let body;
      try {
        body = await readBody(req);
      } catch {
        json(res, 400, { error: 'Invalid JSON' });
        return true;
      }
      let out;
      if (path === '/api/auth/signup') out = await startSignup(body);
      else if (path === '/api/auth/login') out = await startLogin(body);
      else out = await verify(body);
      json(res, out.status, out.body);
      return true;
    },
  };
}
