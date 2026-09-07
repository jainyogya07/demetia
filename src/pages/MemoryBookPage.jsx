import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Camera, MapPin, Plus, Trash2, User } from 'lucide-react';
import { MEMORIES_FALLBACK } from '../data/memoriesFallback';
import { cancelFieldIds, enqueueFieldType, focusField, whenTypeQueueIdle } from '../lib/fieldTypeQueue';
import { hideAlbum, hiddenAlbums, hiddenMemoryIds, hideMemory } from '../lib/memoryAlbums';
import { pickSpokenField } from '../lib/sarthiAssist';
import './MemoryBookPage.css';

async function fetchMemories() {
  const res = await fetch('/api/memories');
  if (!res.ok) throw new Error('api');
  const data = await res.json();
  const rows = data.memories || data;
  if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
  return { rows, source: data.source || 'api' };
}

function foldQuery(value) {
  return String(value || '').toLowerCase();
}

const DRAFT_KEY = 'sarthi-memory-draft-v1';
const DEFAULT_MEMORY_PHOTO = '/photos/default-avatar.png';
const DEFAULT_PHOTO_SET = new Set(['/photos/default-avatar.png', '/photos/default-pfp.jpg']);
const MB_FIELDS = ['title', 'body', 'person', 'place'];
const MB_IDS = {
  title: 'mb-title',
  body: 'mb-body',
  person: 'mb-person',
  place: 'mb-place',
};

function readDraft() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function emptyForm(photoUrl = DEFAULT_MEMORY_PHOTO) {
  return { title: '', body: '', person: '', place: '', photo_url: photoUrl || DEFAULT_MEMORY_PHOTO };
}

function nextAskFrom(fields, ask) {
  if (ask && MB_IDS[ask]) return ask;
  if (fields._ask && MB_IDS[fields._ask]) return fields._ask;
  return MB_FIELDS.find((key) => !String(fields[key] || '').trim() || fields[key] === '—') || 'title';
}

export default function MemoryBookPage() {
  const [memories, setMemories] = useState(MEMORIES_FALLBACK);
  const [source, setSource] = useState('local');
  const [album, setAlbum] = useState('all');
  const [form, setForm] = useState(() => emptyForm());
  const [notice, setNotice] = useState('');
  const [assistFill, setAssistFill] = useState(false);
  const [hidden, setHidden] = useState(() => hiddenAlbums());
  const [hiddenIds, setHiddenIds] = useState(() => hiddenMemoryIds());
  const photoInputRef = useRef(null);
  const formRef = useRef(form);
  formRef.current = form;

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

  useEffect(() => () => cancelFieldIds(Object.values(MB_IDS)), []);

  const albums = useMemo(() => {
    const names = [...new Set(memories.map((m) => m.album).filter(Boolean))];
    return names.filter((name) => !hidden.includes(name));
  }, [memories, hidden]);

  const visible = useMemo(
    () => memories.filter((row) => !hidden.includes(row.album) && !hiddenIds.includes(String(row.id))),
    [memories, hidden, hiddenIds],
  );

  const shown = album === 'all' ? visible : visible.filter((m) => m.album === album);

  const typeFields = (fields = {}, ask) => {
    setAssistFill(true);
    const targetAsk = nextAskFrom(fields, ask);
    let queued = 0;
    MB_FIELDS.forEach((key) => {
      const raw = fields[key];
      if (!raw || raw === '—') return;
      const value = pickSpokenField(raw, key);
      if (!value) return;
      if (String(formRef.current[key] || '') === String(value)) return;
      queued += 1;
      enqueueFieldType(MB_IDS[key], String(value), {
        onTick: (slice) => {
          setForm((prev) => ({ ...prev, [key]: slice }));
        },
      });
    });
    window.setTimeout(() => {
      document.getElementById('mb-add-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!queued) focusField(MB_IDS[targetAsk] || 'mb-title');
    }, 80);
    if (queued) {
      whenTypeQueueIdle(() => focusField(MB_IDS[targetAsk] || 'mb-title'));
    }
  };

  const saveMemory = async (fields) => {
    const next = fields || formRef.current;
    const payload = {
      title: String(next.title || '').trim(),
      body: String(next.body || '').trim(),
      person: String(next.person || '').trim().replace(/^—$/, ''),
      place: String(next.place || '').trim().replace(/^—$/, ''),
      photo_url: String(next.photo_url || formRef.current.photo_url || DEFAULT_MEMORY_PHOTO).trim() || DEFAULT_MEMORY_PHOTO,
      album: 'Special Moments',
      lang: 'en',
      memory_date: new Date().toISOString().slice(0, 10),
    };
    if (!payload.title || !payload.body) return false;
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
      setSource('api');
      setNotice('');
    } catch {
      const row = { ...payload, id: `local-${Date.now()}` };
      setMemories((prev) => [row, ...prev]);
      setNotice('Saved on this device. Start the API with DATABASE_URL to keep it in Postgres.');
    }
    setForm(emptyForm());
    setAssistFill(false);
    try {
      sessionStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    return true;
  };

  const addMemory = async (event) => {
    event.preventDefault();
    await saveMemory(formRef.current);
  };

  const [expandedId, setExpandedId] = useState(null);
  const [photoScale, setPhotoScale] = useState(1);
  const [slideshow, setSlideshow] = useState(false);

  useEffect(() => {
    const draft = readDraft();
    if (draft.title || draft.body) typeFields(draft, draft._ask);
  }, []);

  useEffect(() => {
    const onForm = (event) => {
      const action = event.detail?.action;
      const fields = event.detail?.fields || readDraft();
      const clearKeys = event.detail?.clear || [];
      if (clearKeys.length) {
        const ids = clearKeys.map((key) => (key === 'photo' || key === 'photo_url' ? null : MB_IDS[key])).filter(Boolean);
        if (ids.length) cancelFieldIds(ids);
        setForm((prev) => {
          const next = { ...prev };
          clearKeys.forEach((key) => {
            if (key === 'photo' || key === 'photo_url') next.photo_url = DEFAULT_MEMORY_PHOTO;
            else if (MB_FIELDS.includes(key)) next[key] = '';
          });
          return next;
        });
      }
      if (action === 'start') {
        const incomingEmpty = !fields.title && !fields.body;
        setForm((prev) => ({
          ...prev,
          photo_url: fields.photo_url || prev.photo_url || DEFAULT_MEMORY_PHOTO,
          ...(incomingEmpty && (prev.title || prev.body) && !clearKeys.length ? {} : {
            title: '',
            body: '',
            person: '',
            place: '',
          }),
        }));
        typeFields(incomingEmpty && (formRef.current.title || formRef.current.body) && !clearKeys.length ? formRef.current : fields, event.detail?.ask || 'title');
        return;
      }
      if (action === 'fill') {
        if (fields.photo_url) {
          setForm((prev) => ({ ...prev, photo_url: fields.photo_url }));
        }
        typeFields(fields, event.detail?.ask);
        return;
      }
      if (action === 'save') {
        typeFields(fields, 'title');
        whenTypeQueueIdle(() => {
          saveMemory({ ...formRef.current, ...fields, photo_url: formRef.current.photo_url || DEFAULT_MEMORY_PHOTO });
        });
      }
    };
    window.addEventListener('sarthi:memory-form', onForm);
    return () => window.removeEventListener('sarthi:memory-form', onForm);
  }, []);

  useEffect(() => {
    const onAlbum = (event) => {
      if (event.detail?.action !== 'remove') return;
      const name = event.detail.album;
      setHidden(hiddenAlbums());
      setAlbum((current) => (current === name ? 'all' : current));
    };
    window.addEventListener('sarthi:memory-album', onAlbum);
    return () => window.removeEventListener('sarthi:memory-album', onAlbum);
  }, []);

  useEffect(() => {
    const onItem = (event) => {
      if (event.detail?.action !== 'remove') return;
      setHiddenIds(hiddenMemoryIds());
      setExpandedId((id) => (String(id) === String(event.detail.id) ? null : id));
    };
    window.addEventListener('sarthi:memory-item', onItem);
    return () => window.removeEventListener('sarthi:memory-item', onItem);
  }, []);

  useEffect(() => {
    const control = (event) => {
      const action = event.detail?.action;
      const query = foldQuery(event.detail?.query);
      if (action === 'zoom-in') setPhotoScale((value) => Math.min(1.6, value + 0.15));
      if (action === 'zoom-out') setPhotoScale((value) => Math.max(0.8, value - 0.15));
      if (action === 'next' && shown.length) {
        setExpandedId((id) => shown[(Math.max(0, shown.findIndex((m) => m.id === id)) + 1) % shown.length]?.id);
      }
      if (action === 'previous' && shown.length) {
        setExpandedId((id) => {
          const idx = shown.findIndex((m) => m.id === id);
          const next = idx <= 0 ? shown.length - 1 : idx - 1;
          return shown[next]?.id;
        });
      }
      if (action === 'fullscreen' && shown.length) {
        setExpandedId((id) => id || shown[0].id);
        setPhotoScale(1.45);
      }
      if (action === 'slideshow') setSlideshow((on) => !on);
      if (action === 'search' && query) {
        const match = memories.find((m) => foldQuery(`${m.album} ${m.person} ${m.title} ${m.place} ${m.body} ${m.memory_date}`).includes(query));
        if (match) {
          if (match.album) setAlbum(match.album);
          setExpandedId(match.id);
        }
      }
      if (action === 'describe') {
        const current = memories.find((m) => m.id === expandedId) || shown[0];
        if (current) {
          window.dispatchEvent(new CustomEvent('sarthi:photo-described', { detail: { text: `${current.title}. ${current.body}` } }));
        }
      }
    };
    window.addEventListener('sarthi:photo-control', control);
    return () => window.removeEventListener('sarthi:photo-control', control);
  }, [shown, memories, expandedId]);

  useEffect(() => {
    if (!slideshow || !shown.length) return undefined;
    const timer = window.setInterval(() => {
      setExpandedId((id) => {
        const idx = Math.max(0, shown.findIndex((m) => m.id === id));
        return shown[(idx + 1) % shown.length]?.id;
      });
    }, 3500);
    return () => window.clearInterval(timer);
  }, [slideshow, shown]);

  const onPickFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || '');
      if (src) setForm((prev) => ({ ...prev, photo_url: src }));
    };
    reader.readAsDataURL(file);
  };

  const previewSrc = form.photo_url || DEFAULT_MEMORY_PHOTO;
  const usingDefaultPhoto = DEFAULT_PHOTO_SET.has(previewSrc);

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
          <span key={name} className={`mb-album-chip${album === name ? ' on' : ''}`}>
            <button type="button" onClick={() => setAlbum(name)}>
              {name}
            </button>
            <button
              type="button"
              className="mb-album-remove"
              aria-label={`Remove ${name}`}
              onClick={(event) => {
                event.stopPropagation();
                hideAlbum(name);
                setHidden(hiddenAlbums());
                setAlbum((current) => (current === name ? 'all' : current));
              }}
            >
              <Trash2 size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className="mb-grid">
        {shown.map((memory) => {
          const isExpanded = expandedId === memory.id;
          return (
            <article
              key={memory.id}
              className={`mb-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setExpandedId(isExpanded ? null : memory.id)}
            >
              <button
                type="button"
                className="mb-card-remove"
                aria-label={`Remove ${memory.title}`}
                onClick={(event) => {
                  event.stopPropagation();
                  hideMemory(memory.id);
                  setHiddenIds(hiddenMemoryIds());
                  setExpandedId((id) => (id === memory.id ? null : id));
                }}
              >
                <Trash2 size={14} />
              </button>
              <div className="mb-photo">
                <img src={memory.photo_url} alt="" style={{ transform: `scale(${photoScale})` }} />
              </div>
              <div className="mb-body">
                <p className="mb-album">{memory.album}</p>
                <h3>{memory.title}</h3>
                <p className="mb-text">{memory.body}</p>
                <div className="mb-meta">
                  <span><User size={12} /> {memory.person}</span>
                  <span><MapPin size={12} /> {memory.place}</span>
                  {memory.memory_date && <span>{memory.memory_date}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <form id="mb-add-form" className={`mb-add${assistFill ? ' is-assist-fill' : ''}`} onSubmit={addMemory}>
        <h3><Plus size={16} /> Add a memory</h3>
        {assistFill && <p className="mb-assist-hint">Sarthi Assist is filling this. Say the details — we will add other languages later in edit.</p>}
        <div className="mb-photo-picker">
          <div className={`mb-photo-preview${usingDefaultPhoto ? ' is-default' : ''}`} aria-hidden="true">
            <img src={previewSrc} alt="" />
          </div>
          <div className="mb-photo-picker-main">
            <p className="mb-photo-label">Photo</p>
            <p className="mb-photo-hint">
              {usingDefaultPhoto ? 'Default photo until you pick one from the device.' : 'This photo will save with the memory.'}
            </p>
            <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={onPickFile} />
            <button type="button" className="ss-text-btn mb-photo-file" onClick={() => photoInputRef.current?.click()}>
              <Camera size={14} /> Choose from device
            </button>
            {!usingDefaultPhoto && (
              <button
                type="button"
                className="ss-text-btn mb-photo-file"
                onClick={() => setForm((prev) => ({ ...prev, photo_url: DEFAULT_MEMORY_PHOTO }))}
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
        <label>
          Title
          <input id="mb-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>
          What happened
          <textarea id="mb-body" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </label>
        <div className="mb-add-row">
          <label>
            Person
            <input id="mb-person" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} />
          </label>
          <label>
            Place
            <input id="mb-place" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
          </label>
        </div>
        <button type="submit" className="ss-full-btn">Save to the book</button>
      </form>
    </div>
  );
}
