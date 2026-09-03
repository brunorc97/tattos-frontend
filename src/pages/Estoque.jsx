import React, { useState } from 'react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import useToast from '../hooks/useToast';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  Filter,
  Minus,
  Barcode,
  Layers,
  Sparkles,
  ShieldAlert,
  CalendarClock
} from 'lucide-react';

const INITIAL_ITEMS = [
  {
    id: 'EST-01',
    name: 'Cartucho Kwadron 03RL (Round Liner)',
    category: 'Agulhas & Cartuchos',
    brand: 'Kwadron',
    quantity: 4,
    minQuantity: 20,
    unit: 'unid.',
    batch: 'KW-9921',
    expiry: '2028-12-31',
    costPerUnit: 9.5,
  },
  {
    id: 'EST-02',
    name: 'Cartucho Kwadron 07MG (Magnum)',
    category: 'Agulhas & Cartuchos',
    brand: 'Kwadron',
    quantity: 24,
    minQuantity: 20,
    unit: 'unid.',
    batch: 'KW-8834',
    expiry: '2028-10-15',
    costPerUnit: 10.2,
  },
  {
    id: 'EST-03',
    name: 'Tinta Dynamic Triple Black 240ml',
    category: 'Tintas & Pigmentos',
    brand: 'Dynamic Color Co.',
    quantity: 1,
    minQuantity: 3,
    unit: 'frascos',
    batch: 'DYN-2025-X',
    expiry: '2027-04-01',
    costPerUnit: 180.0,
  },
  {
    id: 'EST-04',
    name: 'Tinta Electric Ink Easy Glow Carmim 30ml',
    category: 'Tintas & Pigmentos',
    brand: 'Electric Ink',
    quantity: 5,
    minQuantity: 2,
    unit: 'frascos',
    batch: 'EI-7761',
    expiry: '2027-09-10',
    costPerUnit: 65.0,
  },
  {
    id: 'EST-05',
    name: 'Luvas Nitrílicas Pretas - Tamanho M (Caixa c/ 100)',
    category: 'Biossegurança & EPI',
    brand: 'Unigloves',
    quantity: 2,
    minQuantity: 6,
    unit: 'caixas',
    batch: 'UG-2026-M',
    expiry: '2029-01-30',
    costPerUnit: 52.0,
  },
  {
    id: 'EST-06',
    name: 'Biqueiras Descartáveis com Grip 25mm 05RL',
    category: 'Descartáveis & Biqueiras',
    brand: 'Cheyenne Safe',
    quantity: 45,
    minQuantity: 30,
    unit: 'unid.',
    batch: 'CH-3321',
    expiry: '2028-08-12',
    costPerUnit: 4.8,
  },
  {
    id: 'EST-07',
    name: 'Filme Protetor Dermal (Second Skin) Rolo 15cm x 10m',
    category: 'Cuidados Pós-Tattoo',
    brand: 'Dermalize Pro',
    quantity: 6,
    minQuantity: 4,
    unit: 'rolos',
    batch: 'DP-9901',
    expiry: '2028-03-20',
    costPerUnit: 140.0,
  },
  {
    id: 'EST-08',
    name: 'Envelopes Grau Cirúrgico para Autoclave 9x26cm',
    category: 'Biossegurança & EPI',
    brand: 'Stericlin',
    quantity: 120,
    minQuantity: 80,
    unit: 'unid.',
    batch: 'ST-5542',
    expiry: '2030-05-01',
    costPerUnit: 0.9,
  },
];

const CATEGORIES = [
  'Todas as Categorias',
  'Agulhas & Cartuchos',
  'Tintas & Pigmentos',
  'Biossegurança & EPI',
  'Descartáveis & Biqueiras',
  'Cuidados Pós-Tattoo',
];

const Estoque = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Agulhas & Cartuchos',
    brand: '',
    quantity: '',
    minQuantity: '',
    unit: 'unid.',
    batch: '',
    expiry: '',
    costPerUnit: '',
  });

  const getItemStatus = (current, min) => {
    const ratio = current / min;
    if (ratio <= 0.3) return { label: 'Crítico / Ruptura', variant: 'danger' };
    if (ratio <= 0.8) return { label: 'Atenção / Repor', variant: 'warning' };
    return { label: 'Nível Seguro', variant: 'success' };
  };

  const criticalCount = items.filter((i) => i.quantity / i.minQuantity <= 0.3).length;
  const warningCount = items.filter((i) => {
    const r = i.quantity / i.minQuantity;
    return r > 0.3 && r <= 0.8;
  }).length;

  const handleUpdateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = Math.max(0, item.quantity + delta);
          const ratio = next / item.minQuantity;
          if (delta < 0 && ratio <= 0.3) {
            toast.warning(`Atenção: "${item.name}" atingiu nível crítico (${next} ${item.unit} restantes)!`, 'Alerta de Ruptura');
          } else if (delta > 0) {
            toast.success(`+1 ${item.unit} adicionado para "${item.name}". Total: ${next}`, 'Entrada de Insumo');
          } else {
            toast.info(`Baixa registrada: "${item.name}" agora com ${next} ${item.unit}.`, 'Baixa de Insumo');
          }
          return { ...item, quantity: next };
        }
        return item;
      })
    );
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: `EST-${String(items.length + 1).padStart(2, '0')}`,
      name: formData.name,
      category: formData.category,
      brand: formData.brand || 'Genérico',
      quantity: Number(formData.quantity) || 0,
      minQuantity: Number(formData.minQuantity) || 1,
      unit: formData.unit,
      batch: formData.batch || `LOTE-${Date.now().toString().slice(-4)}`,
      expiry: formData.expiry || '2028-12-31',
      costPerUnit: Number(formData.costPerUnit) || 0,
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    toast.success(`Insumo "${newItem.name}" cadastrado com sucesso!`, 'Estoque Cadastrado');
    setFormData({
      name: '',
      category: 'Agulhas & Cartuchos',
      brand: '',
      quantity: '',
      minQuantity: '',
      unit: 'unid.',
      batch: '',
      expiry: '',
      costPerUnit: '',
    });
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.batch.toLowerCase().includes(search.toLowerCase());

    const matchCat =
      selectedCategory === 'Todas as Categorias' || item.category === selectedCategory;

    const matchCrit = !onlyCritical || item.quantity / item.minQuantity <= 0.8;

    return matchSearch && matchCat && matchCrit;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Ações */}
      <div className="p-6 rounded-sm bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-lowrider flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-chrome px-2 py-0.5 bg-neutral-900 border border-chrome/30 rounded">
              Controle de Insumos & Biossegurança
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Monitor de Ruptura em Tempo Real
            </span>
          </div>
          <h1 className="font-blackletter text-3xl text-neutral-100 tracking-wide">
            Estoque de Agulhas, Tintas e Descartáveis
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Rastreamento de lotes esterilizados e datas de validade para prevenção de paralisação nas bancadas.
          </p>
        </div>

        <ChromeButton onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Insumo</span>
        </ChromeButton>
      </div>

      {/* Métricas Rápidas de Alerta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <LowriderCard
          glow={criticalCount > 0}
          className={criticalCount > 0 ? 'border-cyber-red/50' : ''}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyber-red" />
              <span>Estoque Crítico / Ruptura</span>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyber-red/20 text-red-200 border border-cyber-red/40">
              Urgente
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyber-red">{criticalCount}</span>
            <span className="text-xs text-neutral-400 font-mono">itens abaixo de 30% da cota</span>
          </div>
        </LowriderCard>

        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Itens em Atenção</span>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800">
              Repor em Breve
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400">{warningCount}</span>
            <span className="text-xs text-neutral-400 font-mono">insumos com necessidade de compra</span>
          </div>
        </LowriderCard>

        <LowriderCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-chrome" />
              <span>Total de Insumos Cadastrados</span>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
              Geral
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{items.length}</span>
            <span className="text-xs text-neutral-400 font-mono">itens monitorados pelo ERP</span>
          </div>
        </LowriderCard>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-neutral-950/80 border border-neutral-800 rounded-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Filtrar por nome do insumo, marca ou lote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-white pl-9 pr-4 py-2 rounded-sm focus:outline-none focus:border-chrome"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-3 py-1.5 rounded-sm focus:outline-none focus:border-chrome"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-neutral-300 cursor-pointer bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-sm">
            <input
              type="checkbox"
              checked={onlyCritical}
              onChange={(e) => setOnlyCritical(e.target.checked)}
              className="rounded bg-neutral-950 border-neutral-700 text-cyber-red focus:ring-0"
            />
            <span>Apenas Alerta / Crítico</span>
          </label>
        </div>
      </div>

      {/* Grid de Cards de Insumos com Medidores Visuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const status = getItemStatus(item.quantity, item.minQuantity);
          const percent = Math.min(100, Math.round((item.quantity / item.minQuantity) * 100));

          return (
            <LowriderCard
              key={item.id}
              className={`flex flex-col justify-between ${
                status.variant === 'danger' ? 'border-cyber-red/50 hover:border-cyber-red' : ''
              }`}
            >
              <div>
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                      {item.category} • {item.brand}
                    </span>
                    <h3 className="text-sm font-semibold text-white tracking-wide mt-0.5">
                      {item.name}
                    </h3>
                  </div>
                  <StatusBadge status={status.label} variant={status.variant} />
                </div>

                {/* Dados de Lote & Validade */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 py-2 border-y border-neutral-850 mt-3">
                  <span className="flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-neutral-500" />
                    Lote: <strong className="text-neutral-300">{item.batch}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5 text-neutral-500" />
                    Val: {item.expiry}
                  </span>
                </div>

                {/* Medidor Visual de Capacidade / Ruptura */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">
                      Disponível: <strong className="text-white text-sm">{item.quantity}</strong> {item.unit}
                    </span>
                    <span className="text-neutral-500">Mín: {item.minQuantity} {item.unit}</span>
                  </div>

                  {/* Barra de Progresso com Cor Temática */}
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        status.variant === 'danger'
                          ? 'bg-cyber-red shadow-cyber-red-glow'
                          : status.variant === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-chrome'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ações Rápidas de Ajuste de Estoque */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-850">
                <span className="text-[11px] font-mono text-neutral-500">
                  Custo unit: R$ {item.costPerUnit.toFixed(2)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    title="Dar baixa em 1 unidade (uso em sessão)"
                    className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-chrome transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-mono text-xs px-2 text-white font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    title="Adicionar 1 unidade"
                    className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-chrome transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </LowriderCard>
          );
        })}
      </div>

      {/* Modal: Cadastrar Novo Insumo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Insumo no Estoque"
        subtitle="Rastreamento detalhado de agulhas, cartuchos, tintas e EPIs"
      >
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Nome do Insumo / Material *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Cartucho Kwadron 03RL ou Tinta Dynamic Triple Black"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                {CATEGORIES.filter((c) => c !== 'Todas as Categorias').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Marca / Fabricante
              </label>
              <input
                type="text"
                placeholder="ex: Kwadron, Electric Ink, Cheyenne"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Quantidade Atual *
              </label>
              <input
                type="number"
                required
                placeholder="20"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Quantidade Mínima (Alerta) *
              </label>
              <input
                type="number"
                required
                placeholder="10"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Unidade de Medida *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              >
                <option value="unid.">Unidades (unid.)</option>
                <option value="frascos">Frascos</option>
                <option value="caixas">Caixas</option>
                <option value="rolos">Rolos</option>
                <option value="pares">Pares</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Lote de Esterilização
              </label>
              <input
                type="text"
                placeholder="LOTE-2026-X"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Data de Validade
              </label>
              <input
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Custo Unitário (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="12.50"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
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
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar no Estoque</span>
            </ChromeButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Estoque;
