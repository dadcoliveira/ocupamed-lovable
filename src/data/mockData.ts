export type SolicitacaoStatus =
  | "novo"
  | "em_triagem"
  | "aguardando_contato"
  | "agendado"
  | "concluido"
  | "cancelado"
  | "setor_responsavel";

export type TipoExame =
  | "admissional"
  | "demissional"
  | "periodico"
  | "retorno_trabalho"
  | "mudanca_funcao"
  | "aso"
  | "triagem_inicial";

export type Prioridade = "baixa" | "media" | "alta" | "urgente";

export interface Solicitacao {
  id: string;
  nome: string;
  empresa: string;
  tipo: TipoExame;
  status: SolicitacaoStatus;
  prioridade: Prioridade;
  dataEntrada: string;
  dataAgendamento?: string;
  responsavel?: string;
  telefone: string;
  email: string;
  colaborador: string;
  cargo: string;
  setor?: string;
  origem: "whatsapp" | "site" | "telefone";
  observacoes?: string;
}

export const statusLabels: Record<SolicitacaoStatus, string> = {
  novo: "Novo",
  em_triagem: "Em Triagem",
  aguardando_contato: "Aguardando Contato",
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
  setor_responsavel: "Setor Responsável",
};

export const statusBadgeVariant: Record<SolicitacaoStatus, string> = {
  novo: "novo",
  em_triagem: "triagem",
  aguardando_contato: "aguardando",
  agendado: "agendado",
  concluido: "concluido",
  cancelado: "cancelado",
  setor_responsavel: "setor",
};

export const tipoLabels: Record<TipoExame, string> = {
  admissional: "Admissional",
  demissional: "Demissional",
  periodico: "Periódico",
  retorno_trabalho: "Retorno ao Trabalho",
  mudanca_funcao: "Mudança de Função",
  aso: "ASO",
  triagem_inicial: "Triagem Inicial",
};

export const prioridadeLabels: Record<Prioridade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export const mockSolicitacoes: Solicitacao[] = [
  {
    id: "SOL-001",
    nome: "Maria Silva",
    empresa: "TechCorp Ltda",
    tipo: "admissional",
    status: "novo",
    prioridade: "alta",
    dataEntrada: "2026-04-09T08:30:00",
    telefone: "(11) 99876-5432",
    email: "maria@techcorp.com",
    colaborador: "João Santos",
    cargo: "Analista de TI",
    origem: "whatsapp",
    observacoes: "Início previsto para 15/04",
  },
  {
    id: "SOL-002",
    nome: "Carlos Mendes",
    empresa: "Construtora ABC",
    tipo: "periodico",
    status: "em_triagem",
    prioridade: "media",
    dataEntrada: "2026-04-08T14:00:00",
    telefone: "(11) 98765-4321",
    email: "carlos@construtoraabc.com",
    colaborador: "Pedro Oliveira",
    cargo: "Pedreiro",
    setor: "Obras",
    origem: "site",
  },
  {
    id: "SOL-003",
    nome: "Ana Rodrigues",
    empresa: "Logística Express",
    tipo: "retorno_trabalho",
    status: "aguardando_contato",
    prioridade: "urgente",
    dataEntrada: "2026-04-07T10:15:00",
    telefone: "(21) 97654-3210",
    email: "ana@logisticaexpress.com",
    colaborador: "Fernanda Lima",
    cargo: "Motorista",
    origem: "whatsapp",
    observacoes: "Afastamento por acidente de trabalho",
  },
  {
    id: "SOL-004",
    nome: "Roberto Alves",
    empresa: "Indústria Metalúrgica SA",
    tipo: "mudanca_funcao",
    status: "agendado",
    prioridade: "media",
    dataEntrada: "2026-04-06T09:00:00",
    dataAgendamento: "2026-04-11T10:00:00",
    responsavel: "Dra. Patrícia",
    telefone: "(11) 96543-2109",
    email: "roberto@metalurgica.com",
    colaborador: "Lucas Ferreira",
    cargo: "Operador de Máquinas → Supervisor",
    origem: "telefone",
  },
  {
    id: "SOL-005",
    nome: "Juliana Costa",
    empresa: "Farmácia Saúde+",
    tipo: "demissional",
    status: "concluido",
    prioridade: "baixa",
    dataEntrada: "2026-04-05T11:30:00",
    dataAgendamento: "2026-04-08T14:00:00",
    responsavel: "Dr. Ricardo",
    telefone: "(11) 95432-1098",
    email: "juliana@farmaciasaude.com",
    colaborador: "Mariana Souza",
    cargo: "Atendente",
    origem: "site",
  },
  {
    id: "SOL-006",
    nome: "Fernando Dias",
    empresa: "Transportadora Veloz",
    tipo: "aso",
    status: "setor_responsavel",
    prioridade: "alta",
    dataEntrada: "2026-04-04T16:00:00",
    responsavel: "Coord. Operacional",
    telefone: "(21) 94321-0987",
    email: "fernando@veloz.com",
    colaborador: "Ricardo Nunes",
    cargo: "Motorista de Carga",
    setor: "Coordenação",
    origem: "whatsapp",
    observacoes: "Necessita avaliação especial - atividade de risco",
  },
  {
    id: "SOL-007",
    nome: "Patrícia Lemos",
    empresa: "Escola Futuro",
    tipo: "admissional",
    status: "em_triagem",
    prioridade: "media",
    dataEntrada: "2026-04-09T07:45:00",
    telefone: "(11) 93210-9876",
    email: "patricia@escolafuturo.com",
    colaborador: "Camila Rocha",
    cargo: "Professora",
    origem: "site",
  },
  {
    id: "SOL-008",
    nome: "Marcos Vieira",
    empresa: "Restaurante Sabor & Cia",
    tipo: "periodico",
    status: "novo",
    prioridade: "baixa",
    dataEntrada: "2026-04-09T09:00:00",
    telefone: "(11) 92109-8765",
    email: "marcos@saborecia.com",
    colaborador: "Thiago Gomes",
    cargo: "Cozinheiro",
    origem: "whatsapp",
  },
  {
    id: "SOL-009",
    nome: "Luciana Martins",
    empresa: "Consultoria Prime",
    tipo: "triagem_inicial",
    status: "cancelado",
    prioridade: "baixa",
    dataEntrada: "2026-04-03T13:00:00",
    telefone: "(11) 91098-7654",
    email: "luciana@prime.com",
    colaborador: "André Moraes",
    cargo: "Consultor",
    origem: "telefone",
    observacoes: "Cliente desistiu do agendamento",
  },
  {
    id: "SOL-010",
    nome: "Eduardo Prado",
    empresa: "TechCorp Ltda",
    tipo: "admissional",
    status: "agendado",
    prioridade: "alta",
    dataEntrada: "2026-04-07T08:00:00",
    dataAgendamento: "2026-04-10T09:00:00",
    responsavel: "Dra. Patrícia",
    telefone: "(11) 90987-6543",
    email: "eduardo@techcorp.com",
    colaborador: "Beatriz Nascimento",
    cargo: "Designer",
    origem: "whatsapp",
  },
];

export type MockLeadStatus =
  | "Novo"
  | "Em triagem"
  | "Aguardando contato"
  | "Agendado"
  | "Concluído"
  | "Cancelado"
  | "Atendimento de setor responsável";

export type MockLeadRequestType =
  | "exame_admissional"
  | "exame_demissional"
  | "exame_periodico"
  | "retorno_ao_trabalho"
  | "mudanca_de_funcao"
  | "aso"
  | "duvida"
  | "outro";

export type MockLeadPriority = "baixa" | "media" | "alta" | "urgente";

export interface MockLead {
  id: string;
  lead_id?: string;
  requester_name: string;
  phone: string;
  company: string;
  employee_name: string;
  request_type: MockLeadRequestType;
  status: MockLeadStatus;
  priority: MockLeadPriority;
  urgency: string | null;
  preferred_date: string | null;
  preferred_period: string | null;
  initial_notes: string | null;
  conversation_summary: string | null;
  dashboard_summary: string | null;
  created_at: string;
  updated_at: string;
  summary: string;
}

export const mockLeads: MockLead[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    requester_name: "Maria Silva",
    phone: "(11) 99876-5432",
    company: "TechCorp Ltda",
    employee_name: "João Santos",
    request_type: "exame_admissional",
    status: "Novo",
    priority: "alta",
    urgency: "alta",
    preferred_date: "2026-05-20",
    preferred_period: "manha",
    initial_notes: "Início previsto para 20/05. Cargo: Analista de TI.",
    conversation_summary: "Solicitante pediu admissional urgente para novo colaborador.",
    dashboard_summary: "Admissional TechCorp — aguardando triagem.",
    created_at: "2026-05-15T08:30:00.000Z",
    updated_at: "2026-05-15T08:30:00.000Z",
    summary: "exame_admissional | Maria Silva | TechCorp Ltda",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    requester_name: "Carlos Mendes",
    phone: "(11) 98765-4321",
    company: "Construtora ABC",
    employee_name: "Pedro Oliveira",
    request_type: "exame_periodico",
    status: "Em triagem",
    priority: "media",
    urgency: "media",
    preferred_date: "2026-05-22",
    preferred_period: "tarde",
    initial_notes: "Periódico anual do setor de Obras.",
    conversation_summary: "Empresa solicita periódico para equipe de pedreiros.",
    dashboard_summary: "Periódico Construtora ABC — em triagem.",
    created_at: "2026-05-14T14:00:00.000Z",
    updated_at: "2026-05-14T15:00:00.000Z",
    summary: "exame_periodico | Carlos Mendes | Construtora ABC",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    requester_name: "Ana Rodrigues",
    phone: "(21) 97654-3210",
    company: "Logística Express",
    employee_name: "Fernanda Lima",
    request_type: "retorno_ao_trabalho",
    status: "Aguardando contato",
    priority: "urgente",
    urgency: "urgente",
    preferred_date: "2026-05-19",
    preferred_period: "manha",
    initial_notes: "Afastamento por acidente de trabalho. Retorno urgente.",
    conversation_summary: "Funcionária afastada precisa de laudo de retorno.",
    dashboard_summary: "Retorno ao trabalho Logística Express — urgente.",
    created_at: "2026-05-13T10:15:00.000Z",
    updated_at: "2026-05-13T11:00:00.000Z",
    summary: "retorno_ao_trabalho | Ana Rodrigues | Logística Express",
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    requester_name: "Roberto Alves",
    phone: "(11) 96543-2109",
    company: "Indústria Metalúrgica SA",
    employee_name: "Lucas Ferreira",
    request_type: "mudanca_de_funcao",
    status: "Agendado",
    priority: "media",
    urgency: "media",
    preferred_date: "2026-05-21",
    preferred_period: "manha",
    initial_notes: "Mudança de Operador para Supervisor. Prazo: até 25/05.",
    conversation_summary: "Promoção interna exige novo ASO por mudança de função.",
    dashboard_summary: "Mudança de função Metalúrgica SA — agendado para 21/05.",
    created_at: "2026-05-12T09:00:00.000Z",
    updated_at: "2026-05-15T09:30:00.000Z",
    summary: "mudanca_de_funcao | Roberto Alves | Indústria Metalúrgica SA",
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    requester_name: "Juliana Costa",
    phone: "(11) 95432-1098",
    company: "Farmácia Saúde+",
    employee_name: "Mariana Souza",
    request_type: "exame_demissional",
    status: "Concluído",
    priority: "baixa",
    urgency: null,
    preferred_date: "2026-05-10",
    preferred_period: "tarde",
    initial_notes: null,
    conversation_summary: "Demissional realizado sem intercorrências.",
    dashboard_summary: "Demissional Farmácia Saúde+ — concluído.",
    created_at: "2026-05-08T11:30:00.000Z",
    updated_at: "2026-05-10T16:00:00.000Z",
    summary: "exame_demissional | Juliana Costa | Farmácia Saúde+",
  },
  {
    id: "a1b2c3d4-0006-4000-8000-000000000006",
    requester_name: "Fernando Dias",
    phone: "(21) 94321-0987",
    company: "Transportadora Veloz",
    employee_name: "Ricardo Nunes",
    request_type: "aso",
    status: "Atendimento de setor responsável",
    priority: "alta",
    urgency: "alta",
    preferred_date: "2026-05-23",
    preferred_period: "manha",
    initial_notes: "Motorista de carga — atividade de risco. Necessita avaliação especial.",
    conversation_summary: "ASO especial para motorista em rota longa. Encaminhado ao setor.",
    dashboard_summary: "ASO Transportadora Veloz — aguardando setor responsável.",
    created_at: "2026-05-11T16:00:00.000Z",
    updated_at: "2026-05-12T08:00:00.000Z",
    summary: "aso | Fernando Dias | Transportadora Veloz",
  },
  {
    id: "a1b2c3d4-0007-4000-8000-000000000007",
    requester_name: "Patrícia Lemos",
    phone: "(11) 93210-9876",
    company: "Escola Futuro",
    employee_name: "Camila Rocha",
    request_type: "exame_admissional",
    status: "Em triagem",
    priority: "media",
    urgency: "media",
    preferred_date: "2026-05-24",
    preferred_period: "tarde",
    initial_notes: "Professora nova. Início de contrato em 01/06.",
    conversation_summary: "Admissional solicitado para professora com início em junho.",
    dashboard_summary: "Admissional Escola Futuro — em triagem.",
    created_at: "2026-05-15T07:45:00.000Z",
    updated_at: "2026-05-15T08:00:00.000Z",
    summary: "exame_admissional | Patrícia Lemos | Escola Futuro",
  },
  {
    id: "a1b2c3d4-0008-4000-8000-000000000008",
    requester_name: "Marcos Vieira",
    phone: "(11) 92109-8765",
    company: "Restaurante Sabor & Cia",
    employee_name: "Thiago Gomes",
    request_type: "exame_periodico",
    status: "Novo",
    priority: "baixa",
    urgency: null,
    preferred_date: "2026-05-28",
    preferred_period: "tarde",
    initial_notes: "Periódico anual do cozinheiro.",
    conversation_summary: "Empresa solicita periódico de rotina para funcionário da cozinha.",
    dashboard_summary: "Periódico Restaurante Sabor & Cia — aguardando triagem.",
    created_at: "2026-05-15T09:00:00.000Z",
    updated_at: "2026-05-15T09:00:00.000Z",
    summary: "exame_periodico | Marcos Vieira | Restaurante Sabor & Cia",
  },
  {
    id: "a1b2c3d4-0009-4000-8000-000000000009",
    requester_name: "Luciana Martins",
    phone: "(11) 91098-7654",
    company: "Consultoria Prime",
    employee_name: "André Moraes",
    request_type: "duvida",
    status: "Cancelado",
    priority: "baixa",
    urgency: null,
    preferred_date: null,
    preferred_period: null,
    initial_notes: "Cliente desistiu do agendamento após esclarecimento.",
    conversation_summary: "Dúvida sobre tipo de exame necessário. Cancelado após orientação.",
    dashboard_summary: "Dúvida Consultoria Prime — cancelado.",
    created_at: "2026-05-09T13:00:00.000Z",
    updated_at: "2026-05-10T10:00:00.000Z",
    summary: "duvida | Luciana Martins | Consultoria Prime",
  },
  {
    id: "a1b2c3d4-0010-4000-8000-000000000010",
    requester_name: "Eduardo Prado",
    phone: "(11) 90987-6543",
    company: "TechCorp Ltda",
    employee_name: "Beatriz Nascimento",
    request_type: "exame_admissional",
    status: "Agendado",
    priority: "alta",
    urgency: "alta",
    preferred_date: "2026-05-20",
    preferred_period: "manha",
    initial_notes: "Designer. Início em 22/05.",
    conversation_summary: "Segundo admissional da TechCorp este mês.",
    dashboard_summary: "Admissional TechCorp (Beatriz) — agendado para 20/05.",
    created_at: "2026-05-13T08:00:00.000Z",
    updated_at: "2026-05-14T10:00:00.000Z",
    summary: "exame_admissional | Eduardo Prado | TechCorp Ltda",
  },
  {
    id: "a1b2c3d4-0011-4000-8000-000000000011",
    requester_name: "Silvia Borges",
    phone: "(31) 98877-6655",
    company: "Mineração Brasileira",
    employee_name: "José Carlos Lima",
    request_type: "exame_periodico",
    status: "Novo",
    priority: "urgente",
    urgency: "urgente",
    preferred_date: "2026-05-19",
    preferred_period: "manha",
    initial_notes: "Periódico vencido há 2 semanas. Fiscalização próxima.",
    conversation_summary: "Empresa em risco de autuação por periódico vencido.",
    dashboard_summary: "Periódico URGENTE Mineração Brasileira — pendente.",
    created_at: "2026-05-15T06:00:00.000Z",
    updated_at: "2026-05-15T06:00:00.000Z",
    summary: "exame_periodico | Silvia Borges | Mineração Brasileira",
  },
  {
    id: "a1b2c3d4-0012-4000-8000-000000000012",
    requester_name: "Henrique Fonseca",
    phone: "(41) 97766-5544",
    company: "Supermercado Bom Preço",
    employee_name: "Sandra Oliveira",
    request_type: "retorno_ao_trabalho",
    status: "Em triagem",
    priority: "alta",
    urgency: "alta",
    preferred_date: "2026-05-21",
    preferred_period: "manha",
    initial_notes: "Retorno após licença médica de 30 dias.",
    conversation_summary: "Funcionária quer retornar ao caixa após licença por LER.",
    dashboard_summary: "Retorno ao trabalho Supermercado Bom Preço — triagem.",
    created_at: "2026-05-14T11:00:00.000Z",
    updated_at: "2026-05-14T13:00:00.000Z",
    summary: "retorno_ao_trabalho | Henrique Fonseca | Supermercado Bom Preço",
  },
  {
    id: "a1b2c3d4-0013-4000-8000-000000000013",
    requester_name: "Tatiane Rocha",
    phone: "(51) 96655-4433",
    company: "Clínica OdontoMax",
    employee_name: "Rafael Cunha",
    request_type: "exame_admissional",
    status: "Agendado",
    priority: "media",
    urgency: "media",
    preferred_date: "2026-05-22",
    preferred_period: "tarde",
    initial_notes: "Dentista novo. Início contrato 26/05.",
    conversation_summary: "Admissional para dentista recém-contratado.",
    dashboard_summary: "Admissional OdontoMax — agendado.",
    created_at: "2026-05-13T14:30:00.000Z",
    updated_at: "2026-05-15T09:00:00.000Z",
    summary: "exame_admissional | Tatiane Rocha | Clínica OdontoMax",
  },
  {
    id: "a1b2c3d4-0014-4000-8000-000000000014",
    requester_name: "Gustavo Melo",
    phone: "(61) 95544-3322",
    company: "Seguradora ConFiança",
    employee_name: "Priscila Vasconcelos",
    request_type: "mudanca_de_funcao",
    status: "Novo",
    priority: "media",
    urgency: null,
    preferred_date: "2026-05-26",
    preferred_period: "tarde",
    initial_notes: "Promoção de analista para gerente. Sem prazo urgente.",
    conversation_summary: "Mudança de função interna — analista promovida a gerente.",
    dashboard_summary: "Mudança de função Seguradora ConFiança — novo.",
    created_at: "2026-05-15T10:00:00.000Z",
    updated_at: "2026-05-15T10:00:00.000Z",
    summary: "mudanca_de_funcao | Gustavo Melo | Seguradora ConFiança",
  },
  {
    id: "a1b2c3d4-0015-4000-8000-000000000015",
    requester_name: "Renata Pinheiro",
    phone: "(71) 94433-2211",
    company: "Estaleiro Bahia",
    employee_name: "Marcos Albuquerque",
    request_type: "aso",
    status: "Concluído",
    priority: "alta",
    urgency: "alta",
    preferred_date: "2026-05-12",
    preferred_period: "manha",
    initial_notes: "ASO para operador de guindaste. Concluído sem restrições.",
    conversation_summary: "ASO especial para atividade de risco concluído com sucesso.",
    dashboard_summary: "ASO Estaleiro Bahia — concluído.",
    created_at: "2026-05-10T07:30:00.000Z",
    updated_at: "2026-05-12T12:00:00.000Z",
    summary: "aso | Renata Pinheiro | Estaleiro Bahia",
  },
];

const detailsByLeadId: Record<string, object> = {
  "a1b2c3d4-0001-4000-8000-000000000001": { employee_role: "Analista de TI", admission_deadline: "esta semana", triage_exam_type: "exame_admissional", specific_question: null },
  "a1b2c3d4-0002-4000-8000-000000000002": { employee_role: "Pedreiro", periodic_type: "Anual", periodic_quantity: "1", periodic_window: "30 dias", triage_exam_type: "exame_periodico", specific_question: null },
  "a1b2c3d4-0003-4000-8000-000000000003": { employee_role: "Motorista", has_return_date: true, return_date: "2026-05-19", has_return_document: true, triage_exam_type: "retorno_ao_trabalho", specific_question: "Médico autorizou retorno?" },
  "a1b2c3d4-0004-4000-8000-000000000004": { employee_role: "Operador de Máquinas", new_role: "Supervisor", has_role_change_deadline: true, role_change_deadline: "2026-05-25", triage_exam_type: "mudanca_de_funcao", specific_question: null },
  "a1b2c3d4-0005-4000-8000-000000000005": { employee_role: "Atendente", dismissal_deadline: "2026-05-10", triage_exam_type: "exame_demissional", specific_question: null },
  "a1b2c3d4-0006-4000-8000-000000000006": { employee_role: "Motorista de Carga", aso_purpose: "Renovação anual", triage_exam_type: "aso", specific_question: "Exame toxicológico incluso?" },
  "a1b2c3d4-0007-4000-8000-000000000007": { employee_role: "Professora", admission_deadline: "até 31/05", triage_exam_type: "exame_admissional", specific_question: null },
  "a1b2c3d4-0008-4000-8000-000000000008": { employee_role: "Cozinheiro", periodic_type: "Anual", triage_exam_type: "exame_periodico", specific_question: null },
  "a1b2c3d4-0009-4000-8000-000000000009": { employee_role: "Consultor", triage_exam_type: "duvida", specific_question: "Qual exame é necessário para cargo de TI?" },
  "a1b2c3d4-0010-4000-8000-000000000010": { employee_role: "Designer", admission_deadline: "2026-05-22", triage_exam_type: "exame_admissional", specific_question: null },
  "a1b2c3d4-0011-4000-8000-000000000011": { employee_role: "Operador de Mineração", periodic_type: "Anual", triage_exam_type: "exame_periodico", specific_question: "Audiometria inclusa?" },
  "a1b2c3d4-0012-4000-8000-000000000012": { employee_role: "Operadora de Caixa", has_return_date: true, return_date: "2026-05-21", has_return_document: true, triage_exam_type: "retorno_ao_trabalho", specific_question: "Restrição de esforço repetitivo?" },
  "a1b2c3d4-0013-4000-8000-000000000013": { employee_role: "Dentista", admission_deadline: "2026-05-26", triage_exam_type: "exame_admissional", specific_question: null },
  "a1b2c3d4-0014-4000-8000-000000000014": { employee_role: "Analista → Gerente", new_role: "Gerente", triage_exam_type: "mudanca_de_funcao", specific_question: null },
  "a1b2c3d4-0015-4000-8000-000000000015": { employee_role: "Operador de Guindaste", aso_purpose: "Atividade de risco", triage_exam_type: "aso", specific_question: null },
};

const historyByLeadId: Record<string, object[]> = {
  "a1b2c3d4-0001-4000-8000-000000000001": [
    { id: "h1-1", event_type: "lead_criado", description: "Lead criado via WhatsApp", author_type: "system", event_origin: "whatsapp", created_at: "2026-05-15T08:30:00.000Z" },
  ],
  "a1b2c3d4-0004-4000-8000-000000000004": [
    { id: "h4-1", event_type: "lead_criado", description: "Lead criado via WhatsApp", author_type: "system", event_origin: "whatsapp", created_at: "2026-05-12T09:00:00.000Z" },
    { id: "h4-2", event_type: "status_alterado", description: "Status alterado para Agendado", author_type: "user", event_origin: "replit", old_value: "Em triagem", new_value: "Agendado", created_at: "2026-05-15T09:30:00.000Z" },
  ],
  "a1b2c3d4-0005-4000-8000-000000000005": [
    { id: "h5-1", event_type: "lead_criado", description: "Lead criado via site", author_type: "system", event_origin: "site", created_at: "2026-05-08T11:30:00.000Z" },
    { id: "h5-2", event_type: "status_alterado", description: "Exame realizado com sucesso", author_type: "user", event_origin: "replit", old_value: "Agendado", new_value: "Concluído", created_at: "2026-05-10T16:00:00.000Z" },
  ],
  "a1b2c3d4-0015-4000-8000-000000000015": [
    { id: "h15-1", event_type: "lead_criado", description: "Lead criado via WhatsApp", author_type: "system", event_origin: "whatsapp", created_at: "2026-05-10T07:30:00.000Z" },
    { id: "h15-2", event_type: "status_alterado", description: "ASO concluído sem restrições", author_type: "user", event_origin: "replit", old_value: "Agendado", new_value: "Concluído", created_at: "2026-05-12T12:00:00.000Z" },
  ],
};

const scheduleByLeadId: Record<string, object[]> = {
  "a1b2c3d4-0004-4000-8000-000000000004": [
    { id: "s4-1", preferred_date: "2026-05-21", preferred_period: "manha", schedule_status: "confirmado", schedule_notes: "Confirmado com o colaborador", confirmed_at: "2026-05-15T09:30:00.000Z" },
  ],
  "a1b2c3d4-0005-4000-8000-000000000005": [
    { id: "s5-1", preferred_date: "2026-05-10", preferred_period: "tarde", schedule_status: "confirmado", schedule_notes: null, confirmed_at: "2026-05-08T14:00:00.000Z" },
  ],
  "a1b2c3d4-0010-4000-8000-000000000010": [
    { id: "s10-1", preferred_date: "2026-05-20", preferred_period: "manha", schedule_status: "confirmado", schedule_notes: "Paciente confirmou presença", confirmed_at: "2026-05-14T10:00:00.000Z" },
  ],
  "a1b2c3d4-0013-4000-8000-000000000013": [
    { id: "s13-1", preferred_date: "2026-05-22", preferred_period: "tarde", schedule_status: "pendente", schedule_notes: "Aguardando confirmação do paciente", confirmed_at: null },
  ],
  "a1b2c3d4-0015-4000-8000-000000000015": [
    { id: "s15-1", preferred_date: "2026-05-12", preferred_period: "manha", schedule_status: "confirmado", schedule_notes: null, confirmed_at: "2026-05-10T09:00:00.000Z" },
  ],
};

export function getMockLeadDashboard(leadId: string) {
  const lead = mockLeads.find((l) => l.id === leadId);
  if (!lead) return null;
  return {
    success: true,
    lead_id: leadId,
    lead,
    details: detailsByLeadId[leadId] ?? {},
    schedule: scheduleByLeadId[leadId] ?? [],
    history: historyByLeadId[leadId] ?? [
      {
        id: `h-${leadId}-auto`,
        event_type: "lead_criado",
        description: "Lead criado via demo mode",
        author_type: "system",
        event_origin: "demo",
        created_at: lead.created_at,
      },
    ],
    summary: lead.summary,
    next_action: lead.status === "Novo" ? "Realizar triagem" : "Acompanhar atendimento",
  };
}

// ─── Tipos e mock data para SolicitacaoDetalhe ───────────────────────────────

export type Status =
  | "novo"
  | "em_triagem"
  | "aguardando_documento"
  | "agendado"
  | "em_atendimento"
  | "concluido"
  | "cancelado";

export interface Documento {
  nome: string;
  obrigatorio: boolean;
  entregue: boolean;
  entregue_em?: string;
}

export interface HistoricoEvento {
  id: string;
  data: string;
  tipo: "status" | "observacao" | "documento" | "contato" | "agendamento";
  descricao: string;
  autor: string;
}

export interface SolicitacaoDetalhada {
  id: string;
  colaborador: string;
  cpf: string;
  cargo: string;
  empresa: string;
  cnpj: string;
  solicitante: string;
  telefone: string;
  email: string;
  tipo: string;
  status: Status;
  prioridade: Prioridade;
  prazo: string;
  recebido_em: string;
  agendado_para?: string;
  medico_responsavel?: string;
  preferencia_periodo: "manha" | "tarde" | "qualquer";
  observacao?: string;
  setor?: string;
  documentos: Documento[];
  historico: HistoricoEvento[];
}

export const mockSolicitacoesDetalhadas: SolicitacaoDetalhada[] = [
  {
    id: "SOL-001",
    colaborador: "João Santos",
    cpf: "123.456.789-01",
    cargo: "Analista de TI",
    empresa: "TechCorp Ltda",
    cnpj: "12.345.678/0001-90",
    solicitante: "Maria Silva",
    telefone: "(11) 99876-5432",
    email: "maria@techcorp.com",
    tipo: "admissional",
    status: "novo",
    prioridade: "alta",
    prazo: "2026-05-30",
    recebido_em: "2026-05-20T08:30:00",
    preferencia_periodo: "manha",
    observacao: "Início previsto para 30/05",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: false },
      { nome: "Foto 3x4 recente", obrigatorio: true, entregue: false },
      { nome: "Carteira de vacinação", obrigatorio: false, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-20T08:30:00", tipo: "status", descricao: "Solicitação recebida via WhatsApp", autor: "Sistema" },
    ],
  },
  {
    id: "SOL-002",
    colaborador: "Pedro Oliveira",
    cpf: "234.567.890-12",
    cargo: "Pedreiro",
    empresa: "Construtora ABC",
    cnpj: "23.456.789/0001-01",
    solicitante: "Carlos Mendes",
    telefone: "(11) 98765-4321",
    email: "carlos@construtoraabc.com",
    tipo: "periodico",
    status: "em_triagem",
    prioridade: "media",
    prazo: "2026-06-05",
    recebido_em: "2026-05-19T14:00:00",
    preferencia_periodo: "qualquer",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: true },
      { nome: "ASO anterior", obrigatorio: true, entregue: false },
      { nome: "Certificado NR-35", obrigatorio: false, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-19T14:00:00", tipo: "status", descricao: "Solicitação recebida via site", autor: "Sistema" },
      { id: "H002", data: "2026-05-20T09:15:00", tipo: "contato", descricao: "Contato realizado com solicitante para confirmar dados", autor: "Ana Paula" },
      { id: "H003", data: "2026-05-20T09:20:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Ana Paula" },
    ],
  },
  {
    id: "SOL-003",
    colaborador: "Fernanda Lima",
    cpf: "345.678.901-23",
    cargo: "Motorista",
    empresa: "Logística Express",
    cnpj: "34.567.890/0001-12",
    solicitante: "Ana Rodrigues",
    telefone: "(21) 97654-3210",
    email: "ana@logisticaexpress.com",
    tipo: "retorno_afastamento",
    status: "aguardando_documento",
    prioridade: "urgente",
    prazo: "2026-05-27",
    recebido_em: "2026-05-18T10:15:00",
    preferencia_periodo: "manha",
    observacao: "Afastamento por acidente de trabalho — prazo crítico",
    documentos: [
      { nome: "Laudo médico do afastamento", obrigatorio: true, entregue: false },
      { nome: "RG / CPF", obrigatorio: true, entregue: true },
      { nome: "Atestado de alta médica", obrigatorio: true, entregue: false },
      { nome: "Boletim de ocorrência", obrigatorio: false, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-18T10:15:00", tipo: "status", descricao: "Solicitação recebida via WhatsApp", autor: "Sistema" },
      { id: "H002", data: "2026-05-18T11:00:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Ana Paula" },
      { id: "H003", data: "2026-05-19T08:30:00", tipo: "documento", descricao: "RG/CPF recebido e registrado", autor: "Ana Paula" },
      { id: "H004", data: "2026-05-19T08:35:00", tipo: "status", descricao: "Status alterado para: Aguardando Documento", autor: "Ana Paula" },
      { id: "H005", data: "2026-05-20T10:00:00", tipo: "contato", descricao: "Ligação para cobrar laudo médico — empresa informou que enviará até amanhã", autor: "Carlos" },
    ],
  },
  {
    id: "SOL-004",
    colaborador: "Lucas Ferreira",
    cpf: "456.789.012-34",
    cargo: "Operador de Máquinas → Supervisor",
    empresa: "Indústria Metalúrgica SA",
    cnpj: "45.678.901/0001-23",
    solicitante: "Roberto Alves",
    telefone: "(11) 96543-2109",
    email: "roberto@metalurgica.com",
    tipo: "mudanca_funcao",
    status: "agendado",
    prioridade: "media",
    prazo: "2026-05-28",
    recebido_em: "2026-05-17T09:00:00",
    agendado_para: "2026-05-23T10:00:00",
    medico_responsavel: "Dra. Patrícia Almeida",
    preferencia_periodo: "manha",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: true },
      { nome: "Exames anteriores", obrigatorio: true, entregue: true },
      { nome: "Termo de mudança de função", obrigatorio: false, entregue: true },
    ],
    historico: [
      { id: "H001", data: "2026-05-17T09:00:00", tipo: "status", descricao: "Solicitação recebida via telefone", autor: "Sistema" },
      { id: "H002", data: "2026-05-17T14:00:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Ana Paula" },
      { id: "H003", data: "2026-05-18T09:00:00", tipo: "documento", descricao: "Todos os documentos recebidos", autor: "Ana Paula" },
      { id: "H004", data: "2026-05-19T10:30:00", tipo: "agendamento", descricao: "Consulta agendada para 23/05 às 10h com Dra. Patrícia", autor: "Ana Paula" },
      { id: "H005", data: "2026-05-19T10:35:00", tipo: "status", descricao: "Status alterado para: Agendado", autor: "Ana Paula" },
    ],
  },
  {
    id: "SOL-005",
    colaborador: "Mariana Souza",
    cpf: "567.890.123-45",
    cargo: "Atendente",
    empresa: "Farmácia Saúde+",
    cnpj: "56.789.012/0001-34",
    solicitante: "Juliana Costa",
    telefone: "(11) 95432-1098",
    email: "juliana@farmaciasaude.com",
    tipo: "demissional",
    status: "concluido",
    prioridade: "baixa",
    prazo: "2026-05-15",
    recebido_em: "2026-05-10T11:30:00",
    agendado_para: "2026-05-13T14:00:00",
    medico_responsavel: "Dr. Ricardo Braga",
    preferencia_periodo: "tarde",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: true },
      { nome: "Carteira de trabalho", obrigatorio: true, entregue: true },
      { nome: "Carta demissional", obrigatorio: false, entregue: true },
    ],
    historico: [
      { id: "H001", data: "2026-05-10T11:30:00", tipo: "status", descricao: "Solicitação recebida via site", autor: "Sistema" },
      { id: "H002", data: "2026-05-10T15:00:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Carlos" },
      { id: "H003", data: "2026-05-11T09:00:00", tipo: "documento", descricao: "Documentação completa recebida", autor: "Carlos" },
      { id: "H004", data: "2026-05-11T10:00:00", tipo: "agendamento", descricao: "Consulta agendada para 13/05 às 14h com Dr. Ricardo", autor: "Carlos" },
      { id: "H005", data: "2026-05-13T16:00:00", tipo: "status", descricao: "ASO emitido e entregue. Solicitação concluída.", autor: "Dr. Ricardo Braga" },
    ],
  },
  {
    id: "SOL-006",
    colaborador: "Ricardo Nunes",
    cpf: "678.901.234-56",
    cargo: "Motorista de Carga",
    empresa: "Transportadora Veloz",
    cnpj: "67.890.123/0001-45",
    solicitante: "Fernando Dias",
    telefone: "(21) 94321-0987",
    email: "fernando@veloz.com",
    tipo: "aso",
    status: "em_atendimento",
    prioridade: "alta",
    prazo: "2026-05-27",
    recebido_em: "2026-05-16T16:00:00",
    agendado_para: "2026-05-21T09:00:00",
    medico_responsavel: "Dr. Marcos Pereira",
    preferencia_periodo: "manha",
    observacao: "Necessita avaliação especial - atividade de risco",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: true },
      { nome: "CNH categoria D/E", obrigatorio: true, entregue: true },
      { nome: "Exame toxicológico", obrigatorio: true, entregue: false },
      { nome: "ASO anterior", obrigatorio: false, entregue: true },
    ],
    historico: [
      { id: "H001", data: "2026-05-16T16:00:00", tipo: "status", descricao: "Solicitação recebida via WhatsApp", autor: "Sistema" },
      { id: "H002", data: "2026-05-17T08:00:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Ana Paula" },
      { id: "H003", data: "2026-05-18T10:00:00", tipo: "documento", descricao: "RG/CPF e CNH recebidos", autor: "Ana Paula" },
      { id: "H004", data: "2026-05-19T09:00:00", tipo: "agendamento", descricao: "Consulta agendada para 21/05 às 9h com Dr. Marcos", autor: "Carlos" },
      { id: "H005", data: "2026-05-21T09:30:00", tipo: "status", descricao: "Status alterado para: Em Atendimento", autor: "Dr. Marcos Pereira" },
      { id: "H006", data: "2026-05-21T10:00:00", tipo: "observacao", descricao: "Aguardando resultado do exame toxicológico para emissão do ASO", autor: "Dr. Marcos Pereira" },
    ],
  },
  {
    id: "SOL-007",
    colaborador: "Camila Rocha",
    cpf: "789.012.345-67",
    cargo: "Professora",
    empresa: "Escola Futuro",
    cnpj: "78.901.234/0001-56",
    solicitante: "Patrícia Lemos",
    telefone: "(11) 93210-9876",
    email: "patricia@escolafuturo.com",
    tipo: "admissional",
    status: "em_triagem",
    prioridade: "media",
    prazo: "2026-06-01",
    recebido_em: "2026-05-20T07:45:00",
    preferencia_periodo: "tarde",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: false },
      { nome: "Diploma / Certificado", obrigatorio: true, entregue: false },
      { nome: "Foto 3x4 recente", obrigatorio: false, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-20T07:45:00", tipo: "status", descricao: "Solicitação recebida via site", autor: "Sistema" },
      { id: "H002", data: "2026-05-20T10:00:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Carlos" },
    ],
  },
  {
    id: "SOL-008",
    colaborador: "Thiago Gomes",
    cpf: "890.123.456-78",
    cargo: "Cozinheiro",
    empresa: "Restaurante Sabor & Cia",
    cnpj: "89.012.345/0001-67",
    solicitante: "Marcos Vieira",
    telefone: "(11) 92109-8765",
    email: "marcos@saborecia.com",
    tipo: "periodico",
    status: "novo",
    prioridade: "baixa",
    prazo: "2026-06-10",
    recebido_em: "2026-05-20T09:00:00",
    preferencia_periodo: "qualquer",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: false },
      { nome: "Carteira de saúde", obrigatorio: true, entregue: false },
      { nome: "ASO anterior", obrigatorio: false, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-20T09:00:00", tipo: "status", descricao: "Solicitação recebida via WhatsApp", autor: "Sistema" },
    ],
  },
  {
    id: "SOL-009",
    colaborador: "André Moraes",
    cpf: "901.234.567-89",
    cargo: "Consultor",
    empresa: "Consultoria Prime",
    cnpj: "90.123.456/0001-78",
    solicitante: "Luciana Martins",
    telefone: "(11) 91098-7654",
    email: "luciana@prime.com",
    tipo: "triagem_inicial",
    status: "cancelado",
    prioridade: "baixa",
    prazo: "2026-05-20",
    recebido_em: "2026-05-14T13:00:00",
    preferencia_periodo: "tarde",
    observacao: "Cliente desistiu do agendamento",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-14T13:00:00", tipo: "status", descricao: "Solicitação recebida via telefone", autor: "Sistema" },
      { id: "H002", data: "2026-05-15T09:00:00", tipo: "contato", descricao: "Tentativa de contato — não atendeu", autor: "Ana Paula" },
      { id: "H003", data: "2026-05-16T10:00:00", tipo: "contato", descricao: "Cliente retornou ligação e informou cancelamento", autor: "Ana Paula" },
      { id: "H004", data: "2026-05-16T10:05:00", tipo: "status", descricao: "Status alterado para: Cancelado. Motivo: cliente desistiu.", autor: "Ana Paula" },
    ],
  },
  {
    id: "SOL-010",
    colaborador: "Beatriz Nascimento",
    cpf: "012.345.678-90",
    cargo: "Designer",
    empresa: "TechCorp Ltda",
    cnpj: "12.345.678/0001-90",
    solicitante: "Eduardo Prado",
    telefone: "(11) 90987-6543",
    email: "eduardo@techcorp.com",
    tipo: "admissional",
    status: "agendado",
    prioridade: "alta",
    prazo: "2026-05-26",
    recebido_em: "2026-05-18T08:00:00",
    agendado_para: "2026-05-22T09:00:00",
    medico_responsavel: "Dra. Patrícia Almeida",
    preferencia_periodo: "manha",
    documentos: [
      { nome: "RG / CPF", obrigatorio: true, entregue: true },
      { nome: "Foto 3x4 recente", obrigatorio: true, entregue: true },
      { nome: "Carteira de vacinação", obrigatorio: false, entregue: false },
    ],
    historico: [
      { id: "H001", data: "2026-05-18T08:00:00", tipo: "status", descricao: "Solicitação recebida via WhatsApp", autor: "Sistema" },
      { id: "H002", data: "2026-05-18T11:00:00", tipo: "status", descricao: "Status alterado para: Em Triagem", autor: "Carlos" },
      { id: "H003", data: "2026-05-19T09:00:00", tipo: "documento", descricao: "RG/CPF e foto recebidos", autor: "Carlos" },
      { id: "H004", data: "2026-05-19T14:00:00", tipo: "agendamento", descricao: "Consulta agendada para 22/05 às 9h com Dra. Patrícia", autor: "Carlos" },
      { id: "H005", data: "2026-05-19T14:05:00", tipo: "status", descricao: "Status alterado para: Agendado", autor: "Carlos" },
    ],
  },
];

export const mockDashboard = {
  tempo_medio_triagem_horas: 2.4,
  tempo_medio_agendamento_dias: 3.1,
};
