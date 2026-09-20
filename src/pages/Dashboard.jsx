import React from 'react';
import { useNavigate } from 'react-router-dom';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import SmartAiAssistant from '../components/ui/SmartAiAssistant';
import useToast from '../hooks/useToast';
import {
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Armchair,
  Activity,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

// Dados simulados para o gráfico com estilo de aerógrafo (Airbrush)
const monthlyPerformanceData = [
  { day: '01/Set', faturamento: 1800, despesas: 450 },
  { day: '05/Set', faturamento: 3200, despesas: 820 },
  { day: '10/Set', faturamento: 2900, despesas: 600 },
  { day: '15/Set', faturamento: 4600, despesas: 1100 },
  { day: '20/Set', faturamento: 3800, despesas: 950 },
  { day: '25/Set', faturamento: 5200, despesas: 1400 },
  { day: '30/Set', faturamento: 6100, despesas: 1200 },
];

const studioStations = [
  { id: 1, name: 'Bancada 01 — Custom & Blackletter', artist: 'Rodrigo Black', status: 'Em Sessão', client: 'Carlos Santana', finishIn: '1h 30m' },
  { id: 2, name: 'Bancada 02 — Microrealismo & Fine', artist: 'Luna Ink', status: 'Em Preparação', client: 'Mariana Duarte', finishIn: 'Iniciando' },
  { id: 3, name: 'Bancada 03 — Traditional & Lowrider', artist: 'Marcos Calavera', status: 'Disponível', client: '—', finishIn: 'Próx: 17:00' },
  { id: 4, name: 'Bancada 04 — Body Piercing & Mod', artist: 'Yasmin Shadow', status: 'Em Sessão', client: 'Lucas Prado', finishIn: '25m' },
];

const upcomingSessions = [
  { id: 1, time: '14:00', client: 'Carlos Santana', artist: 'Rodrigo Black', style: 'Chicano Lettering', depositPaid: true, status: 'Confirmado', station: 'Bancada 01' },
  { id: 2, time: '16:30', client: 'Mariana Duarte', artist: 'Luna Ink', style: 'Microrealismo Floral', depositPaid: true, status: 'Em Preparação', station: 'Bancada 02' },
  { id: 3, time: '18:00', client: 'Diego Martinez', artist: 'Rodrigo Black', style: 'Fechamento Lowrider (Braço)', depositPaid: true, status: 'Confirmado', station: 'Bancada 01' },
  { id: 4, time: '19:30', client: 'Beatriz Lima', artist: 'Marcos Calavera', style: 'Black & Grey Mask', depositPaid: false, status: 'Aguardando Sinal', station: 'Bancada 03' },
];

const criticalSupplies = [
  { name: 'Cartucho Kwadron 03RL', current: 4, min: 20, unit: 'unid.', status: 'Crítico' },
  { name: 'Tinta Dynamic Triple Black 240ml', current: 1, min: 3, unit: 'frascos', status: 'Esgotando' },
  { name: 'Luvas Nitrílicas Pretas Tam M', current: 18, min: 50, unit: 'pares', status: 'Atenção' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-950 border border-neutral-700 p-3 rounded shadow-2xl font-mono text-xs">
        <p className="text-neutral-400 font-bold mb-1">{label}</p>
        <p className="text-chrome flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-chrome inline-block"></span>
          Faturamento: R$ {payload[0]?.value?.toLocaleString('pt-BR')}
        </p>
        <p className="text-cyber-red flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-cyber-red inline-block"></span>
          Despesas: R$ {payload[1]?.value?.toLocaleString('pt-BR')}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner de Boas-Vindas Operacional */}
      <div className="relative overflow-hidden p-6 rounded-sm bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-lowrider">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono bg-neutral-800 border border-chrome/30 text-chrome rounded">
                The Hood • Central do Estúdio
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="font-title font-bold text-2xl sm:text-3xl text-neutral-100 tracking-tight">
              Estúdio Operando a Todo Vapor
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              3 bancadas em atividade simultânea. Controle rigoroso de biossegurança e fluxo financeiro em tempo real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ChromeButton onClick={() => navigate('/tatuadores')} variant="secondary">
              <Users className="w-4 h-4 text-chrome" />
              <span>Tatuadores</span>
            </ChromeButton>
            <ChromeButton onClick={() => navigate('/agenda')} variant="secondary">
              <Calendar className="w-4 h-4" />
              <span>Ver Grade</span>
            </ChromeButton>
            <ChromeButton onClick={() => navigate('/anamnese')}>
              <Users className="w-4 h-4" />
              <span>Nova Anamnese</span>
            </ChromeButton>
          </div>
        </div>
      </div>

      {/* Assistente IA PAIR - Pulso Operacional do Estúdio */}
      <SmartAiAssistant
        title="TattOS AI — Diagnóstico Preditivo de Estúdio"
        category="Google PAIR Ambient Intelligence"
        confidence={96}
        reason="A IA cruzou os agendamentos das 16:30 e 19:30 com o estoque de insumos e constatou que 2 fichas de anamnese ainda estão sem assinatura e o insumo Cartucho 03RL está abaixo do ponto de reposição."
        suggestion="Deseja despachar link de confirmação com anamnese via WhatsApp para Mariana Duarte e gerar ordem de reposição para 20 cartuchos Kwadron 03RL?"
        actionLabel="Otimizar Agora"
        onApply={() => {
          toast.ai('Lembrete de Anamnese enviado via WhatsApp e ordem de reposição do 03RL criada no Estoque!', 'Ação IA Executada');
        }}
      />

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <LowriderCard glow>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Sessões Hoje</span>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-chrome" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">8</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 6 com sinal pago
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Capacidade da cabine: 85% ocupada
          </div>
        </LowriderCard>

        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Fichas de Anamnese</span>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Users className="w-4 h-4 text-chrome" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">14</span>
            <span className="text-xs text-amber-400 font-mono">2 pendentes</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Assinaturas biométricas digitais válidas
          </div>
        </LowriderCard>

        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Receita Bruta (Mês)</span>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-cyber-gold" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">R$ 27.600</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Ticket médio por sessão: R$ 680
          </div>
        </LowriderCard>

        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Alertas de Estoque</span>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-cyber-red/50 flex items-center justify-center shadow-cyber-red-glow">
              <AlertTriangle className="w-4 h-4 text-cyber-red" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyber-red">3</span>
            <span className="text-xs text-red-300 font-mono">Reposição Urgente</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            Cartuchos 03RL abaixo da cota mínima
          </div>
        </LowriderCard>
      </div>

      {/* Airbrush Chart & Status das Bancadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Recharts com Estilo Aerógrafo */}
        <div className="lg:col-span-2">
          <LowriderCard
            title="Evolução Financeira — Estilo Aerografia"
            subtitle="Faturamento bruto vs. Custos operacionais (Setembro)"
            action={
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-chrome inline-block" />
                  Receita
                </span>
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyber-red inline-block" />
                  Despesas
                </span>
              </div>
            }
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    {/* Gradiente Aerógrafo Cromado para Receitas */}
                    <linearGradient id="airbrushChrome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C0C0C0" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#C0C0C0" stopOpacity={0.0}/>
                    </linearGradient>
                    {/* Gradiente Aerógrafo Carmesim para Despesas */}
                    <linearGradient id="airbrushRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A0303" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8A0303" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.6} />
                  <XAxis dataKey="day" stroke="#737373" tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#737373" tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="faturamento"
                    stroke="#C0C0C0"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#airbrushChrome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stroke="#8A0303"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#airbrushRed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </LowriderCard>
        </div>

        {/* Status das Bancadas de Tatuagem */}
        <div>
          <LowriderCard
            title="Bancadas do Estúdio"
            subtitle="Monitor de ocupação física"
            action={<Armchair className="w-4 h-4 text-chrome" />}
          >
            <div className="space-y-3">
              {studioStations.map((st) => (
                <div
                  key={st.id}
                  className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-sm hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-neutral-200">{st.name}</span>
                    <StatusBadge status={st.status} />
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono flex items-center justify-between">
                    <span>Artista: <strong className="text-neutral-300">{st.artist}</strong></span>
                    <span className="text-neutral-500">{st.finishIn}</span>
                  </div>
                  {st.client !== '—' && (
                    <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                      Cliente: {st.client}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </LowriderCard>
        </div>
      </div>

      {/* Sessões e Alertas Críticos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Sessões */}
        <div className="lg:col-span-2">
          <LowriderCard
            title="Próximas Sessões Agendadas"
            subtitle="Sincronizado com a agenda operacional do estúdio"
            action={
              <ChromeButton onClick={() => navigate('/agenda')} variant="secondary">
                Ver Agenda
              </ChromeButton>
            }
          >
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-neutral-900/50 border border-neutral-800 rounded-sm hover:border-neutral-700 transition-colors gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[50px] p-2 bg-neutral-950 border border-neutral-800 rounded">
                      <Clock className="w-3.5 h-3.5 mx-auto text-chrome mb-0.5" />
                      <span className="font-mono text-xs font-bold text-white block">{session.time}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-100 flex items-center gap-2">
                        {session.client}
                        {session.depositPaid && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950/70 border border-emerald-800 text-emerald-400 rounded">
                            Sinal Pago
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {session.style} • <span className="text-neutral-300">{session.artist}</span> ({session.station})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={session.status} />
                  </div>
                </div>
              ))}
            </div>
          </LowriderCard>
        </div>

        {/* Monitor Rápido de Suprimentos Críticos */}
        <div>
          <LowriderCard
            title="Estoque em Ruptura"
            subtitle="Itens com risco de parada"
            action={
              <ChromeButton onClick={() => navigate('/estoque')} variant="secondary">
                Acessar Estoque
              </ChromeButton>
            }
          >
            <div className="space-y-3">
              {criticalSupplies.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-sm hover:border-cyber-red/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-200">{item.name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mt-2">
                    <span>Disponível: <strong className="text-white">{item.current}</strong> {item.unit}</span>
                    <span>Mín: {item.min} {item.unit}</span>
                  </div>
                  {/* Barra de Nível */}
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full mt-2 overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-cyber-red transition-all duration-500 shadow-cyber-red-glow"
                      style={{ width: `${Math.min(100, (item.current / item.min) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <ChromeButton onClick={() => navigate('/estoque')} className="w-full">
                  <span>Solicitar Reposição de Insumos</span>
                  <ArrowUpRight className="w-4 h-4" />
                </ChromeButton>
              </div>
            </div>
          </LowriderCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
