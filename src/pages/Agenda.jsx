import React, { useState } from 'react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import useToast from '../hooks/useToast';
import useArtists from '../hooks/useArtists';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Armchair,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  DollarSign,
  Zap,
  RotateCcw
} from 'lucide-react';

const INITIAL_ARTISTS = [
  { id: 'all', name: 'Todos os Artistas' },
  { id: 'rodrigo', name: 'Rodrigo Black (Chicano / Lettering)' },
  { id: 'luna', name: 'Luna Ink (Microrealismo / Fine Line)' },
  { id: 'calavera', name: 'Marcos Calavera (Traditional & Oriental)' },
  { id: 'yasmin', name: 'Yasmin Shadow (Body Piercing)' },
];

const STATIONS = [
  'Bancada 01 — Custom & Blackletter',
  'Bancada 02 — Microrealismo & Fine',
  'Bancada 03 — Traditional & Lowrider',
  'Bancada 04 — Body Piercing & Mod',
];

const INITIAL_SESSIONS = [
  {
    id: 1,
    client: 'Carlos Santana',
    phone: '(11) 98765-4321',
    artist: 'Rodrigo Black',
    artistId: 'rodrigo',
    style: 'Chicano Lettering no Antebraço',
    date: '2026-09-03',
    startTime: '10:00',
    durationHours: 3, // 10:00 -> 13:00
    station: 'Bancada 01 — Custom & Blackletter',
    price: 1200,
    deposit: 300,
    status: 'Confirmado',
  },
  {
    id: 2,
    client: 'Mariana Duarte',
    phone: '(11) 97654-3210',
    artist: 'Luna Ink',
    artistId: 'luna',
    style: 'Floral Delicado Costela',
    date: '2026-09-03',
    startTime: '14:00',
    durationHours: 2.5, // 14:00 -> 16:30
    station: 'Bancada 02 — Microrealismo & Fine',
    price: 950,
    deposit: 250,
    status: 'Confirmado',
  },
  {
    id: 3,
    client: 'Diego Martinez',
    phone: '(11) 99123-8899',
    artist: 'Rodrigo Black',
    artistId: 'rodrigo',
    style: 'Lowrider Chevy Impala 64 no Braço',
    date: '2026-09-03',
    startTime: '14:30',
    durationHours: 4, // 14:30 -> 18:30
    station: 'Bancada 01 — Custom & Blackletter',
    price: 2200,
    deposit: 500,
    status: 'Confirmado',
  },
  {
    id: 4,
    client: 'Lucas Prado',
    phone: '(11) 98111-2233',
    artist: 'Yasmin Shadow',
    artistId: 'yasmin',
    style: 'Septo & Nostril em Titânio Grau Implante',
    date: '2026-09-03',
    startTime: '16:00',
    durationHours: 1, // 16:00 -> 17:00
    station: 'Bancada 04 — Body Piercing & Mod',
    price: 320,
    deposit: 100,
    status: 'Em Preparação',
  },
  {
    id: 5,
    client: 'Beatriz Lima',
    phone: '(11) 99988-7766',
    artist: 'Marcos Calavera',
    artistId: 'calavera',
    style: 'Máscara Hannya Chicana',
    date: '2026-09-03',
    startTime: '17:30',
    durationHours: 3.5, // 17:30 -> 21:00
    station: 'Bancada 03 — Traditional & Lowrider',
    price: 1800,
    deposit: 0,
    status: 'Aguardando Sinal',
  },
];

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const formatEndTime = (startTime, durationHours) => {
  const mins = timeToMinutes(startTime) + Number(durationHours) * 60;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const Agenda = () => {
  const { artists } = useArtists();
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-09-03');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);

  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    artistId: artists[0]?.id || 'art-1',
    style: '',
    date: '2026-09-03',
    startTime: '11:00',
    durationHours: 2,
    station: STATIONS[0],
    price: '',
    deposit: '',
  });

  // Checa choque de horários com cálculo de sugestão inteligente (Google PAIR)
  const checkConflicts = (testData) => {
    const startMins = timeToMinutes(testData.startTime);
    const endMins = startMins + Number(testData.durationHours) * 60;

    const artistObj = artists.find(
      (a) => a.id === testData.artistId || a.name.toLowerCase().includes(testData.artistId.toLowerCase())
    ) || INITIAL_ARTISTS.find((a) => a.id === testData.artistId);
    const artistName = artistObj ? artistObj.name.split(' (')[0] : '';

    for (const s of sessions) {
      if (s.date !== testData.date) continue;
      if (s.status === 'Cancelado') continue;

      const sStart = timeToMinutes(s.startTime);
      const sEnd = sStart + Number(s.durationHours) * 60;

      const hasTimeOverlap = Math.max(startMins, sStart) < Math.min(endMins, sEnd);

      if (!hasTimeOverlap) continue;

      // 1. Choque de Artista: calcular próximo horário livre
      if (s.artistId === testData.artistId) {
        const nextFreeTime = formatEndTime(s.startTime, s.durationHours);
        return {
          type: 'artist',
          message: `Choque de Horário! O artista ${artistName} já possui atendimento com "${s.client}" entre ${s.startTime} e ${formatEndTime(s.startTime, s.durationHours)}.`,
          suggestedTime: nextFreeTime,
          suggestionText: `Ajustar horário de início para ${nextFreeTime} (após a sessão de ${s.client})`,
          actionType: 'time',
        };
      }

      // 2. Conflito de Bancada: sugerir bancada alternativa livre
      if (s.station === testData.station) {
        const freeStation = STATIONS.find((st) => {
          return !sessions.some((other) => {
            if (other.date !== testData.date || other.status === 'Cancelado') return false;
            if (other.station !== st) return false;
            const oStart = timeToMinutes(other.startTime);
            const oEnd = oStart + Number(other.durationHours) * 60;
            return Math.max(startMins, oStart) < Math.min(endMins, oEnd);
          });
        });

        return {
          type: 'station',
          message: `Conflito de Bancada! A "${testData.station}" já está reservada para "${s.client}" entre ${s.startTime} e ${formatEndTime(s.startTime, s.durationHours)}.`,
          suggestedStation: freeStation || STATIONS[2],
          suggestionText: freeStation
            ? `Remanejar para a "${freeStation}" (que está totalmente livre)`
            : 'Mudar para outra cabine disponível',
          actionType: 'station',
        };
      }
    }

    return null;
  };

  const handleFormChange = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    // Validação em tempo real com sugestão inteligente
    const conflict = checkConflicts(nextData);
    setConflictData(conflict);
  };

  // Aplicação da sugestão inteligente da IA com 1 clique (User Agency)
  const applySmartResolution = () => {
    if (!conflictData) return;

    if (conflictData.actionType === 'time' && conflictData.suggestedTime) {
      const updated = { ...formData, startTime: conflictData.suggestedTime };
      setFormData(updated);
      setConflictData(checkConflicts(updated));
      toast.ai(`Horário recalculado para ${conflictData.suggestedTime}. Conflito resolvido!`);
    } else if (conflictData.actionType === 'station' && conflictData.suggestedStation) {
      const updated = { ...formData, station: conflictData.suggestedStation };
      setFormData(updated);
      setConflictData(checkConflicts(updated));
      toast.ai(`Bancada ajustada para "${conflictData.suggestedStation}". Conflito resolvido!`);
    }
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    const conflict = checkConflicts(formData);
    if (conflict) {
      toast.error(conflict.message, 'Conflito de Agenda');
      return;
    }

    const artistObj = artists.find((a) => a.id === formData.artistId) || INITIAL_ARTISTS.find((a) => a.id === formData.artistId);
    const newSession = {
      id: Date.now(),
      client: formData.client,
      phone: formData.phone,
      artist: artistObj ? artistObj.name.split(' (')[0] : 'Artista',
      artistId: formData.artistId,
      style: formData.style,
      date: formData.date,
      startTime: formData.startTime,
      durationHours: Number(formData.durationHours),
      station: formData.station,
      price: Number(formData.price) || 0,
      deposit: Number(formData.deposit) || 0,
      status: Number(formData.deposit) > 0 ? 'Confirmado' : 'Aguardando Sinal',
    };

    setSessions([newSession, ...sessions]);
    setIsModalOpen(false);
    toast.success(
      `Sessão com ${newSession.client} agendada para às ${newSession.startTime} com ${newSession.artist}!`,
      'Agendamento Confirmado'
    );

    setFormData({
      client: '',
      phone: '',
      artistId: artists[0]?.id || 'art-1',
      style: '',
      date: selectedDate,
      startTime: '11:00',
      durationHours: 2,
      station: STATIONS[0],
      price: '',
      deposit: '',
    });
    setConflictData(null);
  };

  const updateSessionStatus = (sessionId, newStatus) => {
    const session = sessions.find((s) => s.id === sessionId);
    setSessions(
      sessions.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
    );
    if (session) {
      toast.info(`Status da sessão de ${session.client} atualizado para "${newStatus}".`, 'Agenda Operacional');
    }
  };

  const selectedArtistObj = artists.find((a) => a.id === selectedArtist);

  const filteredSessions = sessions.filter((s) => {
    const matchArtist =
      selectedArtist === 'all' ||
      s.artistId === selectedArtist ||
      (selectedArtistObj && s.artist.toLowerCase() === selectedArtistObj.name.toLowerCase());
    const matchDate = s.date === selectedDate;
    return matchArtist && matchDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Barra de Controle de Agenda & Filtros Fluidos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-neutral-950/80 border border-neutral-800 rounded-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1.5 rounded-sm">
            <button
              onClick={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 1);
                setSelectedDate(prev.toISOString().split('T')[0]);
              }}
              className="p-1 hover:text-white text-neutral-400 rounded transition-colors focus-visible:ring-1 ring-chrome"
              title="Dia anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-white px-2 font-semibold select-none">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
              })}
            </span>
            <button
              onClick={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 1);
                setSelectedDate(next.toISOString().split('T')[0]);
              }}
              className="p-1 hover:text-white text-neutral-400 rounded transition-colors focus-visible:ring-1 ring-chrome"
              title="Próximo dia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Seletor de Data Direto */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-3 py-1.5 rounded-sm focus:outline-none focus:border-chrome transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro por Artista */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-3 py-1.5 rounded-sm focus:outline-none focus:border-chrome transition-colors"
            >
              <option value="all">Todos os Artistas</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.tag === 'residente' ? 'Residente' : 'Visitante'})
                </option>
              ))}
            </select>
          </div>

          <ChromeButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </ChromeButton>
        </div>
      </div>

      {/* Grade Operacional do Dia */}
      <LowriderCard
        title={`Grade de Sessões — ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { dateStyle: 'full' })}`}
        subtitle="Prevenção preditiva de colisões de cabine e conflitos de tatuador"
        action={
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>{filteredSessions.length} sessões registradas</span>
          </div>
        }
      >
        {filteredSessions.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 animate-fade-in-up">
            <CalendarIcon className="w-12 h-12 mx-auto text-neutral-700 mb-3" />
            <p className="font-mono text-sm text-neutral-400">
              Nenhuma sessão agendada para este filtro nesta data.
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              Clique em "Novo Agendamento" para reservar um horário.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const endTime = formatEndTime(session.startTime, session.durationHours);
              return (
                <div
                  key={session.id}
                  className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-sm hover:border-chrome/50 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-lowrider"
                >
                  <div className="flex items-start md:items-center gap-4">
                    {/* Time Badge */}
                    <div className="p-3 bg-neutral-950 border border-neutral-800 rounded text-center min-w-[90px] group-hover:border-chrome/40 transition-colors">
                      <div className="flex items-center justify-center gap-1 text-chrome mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs font-bold">{session.startTime}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 block">
                        até {endTime} ({session.durationHours}h)
                      </span>
                    </div>

                    {/* Client & Tattoo Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white tracking-wide">
                          {session.client}
                        </h4>
                        <span className="text-xs text-neutral-500 font-mono">
                          {session.phone}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 font-sans mt-0.5">
                        {session.style}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-neutral-400">
                        <span className="flex items-center gap-1 text-chrome">
                          <User className="w-3 h-3" /> {session.artist}
                        </span>
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Armchair className="w-3 h-3" /> {session.station}
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> R$ {session.price}
                          {session.deposit > 0 && ` (Sinal: R$ ${session.deposit})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <StatusBadge status={session.status} />

                    <select
                      value={session.status}
                      onChange={(e) => updateSessionStatus(session.id, e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 py-1.5 px-2.5 rounded focus:outline-none focus:border-chrome transition-colors cursor-pointer"
                    >
                      <option value="Confirmado">Confirmado</option>
                      <option value="Em Preparação">Em Preparação</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Aguardando Sinal">Aguardando Sinal</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </LowriderCard>

      {/* Modal: Novo Agendamento com Assistência Inteligente PAIR */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setConflictData(null);
        }}
        title="Novo Agendamento de Sessão"
        subtitle="Prevenção ativa de colisões com resolução inteligente de conflitos"
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4">
          {/* Card de Colisão & Sugestão com 1 Clique (Google PAIR) */}
          {conflictData && (
            <div className="p-3.5 bg-cyber-red/20 border border-cyber-red text-red-200 text-xs rounded-sm font-mono space-y-2.5 animate-fade-in-up">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block mb-0.5">Conflito Detectado pelo Sistema:</strong>
                  {conflictData.message}
                </div>
              </div>

              {/* Botão de Resolução Inteligente */}
              {conflictData.suggestionText && (
                <div className="pt-2 border-t border-cyber-red/40 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-red-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-chrome" />
                    Sugestão IA: {conflictData.suggestionText}
                  </span>
                  <button
                    type="button"
                    onClick={applySmartResolution}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white border border-chrome/60 hover:border-chrome rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_10px_rgba(192,192,192,0.2)]"
                  >
                    <Zap className="w-3.5 h-3.5 text-chrome" />
                    <span>Aplicar Resolução</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Nome do Cliente *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Carlos Santana"
                value={formData.client}
                onChange={(e) => handleFormChange('client', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                WhatsApp / Telefone *
              </label>
              <input
                type="tel"
                required
                placeholder="(11) 98765-4321"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Artista Responsável *
              </label>
              <select
                value={formData.artistId}
                onChange={(e) => handleFormChange('artistId', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              >
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.tag === 'residente' ? 'Residente' : 'Visitante / Guest'}) - {a.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Bancada / Cabine *
              </label>
              <select
                value={formData.station}
                onChange={(e) => handleFormChange('station', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              >
                {STATIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Estilo da Tatuagem & Descrição da Arte *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Chicano Lettering no antebraço, sombreado suave black & grey"
              value={formData.style}
              onChange={(e) => handleFormChange('style', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Horário de Início *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleFormChange('startTime', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Duração Estimada *
              </label>
              <select
                value={formData.durationHours}
                onChange={(e) => handleFormChange('durationHours', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              >
                <option value="1">1 hora</option>
                <option value="1.5">1h 30m</option>
                <option value="2">2 horas</option>
                <option value="2.5">2h 30m</option>
                <option value="3">3 horas</option>
                <option value="4">4 horas</option>
                <option value="5">5 horas</option>
                <option value="6">6 horas (Fechamento)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Valor Total (R$) *
              </label>
              <input
                type="number"
                required
                placeholder="1200"
                value={formData.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Valor do Sinal / Depósito (R$)
              </label>
              <input
                type="number"
                placeholder="300"
                value={formData.deposit}
                onChange={(e) => handleFormChange('deposit', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <ChromeButton type="submit" disabled={!!conflictData}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Agendamento</span>
            </ChromeButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Agenda;
