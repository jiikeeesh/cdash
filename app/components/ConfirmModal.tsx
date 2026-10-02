export function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmStyle = 'danger' }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmStyle?: 'danger' | 'brand' | 'warning';
}) {
  return (
    <div className="modal-backdrop" onClick={onCancel} style={{ zIndex: 9999 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn-close" onClick={onCancel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: 'var(--neutral-700)', lineHeight: 1.5 }}>{message}</p>
        </div>
        <div className="modal-footer" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className={`btn btn-${confirmStyle}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
