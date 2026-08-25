import { BookOpen, ChevronRight, Music } from "lucide-react";

function MemoryBook() {
  const memories = [
    {
      title: "My Family",
      subtitle: "12 memories",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80",
    },
    {
      title: "My Home & Village",
      subtitle: "8 memories",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80",
    },
    {
      title: "Special Moments",
      subtitle: "6 memories",
      image:
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=300&q=80",
    },
    {
      title: "Favorite Sounds",
      subtitle: "10 sounds",
      icon: Music,
      type: "sound",
    },
  ];

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
        {memories.map((memory) => {
          const Icon = memory.icon;

          return (
            <button
              className="memory-item"
              key={memory.title}
            >
              {/* IMAGE / SOUND ICON */}
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

              <ChevronRight
                className="memory-arrow"
                size={18}
              />
            </button>
          );
        })}
      </div>

      <button className="open-memory-book-btn">
        Open Memory Book
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default MemoryBook;