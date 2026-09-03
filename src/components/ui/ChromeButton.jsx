import React from 'react';

/**
 * ChromeButton Component
 * Botão com acabamento metálico, bordas chanfradas e brilho cromado
 */
const ChromeButton = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  className = '',
  ...props
}) => {
  const baseStyles = `
    relative px-5 py-2.5 font-medium text-xs tracking-wider uppercase
    transition-all duration-200 ease-in-out select-none active:scale-[0.98]
    flex items-center justify-center gap-2 cursor-pointer
  `;

  const variants = {
    primary: `
      bg-gradient-to-b from-neutral-800 to-neutral-950 text-chrome-light
      border border-chrome/50 hover:border-chrome hover:text-white
      hover:shadow-chrome-glow active:bg-neutral-900
    `,
    secondary: `
      bg-neutral-900/60 text-neutral-300 border border-neutral-800
      hover:border-neutral-600 hover:text-white
    `,
    danger: `
      bg-gradient-to-b from-cyber-red/30 to-neutral-950 text-red-200
      border border-cyber-red/60 hover:border-cyber-red hover:shadow-cyber-red-glow
    `,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      style={{
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      }}
      {...props}
    >
      {/* Detalhe Metálico Superior */}
      <span className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-chrome/40 to-transparent pointer-events-none" />
      {children}
    </button>
  );
};

export default ChromeButton;
