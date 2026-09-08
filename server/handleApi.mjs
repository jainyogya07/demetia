import { MEMORIES_FALLBACK } from '../src/data/memoriesFallback.js';
import { createAuthHandlers } from './auth.mjs';
import { apiPath, json, readBody, withDb } from './httpKit.mjs';

const auth = createAuthHandlers({ withDb, json, readBody });

export async function handleApiRequest(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      json(res, 204, {});
      return true;
    }

  const path = apiPath(req);
  if (!path.startsWith('/api')) return false;

  if (await auth.handle(req, res, path)) return true;

  if (req.method === 'GET' && (path === '/api/health' || path === '/health')) {
    json(res, 200, { ok: true, database: Boolean(process.env.DATABASE_URL?.trim()) });
    return true;
  }

  if (req.method === 'GET' && path === '/api/music-preview') {
    const q = new URL(req.url || '/', 'http://local').searchParams.get('q') || '';
    if (!q.trim()) {
      json(res, 400, { previewUrl: '' });
      return true;
    }
    try {
      const itunes = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=1&country=IN`;
      const remote = await fetch(itunes);
      const data = await remote.json().catch(() => ({}));
      json(res, 200, { previewUrl: data.results?.[0]?.previewUrl || '' });
    } catch {
      json(res, 200, { previewUrl: '' });
    }
    return true;
  }

  if (req.method === 'GET' && path === '/api/memories') {
    const db = await withDb(async (client) => {
      const { rows } = await client.query(
        `SELECT id, title, body, photo_url, person, place, memory_date::text, lang, album
         FROM memories ORDER BY memory_date DESC NULLS LAST, title`,
      );
      return rows;
    });
    if (db.ok && db.result?.length) {
      json(res, 200, { source: 'postgres', memories: db.result });
      return true;
    }
    json(res, 200, {
      source: 'fallback',
      error: db.error || 'empty',
      memories: MEMORIES_FALLBACK,
    });
    return true;
  }

  if (req.method === 'POST' && path === '/api/memories') {
    let body;
    try {
      body = await readBody(req);
    } catch {
      json(res, 400, { error: 'Invalid JSON' });
      return true;
    }
    const row = {
      id: body.id || `m-${Date.now()}`,
      title: String(body.title || '').trim(),
      body: String(body.body || '').trim(),
      photo_url: String(body.photo_url || '/photos/garden.png'),
      person: String(body.person || ''),
      place: String(body.place || ''),
      memory_date: body.memory_date || new Date().toISOString().slice(0, 10),
      lang: body.lang || 'en',
      album: body.album || 'Special Moments',
    };
    if (!row.title || !row.body) {
      json(res, 400, { error: 'title and body are required' });
      return true;
    }
    const db = await withDb(async (client) => {
      await client.query(
        `INSERT INTO memories (id, title, body, photo_url, person, place, memory_date, lang, album)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title, body = EXCLUDED.body, photo_url = EXCLUDED.photo_url,
           person = EXCLUDED.person, place = EXCLUDED.place, memory_date = EXCLUDED.memory_date,
           lang = EXCLUDED.lang, album = EXCLUDED.album`,
        [row.id, row.title, row.body, row.photo_url, row.person, row.place, row.memory_date, row.lang, row.album],
      );
      return row;
    });
    if (!db.ok) {
      json(res, 503, { error: db.error, memory: row, source: 'local-only' });
      return true;
    }
    json(res, 201, { source: 'postgres', memory: db.result });
    return true;
  }

  if (req.method === 'POST' && path === '/api/home-chat') {
    let body;
    try {
      body = await readBody(req);
    } catch {
      json(res, 400, { error: 'Invalid JSON' });
      return true;
    }
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const history = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const last = String(history[history.length - 1]?.text || '').trim();
    if (!last) {
      json(res, 400, { error: 'empty' });
      return true;
    }
    if (!key) {
      json(res, 200, { reply: 'Main yahin hoon. Dawa, Memory Book, ya ghar ke baare mein poochho — Assist FAB bhi sun raha hai.', source: 'local' });
      return true;
    }
    try {
      let contents = history.map((row) => ({
        role: row.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(row.text || '').slice(0, 800) }],
      })).filter((row) => row.parts[0].text);
      if (!contents.length || contents[0].role !== 'user') {
        contents = [{ role: 'user', parts: [{ text: last }] }];
      }
      const gemini = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: 'You are Care Agent on the Caresahaay / Smriti Saarthi home chat. Warm, short (1-3 sentences). Mirror the user language (Hindi, Hinglish, Assamese, English). Never call yourself Assist or tell them to press Speak. You cannot change medicine dosage. Offer Memory Book, routine, safety, or family in simple words.',
            }],
          },
          contents,
          generationConfig: { maxOutputTokens: 180, temperature: 0.6 },
        }),
      });
      const data = await gemini.json().catch(() => ({}));
      const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join(' ').trim();
      json(res, gemini.ok && reply ? 200 : 200, { reply: reply || 'Thoda ruk ke phir se likho. Main sun rahi hoon.', source: 'gemini' });
    } catch {
      json(res, 200, { reply: 'Abhi line kamzor hai. Phir se try karo, ya Emergency Help sidebar mein hai.', source: 'error' });
    }
    return true;
  }

  json(res, 404, { error: 'Not found' });
  return true;
  } catch (err) {
    json(res, 500, { error: err?.message || 'API failed' });
    return true;
  }
}
