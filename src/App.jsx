import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ArtistsProvider } from './context/ArtistsContext';
import useAuth from './hooks/useAuth';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Tatuadores from './pages/Tatuadores';
import FichaAnamnese from './pages/FichaAnamnese';
import Estoque from './pages/Estoque';
import Financeiro from './pages/Financeiro';
import Login from './pages/Login';

const ProtectedLayout = ({ children, title }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-neutral-400 font-mono text-xs">
        Carregando TattOS ERP...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-neutral-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ArtistsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedLayout title="Painel de Controle">
                    <Dashboard />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/agenda"
                element={
                  <ProtectedLayout title="Agenda de Sessões">
                    <Agenda />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/tatuadores"
                element={
                  <ProtectedLayout title="Cadastro de Tatuadores">
                    <Tatuadores />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/anamnese"
                element={
                  <ProtectedLayout title="Fichas de Anamnese">
                    <FichaAnamnese />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/estoque"
                element={
                  <ProtectedLayout title="Controle de Estoque">
                    <Estoque />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/financeiro"
                element={
                  <ProtectedLayout title="Fluxo de Caixa & Finanças">
                    <Financeiro />
                  </ProtectedLayout>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ArtistsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
