import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  UploadCloud, FileText, Image as ImageIcon, CheckCircle, Clock,
  AlertCircle, MoreVertical, Download, Trash2, Eye, ShieldCheck,
  FileCheck2, FileWarning, Search, HardDrive
} from 'lucide-react';
import { useI18n } from './I18nContext';
import './MyDocuments.css';

const META_KEY = 'saheli-documents-meta';
const IDB_NAME = 'saheli-documents';
const IDB_STORE = 'files';
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(IDB_STORE)) {
        req.result.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(id, blob) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function idbDel(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMeta(list) {
  const slim = list.map(({ objectUrl, file, ...rest }) => rest);
  localStorage.setItem(META_KEY, JSON.stringify(slim));
}

function extOf(name, mime) {
  const fromName = name.includes('.') ? name.split('.').pop() : '';
  if (fromName) return fromName.toLowerCase();
  if (mime === 'application/pdf') return 'pdf';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpeg';
  return 'file';
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso, lang) {
  try {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-IN' : lang, {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function guessCategory(name, t) {
  const n = name.toLowerCase();
  if (/aadhaar|aadhar|id |passport|voter/.test(n)) return t('docs.catIdentity');
  if (/prescription|rx |medicine|doctor/.test(n)) return t('docs.catLegal');
  if (/report|lab|scan|mri|hospital/.test(n)) return t('docs.catIncome');
  if (/insurance|disability|bank|passbook/.test(n)) return t('docs.catFinancial');
  return t('docs.catOther');
}

const getFileIcon = (type) => {
  switch (String(type || '').toLowerCase()) {
    case 'pdf': return <FileText size={24} className="md-file-icon pdf-icon" />;
    case 'jpeg':
    case 'jpg':
    case 'png': return <ImageIcon size={24} className="md-file-icon img-icon" />;
    default: return <FileText size={24} className="md-file-icon default-icon" />;
  }
};

const MyDocuments = () => {
  const { t, lang } = useI18n();
  const inputRef = useRef(null);
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    const meta = loadMeta();
    (async () => {
      const hydrated = [];
      for (const item of meta) {
        let objectUrl = null;
        try {
          const blob = await idbGet(item.id);
          if (blob) objectUrl = URL.createObjectURL(blob);
        } catch {
          /* ignore */
        }
        hydrated.push({ ...item, objectUrl });
      }
      if (!cancelled) setDocs(hydrated);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    saveMeta(docs);
  }, [docs]);

  const ingestFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setNotice('');
    for (const file of files) {
      const mime = file.type || '';
      const okType = ALLOWED.includes(mime) || /\.(pdf|png|jpe?g)$/i.test(file.name);
      if (!okType) {
        setNotice(t('docs.badType'));
        continue;
      }
      if (file.size > MAX_BYTES) {
        setNotice(t('docs.tooLarge'));
        continue;
      }
      const id = `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const type = extOf(file.name, mime);
      const objectUrl = URL.createObjectURL(file);
      const row = {
        id,
        name: file.name,
        type,
        sizeBytes: file.size,
        size: formatSize(file.size),
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        progress: 8,
        category: guessCategory(file.name, t),
        objectUrl,
      };
      setDocs((prev) => [row, ...prev]);
      idbPut(id, file).catch(() => {});

      const started = Date.now();
      const tick = () => {
        const elapsed = Date.now() - started;
        const next = Math.min(100, 8 + Math.round((elapsed / 700) * 92));
        setDocs((prev) => prev.map((d) => (
          d.id === id ? { ...d, progress: next, status: next >= 100 ? 'pending' : 'uploading' } : d
        )));
        if (next < 100) window.setTimeout(tick, 80);
      };
      window.setTimeout(tick, 80);
    }
  }, [t]);

  const removeDoc = async (id) => {
    const target = docs.find((d) => d.id === id);
    if (target?.objectUrl) URL.revokeObjectURL(target.objectUrl);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setActiveMenu(null);
    try { await idbDel(id); } catch { /* ignore */ }
  };

  const filteredDocs = docs.filter((doc) => {
    const matchesFilter = statusFilter === 'all' || doc.status === statusFilter
      || (statusFilter === 'pending' && doc.status === 'uploading');
    const q = searchQuery.toLowerCase();
    const hay = `${doc.name} ${doc.category}`.toLowerCase();
    return matchesFilter && (!q || hay.includes(q));
  });

  const metrics = useMemo(() => {
    const verified = docs.filter((d) => d.status === 'verified').length;
    const pending = docs.filter((d) => d.status === 'pending' || d.status === 'uploading').length;
    const action = docs.filter((d) => d.status === 'action_required').length;
    const bytes = docs.reduce((n, d) => n + (d.sizeBytes || 0), 0);
    return { verified, pending, action, storage: formatSize(bytes) };
  }, [docs]);

  const statusBadge = (doc) => {
    if (doc.status === 'verified') {
      return <span className="md-badge verified"><CheckCircle size={12} /> {t('docs.statusVerified')}</span>;
    }
    if (doc.status === 'uploading') {
      return <span className="md-badge pending"><Clock size={12} /> {t('docs.uploading', { n: doc.progress || 0 })}</span>;
    }
    if (doc.status === 'pending') {
      return <span className="md-badge pending"><Clock size={12} /> {t('docs.statusPending')}</span>;
    }
    if (doc.status === 'action_required') {
      return <span className="md-badge action-required"><AlertCircle size={12} /> {t('docs.statusAction')}</span>;
    }
    return null;
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    ingestFiles(e.dataTransfer.files);
  };

  return (
    <div className="md-page">
      <header className="ss-page-head" style={{ marginBottom: 8 }}>
        <p className="ss-kicker">Records</p>
        <h2>My Documents</h2>
        <p>Keep prescriptions, reports, and ID copies on this device for family and clinic visits.</p>
      </header>
      <div className="md-metrics-grid">
        <div className="md-metric-card">
          <div className="md-metric-icon-wrap primary"><FileCheck2 size={22} /></div>
          <div className="md-metric-info">
            <span className="md-metric-value">{metrics.verified}</span>
            <span className="md-metric-label">{t('docs.verified')}</span>
          </div>
        </div>
        <div className="md-metric-card">
          <div className="md-metric-icon-wrap warning"><Clock size={22} /></div>
          <div className="md-metric-info">
            <span className="md-metric-value">{metrics.pending}</span>
            <span className="md-metric-label">{t('docs.pending')}</span>
          </div>
        </div>
        <div className="md-metric-card">
          <div className="md-metric-icon-wrap danger"><FileWarning size={22} /></div>
          <div className="md-metric-info">
            <span className="md-metric-value">{metrics.action}</span>
            <span className="md-metric-label">{t('docs.actionRequired')}</span>
          </div>
        </div>
        <div className="md-metric-card">
          <div className="md-metric-icon-wrap neutral"><HardDrive size={22} /></div>
          <div className="md-metric-info">
            <span className="md-metric-value">{metrics.storage}</span>
            <span className="md-metric-label">{t('docs.storage')}</span>
          </div>
        </div>
      </div>

      <div className="md-main-layout">
        <div className="md-list-section">
          <div className="md-list-header">
            <h3>{t('docs.yourDocs')}</h3>
            <div className="md-toolbar">
              <div className="md-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={t('docs.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="md-filter-row" role="tablist">
            {['all', 'uploading', 'pending', 'verified'].map((key) => (
              <button
                key={key}
                type="button"
                className={`md-filter-chip ${statusFilter === key ? 'active' : ''}`}
                onClick={() => setStatusFilter(key)}
              >
                {t(`docs.filter${key.charAt(0).toUpperCase()}${key.slice(1)}`)}
              </button>
            ))}
          </div>

          <div className="md-doc-list">
            {filteredDocs.map((doc) => (
              <div className="md-doc-item" key={doc.id}>
                <div className="md-doc-icon">{getFileIcon(doc.type)}</div>
                <div className="md-doc-details">
                  <h4>{doc.name}</h4>
                  <div className="md-doc-meta">
                    <span>{doc.category}</span>
                    <span className="md-dot">•</span>
                    <span>{doc.size}</span>
                    <span className="md-dot">•</span>
                    <span>{t('docs.uploaded', { date: formatDate(doc.uploadDate, lang) })}</span>
                  </div>
                  {doc.status === 'uploading' && (
                    <div className="md-progress" aria-valuenow={doc.progress || 0} aria-valuemin={0} aria-valuemax={100}>
                      <div className="md-progress-bar" style={{ width: `${doc.progress || 0}%` }} />
                    </div>
                  )}
                  {doc.message && <div className="md-doc-error">{doc.message}</div>}
                </div>
                <div className="md-doc-status">{statusBadge(doc)}</div>
                <div className="md-doc-actions" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="md-icon-btn"
                    onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                    aria-label={t('docs.view')}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeMenu === doc.id && (
                    <div className="md-dropdown">
                      <button
                        type="button"
                        disabled={!doc.objectUrl}
                        onClick={() => { if (doc.objectUrl) window.open(doc.objectUrl, '_blank', 'noopener'); setActiveMenu(null); }}
                      >
                        <Eye size={14} /> {t('docs.view')}
                      </button>
                      <button
                        type="button"
                        disabled={!doc.objectUrl}
                        onClick={() => {
                          if (!doc.objectUrl) return;
                          const a = document.createElement('a');
                          a.href = doc.objectUrl;
                          a.download = doc.name;
                          a.click();
                          setActiveMenu(null);
                        }}
                      >
                        <Download size={14} /> {t('docs.download')}
                      </button>
                      <button type="button" className="delete" onClick={() => removeDoc(doc.id)}>
                        <Trash2 size={14} /> {t('docs.delete')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="md-empty">
                <p>{searchQuery ? t('docs.emptySearch', { q: searchQuery }) : t('docs.empty')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="md-side-section">
          <div className="md-upload-card">
            <h3>{t('docs.uploadTitle')}</h3>
            <p>{t('docs.uploadLead')}</p>
            {notice && <div className="md-doc-error md-upload-notice">{notice}</div>}

            <div
              className={`md-dropzone ${dragOver ? 'is-dragover' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                multiple
                hidden
                onChange={(e) => { ingestFiles(e.target.files); e.target.value = ''; }}
              />
              <div className="md-dropzone-icon">
                <UploadCloud size={32} />
              </div>
              <h4>{t('docs.drop')}</h4>
              <p>{t('docs.or')}</p>
              <button type="button" className="btn btn-primary" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                {t('docs.browse')}
              </button>
            </div>

            <div className="md-upload-tips">
              <h5>{t('docs.tipsTitle')}</h5>
              <ul>
                <li><CheckCircle size={14} /> {t('docs.tipAadhaar')}</li>
                <li><CheckCircle size={14} /> {t('docs.tipDeath')}</li>
                <li><CheckCircle size={14} /> {t('docs.tipIncome')}</li>
                <li><CheckCircle size={14} /> {t('docs.tipBank')}</li>
              </ul>
            </div>
          </div>

          <div className="md-security-card">
            <ShieldCheck size={20} className="md-security-icon" />
            <div>
              <h4>{t('docs.securityTitle')}</h4>
              <p>{t('docs.securityLead')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
