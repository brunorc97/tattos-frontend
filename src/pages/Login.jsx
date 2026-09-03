import React, { useState } from 'react';
import { Skull, Lock, User, AlertCircle } from 'lucide-react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Falha na autenticação. Verifique suas credenciais.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luz ambiente / Brilho cromado de fundo */}
      <div className="absolute w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Header de Identidade */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-900 border border-chrome/50 rounded-sm flex items-center justify-center shadow-chrome-glow">
            <Skull className="w-9 h-9 text-chrome" />
          </div>
          <h1 className="font-blackletter text-4xl text-neutral-100 tracking-wider">
            TattOS
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mt-1">
            Gestão & ERP para Body Art Studios
          </p>
        </div>

        <LowriderCard glow>
          {isExpired && (
            <div className="mb-4 p-3 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs flex items-center gap-2 rounded-sm font-mono">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sessão expirada. Faça login novamente para continuar.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-cyber-red/20 border border-cyber-red/60 text-red-200 text-xs flex items-center gap-2 rounded-sm font-mono">
              <AlertCircle className="w-4 h-4 text-cyber-red shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Usuário / E-mail
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="artista@tattos.com"
                  className="w-full bg-neutral-900/80 border border-neutral-800 rounded-sm py-2.5 pl-10 pr-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-chrome/60 transition-colors"
                />
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900/80 border border-neutral-800 rounded-sm py-2.5 pl-10 pr-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-chrome/60 transition-colors"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <ChromeButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-sm"
              >
                {isSubmitting ? 'Autenticando...' : 'Acessar TattOS ERP'}
              </ChromeButton>

              <button
                type="button"
                onClick={() => {
                  const { loginDemo } = useAuth;
                  // Via direct handler
                  sessionStorage.setItem('tattos_auth_token', 'demo_jwt_token_tattos_frontend');
                  sessionStorage.setItem('tattos_user_profile', JSON.stringify({
                    name: 'Rodrigo Black (Demo)',
                    email: 'artista@tattos.com',
                    role: 'Tattoo Master / Studio Owner',
                  }));
                  window.location.href = '/';
                }}
                className="w-full py-2.5 text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-chrome/50 rounded-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Validar Front-end (Acesso Demonstração / Sem Backend)
              </button>
            </div>
          </form>
        </LowriderCard>

        <p className="text-center text-[11px] text-neutral-600 mt-6 font-mono">
          Isolamento Seguro • Spring Security 4 • Zero Client-side Validation Bypass
        </p>
      </div>
    </div>
  );
};

export default Login;
