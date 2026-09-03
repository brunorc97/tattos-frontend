import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook customizado para acesso ao contexto de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

export default useAuth;
