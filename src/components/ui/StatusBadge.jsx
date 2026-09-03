import React from 'react';

/**
 * StatusBadge Component
 * Badge de status temático para TattOS
 */
const StatusBadge = ({ status, variant, className = '' }) => {
  const getVariantStyles = () => {
    if (variant) {
      switch (variant) {
        case 'success':
          return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
        case 'warning':
          return 'bg-amber-950/60 text-amber-300 border-amber-800/80 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
        case 'danger':
          return 'bg-red-950/60 text-red-300 border-cyber-red/80 shadow-[0_0_8px_rgba(138,3,3,0.3)]';
        case 'chrome':
          return 'bg-neutral-900 text-chrome border-chrome/40 shadow-[0_0_8px_rgba(192,192,192,0.15)]';
        case 'cyan':
          return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 shadow-[0_0_8px_rgba(6,182,212,0.15)]';
        default:
          return 'bg-neutral-900 text-neutral-300 border-neutral-700';
      }
    }

    const s = String(status).toLowerCase();
    if (s.includes('confirm') || s.includes('conclu') || s.includes('pago') || s.includes('seguro') || s.includes('assinad')) {
      return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
    }
    if (s.includes('pend') || s.includes('aten') || s.includes('prepar') || s.includes('aguard')) {
      return 'bg-amber-950/60 text-amber-300 border-amber-800/80 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
    }
    if (s.includes('crític') || s.includes('esgot') || s.includes('cancel') || s.includes('alerta') || s.includes('risco')) {
      return 'bg-red-950/60 text-red-300 border-cyber-red/80 shadow-[0_0_8px_rgba(138,3,3,0.3)]';
    }
    return 'bg-neutral-900 text-chrome border-chrome/40';
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-medium rounded border uppercase tracking-wider ${getVariantStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
