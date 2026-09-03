# TattOS — Front-end (Client-side)

> Sistema Operacional & ERP Integrado para Estúdios de Tatuagem e Artistas de *Body Art*.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![Design System](https://img.shields.io/badge/Design_System-Dark_Cyber--Chicano-c0c0c0.svg)](#-design-system-dark-cyber-chicano)

Este repositório contém a interface de usuário (Client-side) do **TattOS**, um ERP (Sistema de Gestão Integrada) de alta fidelidade projetado para atuar como o centro de operações de estúdios profissionais de tatuagem e body piercing, gerindo desde o acolhimento do cliente até o fechamento de caixa e controle de conformidade sanitária.

---

## 🎨 Design System: Dark Cyber-Chicano

A interface adota uma identidade visual imersiva e sofisticada inspirada na cultura *Lowrider* do sul da Califórnia e na estética *Black and Grey / Chicano Lettering*, mesclada com toques cibernéticos e acabamento metálico. Cada elemento foi desenhado para unir ergonomia de estúdio (baixo cansaço visual sob iluminação direta) com elegância artística.

### 🖤 Paleta de Cores Base
* **Fundo Principal:** Grafite envelhecido (`#0D0D0D`) e preto profundo (`#070707`) com iluminação ambiente sutil.
* **Superfícies & Cards:** Efeito *Glassmorphism opaco* (`rgba(10, 10, 10, 0.85)` com `backdrop-blur-md`) e chanfros angulares de 45° cortados a laser.
* **Cromados Metálicos:** Prata espelhado (`#C0C0C0`), cinza metálico (`#737373`) e detalhes em alto brilho (*chrome glow*).
* **Acentos Estéticos:**
  * `cyber-red` (`#8A0303`): Tinta carmesim / sangue para alertas críticos e ênfase.
  * `cyber-gold` (`#C5A059`): Ouro envelhecido Lowrider para distinções VIP e finanças.
  * `cyber-cyan` (`#00F0FF`): Feixes neon para métricas de tempo real.

### 🖋️ Tipografia Híbrida
* **Títulos e Marcas:** Fontes expressivas góticas e caligráficas (*Pirata One*, *UnifrakturMaguntia*, *Great Vibes*).
* **Gestão e Dados:** *Inter* e *JetBrains Mono* para clareza cirúrgica em números, tabelas, horários e formulários.

---

## 🚀 Stack Tecnológica

| Tecnologia | Finalidade |
| :--- | :--- |
| **React 19** | Biblioteca base reativa para interfaces declarativas e componentes modulares |
| **Vite 6** | Build tooling ultra-rápido com Hot Module Replacement (HMR) instantâneo |
| **Tailwind CSS 3.4** | Design system customizado via utilitários atômicos e animações metálicas |
| **Lucide React** | Conjunto coeso de ícones monocromáticos otimizados |
| **Recharts** | Visualização analítica com gradientes de aerografia (*airbrush style*) |
| **Axios** | Cliente HTTP configurado com interceptores JWT e tratamento defensivo |
| **HTML5 Canvas** | Captura vetorial de assinatura digital em alta precisão para termos de consentimento |

---

## ⚙️ Funcionalidades Principais da Interface

### 1. 🏙️ Dashboard ("The Hood")
Painel executivo com visão holística do estúdio: sessões ativas no dia, faturamento projetado, fichas aguardando assinatura, gráficos de fluxo de caixa estilo aerógrafo e alertas imediatos de escassez de insumos.

### 2. 📅 Agenda Inteligente
Calendário operacional multi-artista e multi-bancada:
* Prevenção de choques de horário entre tatuadores e estações de atendimento.
* Visualização por dia, semana e filtros por tatuador residente ou *guest*.
* Modal rápido para novos agendamentos com cálculo automático de duração de sessão e estilo de arte.

### 3. 📜 Ficha de Anamnese Digital
Formulário de biossegurança completo em conformidade com normas sanitárias (Anvisa / OSHA):
* Layout de pergaminho estético Dark Cyber-Chicano.
* Triagem detalhada: alergias a tintas/látex, hemofilia, diabetes, queloides, doenças transmissíveis e histórico de cicatrização.
* **Canvas de Assinatura Digital** em alta resolução com opção de limpar, assinar com caneta/touch e geração de comprovante digital.

### 4. 🎭 Módulo Financeiro ("Smile Now, Cry Later")
Gestão de receitas e despesas com apelo temático:
* **"Smile Now"**: Faturamento bruto, sessões pagas, depósitos de agendamento (sinal) e comissões do estúdio.
* **"Cry Later"**: Custos com materiais descartáveis, aluguel de bancadas, manutenção de autoclaves e contas fixas.
* Cálculo automatizado de divisão de comissão de artistas e gráficos temporais de desempenho.

### 5. 📦 Controle de Estoque Crítico
Monitoramento contínuo de materiais essenciais com indicadores de nível de risco:
* Agulhas e Cartuchos (RL, RS, Magnum, Curved Mag).
* Tintas e Pigmentos (com rastreamento de lotes, marcas e data de validade após aberto).
* Materiais descartáveis e EPIs (biqueiras, luvas nitrílicas, papel toalha, plástico filme, vaselina).
* Indicadores visuais imediatos de "Nível Seguro", "Alerta Amarelo" e "Estoque Crítico / Esgotado".

---

## 📁 Estrutura do Projeto

```plaintext
tattos-frontend/
├── public/                  # Ícones e arquivos estáticos
├── src/
│   ├── assets/              # SVGs, logotipos e fontes
│   ├── components/
│   │   ├── layout/          # Sidebar, Header e casca de navegação
│   │   └── ui/              # LowriderCard, ChromeButton, SignaturePad, Badges
│   ├── context/             # AuthContext e gerenciadores de estado global
│   ├── hooks/               # useAuth e hooks customizados
│   ├── pages/               # Páginas principais da aplicação
│   │   ├── Dashboard.jsx    # Painel executivo "The Hood"
│   │   ├── Agenda.jsx       # Calendário operacional multi-artista
│   │   ├── FichaAnamnese.jsx# Ficha médica de biossegurança & assinatura
│   │   ├── Financeiro.jsx   # Fluxo de caixa "Smile Now, Cry Later"
│   │   ├── Estoque.jsx      # Monitor de insumos críticos e cartuchos
│   │   └── Login.jsx        # Portal de acesso seguro
│   ├── services/            # Cliente Axios com interceptors e rotas da API
│   ├── App.jsx              # Roteamento e layouts protegidos
│   ├── main.jsx             # Ponto de entrada React
│   └── index.css            # Diretivas Tailwind, gradientes e scrollbar
├── tailwind.config.js       # Definições da paleta Dark Cyber-Chicano
├── vite.config.js           # Configuração de build do Vite
└── package.json             # Dependências e scripts
```

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior recomendada)
* **npm** ou **yarn** / **pnpm**

### Passo a Passo

```bash
# 1. Clone o repositório ou acesse a pasta raiz
git clone https://github.com/brunorc97/tattos-frontend.git
cd tattos-frontend

# 2. Instale as dependências do projeto
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Por padrão, a aplicação estará acessível em: `http://localhost:5173`

---

## 🔐 Conexão com o Back-end & Modo Demonstração

O front-end é configurado para se comunicar de forma transparente com a API REST do TattOS (desenvolvida em Spring Boot / Java):

* As credenciais e tokens JWT emitidos no endpoint `/api/auth/login` são mantidos em `sessionStorage` e enviados no header `Authorization: Bearer <token>`.
* **Modo Demonstração Integrado:** Caso você esteja executando apenas o front-end sem o back-end ativo, a tela de Login dispõe do botão de **"Acesso Demonstração"** para navegar imediatamente por todas as telas com dados realistas pré-carregados.

---

## 🖤 Licença
Distribuído sob licença proprietária exclusiva para o ecossistema **TattOS**. Desenvolvido com respeito à tradição da tatuagem e dedicação à excelência tecnológica.