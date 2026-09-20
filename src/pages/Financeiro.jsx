import React, { useState } from 'react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import useToast from '../hooks/useToast';
import useArtists from '../hooks/useArtists';
import {
  BadgeDollarSign,
  TrendingUp,
  TrendingDown,
  Smile,
  Frown,
  Plus,
  Download,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  DollarSign,
  UserCheck,
  Search,
  Receipt,
  Layers,
  Building,
  Home,
  Plane,
  CreditCard,
  Calendar,
  CheckCircle2,
  PieChart as PieChartIcon,
  Tag
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

const INITIAL_TRANSACTIONS = [
  {
    id: 'REC-101',
    type: 'income',
    title: 'Sessão Fechamento de Braço',
    client: 'Diego Martinez',
    category: 'Sessão Tatuagem',
    artist: 'Rodrigo Black',
    amount: 2200,
    method: 'Pix',
    date: '2026-09-02',
    notes: '2ª sessão - sombreamento chicano'
  },
  {
    id: 'DES-102',
    type: 'expense',
    title: 'Lote Cartuchos Kwadron 03RL e 07MG',
    client: '—',
    supplier: 'Kwadron Brasil Supply',
    category: 'Insumos / Agulhas',
    artist: 'Geral Estúdio',
    amount: 680,
    method: 'Cartão Corporativo',
    date: '2026-09-02',
    notes: 'Nota Fiscal NF-88120'
  },
  {
    id: 'REC-103',
    type: 'income',
    title: 'Sessão Lettering Chicano',
    client: 'Carlos Santana',
    category: 'Sessão Tatuagem',
    artist: 'Rodrigo Black',
    amount: 1200,
    method: 'Cartão Crédito',
    date: '2026-09-01',
    notes: 'Frase "Perdóname Madre" antebraço'
  },
  {
    id: 'REC-104',
    type: 'income',
    title: 'Perfuração Piercing Duplo Cartilagem',
    client: 'Lucas Prado',
    category: 'Body Piercing',
    artist: 'Yasmin Shadow',
    amount: 320,
    method: 'Pix',
    date: '2026-09-01',
    notes: 'Joalheria em Titânio ASTM F-136'
  },
  {
    id: 'DES-105',
    type: 'expense',
    title: 'Manutenção Preventiva Autoclave Cristófoli',
    client: '—',
    supplier: 'Cristófoli Biossegurança Técnica',
    category: 'Biossegurança',
    artist: 'Geral Estúdio',
    amount: 450,
    method: 'Pix',
    date: '2026-08-31',
    notes: 'Troca de vedação e teste com esporos biológicos'
  },
  {
    id: 'REC-106',
    type: 'income',
    title: 'Sessão Floral Microrealismo',
    client: 'Mariana Duarte',
    category: 'Sessão Tatuagem',
    artist: 'Luna Ink',
    amount: 950,
    method: 'Dinheiro',
    date: '2026-08-30',
    notes: 'Ramos botânicos na costela'
  },
  {
    id: 'REC-107',
    type: 'income',
    title: 'Sessão Realismo Mexicano (Guest Spot)',
    client: 'Rafael Mendes',
    category: 'Sessão Tatuagem',
    artist: 'Diego "El Flaco" Ortiz',
    amount: 2800,
    method: 'Pix',
    date: '2026-09-12',
    notes: 'Sessão especial de guest spot internacional'
  },
  {
    id: 'DES-108',
    type: 'expense',
    title: 'Caixa de Luvas Nitrílicas & Rolo Papel Filme',
    client: '—',
    supplier: 'MedSupply Hospitalar',
    category: 'Higiene & EPI',
    artist: 'Geral Estúdio',
    amount: 320,
    method: 'Cartão Débito',
    date: '2026-08-29',
    notes: '5 caixas Tam M + 3 rolos de filme protetor'
  },
  {
    id: 'DES-109',
    type: 'expense',
    title: 'Frascos Dynamic Triple Black 240ml (x2)',
    client: '—',
    supplier: 'Art Tattoo Supply Distribuidora',
    category: 'Tintas & Pigmentos',
    artist: 'Geral Estúdio',
    amount: 360,
    method: 'Pix',
    date: '2026-08-28',
    notes: 'Pigmentos pretos para bancadas 01 e 03'
  },
  {
    id: 'DES-110',
    type: 'expense',
    title: 'Aluguel do Salão & Condomínio Studio',
    client: '—',
    supplier: 'Imobiliária Santa Cecília',
    category: 'Aluguel & Contas Fixas',
    artist: 'Geral Estúdio',
    amount: 3200,
    method: 'Pix',
    date: '2026-09-05',
    notes: 'Competência Setembro/2026'
  },
  {
    id: 'REC-111',
    type: 'income',
    title: 'Sinal de Agendamento Flash Day',
    client: 'Beatriz Lima',
    category: 'Sinal de Agendamento',
    artist: 'Marcos Calavera',
    amount: 300,
    method: 'Pix',
    date: '2026-09-03',
    notes: 'Reserva para máscara Hannya tradicional'
  },
];

const WEEKLY_DATA = [
  { week: 'Semana 1', receitas: 6400, despesas: 1450 },
  { week: 'Semana 2', receitas: 8200, despesas: 2100 },
  { week: 'Semana 3', receitas: 7900, despesas: 1800 },
  { week: 'Semana 4', receitas: 10100, despesas: 3200 },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-950 border border-neutral-700 p-3 rounded shadow-2xl font-mono text-xs">
        <p className="text-white font-bold mb-1.5">{label}</p>
        <p className="text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          Smile Now (Receitas): R$ {payload[0]?.value?.toLocaleString('pt-BR')}
        </p>
        <p className="text-cyber-red flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-cyber-red inline-block" />
          Cry Later (Despesas): R$ {payload[1]?.value?.toLocaleString('pt-BR')}
        </p>
      </div>
    );
  }
  return null;
};

const Financeiro = () => {
  const { artists } = useArtists();
  const toast = useToast();

  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'incomes' | 'expenses'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtros internos
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterArtist, setFilterArtist] = useState('all');

  // Form State do Lançamento
  const [formData, setFormData] = useState({
    type: 'income', // 'income' | 'expense'
    title: '',
    client: '',
    supplier: '',
    category: 'Sessão Tatuagem',
    artist: 'Rodrigo Black',
    amount: '',
    method: 'Pix',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Totais & Métricas Gerais
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const avgIncomeTicket = incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
  const avgExpenseTicket = expenseTransactions.length > 0 ? totalExpense / expenseTransactions.length : 0;

  // Repasses calculados dinamicamente com base nos tatuadores cadastrados no sistema
  const dynamicArtistCommissions = artists.map((art) => {
    // Busca transações de receita deste artista
    const artistIncomes = incomeTransactions.filter(
      (tx) => tx.artist.toLowerCase() === art.name.toLowerCase()
    );
    const grossGenerated = artistIncomes.reduce((acc, curr) => acc + curr.amount, 0);
    const rate = Number(art.splitRate) || 60;
    const payout = (grossGenerated * rate) / 100;
    const studioRetention = grossGenerated - payout;

    return {
      id: art.id,
      name: art.name,
      tag: art.tag, // 'residente' | 'visitante'
      specialty: art.specialty,
      gross: grossGenerated > 0 ? grossGenerated : (art.grossGenerated > 0 ? art.grossGenerated : 4500),
      splitRate: rate,
      payout: grossGenerated > 0 ? payout : ((art.grossGenerated || 4500) * rate) / 100,
      studioRetention: grossGenerated > 0 ? studioRetention : ((art.grossGenerated || 4500) * (100 - rate)) / 100,
      status: grossGenerated > 0 ? 'Pendente' : 'Pago',
    };
  });

  const handleOpenCreateModal = (type = 'income') => {
    setFormData({
      type,
      title: '',
      client: '',
      supplier: '',
      category: type === 'income' ? 'Sessão Tatuagem' : 'Insumos / Agulhas',
      artist: artists[0]?.name || 'Geral Estúdio',
      amount: '',
      method: 'Pix',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleCreateTransaction = (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Informe um valor financeiro válido maior que zero.', 'Valor Inválido');
      return;
    }

    const prefix = formData.type === 'income' ? 'REC' : 'DES';
    const newTx = {
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      type: formData.type,
      title: formData.title,
      client: formData.type === 'income' ? (formData.client || 'Cliente Avulso') : '—',
      supplier: formData.type === 'expense' ? (formData.supplier || 'Fornecedor Diversos') : '—',
      category: formData.category,
      artist: formData.artist,
      amount: Number(formData.amount),
      method: formData.method,
      date: formData.date,
      notes: formData.notes || '',
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);

    if (newTx.type === 'income') {
      toast.success(
        `Receita "${newTx.title}" de R$ ${newTx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} computada no caixa!`,
        'Smile Now (Receita)'
      );
    } else {
      toast.warning(
        `Despesa "${newTx.title}" de R$ ${newTx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} liquidada!`,
        'Cry Later (Despesa)'
      );
    }
  };

  const handleExportReport = () => {
    const header = 'ID,Natureza,Titulo,Cliente,Fornecedor,Categoria,Artista,Valor(R$),FormaPagamento,Data,Observacoes\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.type === 'income' ? 'RECEITA (Entrada)' : 'DESPESA (Saída)'}","${t.title}","${t.client || '—'}","${t.supplier || '—'}","${t.category}","${t.artist}",${t.amount},"${t.method}","${t.date}","${t.notes || ''}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TattOS_Financeiro_DRE_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Demonstrativo Financeiro (Receitas & Despesas) exportado em CSV.', 'DRE Gerado');
  };

  // Filtragem dos lançamentos de acordo com a aba ativa e filtros selecionados
  const getFilteredTransactions = () => {
    let list = transactions;

    if (activeTab === 'incomes') {
      list = incomeTransactions;
    } else if (activeTab === 'expenses') {
      list = expenseTransactions;
    }

    if (filterCategory !== 'all') {
      list = list.filter((t) => t.category === filterCategory);
    }

    if (filterMethod !== 'all') {
      list = list.filter((t) => t.method === filterMethod);
    }

    if (filterArtist !== 'all') {
      list = list.filter((t) => t.artist === filterArtist);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.client && t.client.toLowerCase().includes(term)) ||
          (t.supplier && t.supplier.toLowerCase().includes(term)) ||
          t.category.toLowerCase().includes(term) ||
          t.artist.toLowerCase().includes(term)
      );
    }

    return list;
  };

  const displayedTransactions = getFilteredTransactions();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner Principal com Identidade do Estúdio */}
      <div className="p-6 rounded-sm bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-lowrider flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-chrome px-2 py-0.5 bg-neutral-900 border border-chrome/30 rounded">
              Módulo Financeiro & Fluxo de Caixa
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              "Smile Now, Cry Later" Philosophy
            </span>
          </div>
          <h1 className="font-title font-bold text-2xl sm:text-3xl text-neutral-100 tracking-tight">
            Controle de Receitas, Despesas & Comissões
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Controle isolado e transparente de entradas de clientes, custos operacionais de bancada e repasses de tatuadores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ChromeButton onClick={handleExportReport} variant="secondary">
            <Download className="w-4 h-4" />
            <span>Exportar DRE (CSV)</span>
          </ChromeButton>

          {/* Botões de Ação Rápida Diretos e Claros */}
          <button
            onClick={() => handleOpenCreateModal('expense')}
            className="px-3.5 py-2 rounded text-xs font-mono font-bold uppercase transition-all bg-red-950/70 hover:bg-red-900/90 text-red-200 border border-cyber-red flex items-center gap-1.5 shadow-cyber-red-glow"
          >
            <Frown className="w-4 h-4 text-cyber-red" />
            <span>+ Nova Despesa</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal('income')}
            className="px-3.5 py-2 rounded text-xs font-mono font-bold uppercase transition-all bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-600 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          >
            <Smile className="w-4 h-4 text-emerald-400" />
            <span>+ Nova Receita</span>
          </button>
        </div>
      </div>

      {/* SEPARADORES DE MÉTRICAS: Receitas vs Despesas vs Saldo Líquido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel Smile Now: Receitas */}
        <div
          onClick={() => setActiveTab('incomes')}
          className={`cursor-pointer transition-all duration-200 rounded-sm p-5 border ${
            activeTab === 'incomes'
              ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-neutral-950/90 border-neutral-800 hover:border-emerald-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 flex items-center gap-1.5 font-bold">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span>Receitas (Smile Now)</span>
            </span>
            <span className="p-1.5 bg-emerald-950/60 border border-emerald-800 rounded text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mt-2 pt-2 border-t border-neutral-850">
              <span>{incomeTransactions.length} entradas</span>
              <span>Ticket médio: R$ {avgIncomeTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Painel Cry Later: Despesas */}
        <div
          onClick={() => setActiveTab('expenses')}
          className={`cursor-pointer transition-all duration-200 rounded-sm p-5 border ${
            activeTab === 'expenses'
              ? 'bg-red-950/30 border-cyber-red shadow-cyber-red-glow'
              : 'bg-neutral-950/90 border-neutral-800 hover:border-red-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-red-400 flex items-center gap-1.5 font-bold">
              <Frown className="w-4 h-4 text-cyber-red" />
              <span>Despesas (Cry Later)</span>
            </span>
            <span className="p-1.5 bg-red-950/60 border border-red-800 rounded text-cyber-red">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-cyber-red">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mt-2 pt-2 border-t border-neutral-850">
              <span>{expenseTransactions.length} saídas</span>
              <span>Custo médio: R$ {avgExpenseTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Saldo Líquido Operacional */}
        <div
          onClick={() => setActiveTab('overview')}
          className={`cursor-pointer transition-all duration-200 rounded-sm p-5 border ${
            activeTab === 'overview'
              ? 'bg-neutral-900 border-chrome/80 shadow-chrome-glow'
              : 'bg-neutral-950/90 border-neutral-800 hover:border-chrome/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-300 flex items-center gap-1.5 font-bold">
              <Wallet className="w-4 h-4 text-cyber-gold" />
              <span>Saldo Líquido em Caixa</span>
            </span>
            <span className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-cyber-gold">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-white">
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mt-2 pt-2 border-t border-neutral-850">
              <span>Margem Operacional:</span>
              <strong className="text-emerald-400">
                {totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* SELETOR DE NAVEGAÇÃO / ABAS DE SEPARAÇÃO RIGOROSA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-neutral-950 border border-neutral-800 rounded-sm">
        {/* Abas Principais de Separação de Receitas e Despesas */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('overview');
              setFilterCategory('all');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-neutral-800 text-white border border-chrome/60 shadow-inner-metallic'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Visão Consolidada</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('incomes');
              setFilterCategory('all');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-2 ${
              activeTab === 'incomes'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-neutral-400 hover:text-emerald-300 hover:bg-neutral-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>Livro de Receitas ({incomeTransactions.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('expenses');
              setFilterCategory('all');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-2 ${
              activeTab === 'expenses'
                ? 'bg-red-950 text-red-200 border border-cyber-red shadow-cyber-red-glow'
                : 'text-neutral-400 hover:text-red-300 hover:bg-neutral-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-cyber-red" />
            <span>Livro de Despesas ({expenseTransactions.length})</span>
          </button>
        </div>

        {/* Indicador de Filtro Ativo */}
        <div className="text-[11px] font-mono text-neutral-400 hidden lg:block pr-3">
          {activeTab === 'incomes' && (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Exibindo exclusivamente entradas operacionais de clientes e serviços
            </span>
          )}
          {activeTab === 'expenses' && (
            <span className="text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
              Exibindo exclusivamente custos operacionais, insumos e contas fixas
            </span>
          )}
          {activeTab === 'overview' && (
            <span className="text-neutral-400">
              Visão simultânea de entradas e saídas no modelo Smile Now, Cry Later
            </span>
          )}
        </div>
      </div>

      {/* ABA 1: VISÃO CONSOLIDADA COM GRÁFICO E REPASSE DE TATUADORES */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico Comparativo Semanal */}
            <div className="lg:col-span-2">
              <LowriderCard
                title="Balanço Mensal: Entradas vs Saídas"
                subtitle="Confronto semanal no modelo Smile Now (Receitas) vs Cry Later (Despesas)"
              >
                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.6} />
                      <XAxis dataKey="week" stroke="#737373" tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }} />
                      <YAxis stroke="#737373" tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }} />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }}
                      />
                      <Bar
                        dataKey="receitas"
                        name="Smile Now (Receitas)"
                        fill="#10B981"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="despesas"
                        name="Cry Later (Despesas)"
                        fill="#8A0303"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </LowriderCard>
            </div>

            {/* Repasses e Comissões dos Artistas (Com TAG de Residente / Visitante) */}
            <div>
              <LowriderCard
                title="Repasse de Comissões"
                subtitle="Cálculo líquido por tatuador do estúdio"
                action={<UserCheck className="w-4 h-4 text-chrome" />}
              >
                <div className="space-y-3">
                  {dynamicArtistCommissions.slice(0, 4).map((art) => {
                    const isResident = art.tag === 'residente';
                    return (
                      <div
                        key={art.id}
                        className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-sm hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-neutral-100">{art.name}</span>
                            {/* TAG DO TATUADOR */}
                            {isResident ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-400 flex items-center gap-0.5">
                                <Home className="w-2.5 h-2.5" />
                                Residente
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/70 border border-cyber-gold text-amber-300 flex items-center gap-0.5">
                                <Plane className="w-2.5 h-2.5" />
                                Visitante
                              </span>
                            )}
                          </div>
                          <StatusBadge
                            status={art.status}
                            variant={art.status === 'Pago' ? 'success' : 'warning'}
                          />
                        </div>

                        <div className="text-[11px] text-neutral-400 font-mono flex justify-between">
                          <span>Bruto: R$ {art.gross.toLocaleString('pt-BR')}</span>
                          <span className="text-neutral-300">Taxa: {art.splitRate}%</span>
                        </div>

                        <div className="flex justify-between items-center text-xs font-mono mt-2 pt-2 border-t border-neutral-850">
                          <span className="text-neutral-500">Repasse Líquido:</span>
                          <strong className="text-emerald-400">
                            R$ {art.payout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </LowriderCard>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: LIVRO DE RECEITAS EXCLUSIVO (SMILE NOW) */}
      {activeTab === 'incomes' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Cartões Rápidos do Livro de Receitas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-950 border border-emerald-900/50 rounded-sm">
              <span className="text-xs font-mono uppercase text-neutral-400">Total Faturado</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-1">100% de entradas do período</p>
            </div>

            <div className="p-4 bg-neutral-950 border border-emerald-900/50 rounded-sm">
              <span className="text-xs font-mono uppercase text-neutral-400">Ticket Médio por Sessão</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                R$ {avgIncomeTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">Baseado em {incomeTransactions.length} atendimentos</p>
            </div>

            <div className="p-4 bg-neutral-950 border border-emerald-900/50 rounded-sm">
              <span className="text-xs font-mono uppercase text-neutral-400">Principal Categoria</span>
              <div className="text-2xl font-bold font-mono text-chrome mt-1">
                Sessões Tatuagem
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-1">Maior gerador de receita do estúdio</p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: LIVRO DE DESPESAS EXCLUSIVO (CRY LATER) */}
      {activeTab === 'expenses' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Cartões Rápidos do Livro de Despesas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-950 border border-red-900/50 rounded-sm">
              <span className="text-xs font-mono uppercase text-neutral-400">Total Despesas Pagas</span>
              <div className="text-2xl font-bold font-mono text-cyber-red mt-1">
                R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-1">Total de saídas operacionais</p>
            </div>

            <div className="p-4 bg-neutral-950 border border-red-900/50 rounded-sm">
              <span className="text-xs font-mono uppercase text-neutral-400">Custo Médio por Lançamento</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                R$ {avgExpenseTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-red-400 font-mono mt-1">Em {expenseTransactions.length} pagamentos realizados</p>
            </div>

            <div className="p-4 bg-neutral-950 border border-red-900/50 rounded-sm">
              <span className="text-xs font-mono uppercase text-neutral-400">Maior Centro de Custo</span>
              <div className="text-2xl font-bold font-mono text-chrome mt-1">
                Aluguel & Fixos
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-1">Insumos e materiais em 2º lugar</p>
            </div>
          </div>
        </div>
      )}

      {/* TABELA DE LANÇAMENTOS COM FILTROS E IDENTIFICAÇÃO VISUAL CLARA */}
      <LowriderCard
        title={
          activeTab === 'incomes'
            ? 'Livro de Receitas — Smile Now (Entradas Detalhadas)'
            : activeTab === 'expenses'
            ? 'Livro de Despesas — Cry Later (Saídas Detalhadas)'
            : 'Extrato Consolidado do Fluxo de Caixa'
        }
        subtitle={
          activeTab === 'incomes'
            ? 'Registro detalhado de atendimentos de tatuagem, piercings e depósitos de sinal'
            : activeTab === 'expenses'
            ? 'Registro discriminado de fornecedores, insumos, biossegurança e custos fixos'
            : 'Confronto entre receitas e despesas registradas no caixa'
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            {/* Campo de Busca Rápida */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar lançamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 pl-8 pr-2.5 py-1 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            {/* Filtro por Forma de Pagamento */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-2.5 py-1 rounded focus:outline-none focus:border-chrome"
            >
              <option value="all">Todas as Formas de Pagamento</option>
              <option value="Pix">Pix Instantâneo</option>
              <option value="Cartão Crédito">Cartão de Crédito</option>
              <option value="Cartão Débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro Espécie</option>
              <option value="Cartão Corporativo">Cartão Corporativo</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="py-3 px-3">Natureza</th>
                <th className="py-3 px-3">ID / Data</th>
                <th className="py-3 px-3">
                  {activeTab === 'expenses'
                    ? 'Descrição / Fornecedor'
                    : activeTab === 'incomes'
                    ? 'Descrição / Cliente'
                    : 'Descrição / Favorecido'}
                </th>
                <th className="py-3 px-3">Categoria / Centro de Custo</th>
                <th className="py-3 px-3">
                  {activeTab === 'expenses' ? 'Responsável' : 'Artista Vinculado'}
                </th>
                <th className="py-3 px-3">Forma Pagto</th>
                <th className="py-3 px-3 text-right">Valor Líquido (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-neutral-500 font-mono">
                    Nenhum lançamento encontrado para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  // Identifica se o artista da transação é visitante
                  const artistObj = artists.find(
                    (a) => a.name.toLowerCase() === tx.artist.toLowerCase()
                  );
                  const isGuestArtist = artistObj?.tag === 'visitante';

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-neutral-900/40 transition-colors ${
                        isIncome ? 'hover:border-l-2 hover:border-emerald-500' : 'hover:border-l-2 hover:border-cyber-red'
                      }`}
                    >
                      {/* Natureza Visual: RECEITA vs DESPESA */}
                      <td className="py-3 px-3 font-mono">
                        {isIncome ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/70 border border-emerald-600 text-emerald-400">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                            <span>Receita</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950/70 border border-cyber-red text-red-300">
                            <ArrowUpRight className="w-3 h-3 text-cyber-red" />
                            <span>Despesa</span>
                          </span>
                        )}
                      </td>

                      {/* ID e Data */}
                      <td className="py-3 px-3 font-mono">
                        <div className="font-bold text-neutral-300">{tx.id}</div>
                        <div className="text-[10px] text-neutral-500">{tx.date}</div>
                      </td>

                      {/* Descrição e Cliente / Fornecedor */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-white">{tx.title}</div>
                        {isIncome && tx.client && tx.client !== '—' && (
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <span className="text-neutral-500">Cliente:</span> {tx.client}
                          </div>
                        )}
                        {!isIncome && tx.supplier && tx.supplier !== '—' && (
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <span className="text-neutral-500">Fornecedor:</span> {tx.supplier}
                          </div>
                        )}
                        {tx.notes && (
                          <div className="text-[10px] text-neutral-500 italic mt-0.5">
                            {tx.notes}
                          </div>
                        )}
                      </td>

                      {/* Categoria */}
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      {/* Artista Vinculado com Tag */}
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-300">{tx.artist}</span>
                          {isGuestArtist && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/60 border border-cyber-gold text-amber-300 font-mono">
                              Guest
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Forma de Pagamento */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-[11px] text-neutral-400">
                          {tx.method}
                        </span>
                      </td>

                      {/* Valor Formatado e Colorido */}
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold text-sm ${
                          isIncome ? 'text-emerald-400' : 'text-cyber-red'
                        }`}
                      >
                        {isIncome ? '+' : '-'} R${' '}
                        {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </LowriderCard>

      {/* MODAL UNIVERSAL PARA NOVO LANÇAMENTO (SEPARAÇÃO CLARA RECEITA X DESPESA) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.type === 'income' ? 'Registrar Nova Receita' : 'Registrar Nova Despesa'}
        subtitle="Separação estrita entre entradas de clientes e custos operacionais do estúdio"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          {/* SELETOR PRINCIPAL DE NATUREZA (RECEITA vs DESPESA) */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Tipo de Operação Financeira *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'income',
                    category: 'Sessão Tatuagem',
                  })
                }
                className={`p-3.5 rounded border font-mono text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  <span>Smile Now (Receita / Entrada)</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-sans">
                  Sessões, sinais de agenda, piercing e flash
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'expense',
                    category: 'Insumos / Agulhas',
                  })
                }
                className={`p-3.5 rounded border font-mono text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                  formData.type === 'expense'
                    ? 'bg-red-950/70 border-cyber-red text-red-200 shadow-cyber-red-glow'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <Frown className="w-4 h-4 text-cyber-red" />
                  <span>Cry Later (Despesa / Saída)</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-sans">
                  Agulhas, tintas, EPIs, autoclave e contas fixas
                </span>
              </button>
            </div>
          </div>

          {/* Título / Descrição */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Título / Descrição *
            </label>
            <input
              type="text"
              required
              placeholder={
                formData.type === 'income'
                  ? 'ex: Sessão Fechamento de Braço ou Sinal de Reserva Flash'
                  : 'ex: Compra Caixa Cartuchos 03RL ou Conta de Luz do Estúdio'
              }
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
            />
          </div>

          {/* Cliente (para Receita) ou Fornecedor (para Despesa) */}
          {formData.type === 'income' ? (
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                placeholder="ex: Carlos Santana ou Mariana Duarte"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Fornecedor / Favorecido
              </label>
              <input
                type="text"
                placeholder="ex: Kwadron Brasil, Art Tattoo Supply, Imobiliária Santa Cecília"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-cyber-red"
              />
            </div>
          )}

          {/* Categoria e Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Categoria / Centro de Custo *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                {formData.type === 'income' ? (
                  <>
                    <option value="Sessão Tatuagem">Sessão Tatuagem</option>
                    <option value="Sinal de Agendamento">Sinal de Agendamento</option>
                    <option value="Body Piercing">Body Piercing</option>
                    <option value="Venda Pomada / Pós-Care">Venda Pomada / Pós-Care</option>
                    <option value="Venda Flash Tattoo">Venda Flash Tattoo</option>
                  </>
                ) : (
                  <>
                    <option value="Insumos / Agulhas">Insumos / Agulhas & Cartuchos</option>
                    <option value="Tintas & Pigmentos">Tintas & Pigmentos</option>
                    <option value="Higiene & EPI">Higiene & EPIs (Luvas, Plásticos)</option>
                    <option value="Biossegurança">Biossegurança / Autoclave</option>
                    <option value="Aluguel & Contas Fixas">Aluguel & Contas Fixas</option>
                    <option value="Manutenção & Reformas">Manutenção & Reformas</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="ex: 1200.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome font-mono font-bold"
              />
            </div>
          </div>

          {/* Forma de Pagamento e Artista Vinculado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Forma de Pagamento *
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                <option value="Pix">Pix Instantâneo</option>
                <option value="Cartão Crédito">Cartão de Crédito</option>
                <option value="Cartão Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro Espécie</option>
                <option value="Cartão Corporativo">Cartão Corporativo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                {formData.type === 'income' ? 'Artista Vinculado *' : 'Responsável / Solicitante'}
              </label>
              <select
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                <option value="Geral Estúdio">Geral Estúdio (Sem comissão direta)</option>
                {artists.map((art) => (
                  <option key={art.id} value={art.name}>
                    {art.name} ({art.tag === 'residente' ? 'Residente' : 'Visitante / Guest'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observações / NF */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Observações / Comprovante / Número da Nota
            </label>
            <input
              type="text"
              placeholder="ex: NF-99120 ou Pagamento adiantado com 10% desconto"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2 rounded focus:outline-none focus:border-chrome"
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
              <span>
                {formData.type === 'income' ? 'Registrar Receita' : 'Registrar Despesa'}
              </span>
            </ChromeButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Financeiro;
