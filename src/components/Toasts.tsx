import { useApp } from '../context/AppContext';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const toneIcon: Record<string, IconName> = { ok: 'check', info: 'message', warn: 'shield' };

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button key={toast.id} type="button" className={`toast toast--${toast.tone}`} onClick={() => dismissToast(toast.id)}>
          <Icon name={toneIcon[toast.tone] ?? 'check'} size={18} />
          <span>{toast.text}</span>
        </button>
      ))}
    </div>
  );
}
