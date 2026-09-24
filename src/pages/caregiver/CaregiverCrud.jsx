import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pencil, Trash2, X, Check, Plus } from 'lucide-react';
import './CaregiverCrud.css';

/** Elderly-friendly confirm before remove. */
export function ConfirmRemove({ open, subject, onConfirm, onCancel }) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="cg-confirm-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="cg-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id={titleId}>Remove?</h3>
            <p>
              {subject
                ? `Remove “${subject}” from this list? You can add it again later.`
                : 'Remove this item from the list? You can add it again later.'}
            </p>
            <div className="cg-confirm-actions">
              <button type="button" className="cg-btn cg-btn-ghost" onClick={onCancel}>
                Keep it
              </button>
              <button type="button" className="cg-btn cg-btn-danger" onClick={onConfirm}>
                Yes, remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function RowActions({ onEdit, onRemove, editLabel = 'Edit', removeLabel = 'Remove' }) {
  return (
    <div className="cg-row-actions">
      {onEdit ? (
        <button type="button" className="cg-icon-btn" onClick={onEdit} aria-label={editLabel} title={editLabel}>
          <Pencil size={16} strokeWidth={2.2} />
        </button>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          className="cg-icon-btn cg-icon-btn-danger"
          onClick={onRemove}
          aria-label={removeLabel}
          title={removeLabel}
        >
          <Trash2 size={16} strokeWidth={2.2} />
        </button>
      ) : null}
    </div>
  );
}

export function AddButton({ onClick, label = 'Add' }) {
  return (
    <button type="button" className="cg-btn cg-btn-add" onClick={onClick}>
      <Plus size={16} strokeWidth={2.4} />
      {label}
    </button>
  );
}

export function CrudForm({ title, onSubmit, onCancel, children, submitLabel = 'Save' }) {
  return (
    <motion.form
      className="cg-crud-form"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {title ? <p className="cg-crud-form-title">{title}</p> : null}
      <div className="cg-crud-fields">{children}</div>
      <div className="cg-crud-form-actions">
        <button type="button" className="cg-btn cg-btn-ghost" onClick={onCancel}>
          <X size={15} /> Cancel
        </button>
        <button type="submit" className="cg-btn cg-btn-primary">
          <Check size={15} /> {submitLabel}
        </button>
      </div>
    </motion.form>
  );
}

export function Field({ label, children }) {
  return (
    <label className="cg-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

/** Hook: pending remove id + confirm helpers. */
export function useConfirmRemove() {
  const [pending, setPending] = useState(null);
  return {
    pending,
    askRemove: (id, subject) => setPending({ id, subject }),
    clear: () => setPending(null),
    Confirm: ({ onConfirm }) => (
      <ConfirmRemove
        open={!!pending}
        subject={pending?.subject}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending?.id != null) onConfirm(pending.id);
          setPending(null);
        }}
      />
    ),
  };
}
