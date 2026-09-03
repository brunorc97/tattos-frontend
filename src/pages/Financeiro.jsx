import React, { useState } from 'react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import useToast from '../hooks/useToast';
import {
  BadgeDollarSign,
  TrendingUp,
  TrendingDown,
  Smile,
  Frown,
  Plus,
  Download,
  Wallet,
  PieChart as PieChartIcon,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  DollarSign,
  UserCheck
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
  { id: 'TRX-101', type: 'income', title: 'Sessão Fechamento de Braço', client: 'Diego Martinez', category: 'Sessão Tatuagem', artist: 'Rodrigo Black', amount: 2200, method: 'Pix', date: '2026-09-02' },
  { id: 'TRX-102', type: 'expense', title: 'Lote Cartuchos Kwadron 03RL e 07MG', client: '—', category: 'Insumos / Agulhas', artist: 'Geral Estúdio', amount: 680, method: 'Cartão Corporativo', date: '2026-09-02' },
  { id: 'TRX-103', type: 'income', title: 'Sessão Lettering Chicano', client: 'Carlos Santana', category: 'Sessão Tatuagem', artist: 'Rodrigo Black', amount: 1200, method: 'Cartão Crédito', date: '2026-09-01' },
  { id: 'TRX-104', type: 'income', title: 'Perfuração Piercing Duplo', client: 'Lucas Prado', category: 'Body Piercing', artist: 'Yasmin Shadow', amount: 320, method: 'Pix', date: '2026-09-01' },
  { id: 'TRX-105', type: 'expense', title: 'Manutenção Autoclave & Teste Biológico', client: '—', category: 'Biossegurança', artist: 'Geral Estúdio', amount: 450, method: 'Pix', date: '2026-08-31' },
  { id: 'TRX-106', type: 'income', title: 'Sessão Floral Microrealismo', client: 'Mariana Duarte', category: 'Sessão Tatuagem', artist: 'Luna Ink', amount: 950, method: 'Dinheiro', date: '2026-08-30' },
  { id: 'TRX-107', type: 'expense', title: 'Caixa de Luvas Nitrílicas & Papel Toalha', client: '—', category: 'Higiene & EPI', artist: 'Geral Estúdio', amount: 320, method: 'Cartão Débito', date: '2026-08-29' },
];

const ARTIST_COMMISSIONS = [
  { artist: 'Rodrigo Black', specialty: 'Chicano Lettering', gross: 14200, splitRate: 70, studioRetention: 4260, payout: 9940, status: 'Pago' },
  { artist: 'Luna Ink', specialty: 'Microrealismo', gross: 8900, splitRate: 65, studioRetention: 3115, payout: 5785, status: 'Pendente' },
  { artist: 'Marcos Calavera', specialty: 'Traditional / Lowrider', gross: 6400, splitRate: 60, studioRetention: 2560, payout: 3840, status: 'Pendente' },
  { artist: 'Yasmin Shadow', specialty: 'Piercing & Mod', gross: 3100, splitRate: 70, studioRetention: 930, payout: 2170, status: 'Pago' },
];

const WEEKLY_DATA = [
  { week: 'Semana 1', receitas: 6400, despesas: 1450 },
  { week: 'Semana 2', receitas: 8200, despesas: 2100 },
  { week: 'Semana 3', receitas: 7900, despesas: 1800 },
  { week: 'Semana 4', receitas: 10100, despesas: 2350 },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-950 border border-neutral-700 p-3 rounded shadow-2xl font-mono text-xs">
        <p className="text-white font-bold mb-1.5">{label}</p>
        <p className="text-chrome flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-chrome inline-block" />
          Smile Now (Entradas): R$ {payload[0]?.value?.toLocaleString('pt-BR')}
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
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Form State
  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    client: '',
    category: 'Sessão Tatuagem',
    artist: 'Rodrigo Black',
    amount: '',
    method: 'Pix',
    date: new Date().toISOString().split('T')[0],
  });

  // Totais
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const toast = useToast();

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    const newTx = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      type: formData.type,
      title: formData.title,
      client: formData.client || '—',
      category: formData.category,
      artist: formData.artist,
      amount: Number(formData.amount),
      method: formData.method,
      date: formData.date,
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    toast.success(
      `Lançamento "${newTx.title}" de R$ ${newTx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} registrado!`,
      newTx.type === 'income' ? 'Smile Now (Receita)' : 'Cry Later (Despesa)'
    );

    setFormData({
      type: 'income',
      title: '',
      client: '',
      category: 'Sessão Tatuagem',
      artist: 'Rodrigo Black',
      amount: '',
      method: 'Pix',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleExportReport = () => {
    const header = 'ID,Tipo,Titulo,Cliente,Categoria,Artista,Valor(R$),FormaPagamento,Data\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.type === 'income' ? 'Smile Now (Receita)' : 'Cry Later (Despesa)'}","${t.title}","${t.client}","${t.category}","${t.artist}",${t.amount},"${t.method}","${t.date}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TattOS_DRE_Financeiro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Demonstrativo de Resultados do Exercício (DRE) exportado em CSV.', 'Exportação Concluída');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'income') return t.type === 'income';
    if (filterType === 'expense') return t.type === 'expense';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner Conceitual: Smile Now, Cry Later */}
      <div className="p-6 rounded-sm bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-lowrider flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-chrome px-2 py-0.5 bg-neutral-900 border border-chrome/30 rounded">
              Gestão Financeira & Comissões
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              "Smile Now, Cry Later" Philosophy
            </span>
          </div>
          <h1 className="font-blackletter text-3xl text-neutral-100 tracking-wide">
            Controle de Caixa & Repasses do Estúdio
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Divisão automatizada de comissões, monitor de entradas de clientes e custos operacionais de bancada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ChromeButton onClick={handleExportReport} variant="secondary">
            <Download className="w-4 h-4" />
            <span>Exportar DRE (CSV)</span>
          </ChromeButton>
          <ChromeButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Novo Lançamento</span>
          </ChromeButton>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Smile Now: Faturamento Bruto */}
        <LowriderCard glow>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span>Smile Now (Receitas)</span>
            </span>
            <span className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-white">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-emerald-400 font-mono mt-1">
              Entradas de sessões e pagamentos de sinal
            </p>
          </div>
        </LowriderCard>

        {/* Cry Later: Despesas Operacionais */}
        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Frown className="w-4 h-4 text-cyber-red" />
              <span>Cry Later (Despesas)</span>
            </span>
            <span className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-cyber-red">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-cyber-red">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-red-400 font-mono mt-1">
              Cartuchos, EPIs, autoclave e custos fixos
            </p>
          </div>
        </LowriderCard>

        {/* Saldo Líquido do Estúdio */}
        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-cyber-gold" />
              <span>Lucro Operacional Líquido</span>
            </span>
            <span className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-cyber-gold">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-chrome-light">
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Margem operacional líquida: {totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </LowriderCard>
      </div>

      {/* Gráfico Comparativo Semanal & Divisão de Comissões */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras Dark Cyber */}
        <div className="lg:col-span-2">
          <LowriderCard
            title="Balanço Mensal: Entradas vs Saídas"
            subtitle="Confronto semanal no modelo Smile Now, Cry Later"
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
                    name="Smile Now (Entradas)"
                    fill="#C0C0C0"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="despesas"
                    name="Cry Later (Saídas)"
                    fill="#8A0303"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </LowriderCard>
        </div>

        {/* Repasses e Comissões dos Artistas */}
        <div>
          <LowriderCard
            title="Repasse de Comissões"
            subtitle="Cálculo líquido por tatuador"
            action={<UserCheck className="w-4 h-4 text-chrome" />}
          >
            <div className="space-y-3">
              {ARTIST_COMMISSIONS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-sm hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-neutral-100">{item.artist}</span>
                    <StatusBadge
                      status={item.status}
                      variant={item.status === 'Pago' ? 'success' : 'warning'}
                    />
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono flex justify-between">
                    <span>Bruto: R$ {item.gross.toLocaleString('pt-BR')}</span>
                    <span className="text-neutral-300">Taxa: {item.splitRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono mt-2 pt-2 border-t border-neutral-850">
                    <span className="text-neutral-500">Repasse Líquido:</span>
                    <strong className="text-emerald-400">R$ {item.payout.toLocaleString('pt-BR')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </LowriderCard>
        </div>
      </div>

      {/* Tabela de Lançamentos de Caixa */}
      <LowriderCard
        title="Fluxo de Caixa Operacional"
        subtitle="Extrato detalhado de transações do estúdio"
        action={
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-2.5 py-1 rounded focus:outline-none focus:border-chrome"
            >
              <option value="all">Todas as Transações</option>
              <option value="income">Apenas Smile Now (Entradas)</option>
              <option value="expense">Apenas Cry Later (Saídas)</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="py-3 px-3">ID / Data</th>
                <th className="py-3 px-3">Descrição / Cliente</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Artista / Vinculado</th>
                <th className="py-3 px-3">Forma Pagto</th>
                <th className="py-3 px-3 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-neutral-300">{tx.id}</div>
                    <div className="text-[10px] text-neutral-500">{tx.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-white flex items-center gap-1.5">
                      {tx.type === 'income' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-cyber-red shrink-0" />
                      )}
                      <span>{tx.title}</span>
                    </div>
                    {tx.client !== '—' && (
                      <div className="text-[11px] text-neutral-400">Cliente: {tx.client}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-neutral-300 font-mono">{tx.category}</td>
                  <td className="py-3 px-3 text-neutral-400 font-mono">{tx.artist}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-[11px] text-neutral-300">
                      {tx.method}
                    </span>
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-cyber-red'}`}>
                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LowriderCard>

      {/* Modal: Novo Lançamento de Caixa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lançamento Financeiro"
        subtitle="Registre entradas de clientes ou saídas operacionais de estúdio"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: 'Sessão Tatuagem' })}
              className={`p-3 rounded border font-mono text-xs flex items-center justify-center gap-2 transition-all ${
                formData.type === 'income'
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Smile Now (Receita)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: 'Insumos / Agulhas' })}
              className={`p-3 rounded border font-mono text-xs flex items-center justify-center gap-2 transition-all ${
                formData.type === 'expense'
                  ? 'bg-red-950/60 border-cyber-red text-red-300 shadow-cyber-red-glow'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Frown className="w-4 h-4" />
              <span>Cry Later (Despesa)</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Título / Descrição *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Pagamento Sessão Tatuagem Carlos ou Lote Agulhas RL"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Categoria *
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
                    <option value="Higiene & EPI">Higiene & EPIs</option>
                    <option value="Biossegurança">Biossegurança / Autoclave</option>
                    <option value="Aluguel & Contas Fixas">Aluguel & Contas Fixas</option>
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
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>
          </div>

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
                Artista Vinculado
              </label>
              <select
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                <option value="Geral Estúdio">Geral Estúdio (Sem comissão direta)</option>
                <option value="Rodrigo Black">Rodrigo Black</option>
                <option value="Luna Ink">Luna Ink</option>
                <option value="Marcos Calavera">Marcos Calavera</option>
                <option value="Yasmin Shadow">Yasmin Shadow</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <ChromeButton type="submit">
              <span>Registrar Lançamento</span>
            </ChromeButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Financeiro;
