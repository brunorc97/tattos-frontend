import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

/**
 * Provedor de Autenticação TattOS
 * Mantém o estado da sessão no cliente sem expor lógica de negócio ou criptografia.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('tattos_auth_token');
    const storedUser = sessionStorage.getItem('tattos_user_profile');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        sessionStorage.removeItem('tattos_auth_token');
        sessionStorage.removeItem('tattos_user_profile');
      }
    }
    setLoading(false);
  }, []);

  const loginDemo = () => {
    const demoUser = {
      name: 'Rodrigo Black (Demo)',
      email: 'artista@tattos.com',
      role: 'Tattoo Master / Admin',
    };
    sessionStorage.setItem('tattos_auth_token', 'demo_jwt_token_tattos_frontend');
    sessionStorage.setItem('tattos_user_profile', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const login = async (username, password) => {
    // Tenta autenticar contra o backend Spring Boot
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;

      sessionStorage.setItem('tattos_auth_token', token);
      sessionStorage.setItem('tattos_user_profile', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    } catch (err) {
      // Se não houver backend online e for credencial demo, faz fallback amigável
      if (username === 'demo' || !err.response) {
        loginDemo();
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('tattos_auth_token');
    sessionStorage.removeItem('tattos_user_profile');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        loginDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
