import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Custom Hook para disparar notificações fluidas
 * inspiradas no Google Material 3 e Google PAIR Guidebook
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
