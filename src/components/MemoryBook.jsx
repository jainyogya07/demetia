import { BookOpen, ChevronRight, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { MEMORIES_FALLBACK } from "../data/memoriesFallback";

function MemoryBook() {
  const { openModule } = useAppNav();
  const [rows, setRows] = useState(MEMORIES_FALLBACK);

  useEffect(() => {
    fetch("/api/memories")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const list = data.memories || [];
        if (list.length) setRows(list);
      })
      .catch(() => setRows(MEMORIES_FALLBACK));
  }, []);

  const albums = [
    { title: "My Family", album: "My Family" },
    { title: "My Home & Village", album: "My Home & Village" },
    { title: "Special Moments", album: "Special Moments" },
    { title: "Favorite Sounds", album: "Favorite Sounds", type: "sound" },
  ].map((slot) => {
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
          <button
            type="button"
            className="memory-item"
            key={memory.title}
            onClick={() => openModule("memory-book")}
          >
            {memory.type === "sound" ? (
              <div className="memory-sound-icon">
                <Music size={24} />
              </div>
            ) : (
              <img
                src={memory.image}
                alt={memory.title}
                className="memory-thumbnail"
              />
            )}
            <div className="memory-item-content">
              <strong>{memory.title}</strong>
              <span>{memory.subtitle}</span>
            </div>
            <ChevronRight className="memory-arrow" size={18} />
          </button>
        ))}
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
