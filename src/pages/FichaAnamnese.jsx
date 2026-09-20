import React, { useState, useRef } from 'react';
import LowriderCard from '../components/ui/LowriderCard';
import ChromeButton from '../components/ui/ChromeButton';
import StatusBadge from '../components/ui/StatusBadge';
import SignaturePad from '../components/ui/SignaturePad';
import Modal from '../components/ui/Modal';
import useToast from '../hooks/useToast';
import {
  FileHeart,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  ShieldCheck,
  User,
  HeartPulse,
  Calendar,
  Eye,
  PenTool,
  Clock,
  ShieldAlert,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

const INITIAL_ANAMNESES = [
  {
    id: 'ANAM-2026-001',
    clientName: 'Carlos Santana',
    cpf: '345.678.901-22',
    phone: '(11) 98765-4321',
    birthDate: '1994-05-12',
    procedureType: 'Tatuagem',
    bodyLocation: 'Antebraço direito',
    artist: 'Rodrigo Black',
    date: '2026-09-02',
    status: 'Apto',
    hasMedicalAlert: false,
    allergies: 'Nenhuma conhecida',
    signatureDataUrl: null,
    conditions: {
      diabetes: false,
      hemofilia: false,
      keloids: false,
      hepatiteHiv: false,
      pregnantNursing: false,
      alcohol24h: false,
      fedWell: true,
    },
  },
  {
    id: 'ANAM-2026-002',
    clientName: 'Mariana Duarte',
    cpf: '456.789.012-33',
    phone: '(11) 97654-3210',
    birthDate: '1998-11-20',
    procedureType: 'Tatuagem',
    bodyLocation: 'Costela esquerda',
    artist: 'Luna Ink',
    date: '2026-09-02',
    status: 'Alerta Clínico',
    hasMedicalAlert: true,
    allergies: 'Alergia a Iodo e Curativos Adesivos',
    signatureDataUrl: null,
    conditions: {
      diabetes: false,
      hemofilia: false,
      keloids: true,
      hepatiteHiv: false,
      pregnantNursing: false,
      alcohol24h: false,
      fedWell: true,
    },
  },
  {
    id: 'ANAM-2026-003',
    clientName: 'Diego Martinez',
    cpf: '567.890.123-44',
    phone: '(11) 99123-8899',
    birthDate: '1991-03-08',
    procedureType: 'Tatuagem',
    bodyLocation: 'Fechamento de braço completo',
    artist: 'Rodrigo Black',
    date: '2026-09-01',
    status: 'Apto',
    hasMedicalAlert: false,
    allergies: 'Nenhuma',
    signatureDataUrl: null,
    conditions: {
      diabetes: false,
      hemofilia: false,
      keloids: false,
      hepatiteHiv: false,
      pregnantNursing: false,
      alcohol24h: false,
      fedWell: true,
    },
  },
  {
    id: 'ANAM-2026-004',
    clientName: 'Lucas Prado',
    cpf: '678.901.234-55',
    phone: '(11) 98111-2233',
    birthDate: '2001-07-14',
    procedureType: 'Body Piercing',
    bodyLocation: 'Septo Nasal',
    artist: 'Yasmin Shadow',
    date: '2026-09-01',
    status: 'Alerta Clínico',
    hasMedicalAlert: true,
    allergies: 'Nenhuma informada',
    signatureDataUrl: null,
    conditions: {
      diabetes: false,
      hemofilia: false,
      keloids: false,
      hepatiteHiv: false,
      pregnantNursing: false,
      alcohol24h: true,
      fedWell: false,
    },
  },
  {
    id: 'ANAM-2026-005',
    clientName: 'Beatriz Lima',
    cpf: '789.012.345-66',
    phone: '(11) 99988-7766',
    birthDate: '1989-12-03',
    procedureType: 'Tatuagem',
    bodyLocation: 'Ombro e Trapézio',
    artist: 'Marcos Calavera',
    date: '2026-08-30',
    status: 'Alerta Clínico',
    hasMedicalAlert: true,
    allergies: 'Nenhuma',
    signatureDataUrl: null,
    conditions: {
      diabetes: true,
      hemofilia: false,
      keloids: false,
      hepatiteHiv: false,
      pregnantNursing: false,
      alcohol24h: false,
      fedWell: true,
    },
  },
];

/**
 * Função utilitária que decodifica as condições da anamnese e gera
 * a lista detalhada de alertas médicos com recomendações clínicas de estúdio.
 */
export const getMedicalAlerts = (ficha) => {
  if (!ficha) return [];
  const alerts = [];
  const c = ficha.conditions || {};

  const cleanAllergies = (ficha.allergies || '').trim();
  const isNoAllergy =
    !cleanAllergies ||
    cleanAllergies.toLowerCase() === 'nenhuma' ||
    cleanAllergies.toLowerCase() === 'nenhuma conhecida' ||
    cleanAllergies.toLowerCase() === 'nenhuma informada' ||
    cleanAllergies.toLowerCase() === 'não' ||
    cleanAllergies.toLowerCase() === 'nao';

  if (!isNoAllergy) {
    alerts.push({
      id: 'allergies',
      title: 'Alergias Relatadas pelo Cliente',
      badge: 'Alerta Alérgico',
      severity: 'high',
      description: cleanAllergies,
      guidance:
        'Não utilizar insumos, sabões antissépticos, pomadas anestésicas, tintas ou curativos que contenham as substâncias reportadas.',
    });
  }

  if (c.keloids) {
    alerts.push({
      id: 'keloids',
      title: 'Tendência a Queloides / Hipertrofia Cicatricial',
      badge: 'Risco Dermatológico',
      severity: 'high',
      description: 'Histórico de proliferação celular e relevo cicatricial em lesões dérmicas prévias.',
      guidance:
        'Trabalhar com peso de mão estritamente superficial e voltagem calibrada; evitar saturações pesadas ou traumas repetidos no mesmo local para mitigar relevo.',
    });
  }

  if (c.diabetes) {
    alerts.push({
      id: 'diabetes',
      title: 'Diabetes / Distúrbios Glicêmicos',
      badge: 'Atenção Imunológica',
      severity: 'medium',
      description: 'Comprometimento da microcirculação periférica e resposta imune mais lenta.',
      guidance:
        'Processo cicatricial mais lento com suscetibilidade a infecções secundárias. Exige assepsia rigorosa e recomendação enfática de pomada cicatrizante e lavagem neutra.',
    });
  }

  if (c.hemofilia) {
    alerts.push({
      id: 'hemofilia',
      title: 'Hemofilia / Uso de Anticoagulantes',
      badge: 'Risco Hemorrágico Severo',
      severity: 'critical',
      description: 'Dificuldade na coagulação sanguínea ou uso contínuo de medicação anticoagulante.',
      guidance:
        'Alto risco de sangramento excessivo que expulsa o pigmento e dificulta a cicatrização. Recomenda-se liberação formal do médico hematologista antes de iniciar.',
    });
  }

  if (c.hepatiteHiv) {
    alerts.push({
      id: 'hepatiteHiv',
      title: 'Hepatite / HIV / Doenças Infectocontagiosas',
      badge: 'Biossegurança Máxima',
      severity: 'critical',
      description: 'Condição infectocontagiosa ativa ou crônica relatada.',
      guidance:
        'Atenção máxima aos protocolos de barreira biológica: uso de luvas de barreira reforçada, filme barreira completo na máquina e descarte imediato no descarpack.',
    });
  }

  if (c.pregnantNursing) {
    alerts.push({
      id: 'pregnantNursing',
      title: 'Gestante ou em Período de Amamentação',
      badge: 'Contraindicação Sanitária',
      severity: 'critical',
      description: 'Gravidez em curso ou período de lactação materno-infantil.',
      guidance:
        'Procedimento contraindicado pela ANVISA durante a gestação e lactação devido ao risco de infecções sistêmicas, estresse físico e transferência de pigmento.',
    });
  }

  if (c.alcohol24h) {
    alerts.push({
      id: 'alcohol24h',
      title: 'Consumo de Álcool ou Substâncias nas últimas 24h',
      badge: 'Alerta de Vasodilatação',
      severity: 'high',
      description: 'Ingestão recente de álcool, substâncias recreativas ou anti-inflamatórios.',
      guidance:
        'Haverá sangramento intensificado por vasodilatação e sensibilidade dolorosa alterada. Se o cliente apresentar sinais de embriaguez, a sessão deve ser remarcada.',
    });
  }

  if (c.fedWell === false) {
    alerts.push({
      id: 'fedWell',
      title: 'Jejum Prolongado (Não se alimentou nas últimas 2-3h)',
      badge: 'Risco de Hipoglicemia / Desmaio',
      severity: 'high',
      description: 'Cliente está sem ingestão calórica recente antes de um procedimento traumático.',
      guidance:
        'NÃO iniciar o procedimento imediatamente. Oferecer alimento calórico (suco, água com açúcar, frutas ou carboidratos) 20 minutos antes de iniciar para evitar queda de pressão e síncope vasovagal.',
    });
  }

  return alerts;
};

const FichaAnamnese = () => {
  const [fichas, setFichas] = useState(INITIAL_ANAMNESES);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingFicha, setViewingFicha] = useState(null);

  // Signature Pad Ref
  const signatureRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    cpf: '',
    rg: '',
    phone: '',
    email: '',
    birthDate: '',
    procedureType: 'Tatuagem',
    bodyLocation: '',
    artist: 'Rodrigo Black',
    allergies: '',
    // Perguntas de biossegurança
    hasDiabetes: false,
    hasHemofilia: false,
    hasKeloids: false,
    hasHepatiteHiv: false,
    isPregnantOrNursing: false,
    consumedAlcoholOrDrugs24h: false,
    hasEatenRecently: true,
    acceptsTerms: false,
  });

  const toast = useToast();

  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSaveAnamnese = (e) => {
    e.preventDefault();

    if (!formData.acceptsTerms) {
      toast.warning('É necessário assinalar o consentimento do termo de responsabilidade para prosseguir.', 'Validação de Consentimento');
      return;
    }

    if (signatureRef.current && signatureRef.current.isEmpty()) {
      toast.error('A assinatura biométrica digital do cliente é obrigatória para emitir o termo.', 'Assinatura Pendente');
      return;
    }

    const signatureImg = signatureRef.current ? signatureRef.current.toDataURL() : null;

    const cleanAllergies = (formData.allergies || '').trim();
    const hasAllergyAlert =
      cleanAllergies.length > 0 &&
      cleanAllergies.toLowerCase() !== 'nenhuma' &&
      cleanAllergies.toLowerCase() !== 'nenhuma conhecida' &&
      cleanAllergies.toLowerCase() !== 'nenhuma informada' &&
      cleanAllergies.toLowerCase() !== 'não' &&
      cleanAllergies.toLowerCase() !== 'nao';

    const hasAlert =
      formData.hasDiabetes ||
      formData.hasHemofilia ||
      formData.hasKeloids ||
      formData.hasHepatiteHiv ||
      formData.isPregnantOrNursing ||
      formData.consumedAlcoholOrDrugs24h ||
      !formData.hasEatenRecently ||
      hasAllergyAlert;

    const newFicha = {
      id: `ANAM-${new Date().getFullYear()}-${String(fichas.length + 1).padStart(3, '0')}`,
      clientName: formData.clientName,
      cpf: formData.cpf,
      phone: formData.phone,
      email: formData.email,
      birthDate: formData.birthDate,
      procedureType: formData.procedureType,
      bodyLocation: formData.bodyLocation,
      artist: formData.artist,
      date: new Date().toISOString().split('T')[0],
      status: hasAlert ? 'Alerta Clínico' : 'Apto',
      hasMedicalAlert: hasAlert,
      allergies: formData.allergies || 'Nenhuma informada',
      signatureDataUrl: signatureImg,
      conditions: {
        diabetes: formData.hasDiabetes,
        hemofilia: formData.hasHemofilia,
        keloids: formData.hasKeloids,
        hepatiteHiv: formData.hasHepatiteHiv,
        pregnantNursing: formData.isPregnantOrNursing,
        alcohol24h: formData.consumedAlcoholOrDrugs24h,
        fedWell: formData.hasEatenRecently,
      },
    };

    setFichas([newFicha, ...fichas]);
    setIsCreateModalOpen(false);
    toast.success(`Ficha ${newFicha.id} de ${newFicha.clientName} autenticada e arquivada!`, 'Termo Sanitário Emitido');

    // Reset Form
    setFormData({
      clientName: '',
      cpf: '',
      rg: '',
      phone: '',
      email: '',
      birthDate: '',
      procedureType: 'Tatuagem',
      bodyLocation: '',
      artist: 'Rodrigo Black',
      allergies: '',
      hasDiabetes: false,
      hasHemofilia: false,
      hasKeloids: false,
      hasHepatiteHiv: false,
      isPregnantOrNursing: false,
      consumedAlcoholOrDrugs24h: false,
      hasEatenRecently: true,
      acceptsTerms: false,
    });
  };

  const filteredFichas = fichas.filter(
    (f) =>
      f.clientName.toLowerCase().includes(search.toLowerCase()) ||
      f.cpf.includes(search) ||
      f.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-950/80 border border-neutral-800 rounded-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome do cliente, CPF ou código da ficha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-white pl-9 pr-4 py-2 rounded-sm focus:outline-none focus:border-chrome"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        <ChromeButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Emitir Nova Ficha de Anamnese</span>
        </ChromeButton>
      </div>

      {/* Lista de Fichas de Anamnese */}
      <LowriderCard
        title="Fichas de Biossegurança & Consentimento Informado"
        subtitle="Armazenamento seguro de termos médicos e assinaturas biométricas digitais"
        action={
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Conformidade Sanitária (Anvisa)</span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="py-3 px-3">Código</th>
                <th className="py-3 px-3">Cliente / CPF</th>
                <th className="py-3 px-3">Procedimento</th>
                <th className="py-3 px-3">Artista</th>
                <th className="py-3 px-3">Data Emissão</th>
                <th className="py-3 px-3">Status & Alertas Clínicos</th>
                <th className="py-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredFichas.map((ficha) => {
                const alerts = getMedicalAlerts(ficha);
                return (
                  <tr
                    key={ficha.id}
                    className="hover:bg-neutral-900/40 transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-chrome">
                      {ficha.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{ficha.clientName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        CPF: {ficha.cpf} • {ficha.phone}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-neutral-200">{ficha.procedureType}</span>
                      <div className="text-[11px] text-neutral-500">{ficha.bodyLocation}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-300 font-mono">
                      {ficha.artist}
                    </td>
                    <td className="py-3 px-3 text-neutral-400 font-mono">
                      {ficha.date}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge
                          status={ficha.status}
                          variant={ficha.hasMedicalAlert ? 'warning' : 'success'}
                        />
                        {/* Chips com os alertas específicos disparados */}
                        {alerts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5 max-w-[200px]">
                            {alerts.map((al, idx) => (
                              <span
                                key={idx}
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                  al.severity === 'critical'
                                    ? 'bg-red-950/70 border-cyber-red/80 text-red-200'
                                    : 'bg-amber-950/70 border-amber-800/80 text-amber-300'
                                }`}
                                title={al.guidance}
                              >
                                {al.badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setViewingFicha(ficha)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-chrome text-neutral-300 hover:text-white transition-all text-xs font-mono"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visualizar Ficha</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LowriderCard>

      {/* Modal: Nova Ficha de Anamnese com Estética Pergaminho */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Ficha de Anamnese & Consentimento Digital"
        subtitle="Formulário estético e legal com assinatura digital em alta resolução"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveAnamnese} className="space-y-6">
          {/* Sessão 1: Dados do Cliente */}
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-sm space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-chrome flex items-center gap-2">
              <User className="w-4 h-4" /> 1. Dados Pessoais do Cliente
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  WhatsApp / Telefone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Procedimento *
                </label>
                <select
                  value={formData.procedureType}
                  onChange={(e) => setFormData({ ...formData, procedureType: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                >
                  <option value="Tatuagem">Tatuagem (Custom / Flash)</option>
                  <option value="Cobertura">Cobertura (Cover-up / Reforma)</option>
                  <option value="Body Piercing">Body Piercing</option>
                  <option value="Microdermal">Microdermal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Local do Corpo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Antebraço, Panturrilha, Costela"
                  value={formData.bodyLocation}
                  onChange={(e) => setFormData({ ...formData, bodyLocation: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Artista Responsável *
                </label>
                <select
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
                >
                  <option value="Rodrigo Black">Rodrigo Black</option>
                  <option value="Luna Ink">Luna Ink</option>
                  <option value="Marcos Calavera">Marcos Calavera</option>
                  <option value="Yasmin Shadow">Yasmin Shadow</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sessão 2: Triagem de Biossegurança */}
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-sm space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-chrome flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-cyber-red" /> 2. Triagem Médica & Biossegurança
            </h4>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">
                Alergias Conhecidas (Pigmentos, Látex, Iodo, Pomadas, Metais)
              </label>
              <input
                type="text"
                placeholder="Descreva caso haja ou deixe em branco para nenhuma"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded focus:outline-none focus:border-chrome"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <label className="flex items-center gap-2.5 p-2 bg-neutral-950 border border-neutral-850 rounded cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.hasDiabetes}
                  onChange={() => handleCheckboxChange('hasDiabetes')}
                  className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
                />
                <span>Possui Diabetes ou distúrbios glicêmicos</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-neutral-950 border border-neutral-850 rounded cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.hasHemofilia}
                  onChange={() => handleCheckboxChange('hasHemofilia')}
                  className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
                />
                <span>Hemofilia ou uso de anticoagulantes</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-neutral-950 border border-neutral-850 rounded cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.hasKeloids}
                  onChange={() => handleCheckboxChange('hasKeloids')}
                  className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
                />
                <span>Tendência a Queloides / Hipertrofia cicatricial</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-neutral-950 border border-neutral-850 rounded cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.hasHepatiteHiv}
                  onChange={() => handleCheckboxChange('hasHepatiteHiv')}
                  className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
                />
                <span>Hepatite, HIV ou infecções dermatológicas</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-neutral-950 border border-neutral-850 rounded cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.isPregnantOrNursing}
                  onChange={() => handleCheckboxChange('isPregnantOrNursing')}
                  className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
                />
                <span>Gestante ou em período de lactação</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-neutral-950 border border-neutral-850 rounded cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={formData.consumedAlcoholOrDrugs24h}
                  onChange={() => handleCheckboxChange('consumedAlcoholOrDrugs24h')}
                  className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
                />
                <span>Consumiu álcool ou substâncias nas últimas 24h</span>
              </label>
            </div>

            <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded flex items-center justify-between">
              <span className="text-xs text-neutral-300">
                Alimentou-se adequadamente nas últimas 2 a 3 horas?
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="fedWell"
                    checked={formData.hasEatenRecently}
                    onChange={() => setFormData({ ...formData, hasEatenRecently: true })}
                  />
                  <span>Sim</span>
                </label>
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="fedWell"
                    checked={!formData.hasEatenRecently}
                    onChange={() => setFormData({ ...formData, hasEatenRecently: false })}
                  />
                  <span>Não (Jejum)</span>
                </label>
              </div>
            </div>

            {/* Assistente IA em Tempo Real (Google PAIR) */}
            {(() => {
              const previewAlerts = getMedicalAlerts({
                allergies: formData.allergies,
                conditions: {
                  diabetes: formData.hasDiabetes,
                  hemofilia: formData.hasHemofilia,
                  keloids: formData.hasKeloids,
                  hepatiteHiv: formData.hasHepatiteHiv,
                  pregnantNursing: formData.isPregnantOrNursing,
                  alcohol24h: formData.consumedAlcoholOrDrugs24h,
                  fedWell: formData.hasEatenRecently,
                },
              });

              if (previewAlerts.length > 0) {
                return (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/80 rounded text-xs font-mono space-y-1.5 animate-fade-in-up">
                    <div className="flex items-center justify-between text-amber-300">
                      <span className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-chrome animate-pulse" />
                        TattOS AI: {previewAlerts.length} Fator(es) de Risco Sanitário Identificado(s)
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-900/60 border border-amber-750 text-amber-200">
                        Protocolo Especial Requerido
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      A IA vinculará automaticamente o termo com recomendações clínicas de proteção para:{' '}
                      <strong className="text-white">
                        {previewAlerts.map((a) => a.title).join(', ')}
                      </strong>.
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pré-triagem IA: 100% de Aderência Sanitária (Cliente Apto sem comorbidades relatadas).</span>
                  </div>
                );
              }
            })()}
          </div>

          {/* Sessão 3: Termo de Consentimento & Assinatura Digital */}
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-sm space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-chrome flex items-center gap-2">
              <PenTool className="w-4 h-4" /> 3. Termo de Consentimento & Assinatura Digital
            </h4>

            {/* Pergaminho Text */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded text-[11px] text-neutral-400 font-mono leading-relaxed max-h-32 overflow-y-auto space-y-2">
              <p>
                Declaro que as informações prestadas são verídicas. Estou ciente de que o procedimento de body art (tatuagem/piercing) acarreta ruptura da integridade cutânea e comprometo-me a seguir à risca as instruções de assepsia, higienização e cicatrização fornecidas pelo estúdio TattOS.
              </p>
              <p>
                Autorizo a realização do procedimento pelo artista selecionado com insumos 100% esterilizados e descartáveis, conforme normativas sanitárias vigentes.
              </p>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.acceptsTerms}
                onChange={() => handleCheckboxChange('acceptsTerms')}
                className="rounded bg-neutral-900 border-neutral-700 text-chrome focus:ring-0"
              />
              <span>
                Li, compreendi e concordo integralmente com as cláusulas do termo de consentimento.
              </span>
            </label>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                Assinatura Biométrica Digital do Cliente *
              </label>
              <SignaturePad ref={signatureRef} placeholder="Desenhe sua assinatura digital neste campo" />
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <ChromeButton type="submit">
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar & Autenticar Ficha</span>
            </ChromeButton>
          </div>
        </form>
      </Modal>

      {/* Modal: Visualizar Ficha / Pergaminho Completo com Alertas Específicos */}
      {viewingFicha && (() => {
        const alerts = getMedicalAlerts(viewingFicha);
        const c = viewingFicha.conditions || {};

        return (
          <Modal
            isOpen={!!viewingFicha}
            onClose={() => setViewingFicha(null)}
            title={`Ficha de Anamnese: ${viewingFicha.id}`}
            subtitle="Documento Oficial de Registro Sanitário & Consentimento"
            maxWidth="max-w-2xl"
          >
            <div className="space-y-6">
              {/* Cabeçalho do Pergaminho */}
              <div className="p-4 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 text-center rounded relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-chrome/50 to-transparent" />
                <h2 className="font-title font-bold text-xl sm:text-2xl text-white tracking-tight">
                  TattOS Body Art Studio
                </h2>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                  Registro de Biossegurança • {viewingFicha.id}
                </p>
                <div className="mt-2 inline-block">
                  <StatusBadge
                    status={viewingFicha.status}
                    variant={viewingFicha.hasMedicalAlert ? 'warning' : 'success'}
                  />
                </div>
              </div>

              {/* Dados do Cliente */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-neutral-500 block">Cliente</span>
                  <strong className="text-white text-sm">{viewingFicha.clientName}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">CPF</span>
                  <span className="text-neutral-200">{viewingFicha.cpf}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Procedimento & Local</span>
                  <span className="text-neutral-200">
                    {viewingFicha.procedureType} ({viewingFicha.bodyLocation})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Artista Responsável</span>
                  <span className="text-chrome font-bold">{viewingFicha.artist}</span>
                </div>
              </div>

              {/* Seção Exclusiva: Alertas Médicos Detalhados Pós-Preenchimento */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-300 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-cyber-red" />
                    Parecer de Biossegurança & Alertas Clínicos
                  </h4>
                  {alerts.length > 0 ? (
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      {alerts.length} alerta{alerts.length > 1 ? 's' : ''} detectado{alerts.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      Nenhum alerta clínico
                    </span>
                  )}
                </div>

                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.map((al, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded border text-xs font-mono space-y-2 ${
                          al.severity === 'critical'
                            ? 'bg-red-950/30 border-cyber-red/80 shadow-[0_0_12px_rgba(138,3,3,0.25)]'
                            : 'bg-amber-950/25 border-amber-800/80 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {al.severity === 'critical' ? (
                              <ShieldAlert className="w-4 h-4 text-cyber-red shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <strong className="text-white text-sm tracking-wide">
                              {al.title}
                            </strong>
                          </div>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              al.severity === 'critical'
                                ? 'bg-cyber-red/40 border-cyber-red text-red-100'
                                : 'bg-amber-900/40 border-amber-700 text-amber-200'
                            }`}
                          >
                            {al.badge}
                          </span>
                        </div>

                        <div className="text-neutral-300 text-[11px] pl-6">
                          <span className="text-neutral-500">Relato registrado: </span>
                          <span className="text-neutral-200 font-medium">{al.description}</span>
                        </div>

                        <div className="p-2.5 bg-neutral-950/80 rounded border border-neutral-800/90 text-[11px] text-neutral-300 ml-6">
                          <span className="text-chrome font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Protocolo Operacional & Cuidados no Estúdio:
                          </span>
                          <p className="text-neutral-300 leading-relaxed">{al.guidance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-800/70 text-emerald-300 text-xs font-mono rounded flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="block text-white text-sm">Cliente Apto para o Procedimento</strong>
                      <span className="text-[11px] text-emerald-400/80">
                        Nenhuma contraindicação, alergia, comorbidade ou fator de risco foi relatado durante a triagem médica.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Matriz Completa de Respostas da Triagem */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded space-y-2">
                <h5 className="text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
                  Checklist Geral de Biossegurança Respondido
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px]">Diabetes / Glicemia:</span>
                    <span className={c.diabetes ? 'text-amber-400 font-bold flex items-center gap-1' : 'text-emerald-400 flex items-center gap-1'}>
                      {c.diabetes ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {c.diabetes ? 'SIM (Alerta)' : 'NÃO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px]">Hemofilia / Anticoagulantes:</span>
                    <span className={c.hemofilia ? 'text-cyber-red font-bold flex items-center gap-1' : 'text-emerald-400 flex items-center gap-1'}>
                      {c.hemofilia ? <ShieldAlert className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {c.hemofilia ? 'SIM (Crítico)' : 'NÃO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px]">Queloides / Hipertrofia:</span>
                    <span className={c.keloids ? 'text-amber-400 font-bold flex items-center gap-1' : 'text-emerald-400 flex items-center gap-1'}>
                      {c.keloids ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {c.keloids ? 'SIM (Alerta)' : 'NÃO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px]">Hepatite / HIV / Infecções:</span>
                    <span className={c.hepatiteHiv ? 'text-cyber-red font-bold flex items-center gap-1' : 'text-emerald-400 flex items-center gap-1'}>
                      {c.hepatiteHiv ? <ShieldAlert className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {c.hepatiteHiv ? 'SIM (Crítico)' : 'NÃO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px]">Gestante ou Lactante:</span>
                    <span className={c.pregnantNursing ? 'text-cyber-red font-bold flex items-center gap-1' : 'text-emerald-400 flex items-center gap-1'}>
                      {c.pregnantNursing ? <ShieldAlert className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {c.pregnantNursing ? 'SIM (Crítico)' : 'NÃO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px]">Álcool / Substâncias 24h:</span>
                    <span className={c.alcohol24h ? 'text-amber-400 font-bold flex items-center gap-1' : 'text-emerald-400 flex items-center gap-1'}>
                      {c.alcohol24h ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {c.alcohol24h ? 'SIM (Alerta)' : 'NÃO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800/60 sm:col-span-2">
                    <span className="text-neutral-400 text-[11px]">Alimentação recente (últimas 2 a 3h):</span>
                    <span className={c.fedWell !== false ? 'text-emerald-400 flex items-center gap-1' : 'text-cyber-red font-bold flex items-center gap-1'}>
                      {c.fedWell !== false ? <Check className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      {c.fedWell !== false ? 'SIM (Alimentado)' : 'NÃO (Jejum - Risco Hipoglicemia)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assinatura Digital do Pergaminho */}
              <div className="border border-neutral-800 p-4 bg-neutral-950 rounded">
                <span className="text-xs font-mono uppercase text-neutral-400 block mb-2">
                  Assinatura Biométrica Digital Registrada
                </span>
                {viewingFicha.signatureDataUrl ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded p-2 flex items-center justify-center">
                    <img
                      src={viewingFicha.signatureDataUrl}
                      alt="Assinatura Digital"
                      className="max-h-24 filter invert"
                    />
                  </div>
                ) : (
                  <div className="h-20 bg-neutral-900/40 border border-dashed border-neutral-800 rounded flex items-center justify-center text-xs font-mono text-neutral-500">
                    Assinatura autenticada digitalmente via Chave de Sessão TattOS
                  </div>
                )}
                <div className="mt-2 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>Hash: SHA256-TATTOS-{viewingFicha.id}</span>
                  <span>Data: {viewingFicha.date}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    toast.info('Gerando layout de alta resolução para impressão / exportação em PDF...', 'Registro Sanitário');
                    window.print();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 rounded hover:text-white hover:border-chrome transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Gerar PDF</span>
                </button>

                <ChromeButton onClick={() => setViewingFicha(null)}>
                  <span>Fechar Visualização</span>
                </ChromeButton>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};

export default FichaAnamnese;
