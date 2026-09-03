import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import LowriderCard from './LowriderCard';

/**
 * Modal Component
 * Modal imersivo no estilo Dark Cyber-Chicano com backdrop blur e atalho de fechar no ESC
 */
const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full ${maxWidth} z-10 my-8 animate-in fade-in zoom-in-95 duration-200`}>
        <LowriderCard
          glow
          title={title}
          subtitle={subtitle}
          action={
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          }
          className="shadow-2xl border-neutral-700 max-h-[90vh] flex flex-col"
        >
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] pr-1">
            {children}
          </div>
        </LowriderCard>
      </div>
    </div>
  );
};

export default Modal;
