import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileHeart, 
  Package, 
  BadgeDollarSign, 
  Users,
  Skull,
  LogOut 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Agenda', path: '/agenda', icon: CalendarDays },
  { name: 'Tatuadores', path: '/tatuadores', icon: Users },
  { name: 'Ficha Anamnese', path: '/anamnese', icon: FileHeart },
  { name: 'Estoque', path: '/estoque', icon: Package },
  { name: 'Financeiro', path: '/financeiro', icon: BadgeDollarSign },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-neutral-950/95 border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-lg">
      {/* Brand & Studio Identity */}
      <div>
        <div className="p-6 border-b border-neutral-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-neutral-900 border border-chrome/40 flex items-center justify-center shadow-chrome-glow">
            <Skull className="w-6 h-6 text-chrome" />
          </div>
          <div>
            <h1 className="font-title font-extrabold text-xl text-neutral-100 tracking-tight">
              TattOS
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
              Studio ERP v1.0
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200
                  ${
                    isActive
                      ? 'bg-neutral-900/90 text-white border-l-2 border-chrome shadow-inner-metallic'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-chrome">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-neutral-200 truncate">
                {user?.name || 'Artista TattOS'}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                {user?.role || 'Residente'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Encerrar Sessão"
            className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
