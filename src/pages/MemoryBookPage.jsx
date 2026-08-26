import { useEffect, useMemo, useState } from 'react';
import { BookOpen, MapPin, Plus, User } from 'lucide-react';
import { MEMORIES_FALLBACK } from '../data/memoriesFallback';
import './MemoryBookPage.css';

async function fetchMemories() {
  const res = await fetch('/api/memories');
  if (!res.ok) throw new Error('api');
  const data = await res.json();
  const rows = data.memories || data;
  if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
  return { rows, source: data.source || 'api' };
}

export default function MemoryBookPage() {
  const [memories, setMemories] = useState(MEMORIES_FALLBACK);
  const [source, setSource] = useState('local');
  const [album, setAlbum] = useState('all');
  const [form, setForm] = useState({ title: '', body: '', person: 'Latveria', place: 'Guwahati' });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let alive = true;
    fetchMemories()
      .then(({ rows, source: src }) => {
        if (!alive) return;
        setMemories(rows);
        setSource(src);
      })
      .catch(() => {
        if (!alive) return;
        setMemories(MEMORIES_FALLBACK);
        setSource('local');
        setNotice('Postgres is not reachable. Showing the household book from this device.');
      });
    return () => {
      alive = false;
    };
  }, []);

  const albums = useMemo(() => {
    const names = [...new Set(memories.map((m) => m.album).filter(Boolean))];
    return names;
  }, [memories]);

  const shown = album === 'all' ? memories : memories.filter((m) => m.album === album);

  const addMemory = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      person: form.person.trim(),
      place: form.place.trim(),
      photo_url: '/photos/garden.png',
      album: 'Special Moments',
      lang: 'en',
      memory_date: new Date().toISOString().slice(0, 10),
    };
    if (!payload.title || !payload.body) return;
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'save failed');
      const row = data.memory || { ...payload, id: `${Date.now()}` };
      setMemories((prev) => [row, ...prev]);
      setForm({ title: '', body: '', person: 'Latveria', place: 'Guwahati' });
      setSource('api');
      setNotice('');
    } catch {
      const row = { ...payload, id: `local-${Date.now()}` };
      setMemories((prev) => [row, ...prev]);
      setNotice('Saved on this device. Start the API with DATABASE_URL to keep it in Postgres.');
    }
  };

  return (
    <div className="memory-book-page">
      <header className="memory-book-page-head">
        <p className="ss-kicker"><BookOpen size={14} /> Memory Book</p>
        <h2>Lived memories</h2>
        <p>
          Family photographs and the days around them — tea garden, Zoo Road, Rina’s tea.
          {source === 'local' ? ' Local copy.' : source === 'fallback' ? ' API fallback.' : ' Loaded from Postgres.'}
        </p>
      </header>

      {notice && <p className="ss-safety-note">{notice}</p>}

      <div className="mb-albums">
        <button type="button" className={album === 'all' ? 'on' : ''} onClick={() => setAlbum('all')}>
          All
        </button>
        {albums.map((name) => (
          <button key={name} type="button" className={album === name ? 'on' : ''} onClick={() => setAlbum(name)}>
            {name}
          </button>
        ))}
      </div>

      <div className="mb-grid">
        {shown.map((memory) => (
          <article key={memory.id} className="mb-card">
            <div className="mb-photo">
              <img src={memory.photo_url} alt="" />
            </div>
            <div className="mb-body">
              <p className="mb-album">{memory.album}</p>
              <h3>{memory.title}</h3>
              <p>{memory.body}</p>
              <div className="mb-meta">
                <span><User size={12} /> {memory.person}</span>
                <span><MapPin size={12} /> {memory.place}</span>
                {memory.memory_date && <span>{memory.memory_date}</span>}
              </div>
            </div>
          </article>
        ))}
      </div>

      <form className="mb-add" onSubmit={addMemory}>
        <h3><Plus size={16} /> Add a memory</h3>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label>
          What happened
          <textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        </label>
        <div className="mb-add-row">
          <label>
            Person
            <input value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} />
          </label>
          <label>
            Place
            <input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
          </label>
        </div>
        <button type="submit" className="ss-full-btn">Save to the book</button>
      </form>
    </div>
  );
}
