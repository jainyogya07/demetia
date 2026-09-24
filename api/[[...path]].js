import { handleApiRequest } from '../server/handleApi.mjs';

export default async function handler(req, res) {
  try {
    const handled = await handleApiRequest(req, res);
    if (handled || res.writableEnded || res.headersSent) return;
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (err) {
    if (res.writableEnded || res.headersSent) return;
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: err?.message || 'Sign-in failed. Try again.' }));
  }
}
