const USERS_KEY = 'ss-local-users';
const OTP_KEY = 'ss-local-otp';

function digitsPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  return d.length >= 10 ? d.slice(-10) : d;
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(map) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map));
}

function publicUser(row) {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    name: row.name || `${row.firstName} ${row.lastName}`.trim(),
    phone: row.phone,
    email: row.email || '',
    birthDate: row.birthDate || '',
    role: 'user',
    verified: true,
  };
}

function code() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function runLocalAuth(path, body) {
  const phone = digitsPhone(body.phone);

  if (path.endsWith('/signup')) {
    if (phone.length !== 10) throw new Error('Enter a 10-digit mobile number.');
    if (!String(body.firstName || '').trim() || !String(body.lastName || '').trim()) {
      throw new Error('First and last name are required.');
    }
    if (!body.birthDate) throw new Error('Choose your date of birth.');
    const users = loadUsers();
    if (users[phone]?.verified) throw new Error('This number already has an account. Log in instead.');
    const otp = code();
    localStorage.setItem(OTP_KEY, JSON.stringify({
      phone,
      otp,
      pending: {
        firstName: String(body.firstName).trim(),
        lastName: String(body.lastName).trim(),
        birthDate: body.birthDate,
        email: String(body.email || '').trim(),
        phone,
      },
      at: Date.now(),
    }));
    return { ok: true, source: 'device', phone, otp, devOtp: otp, message: 'Use the code shown below.' };
  }

  if (path.endsWith('/login')) {
    if (phone.length !== 10) throw new Error('Enter a 10-digit mobile number.');
    const name = String(body.name || '').trim().toLowerCase();
    if (!name) throw new Error('Enter the name on the account.');
    const user = loadUsers()[phone];
    if (!user) throw new Error('No account for this number. Create one.');
    const full = `${user.firstName} ${user.lastName}`.trim().toLowerCase();
    if (name !== full && name !== user.firstName.toLowerCase() && name !== (user.name || '').toLowerCase()) {
      throw new Error('Name does not match this number.');
    }
    const otp = code();
    localStorage.setItem(OTP_KEY, JSON.stringify({
      phone,
      otp,
      pending: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        email: user.email,
        phone,
      },
      at: Date.now(),
    }));
    return { ok: true, source: 'device', phone, otp, devOtp: otp, message: 'Use the code shown below.' };
  }

  if (path.endsWith('/verify')) {
    const otp = String(body.otp || '').replace(/\D/g, '');
    let row;
    try {
      row = JSON.parse(localStorage.getItem(OTP_KEY) || 'null');
    } catch {
      row = null;
    }
    if (!row || row.phone !== phone) throw new Error('No code found. Request a new one.');
    if (Date.now() - row.at > 5 * 60 * 1000) throw new Error('Code expired. Request a new one.');
    if (row.otp !== otp) throw new Error('That code does not match.');
    const pending = row.pending || {};
    const user = {
      id: `u-${phone}`,
      firstName: pending.firstName,
      lastName: pending.lastName,
      name: `${pending.firstName} ${pending.lastName}`.trim(),
      phone,
      email: pending.email || '',
      birthDate: pending.birthDate || '',
      verified: true,
    };
    const users = loadUsers();
    users[phone] = user;
    saveUsers(users);
    localStorage.removeItem(OTP_KEY);
    return { ok: true, source: 'device', user: publicUser(user) };
  }

  throw new Error('Unknown sign-in step.');
}

export function shouldUseLocalAuth(res, text) {
  if (!res) return true;
  if (res.status === 502 || res.status === 503 || res.status === 504) return true;
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html')) return true;
  if (text && text.trimStart().startsWith('<!')) return true;
  return false;
}
