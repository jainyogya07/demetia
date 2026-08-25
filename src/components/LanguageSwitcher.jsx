import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useI18n } from '../I18nContext';

function LanguageSwitcher() {
  const { lang, language, languages, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

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
      {open && (
        <ul className="lang-switcher-menu" role="listbox" aria-label="Language">
          {languages.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === lang}
                className={item.code === lang ? 'active' : ''}
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
              >
                <span className="lang-native">{item.nativeLabel}</span>
                <span className="lang-en">{item.englishName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSwitcher;
