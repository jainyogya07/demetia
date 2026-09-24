import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Mic, Send } from 'lucide-react';
import companionPortrait from '../assets/infinity_pfp.jpg';
import { useAppNav } from '../AppNavContext';
import './HomeChat.css';

const CHAT_KEY = 'sarthi-home-chat-v1';
const STARTER = {
  id: 'welcome',
  role: 'ai',
  text: 'Namaste. Main Care Agent hoon. Yahan likho — dawa, yaad, ghar, ya jo dil pe ho.',
};

const QUICK = [
  { label: 'Dawa li?', send: 'Did I take my medicine today?' },
  { label: 'Kya next hai?', send: 'What should I do next today?' },
  { label: 'Yaad sunao', send: 'Tell me a family memory from my book.' },
];

function readChat() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
    return Array.isArray(parsed) && parsed.length ? parsed : [STARTER];
  } catch {
    return [STARTER];
  }
}

function nowLabel() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function fallbackReply(text) {
  const t = text.toLowerCase();
  if (/(dawa|medicine|tablet)/.test(t)) return 'Routine mein dawa dikh rahi hai. Green FAB se Assist ko bolo “mark complete” — ya Speak se mere saath baat karo.';
  if (/(yaad|memory|photo|book)/.test(t)) return 'Memory Book khol lo — har card pe delete bhi hai. Koi album hataani ho to Assist se naam lekar bolo.';
  if (/(safe|kahan|location|ghar)/.test(t)) return 'Safety Status pe last check-in dikhta hai. Safe feel na ho to Emergency Help sidebar mein hai.';
  return 'Main yahin hoon. Likhte raho, ya Care Agent se awaaz mein baat karo.';
}

export default function HomeChat({ defaultOpen = true }) {
  const { openModule } = useAppNav();
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState(readChat);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !open) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, busy]);

  const push = (role, text) => {
    setMessages((prev) => [...prev, { id: `${role}-${Date.now()}`, role, text, time: nowLabel() }]);
  };

  const send = async (raw) => {
    const text = String(raw || draft).trim();
    if (!text || busy) return;
    setDraft('');
    setOpen(true);
    push('user', text);
    setBusy(true);
    try {
      const history = [...messages.filter((row) => row.id !== 'welcome'), { role: 'user', text }].slice(-12).map((row) => ({
        role: row.role === 'ai' ? 'model' : 'user',
        text: row.text,
      }));
      const res = await fetch('/api/home-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = String(data.reply || '').trim();
      const weak = !reply || /thoda ruk|line kamzor|Assist FAB/i.test(reply);
      push('ai', weak ? fallbackReply(text) : reply);
    } catch {
      push('ai', fallbackReply(text));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`home-chat${open ? ' is-open' : ''}`}>
      <button type="button" className="home-chat-toggle" onClick={() => setOpen((value) => !value)}>
        <img src={companionPortrait} alt="" className="home-chat-avatar" />
        <span className="home-chat-toggle-copy">
          <strong>Chat with Care Agent</strong>
          <em>{open ? 'Tap to make the window smaller' : 'Tap to expand this window'}</em>
        </span>
        {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      {open && (
        <>
          <div className="home-chat-thread" ref={listRef}>
            {messages.map((row) => (
              <div key={row.id} className={`home-chat-bubble is-${row.role}`}>
                {row.role === 'ai' && <img src={companionPortrait} alt="" />}
                <p>{row.text}</p>
              </div>
            ))}
            {busy && (
              <div className="home-chat-bubble is-ai is-typing">
                <img src={companionPortrait} alt="" />
                <p>Likh rahi hoon…</p>
              </div>
            )}
          </div>

          <div className="home-chat-quick">
            {QUICK.map((chip) => (
              <button key={chip.label} type="button" onClick={() => send(chip.send)}>
                {chip.label}
              </button>
            ))}
          </div>

          <form
            className="home-chat-compose"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message…"
              aria-label="Message Care Agent"
            />
            <button type="button" className="home-chat-speak" onClick={() => openModule('ai', { startVoice: true })}>
              <Mic size={16} />
            </button>
            <button type="submit" className="home-chat-send" disabled={busy || !draft.trim()}>
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </section>
  );
}
