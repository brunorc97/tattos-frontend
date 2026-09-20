import React from 'react';

/**
 * LowriderCard Component
 * 
 * Componente base de superfície seguindo o Design System "Dark Cyber-Chicano".
 * Implementa Glassmorphism opaco (neutral-950/85 com backdrop-blur), bordas com acabamento
 * em prata metálica/cromo e geometria chanfrada inspirada nas curvas de Lowriders e arte Chicana.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo interno do card
 * @param {string} [props.title] - Título opcional exibido no cabeçalho do card
 * @param {string} [props.subtitle] - Descrição secundária ou categoria
 * @param {React.ReactNode} [props.action] - Elemento de ação complementar no cabeçalho
 * @param {boolean} [props.glow=false] - Ativa o brilho metálico externo (chrome-glow)
 * @param {string} [props.className] - Classes Tailwind adicionais
 */
const LowriderCard = ({
  children,
  title,
  subtitle,
  action,
  glow = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        relative group
        bg-neutral-950/85 backdrop-blur-md
        border border-neutral-800 hover:border-chrome/40
        transition-all duration-300 ease-out
        shadow-lowrider ${glow ? 'shadow-chrome-glow' : ''}
        rounded-sm overflow-hidden
        ${className}
      `}
      style={{
        clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
      }}
      {...props}
    >
      {/* Detalhes de Acabamento Cromado nos Cantos Chanfrados */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-chrome/60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-chrome/60 pointer-events-none" />

      {/* Linha de Destaque Superior Metálica (Pinstriping Chicano) */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-chrome/30 to-transparent pointer-events-none" />

      {/* Cabeçalho do Card (Renderizado caso exista título ou ação) */}
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/40">
          <div>
            {title && (
              <h3 className="text-sm font-bold tracking-wider text-neutral-100 uppercase font-title flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-chrome rounded-full shadow-[0_0_8px_#C0C0C0]" />
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-400 mt-0.5 tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Corpo do Conteúdo */}
      <div className="p-6 relative z-10 text-neutral-200">
        {children}
      </div>

      {/* Brilho Sutil no Efeito Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default LowriderCard;
