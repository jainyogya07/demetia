import { useRef, useState } from 'react';
import {
  User, Accessibility, Bell, ShieldCheck, Lock, Globe, Phone, Database,
  Download, Trash2, ShieldAlert, Camera,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import VoiceToggle from '../components/VoiceToggle';
import { useI18n } from '../I18nContext';
import { usePrefs } from '../PrefsContext';
import { LANG_STORAGE_KEY } from '../i18n';
import { useAppNav } from '../AppNavContext';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? 'on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

function Settings() {
  const { t, lang, languages, setLang } = useI18n();
  const { prefs, updatePrefs, resetPrefs } = usePrefs();
  const { openEmergency } = useAppNav();
  const [profileDraft, setProfileDraft] = useState(prefs.profile);
  const [dataNote, setDataNote] = useState('');
  const photoInputRef = useRef(null);

  const saveProfile = () => {
    updatePrefs({ profile: profileDraft });
  };

  const onPickPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        setProfileDraft((prev) => {
          const photoDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          updatePrefs({ profile: { photoDataUrl } });
          return { ...prev, photoDataUrl };
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const exportPrefs = () => {
    const payload = {
      language: lang,
      ...prefs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saheli-preferences.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLocal = () => {
    resetPrefs();
    try {
      localStorage.removeItem(LANG_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setLang('en');
    setProfileDraft({ name: '', phone: '', state: '', district: '', photoDataUrl: '' });
    setDataNote(t('settingsPage.deleted'));
  };

  return (
    <div className="granth-page settings-page">
      <p className="section-label">{t('settingsPage.label')}</p>
      <h2>{t('settingsPage.title')}</h2>
      <p className="granth-page-lead">{t('settingsPage.lead')}</p>
      <p className="settings-saved-hint">{t('settingsPage.savedDevice')}</p>

      <section className="settings-section">
        <div className="settings-section-head">
          <User size={18} />
          <div>
            <h3>{t('settingsPage.profileTitle')}</h3>
            <p>{t('settingsPage.profileLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-photo-row">
            <div className="settings-photo-preview" aria-hidden={!profileDraft.photoDataUrl}>
              {profileDraft.photoDataUrl ? (
                <img src={profileDraft.photoDataUrl} alt="" />
              ) : (
                <User size={28} />
              )}
            </div>
            <div className="settings-photo-actions">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onPickPhoto}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => photoInputRef.current?.click()}
              >
                <Camera size={14} /> {t('settingsPage.changePhoto')}
              </button>
              {profileDraft.photoDataUrl ? (
                <button
                  type="button"
                  className="btn btn-secondary settings-photo-remove"
                  onClick={() => {
                    setProfileDraft({ ...profileDraft, photoDataUrl: '' });
                    updatePrefs({ profile: { photoDataUrl: '' } });
                  }}
                >
                  {t('settingsPage.removePhoto')}
                </button>
              ) : null}
              <p className="settings-photo-hint">{t('settingsPage.photoHint')}</p>
            </div>
          </div>
          <label className="settings-field">
            <span>{t('settingsPage.name')}</span>
            <input
              value={profileDraft.name}
              onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
            />
          </label>
          <label className="settings-field">
            <span>{t('settingsPage.phone')}</span>
            <input
              value={profileDraft.phone}
              onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
              inputMode="tel"
            />
          </label>
          <div className="settings-field-row">
            <label className="settings-field">
              <span>{t('settingsPage.state')}</span>
              <input
                value={profileDraft.state}
                onChange={(e) => setProfileDraft({ ...profileDraft, state: e.target.value })}
              />
            </label>
            <label className="settings-field">
              <span>{t('settingsPage.district')}</span>
              <input
                value={profileDraft.district}
                onChange={(e) => setProfileDraft({ ...profileDraft, district: e.target.value })}
              />
            </label>
          </div>
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.preferredLang')}</h4>
              <p>{languages.find((item) => item.code === lang)?.nativeLabel}</p>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="settings-row">
            <button type="button" className="btn btn-primary" onClick={saveProfile}>
              {t('settingsPage.saveProfile')}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Accessibility size={18} />
          <div>
            <h3>{t('settingsPage.accessTitle')}</h3>
            <p>{t('settingsPage.accessLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <h4>{t('settingsPage.fontSize')}</h4>
            <div className="settings-seg">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={prefs.accessibility.fontSize === size ? 'active' : ''}
                  onClick={() => updatePrefs({ accessibility: { fontSize: size } })}
                >
                  {t(`settingsPage.font${size[0].toUpperCase()}${size.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.contrast')}</h4>
              <p>{prefs.accessibility.highContrast ? t('settingsPage.contrastOn') : t('settingsPage.contrastOff')}</p>
            </div>
            <Toggle
              checked={prefs.accessibility.highContrast}
              label={t('settingsPage.contrast')}
              onChange={(highContrast) => updatePrefs({ accessibility: { highContrast } })}
            />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Globe size={18} />
          <div>
            <h3>Companion voice</h3>
            <p>Female (Kore) or male (Charon). Switch reconnects the live call.</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <h4>Voice</h4>
            <VoiceToggle />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Bell size={18} />
          <div>
            <h3>{t('settingsPage.notifTitle')}</h3>
            <p>{t('settingsPage.notifLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          {[
            ['schemes', 'notifSchemes'],
            ['tickets', 'notifTickets'],
            ['community', 'notifCommunity'],
          ].map(([key, labelKey]) => (
            <div className="settings-row" key={key}>
              <h4>{t(`settingsPage.${labelKey}`)}</h4>
              <Toggle
                checked={prefs.notifications[key]}
                label={t(`settingsPage.${labelKey}`)}
                onChange={(value) => updatePrefs({ notifications: { [key]: value } })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <ShieldCheck size={18} />
          <div>
            <h3>{t('settingsPage.privacyTitle')}</h3>
            <p>{t('settingsPage.privacyLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          {[
            ['dataSharing', 'dataShare'],
            ['aiTranscripts', 'transcripts'],
            ['captions', 'captions'],
          ].map(([key, labelKey]) => (
            <div className="settings-row" key={key}>
              <h4>{t(`settingsPage.${labelKey}`)}</h4>
              <Toggle
                checked={prefs.privacy[key]}
                label={t(`settingsPage.${labelKey}`)}
                onChange={(value) => updatePrefs({ privacy: { [key]: value } })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Lock size={18} />
          <div>
            <h3>{t('settingsPage.securityTitle')}</h3>
            <p>{t('settingsPage.securityLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          {[
            ['password', 'password'],
            ['pin', 'pin'],
            ['twofa', 'twofa'],
          ].map(([key, labelKey]) => (
            <div className="settings-row" key={key}>
              <div>
                <h4>{t(`settingsPage.${labelKey}`)}</h4>
                <p>{t('settingsPage.comingAuth')}</p>
              </div>
              <span className="settings-row-meta">{t('settingsPage.comingAuth')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Globe size={18} />
          <div>
            <h3>{t('settingsPage.languageTitle')}</h3>
            <p>{t('settingsPage.languageLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-lang-grid">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`settings-lang-chip ${item.code === lang ? 'active' : ''}`}
                onClick={() => setLang(item.code)}
              >
                <strong>{item.nativeLabel}</strong>
                <span>{item.englishName}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Phone size={18} />
          <div>
            <h3>{t('settingsPage.helplinesTitle')}</h3>
            <p>{t('settingsPage.helplinesLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <button type="button" className="btn btn-primary" onClick={() => openEmergency?.()}>
              <ShieldAlert size={14} />
              {t('settingsPage.openHelplines')}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Database size={18} />
          <div>
            <h3>{t('settingsPage.dataTitle')}</h3>
            <p>{t('settingsPage.dataLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.exportBtn')}</h4>
              <p>{t('settingsPage.exportHint')}</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={exportPrefs}>
              <Download size={14} />
              {t('settingsPage.exportBtn')}
            </button>
          </div>
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.deleteBtn')}</h4>
              <p>{t('settingsPage.deleteHint')}</p>
            </div>
            <button type="button" className="btn btn-danger-ghost" onClick={deleteLocal}>
              <Trash2 size={14} />
              {t('settingsPage.deleteBtn')}
            </button>
          </div>
          {dataNote && <p className="settings-data-note">{dataNote}</p>}
        </div>
      </section>
    </div>
  );
}

export default Settings;
