import { BookOpen, ChevronRight, Music, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { MEMORIES_FALLBACK } from "../data/memoriesFallback";
import { hideAlbum, hiddenAlbums, MEMORY_ALBUMS } from "../lib/memoryAlbums";

function MemoryBook() {
  const { openModule } = useAppNav();
  const [rows, setRows] = useState(MEMORIES_FALLBACK);
  const [hidden, setHidden] = useState(() => hiddenAlbums());

  useEffect(() => {
    fetch("/api/memories")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const list = data.memories || [];
        if (list.length) setRows(list);
      })
      .catch(() => setRows(MEMORIES_FALLBACK));
  }, []);

  useEffect(() => {
    const onAlbum = (event) => {
      if (event.detail?.action === 'remove' && event.detail.album) {
        setHidden(hiddenAlbums());
      }
    };
    window.addEventListener('sarthi:memory-album', onAlbum);
    return () => window.removeEventListener('sarthi:memory-album', onAlbum);
  }, []);

  const albums = MEMORY_ALBUMS.filter((slot) => !hidden.includes(slot.album)).map((slot) => {
    const matches = rows.filter((m) => m.album === slot.album);
    return {
      ...slot,
      subtitle: `${matches.length || 0} memories`,
      image: matches[0]?.photo_url,
    };
  });

  return (
    <div className="memory-book-card">
      <div className="memory-book-header">
        <div className="section-title">
          <div className="title-icon">
            <BookOpen size={20} />
          </div>
          <h2>My Memory Book</h2>
        </div>
      </div>

      <div className="memory-list">
        {albums.map((memory) => (
          <div className="memory-item-wrap" key={memory.title}>
            <button
              type="button"
              className="memory-item"
              onClick={() => openModule("memory-book")}
            >
              {memory.type === "sound" ? (
                <div className="memory-sound-icon">
                  <Music size={24} />
                </div>
              ) : (
                <img
                  src={memory.image}
                  alt=""
                  className="memory-thumbnail"
                />
              )}
              <div className="memory-item-content">
                <strong>{memory.title}</strong>
                <span>{memory.subtitle}</span>
              </div>
              <ChevronRight className="memory-arrow" size={18} />
            </button>
            <button
              type="button"
              className="memory-item-remove"
              aria-label={`Remove ${memory.title}`}
              onClick={(event) => {
                event.stopPropagation();
                hideAlbum(memory.album);
                setHidden(hiddenAlbums());
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {!albums.length && (
          <p className="memory-empty">No memory books on the home card right now.</p>
        )}
      </div>

      <button
        type="button"
        className="open-memory-book-btn"
        onClick={() => openModule("memory-book")}
      >
        Open Memory Book
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default MemoryBook;
