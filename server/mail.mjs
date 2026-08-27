import net from 'node:net';
import { spawn } from 'node:child_process';
import nodemailer from 'nodemailer';

const MAILPIT_HOST = process.env.MAILPIT_HOST?.trim() || '127.0.0.1';
const MAILPIT_SMTP = Number(process.env.MAILPIT_SMTP_PORT || 1025);
const MAILPIT_UI = process.env.MAILPIT_UI?.trim() || `http://${MAILPIT_HOST}:8025`;

function smtpUser() {
  return process.env.SMTP_EMAIL?.trim() || process.env.EMAIL?.trim() || '';
}

function smtpPass() {
  return (process.env.SMTP_APP_PASSWORD?.trim() || process.env.APP_PASSWORD?.trim() || '').replace(/\s+/g, '');
}

export function mailPreviewUrl() {
  if (smtpUser() && smtpPass()) return '';
  return MAILPIT_UI;
}

export function isSmtpConfigured() {
  return Boolean(smtpUser() && smtpPass()) || true;
}

function portOpen(host, port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port }, () => {
      sock.end();
      resolve(true);
    });
    sock.setTimeout(600);
    sock.on('timeout', () => {
      sock.destroy();
      resolve(false);
    });
    sock.on('error', () => resolve(false));
  });
}

function spawnDetached(cmd, args) {
  return new Promise((resolve) => {
    try {
      const child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
      child.unref();
      child.on('error', () => resolve(false));
      setTimeout(() => resolve(true), 300);
    } catch {
      resolve(false);
    }
  });
}

async function waitForSmtp(tries = 20) {
  for (let i = 0; i < tries; i += 1) {
    if (await portOpen(MAILPIT_HOST, MAILPIT_SMTP)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

/** Mailpit — open-source SMTP catcher (https://github.com/axllent/mailpit). */
export async function ensureMailpit() {
  if (smtpUser() && smtpPass()) return true;
  if (await portOpen(MAILPIT_HOST, MAILPIT_SMTP)) return true;
  await spawnDetached('mailpit', []);
  if (await waitForSmtp(12)) return true;
  await spawnDetached('docker', ['start', 'smriti-mailpit']);
  if (await waitForSmtp(8)) return true;
  await spawnDetached('docker', [
    'run', '-d', '--name', 'smriti-mailpit',
    '-p', `${MAILPIT_SMTP}:1025`, '-p', '8025:8025',
    'axllent/mailpit',
  ]);
  return waitForSmtp(24);
}

function transporter() {
  const user = smtpUser();
  const pass = smtpPass();
  if (user && pass) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user, pass },
    });
  }
  return nodemailer.createTransport({
    host: MAILPIT_HOST,
    port: MAILPIT_SMTP,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Send via open-source Mailpit (local inbox UI) or real SMTP if env is set.
 */
export async function sendAppMail({ to, subject, text }) {
  if (!to) return { ok: false, reason: 'no-email' };
  const ready = await ensureMailpit();
  if (!ready && !(smtpUser() && smtpPass())) {
    return { ok: false, reason: 'mailpit-not-running' };
  }
  try {
    const from = smtpUser() || 'smriti@localhost';
    await transporter().sendMail({
      from: `Smriti Saarthi <${from}>`,
      to,
      subject,
      text,
    });
    return { ok: true, previewUrl: mailPreviewUrl() };
  } catch (err) {
    return { ok: false, reason: err.message || 'send-failed' };
  }
}
