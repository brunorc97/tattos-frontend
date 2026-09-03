import React from 'react';
import { Activity, ShieldCheck, Wifi } from 'lucide-react';

const Header = ({ title = 'Painel de Controle' }) => {
  return (
    <header className="h-16 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-base font-semibold text-neutral-100 uppercase tracking-wider font-sans">
          {title}
        </h2>
      </div>

      {/* Status da Conexão e Segurança do Sistema */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="hidden sm:inline">Spring Security 4 / JWT</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chrome opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-chrome"></span>
          </span>
          <span className="text-neutral-300">API: Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
