import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

/**
 * SmartAiAssistant Component
 * 
 * Implementa as diretrizes do Google People + AI Guidebook (PAIR):
 * 1. Explainability: Deixa claro por que a sugestão foi gerada
 * 2. User Agency: O usuário mantém controle total para aplicar ou descartar
 * 3. Feedback Loop: Permite confirmar ou rejeitar a assistência
 * 4. Ambient & Non-intrusive: Fica integrado harmoniosamente na interface
 */
const SmartAiAssistant = ({
  title = 'Assistente de Otimização TattOS AI',
  category = 'Sugestão Preditiva',
  reason,
  suggestion,
  actionLabel = 'Aplicar Sugestão',
  onApply,
  onDismiss,
  confidence = 94,
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [applied, setApplied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  if (dismissed) return null;

  const handleApply = () => {
    setApplied(true);
    if (onApply) onApply();
    setTimeout(() => {
      setDismissed(true);
    }, 1200);
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-sm
        bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950
        border border-chrome/40 hover:border-chrome/70
        shadow-[0_4px_20px_rgba(192,192,192,0.12)]
        transition-all duration-300 animate-fade-in-up
        ${className}
      `}
    >
      {/* Luz ambiente de IA sutil */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-chrome/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar / Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-900 border border-chrome/40 flex items-center justify-center text-chrome shadow-[0_0_8px_rgba(192,192,192,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              {title}
            </h4>
            <span className="text-[10px] text-neutral-500 font-mono">
              {category} • Confiança IA: <strong className="text-chrome">{confidence}%</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-neutral-400 hover:text-white transition-colors rounded"
            title={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      {expanded && (
        <div className="p-3.5 space-y-2.5 text-xs font-mono">
          {/* Explainability: Por que isso é sugerido */}
          {reason && (
            <div className="text-neutral-400 leading-relaxed text-[11px] bg-neutral-950/60 p-2.5 rounded border border-neutral-850">
              <span className="text-neutral-500 font-bold block uppercase text-[10px] mb-0.5">
                Por que estou sugerindo isso? (PAIR Explainability)
              </span>
              {reason}
            </div>
          )}

          {/* Sugestão Prática */}
          <div className="text-neutral-200 text-xs font-sans leading-relaxed">
            {suggestion}
          </div>

          {/* User Control & Feedback: Ações */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-800/60">
            <button
              onClick={handleDismiss}
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Dispensar sugestão
            </button>

            {onApply && (
              <button
                onClick={handleApply}
                disabled={applied}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider
                  transition-all duration-200 cursor-pointer
                  ${
                    applied
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-chrome/50 hover:border-chrome shadow-[0_0_10px_rgba(192,192,192,0.15)] active:scale-95'
                  }
                `}
              >
                {applied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Aplicado com Sucesso</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-chrome" />
                    <span>{actionLabel}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAiAssistant;
