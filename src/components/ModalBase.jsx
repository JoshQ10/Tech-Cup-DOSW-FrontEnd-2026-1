import { useEffect } from 'react';

export default function ModalBase({ title, onClose, children, className = '' }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
    >
      <div
        className={`w-full max-w-5xl rounded-xl shadow-2xl overflow-auto max-h-[92vh] ${className}`}
        style={{ background: '#000F20', border: '1px solid rgba(255, 255, 255, 0.12)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}
        >
          <h2 className="text-white text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            aria-label="Cerrar"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

