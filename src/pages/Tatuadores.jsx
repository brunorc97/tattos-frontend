import React, { useState } from 'react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import useToast from '../hooks/useToast';
import useArtists from '../hooks/useArtists';
import {
  Users,
  UserCheck,
  UserPlus,
  Plane,
  Home,
  Percent,
  Search,
  Instagram,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Armchair,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  LayoutGrid,
  List,
  AlertCircle
} from 'lucide-react';

const STATIONS = [
  'Bancada 01 — Custom & Blackletter',
  'Bancada 02 — Microrealismo & Fine',
  'Bancada 03 — Traditional & Lowrider',
  'Bancada 04 — Body Piercing & Mod',
];

const INITIAL_FORM_STATE = {
  name: '',
  tag: 'residente', // 'residente' | 'visitante'
  specialty: '',
  splitRate: 70,
  station: STATIONS[0],
  phone: '',
  instagram: '',
  email: '',
  status: 'Ativo',
  bio: '',
  originStudio: '',
  guestPeriodStart: '',
  guestPeriodEnd: '',
};

const Tatuadores = () => {
  const { artists, addArtist, updateArtist, deleteArtist } = useArtists();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Filtros & Visualização
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all'); // 'all' | 'residente' | 'visitante'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Estatísticas Rápidas
  const residentArtists = artists.filter((a) => a.tag === 'residente');
  const guestArtists = artists.filter((a) => a.tag === 'visitante');
  const avgSplitRate =
    artists.length > 0
      ? Math.round(artists.reduce((acc, curr) => acc + Number(curr.splitRate || 0), 0) / artists.length)
      : 0;

  // Filtragem dos Artistas
  const filteredArtists = artists.filter((artist) => {
    // Filtro por Tag (Residente vs Visitante)
    if (filterTag !== 'all' && artist.tag !== filterTag) {
      return false;
    }

    // Filtro de busca textual
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      artist.name.toLowerCase().includes(term) ||
      artist.specialty.toLowerCase().includes(term) ||
      (artist.instagram && artist.instagram.toLowerCase().includes(term)) ||
      (artist.originStudio && artist.originStudio.toLowerCase().includes(term))
    );
  });

  const handleOpenCreateModal = (preselectedTag = 'residente') => {
    setEditingArtistId(null);
    setFormData({
      ...INITIAL_FORM_STATE,
      tag: preselectedTag,
      splitRate: preselectedTag === 'residente' ? 70 : 60,
      status: preselectedTag === 'residente' ? 'Ativo' : 'Em Guest',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (artist) => {
    setEditingArtistId(artist.id);
    setFormData({
      name: artist.name || '',
      tag: artist.tag || 'residente',
      specialty: artist.specialty || '',
      splitRate: artist.splitRate || 70,
      station: artist.station || STATIONS[0],
      phone: artist.phone || '',
      instagram: artist.instagram || '',
      email: artist.email || '',
      status: artist.status || 'Ativo',
      bio: artist.bio || '',
      originStudio: artist.originStudio || '',
      guestPeriodStart: artist.guestPeriodStart || '',
      guestPeriodEnd: artist.guestPeriodEnd || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (artist) => {
    if (window.confirm(`Tem certeza que deseja remover o cadastro de "${artist.name}"?`)) {
      deleteArtist(artist.id);
      toast.warning(`Tatuador "${artist.name}" foi removido do estúdio.`, 'Cadastro Excluído');
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Informe o nome do tatuador.', 'Campo Obrigatório');
      return;
    }

    if (editingArtistId) {
      updateArtist(editingArtistId, formData);
      toast.success(
        `Cadastro do tatuador "${formData.name}" atualizado com sucesso!`,
        formData.tag === 'residente' ? 'Tatuador Residente' : 'Tatuador Visitante'
      );
    } else {
      addArtist(formData);
      toast.success(
        `Novo ${formData.tag === 'residente' ? 'Tatuador Residente' : 'Tatuador Visitante'} "${formData.name}" cadastrado!`,
        'Cadastro Realizado'
      );
    }

    setIsModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
    setEditingArtistId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner Principal com Identidade do Estúdio */}
      <div className="p-6 rounded-sm bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-lowrider flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-chrome px-2 py-0.5 bg-neutral-900 border border-chrome/30 rounded">
              Artistas & Residentes
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Quadro de Artistas e Guest Spots
            </span>
          </div>
          <h1 className="font-title font-bold text-2xl sm:text-3xl text-neutral-100 tracking-tight">
            Cadastro de Tatuadores & Artistas da Casa
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Gestão estruturada de tatuadores residentes e visitantes, percentuais de repasse, bancadas e temporadas de convidados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ChromeButton onClick={() => handleOpenCreateModal('visitante')} variant="secondary">
            <Plane className="w-4 h-4 text-cyber-gold" />
            <span>+ Novo Visitante (Guest)</span>
          </ChromeButton>
          <ChromeButton onClick={() => handleOpenCreateModal('residente')}>
            <UserPlus className="w-4 h-4" />
            <span>+ Novo Tatuador</span>
          </ChromeButton>
        </div>
      </div>

      {/* Cards de Métricas e Divisão do Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Cadastrados */}
        <LowriderCard glow>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Total Artistas</span>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Users className="w-4 h-4 text-chrome" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{artists.length}</span>
            <span className="text-xs text-neutral-400 font-mono">ativos no sistema</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            {residentArtists.length} residentes • {guestArtists.length} visitantes
          </div>
        </LowriderCard>

        {/* Tatuadores Residentes */}
        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tatuadores Residentes</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
              Fixos
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {residentArtists.length}
            </span>
            <span className="text-xs text-neutral-400 font-mono">artistas da casa</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Equipe permanente com bancadas atribuídas
          </div>
        </LowriderCard>

        {/* Tatuadores Visitantes (Guest Spots) */}
        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-cyber-gold" />
              <span>Tatuadores Visitantes</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 border border-amber-800/80 text-amber-300">
              Guest Spot
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyber-gold">
              {guestArtists.length}
            </span>
            <span className="text-xs text-neutral-400 font-mono">em temporada</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Intercâmbio com estúdios externos e internacionais
          </div>
        </LowriderCard>

        {/* Repasse Médio dos Artistas */}
        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Média de Repasse</span>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Percent className="w-4 h-4 text-chrome" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-chrome-light">{avgSplitRate}%</span>
            <span className="text-xs text-neutral-400 font-mono">comissão média</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Retenção média do estúdio: {100 - avgSplitRate}%
          </div>
        </LowriderCard>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-neutral-950/90 border border-neutral-800 rounded-sm">
        {/* Filtro por Tags (Residente / Visitante / Todos) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
              filterTag === 'all'
                ? 'bg-neutral-800 text-white border border-chrome/50 shadow-inner-metallic'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Todos ({artists.length})</span>
          </button>

          <button
            onClick={() => setFilterTag('residente')}
            className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
              filterTag === 'residente'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-emerald-300 border border-neutral-800'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tatuadores Residentes ({residentArtists.length})</span>
          </button>

          <button
            onClick={() => setFilterTag('visitante')}
            className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
              filterTag === 'visitante'
                ? 'bg-amber-950 text-amber-200 border border-cyber-gold shadow-[0_0_12px_rgba(197,160,89,0.3)]'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-amber-200 border border-neutral-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-cyber-gold" />
            <span>Tatuadores Visitantes ({guestArtists.length})</span>
          </button>
        </div>

        {/* Busca e Alternância de Visualização */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, estilo, estúdio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 pl-9 pr-3 py-1.5 rounded focus:outline-none focus:border-chrome"
            />
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
              }`}
              title="Visualização em Lista/Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Artistas ou Tabela */}
      {filteredArtists.length === 0 ? (
        <div className="p-16 text-center bg-neutral-950 border border-neutral-800 rounded-sm">
          <Users className="w-12 h-12 mx-auto text-neutral-700 mb-3" />
          <p className="font-mono text-sm text-neutral-400">
            Nenhum tatuador encontrado para os filtros selecionados.
          </p>
          <div className="mt-4">
            <ChromeButton onClick={() => handleOpenCreateModal('residente')}>
              <span>Cadastrar Novo Artista</span>
            </ChromeButton>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Visualização em Cartões */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => {
            const isResident = artist.tag === 'residente';
            return (
              <div
                key={artist.id}
                className={`group relative p-5 rounded-sm bg-neutral-950 border transition-all duration-200 flex flex-col justify-between hover:shadow-lowrider ${
                  isResident
                    ? 'border-neutral-800 hover:border-emerald-700/60'
                    : 'border-amber-900/40 hover:border-cyber-gold/70'
                }`}
              >
                {/* Linha de acento no topo do card */}
                <div
                  className={`absolute top-0 inset-x-0 h-1 rounded-t-sm ${
                    isResident ? 'bg-emerald-600' : 'bg-gradient-to-r from-cyber-gold via-amber-400 to-cyber-gold'
                  }`}
                />

                <div>
                  {/* Topo do Card: Avatar, Nome e Tag Obrigatória */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-sm flex items-center justify-center font-bold text-base font-mono border ${
                          isResident
                            ? 'bg-neutral-900 border-neutral-700 text-chrome shadow-inner'
                            : 'bg-amber-950/40 border-cyber-gold/50 text-cyber-gold shadow-[0_0_10px_rgba(197,160,89,0.2)]'
                        }`}
                      >
                        {artist.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-sm text-white group-hover:text-chrome transition-colors">
                          {artist.name}
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          {artist.specialty}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={artist.status} />
                  </div>

                  {/* TAG VISÍVEL OBRIGATÓRIA: Tatuador Residente vs Tatuador Visitante */}
                  <div className="mb-4">
                    {isResident ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-950/70 border border-emerald-600/90 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                        <Home className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✦ TATUADOR RESIDENTE</span>
                      </span>
                    ) : (
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-950/70 border border-cyber-gold text-amber-200 shadow-[0_0_10px_rgba(197,160,89,0.25)]">
                          <Plane className="w-3.5 h-3.5 text-cyber-gold animate-bounce" />
                          <span>✈ TATUADOR VISITANTE (GUEST)</span>
                        </span>

                        {/* Informações Específicas do Guest Spot */}
                        {(artist.originStudio || artist.guestPeriodStart) && (
                          <div className="p-2.5 bg-neutral-900/90 border border-amber-900/40 rounded text-[11px] font-mono space-y-1">
                            {artist.originStudio && (
                              <div className="flex items-center gap-1 text-amber-300">
                                <MapPin className="w-3 h-3 text-cyber-gold shrink-0" />
                                <span className="truncate">Origem: {artist.originStudio}</span>
                              </div>
                            )}
                            {artist.guestPeriodStart && (
                              <div className="flex items-center gap-1 text-neutral-400">
                                <Calendar className="w-3 h-3 text-neutral-500 shrink-0" />
                                <span>
                                  Temporada: {artist.guestPeriodStart} {artist.guestPeriodEnd ? `até ${artist.guestPeriodEnd}` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Informações Operacionais: Repasse e Bancada */}
                  <div className="p-3 bg-neutral-900/60 border border-neutral-850 rounded text-xs font-mono space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Comissão de Repasse:</span>
                      <strong className="text-emerald-400 font-bold">
                        {artist.splitRate}% Artista / {100 - artist.splitRate}% Estúdio
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Armchair className="w-3.5 h-3.5 text-neutral-500" />
                        Bancada:
                      </span>
                      <span className="text-neutral-300 text-[11px] truncate max-w-[160px]">
                        {artist.station || 'Não definida'}
                      </span>
                    </div>

                    {artist.totalSessions > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px]">
                        <span className="text-neutral-500">Histórico:</span>
                        <span className="text-neutral-300">
                          {artist.totalSessions} sessões atendidas
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Biografia / Observações */}
                  {artist.bio && (
                    <p className="text-xs text-neutral-400 italic mb-4 line-clamp-2">
                      "{artist.bio}"
                    </p>
                  )}
                </div>

                {/* Rodapé: Contato e Ações */}
                <div className="pt-3 border-t border-neutral-850 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    {artist.instagram && (
                      <a
                        href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                        title={artist.instagram}
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {artist.phone && (
                      <a
                        href={`https://wa.me/55${artist.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 border border-neutral-800 transition-colors"
                        title={artist.phone}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {artist.email && (
                      <a
                        href={`mailto:${artist.email}`}
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                        title={artist.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(artist)}
                      className="px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(artist)}
                      className="p-1.5 text-neutral-500 hover:text-cyber-red bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded transition-colors"
                      title="Excluir Artista"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização em Lista / Tabela Operacional */
        <LowriderCard
          title="Quadro Geral de Artistas"
          subtitle="Lista completa de tatuadores com tags e comissões"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase font-mono tracking-wider text-[11px]">
                  <th className="py-3 px-3">Tatuador / Especialidade</th>
                  <th className="py-3 px-3">Tag de Vínculo</th>
                  <th className="py-3 px-3">Origem / Temporada</th>
                  <th className="py-3 px-3">Comissão Artista</th>
                  <th className="py-3 px-3">Bancada</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredArtists.map((artist) => {
                  const isResident = artist.tag === 'residente';
                  return (
                    <tr key={artist.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{artist.name}</span>
                          {artist.instagram && (
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {artist.instagram}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400">{artist.specialty}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {isResident ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/60 border border-emerald-700/80 text-emerald-400">
                            <Home className="w-3 h-3 text-emerald-400" />
                            <span>Tatuador Residente</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/60 border border-cyber-gold text-amber-200">
                            <Plane className="w-3 h-3 text-cyber-gold" />
                            <span>Tatuador Visitante</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-300">
                        {isResident ? (
                          <span className="text-neutral-500">— Equipe Fixa —</span>
                        ) : (
                          <div>
                            <div>{artist.originStudio || 'Guest Spot'}</div>
                            {artist.guestPeriodStart && (
                              <div className="text-[10px] text-neutral-500">
                                {artist.guestPeriodStart} até {artist.guestPeriodEnd || '—'}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                        {artist.splitRate}%
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-400">
                        {artist.station || '—'}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={artist.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(artist)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(artist)}
                            className="p-1.5 text-neutral-500 hover:text-cyber-red rounded hover:bg-neutral-800 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </LowriderCard>
      )}

      {/* Modal de Cadastro / Edição com Seleção Explícita de TAG */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArtistId ? 'Editar Dados do Tatuador' : 'Cadastro de Novo Tatuador'}
        subtitle="Defina se o artista é residente permanente da casa ou visitante em temporada"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {/* SELEÇÃO DA TAG OBRIGATÓRIA (Tatuador Residente vs Tatuador Visitante) */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Tipo de Vínculo com o Estúdio (Tag Obrigatória) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    tag: 'residente',
                    splitRate: formData.splitRate || 70,
                    status: 'Ativo',
                  })
                }
                className={`p-3.5 rounded border text-left transition-all flex flex-col gap-1 ${
                  formData.tag === 'residente'
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Tatuador Residente</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Artista fixo da casa com bancada e agenda contínua.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    tag: 'visitante',
                    splitRate: formData.splitRate || 60,
                    status: 'Em Guest',
                  })
                }
                className={`p-3.5 rounded border text-left transition-all flex flex-col gap-1 ${
                  formData.tag === 'visitante'
                    ? 'bg-amber-950/60 border-cyber-gold text-amber-200 shadow-[0_0_12px_rgba(197,160,89,0.3)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <Plane className="w-4 h-4 text-cyber-gold" />
                  <span>Tatuador Visitante</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Guest spot temporário, workshop ou temporada limitada.
                </p>
              </button>
            </div>
          </div>

          {/* Campos Específicos para Visitante (Origem & Datas da Temporada) */}
          {formData.tag === 'visitante' && (
            <div className="p-3.5 bg-amber-950/20 border border-cyber-gold/50 rounded space-y-3 animate-fade-in-up">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyber-gold font-bold">
                <Plane className="w-3.5 h-3.5" />
                <span>Dados da Temporada de Guest Spot</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1">
                  Estúdio / Cidade de Origem
                </label>
                <input
                  type="text"
                  placeholder="ex: East LA Customs (Los Angeles, CA) ou Calaveras Tattoo (Curitiba)"
                  value={formData.originStudio}
                  onChange={(e) => setFormData({ ...formData, originStudio: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-cyber-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1">
                    Início da Temporada
                  </label>
                  <input
                    type="date"
                    value={formData.guestPeriodStart}
                    onChange={(e) => setFormData({ ...formData, guestPeriodStart: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2 rounded focus:outline-none focus:border-cyber-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1">
                    Término da Temporada
                  </label>
                  <input
                    type="date"
                    value={formData.guestPeriodEnd}
                    onChange={(e) => setFormData({ ...formData, guestPeriodEnd: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2 rounded focus:outline-none focus:border-cyber-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Nome e Especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Nome do Artista / Nome Artístico *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Rodrigo Black ou Sofia Martinez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Especialidade / Estilos *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Chicano Lettering, Fine Line, Blackwork"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>
          </div>

          {/* Contato: WhatsApp e Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                WhatsApp / Telefone
              </label>
              <input
                type="tel"
                placeholder="(11) 98765-4321"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Instagram (@perfil)
              </label>
              <input
                type="text"
                placeholder="@artista_ink"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>
          </div>

          {/* E-mail e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="artista@tattos.studio"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Status Operacional
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                <option value="Ativo">Ativo</option>
                <option value="Em Guest">Em Guest Spot</option>
                <option value="Convidado">Convidado / Agendado</option>
                <option value="Inativo">Inativo / Afastado</option>
              </select>
            </div>
          </div>

          {/* Regras Financeiras e Espaço Físico: Comissão & Bancada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Taxa de Repasse / Comissão do Artista (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  placeholder="ex: 70"
                  value={formData.splitRate}
                  onChange={(e) => setFormData({ ...formData, splitRate: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 pr-8 rounded focus:outline-none focus:border-chrome font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                  %
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono mt-1">
                Estúdio retém {100 - (Number(formData.splitRate) || 0)}% bruto
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Bancada Preferencial
              </label>
              <select
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                {STATIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Biografia / Observações */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Biografia / Observações do Artista
            </label>
            <textarea
              rows="2"
              placeholder="Histórico, premiações, biossegurança ou detalhes da estadia..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome resize-none"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <ChromeButton type="submit">
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingArtistId ? 'Salvar Alterações' : 'Cadastrar Artista'}</span>
            </ChromeButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tatuadores;
