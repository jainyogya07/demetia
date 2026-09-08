import { createPortal } from 'react-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { markLangManual } from '../i18n';

function LanguageSwitcher() {
  const { lang, language, languages, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 16 });
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return undefined;
    const place = () => {
      const rect = rootRef.current.getBoundingClientRect();
      setMenuPos({
        top: Math.min(rect.bottom + 8, window.innerHeight - 120),
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (event.target.closest?.('.lang-switcher-menu')) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const menu = open ? createPortal(
    <ul
      className="lang-switcher-menu lang-switcher-menu-portal"
      role="listbox"
      aria-label="Language"
      style={{ top: menuPos.top, right: menuPos.right, zIndex: 10050, position: 'fixed' }}
    >
      {languages.map((item) => (
        <li key={item.code}>
          <button
            type="button"
            role="option"
            aria-selected={item.code === lang}
            className={item.code === lang ? 'active' : ''}
            onClick={() => {
              markLangManual();
              setLang(item.code);
              setOpen(false);
            }}
          >
            <span className="lang-native">{item.nativeLabel}</span>
            <span className="lang-en">{item.englishName}</span>
          </button>
        </li>
      ))}
    </ul>,
    document.body,
  ) : null;

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="top-action lang-switcher-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe size={16} />
        <span>{language.nativeLabel}</span>
        <ChevronDown size={14} />
      </button>
      {menu}
    </div>
  );
}

export default LanguageSwitcher;
