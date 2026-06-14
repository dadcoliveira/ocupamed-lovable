import { useState, useEffect } from "react";

// ── Aba: Integrações ─────────────────────────────────────────────
function AbaIntegracoes() {
  const [simulando, setSimulando] = useState(false);
  const [simulacaoConcluida, setSimulacaoConcluida] = useState(false);
  const [etapaSimulacao, setEtapaSimulacao] = useState(0);
  const [mostrarFluxo, setMostrarFluxo] = useState(false);

  const ETAPAS_SIMULACAO = [
    "📲 Mensagem recebida no WhatsApp...",
    "🤖 IA identificando intenção: exame admissional...",
    "📋 Coletando dados: empresa, colaborador, cargo...",
    "✅ Dados completos. Criando solicitação no CRM...",
    "🔔 Notificação enviada para a equipe...",
    "✅ Solicitação criada com sucesso!",
  ];

  function simularMensagem() {
    setSimulando(true);
    setSimulacaoConcluida(false);
    setEtapaSimulacao(0);
    ETAPAS_SIMULACAO.forEach((_, i) => {
      setTimeout(() => {
        setEtapaSimulacao(i + 1);
        if (i === ETAPAS_SIMULACAO.length - 1) {
          setSimulando(false);
          setSimulacaoConcluida(true);
        }
      }, (i + 1) * 900);
    });
  }

  return (
    <div className="space-y-6">

      {/* Card WhatsApp */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">💬</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">WhatsApp Business</p>
              <p className="text-xs text-gray-500">Canal principal de atendimento</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Status</p>
              <p className="text-sm font-semibold text-amber-600">⏳ Aguardando conexão</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Número</p>
              <p className="text-sm font-semibold text-gray-500">Não configurado</p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setMostrarFluxo(!mostrarFluxo)}
              className="w-full flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-xl transition-all"
            >
              <span>📋 Como o cliente conecta o WhatsApp?</span>
              <span>{mostrarFluxo ? "▲" : "▼"}</span>
            </button>
            {mostrarFluxo && (
              <div className="mt-3 space-y-2">
                {[
                  { n: "1", texto: "A clínica disponibiliza o número de WhatsApp comercial ao OcupaMed" },
                  { n: "2", texto: "O administrador acessa esta tela e clica em 'Conectar WhatsApp'" },
                  { n: "3", texto: "Escaneia o QR Code com o WhatsApp da clínica (Aparelhos conectados)" },
                  { n: "4", texto: "A IA de triagem é ativada automaticamente no número conectado" },
                  { n: "5", texto: "Empresas que enviarem mensagem passam a ter solicitações criadas automaticamente no CRM" },
                ].map((e) => (
                  <div key={e.n} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {e.n}
                    </span>
                    <p className="text-sm text-gray-700">{e.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              disabled
              className="flex-1 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl opacity-40 cursor-not-allowed"
            >
              📱 Conectar WhatsApp
            </button>
            <button
              onClick={simularMensagem}
              disabled={simulando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              {simulando ? "⏳ Simulando..." : "🧪 Simular mensagem recebida"}
            </button>
          </div>

          {(simulando || simulacaoConcluida) && (
            <div className="bg-gray-900 rounded-2xl p-4 font-mono text-xs space-y-1.5">
              <p className="text-gray-400 mb-2">{"// Simulação de mensagem WhatsApp → IA → CRM"}</p>
              {ETAPAS_SIMULACAO.slice(0, etapaSimulacao).map((etapa, i) => (
                <p key={i} className={i === etapaSimulacao - 1 && simulando ? "text-yellow-400" : "text-green-400"}>
                  {etapa}
                </p>
              ))}
              {simulacaoConcluida && (
                <div className="mt-3 border-t border-gray-700 pt-3 space-y-1">
                  <p className="text-blue-400">{"// Solicitação criada:"}</p>
                  <p className="text-gray-300">empresa: <span className="text-green-300">"Transportes Alfa"</span></p>
                  <p className="text-gray-300">colaborador: <span className="text-green-300">"João Silva"</span></p>
                  <p className="text-gray-300">tipo: <span className="text-green-300">"Exame Admissional"</span></p>
                  <p className="text-gray-300">origem: <span className="text-green-300">"whatsapp"</span></p>
                  <p className="text-gray-300">status: <span className="text-yellow-300">"triagem_ia"</span></p>
                  <p className="text-gray-300">prioridade: <span className="text-red-300">"alta"</span></p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

interface Usuario {
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
  telefone?: string;
}

interface ConfigNotificacoes {
  prazo_vencido: boolean;
  prazo_proximo: boolean;
  doc_pendente: boolean;
  novo_agendamento: boolean;
  status_atualizado: boolean;
  antecedencia_dias: number;
  email_ativo: boolean;
  som_ativo: boolean;
}

interface ConfigSistema {
  tema: "claro" | "escuro";
  idioma: string;
  fuso_horario: string;
  itens_por_pagina: number;
  status_padrao: string;
  prioridade_padrao: string;
}

interface ConfigCRM {
  nome_clinica: string;
  cnpj: string;
  telefone: string;
  email_contato: string;
  endereco: string;
  logo_url?: string;
  prazo_padrao_dias: number;
  tipos_exame_ativos: string[];
}

const USUARIO_INICIAL: Usuario = {
  nome: "Dr. Admin",
  email: "admin@ocupamed.com.br",
  cargo: "Administrador",
  telefone: "(11) 99999-0000",
};

const NOTIF_INICIAL: ConfigNotificacoes = {
  prazo_vencido:     true,
  prazo_proximo:     true,
  doc_pendente:      true,
  novo_agendamento:  true,
  status_atualizado: false,
  antecedencia_dias: 3,
  email_ativo:       false,
  som_ativo:         true,
};

const SISTEMA_INICIAL: ConfigSistema = {
  tema:              "claro",
  idioma:            "pt-BR",
  fuso_horario:      "America/Sao_Paulo",
  itens_por_pagina:  20,
  status_padrao:     "novo",
  prioridade_padrao: "media",
};

const CRM_INICIAL: ConfigCRM = {
  nome_clinica:       "OcupaMed Clínica",
  cnpj:               "00.000.000/0001-00",
  telefone:           "(11) 3000-0000",
  email_contato:      "contato@ocupamed.com.br",
  endereco:           "Av. Paulista, 1000 — São Paulo/SP",
  prazo_padrao_dias:  5,
  tipos_exame_ativos: [
    "admissional","demissional","periodico",
    "retorno_afastamento","mudanca_funcao","monitoramento",
    "avaliacao_clinica","audiometria","acuidade_visual",
  ],
};

const TIPOS_EXAME = [
  { id: "admissional",         label: "Admissional" },
  { id: "demissional",         label: "Demissional" },
  { id: "periodico",           label: "Periódico" },
  { id: "retorno_afastamento", label: "Retorno Afastamento" },
  { id: "mudanca_funcao",      label: "Mudança de Função" },
  { id: "monitoramento",       label: "Monitoramento" },
  { id: "avaliacao_clinica",   label: "Avaliação Clínica" },
  { id: "audiometria",         label: "Audiometria" },
  { id: "acuidade_visual",     label: "Acuidade Visual" },
];

const STATUS_OPCOES = [
  { id: "novo",                 label: "Novo" },
  { id: "em_triagem",           label: "Em Triagem" },
  { id: "aguardando_documento", label: "Ag. Documento" },
  { id: "agendado",             label: "Agendado" },
  { id: "em_atendimento",       label: "Em Atendimento" },
];

const PRIORIDADE_OPCOES = [
  { id: "urgente", label: "Urgente" },
  { id: "alta",    label: "Alta" },
  { id: "media",   label: "Média" },
  { id: "baixa",   label: "Baixa" },
];

function Toggle({
  ativo,
  onChange,
  disabled = false,
}: {
  ativo: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!ativo)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        ativo ? "bg-blue-600" : "bg-gray-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          ativo ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ConfigRow({
  label,
  descricao,
  children,
}: {
  label: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {descricao && <p className="text-xs text-gray-400 mt-0.5">{descricao}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Secao({
  icone,
  titulo,
  children,
}: {
  icone: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>{icone}</span>
          {titulo}
        </h3>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function Configuracoes() {
  const [abaAtiva, setAbaAtiva] = useState<"config" | "integracoes">("config");

  const [usuario, setUsuario] = useState<Usuario>(USUARIO_INICIAL);
  const [notif, setNotif] = useState<ConfigNotificacoes>(NOTIF_INICIAL);
  const [sistema, setSistema] = useState<ConfigSistema>(() => ({
    ...SISTEMA_INICIAL,
    tema: localStorage.getItem("theme") === "dark" ? "escuro" : "claro",
  }));
  const [crm, setCrm] = useState<ConfigCRM>(CRM_INICIAL);

  useEffect(() => {
    const root = document.documentElement;
    if (sistema.tema === "escuro") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [sistema.tema]);

  const [salvando, setSalvando] = useState(false);
  const [salvoOk, setSalvoOk] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [senhaOk, setSenhaOk] = useState(false);

  function salvar() {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      setSalvoOk(true);
      setTimeout(() => setSalvoOk(false), 2500);
    }, 700);
  }

  function alterarSenha() {
    setErroSenha("");
    if (!senhaAtual) return setErroSenha("Informe a senha atual.");
    if (senhaNova.length < 6) return setErroSenha("A nova senha deve ter ao menos 6 caracteres.");
    if (senhaNova !== senhaConfirm) return setErroSenha("As senhas não coincidem.");
    setSenhaOk(true);
    setSenhaAtual("");
    setSenhaNova("");
    setSenhaConfirm("");
    setTimeout(() => setSenhaOk(false), 3000);
  }

  function toggleTipoExame(id: string) {
    setCrm((c) => ({
      ...c,
      tipos_exame_ativos: c.tipos_exame_ativos.includes(id)
        ? c.tipos_exame_ativos.filter((t) => t !== id)
        : [...c.tipos_exame_ativos, id],
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
            <p className="text-sm text-gray-500">Gerencie preferências e dados do sistema</p>
          </div>
          {abaAtiva === "config" && (
            <button
              onClick={salvar}
              disabled={salvando}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                salvoOk ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-60`}
            >
              {salvando ? "Salvando..." : salvoOk ? "✅ Salvo!" : "Salvar alterações"}
            </button>
          )}
        </div>

        {/* Abas */}
        <div className="flex gap-0 mt-4">
          {([
            { id: "config",       label: "⚙️ Configurações" },
            { id: "integracoes",  label: "🔗 Integrações" },
          ] as const).map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                abaAtiva === aba.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aba Integrações */}
      {abaAtiva === "integracoes" && (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <AbaIntegracoes />
        </div>
      )}

      {/* Aba Configurações */}
      {abaAtiva === "config" && (
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* Perfil do usuário */}
        <Secao icone="👤" titulo="Perfil do usuário">
          <div className="py-4 flex items-center gap-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{usuario.nome}</p>
              <p className="text-xs text-gray-500">{usuario.cargo}</p>
              <button className="text-xs text-blue-500 hover:underline mt-1">Alterar foto</button>
            </div>
          </div>

          <ConfigRow label="Nome completo">
            <input
              value={usuario.nome}
              onChange={(e) => setUsuario((u) => ({ ...u, nome: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="E-mail">
            <input
              type="email"
              value={usuario.email}
              onChange={(e) => setUsuario((u) => ({ ...u, email: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="Cargo / função">
            <input
              value={usuario.cargo}
              onChange={(e) => setUsuario((u) => ({ ...u, cargo: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="Telefone">
            <input
              value={usuario.telefone || ""}
              onChange={(e) => setUsuario((u) => ({ ...u, telefone: e.target.value }))}
              placeholder="(11) 99999-0000"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
        </Secao>

        {/* Segurança */}
        <Secao icone="🔒" titulo="Segurança">
          <div className="py-4 flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Senha atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••••"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nova senha</label>
              <input
                type="password"
                value={senhaNova}
                onChange={(e) => setSenhaNova(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Confirmar nova senha</label>
              <input
                type="password"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
                placeholder="Repita a nova senha"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {erroSenha && <p className="text-xs text-red-500 font-medium">{erroSenha}</p>}
            {senhaOk && <p className="text-xs text-green-600 font-medium">✅ Senha alterada com sucesso!</p>}
            <button
              onClick={alterarSenha}
              className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-lg transition-colors mt-1"
            >
              Alterar senha
            </button>
          </div>
        </Secao>

        {/* Notificações */}
        <Secao icone="🔔" titulo="Notificações">
          <ConfigRow label="Prazo vencido" descricao="Alerta quando uma solicitação passa do prazo">
            <Toggle ativo={notif.prazo_vencido} onChange={(v) => setNotif((n) => ({ ...n, prazo_vencido: v }))} />
          </ConfigRow>
          <ConfigRow label="Prazo próximo" descricao={`Avisa com antecedência de ${notif.antecedencia_dias} dia(s)`}>
            <div className="flex items-center gap-3">
              <input
                type="number" min={1} max={14}
                value={notif.antecedencia_dias}
                onChange={(e) => setNotif((n) => ({ ...n, antecedencia_dias: Number(e.target.value) }))}
                disabled={!notif.prazo_proximo}
                className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-40"
              />
              <Toggle ativo={notif.prazo_proximo} onChange={(v) => setNotif((n) => ({ ...n, prazo_proximo: v }))} />
            </div>
          </ConfigRow>
          <ConfigRow label="Documentos pendentes" descricao="Alerta sobre documentos obrigatórios em falta">
            <Toggle ativo={notif.doc_pendente} onChange={(v) => setNotif((n) => ({ ...n, doc_pendente: v }))} />
          </ConfigRow>
          <ConfigRow label="Agendamentos do dia" descricao="Notifica sobre consultas agendadas para hoje">
            <Toggle ativo={notif.novo_agendamento} onChange={(v) => setNotif((n) => ({ ...n, novo_agendamento: v }))} />
          </ConfigRow>
          <ConfigRow label="Atualizações de status" descricao="Notifica cada mudança de status">
            <Toggle ativo={notif.status_atualizado} onChange={(v) => setNotif((n) => ({ ...n, status_atualizado: v }))} />
          </ConfigRow>
          <ConfigRow label="Notificações por e-mail" descricao="Envia resumo diário por e-mail">
            <Toggle ativo={notif.email_ativo} onChange={(v) => setNotif((n) => ({ ...n, email_ativo: v }))} />
          </ConfigRow>
          <ConfigRow label="Som de notificação" descricao="Toca um som ao receber alertas">
            <Toggle ativo={notif.som_ativo} onChange={(v) => setNotif((n) => ({ ...n, som_ativo: v }))} />
          </ConfigRow>
        </Secao>

        {/* Aparência e sistema */}
        <Secao icone="🎨" titulo="Aparência e sistema">
          <ConfigRow label="Tema" descricao="Aparência visual do sistema">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(["claro", "escuro"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSistema((s) => ({ ...s, tema: t }))}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sistema.tema === t ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t === "claro" ? "☀️ Claro" : "🌙 Escuro"}
                </button>
              ))}
            </div>
          </ConfigRow>
          <ConfigRow label="Itens por página" descricao="Quantidade de registros nas listagens">
            <select
              value={sistema.itens_por_pagina}
              onChange={(e) => setSistema((s) => ({ ...s, itens_por_pagina: Number(e.target.value) }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n} itens</option>)}
            </select>
          </ConfigRow>
          <ConfigRow label="Status padrão" descricao="Status inicial de novas solicitações">
            <select
              value={sistema.status_padrao}
              onChange={(e) => setSistema((s) => ({ ...s, status_padrao: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {STATUS_OPCOES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </ConfigRow>
          <ConfigRow label="Prioridade padrão" descricao="Prioridade inicial de novas solicitações">
            <select
              value={sistema.prioridade_padrao}
              onChange={(e) => setSistema((s) => ({ ...s, prioridade_padrao: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {PRIORIDADE_OPCOES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </ConfigRow>
          <ConfigRow label="Fuso horário">
            <select
              value={sistema.fuso_horario}
              onChange={(e) => setSistema((s) => ({ ...s, fuso_horario: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Belem">Belém (GMT-3)</option>
              <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
              <option value="America/Recife">Recife (GMT-3)</option>
              <option value="America/Bahia">Salvador (GMT-3)</option>
              <option value="America/Cuiaba">Cuiabá (GMT-4)</option>
              <option value="America/Porto_Velho">Porto Velho (GMT-4)</option>
              <option value="America/Noronha">Noronha (GMT-2)</option>
            </select>
          </ConfigRow>
        </Secao>

        {/* Dados da clínica */}
        <Secao icone="🏥" titulo="Dados da clínica">
          <ConfigRow label="Nome da clínica">
            <input
              value={crm.nome_clinica}
              onChange={(e) => setCrm((c) => ({ ...c, nome_clinica: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="CNPJ">
            <input
              value={crm.cnpj}
              onChange={(e) => setCrm((c) => ({ ...c, cnpj: e.target.value }))}
              placeholder="00.000.000/0001-00"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="Telefone">
            <input
              value={crm.telefone}
              onChange={(e) => setCrm((c) => ({ ...c, telefone: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="E-mail de contato">
            <input
              type="email"
              value={crm.email_contato}
              onChange={(e) => setCrm((c) => ({ ...c, email_contato: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="Endereço">
            <input
              value={crm.endereco}
              onChange={(e) => setCrm((c) => ({ ...c, endereco: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
          <ConfigRow label="Prazo padrão (dias)" descricao="Dias corridos para conclusão de uma solicitação">
            <input
              type="number" min={1} max={60}
              value={crm.prazo_padrao_dias}
              onChange={(e) => setCrm((c) => ({ ...c, prazo_padrao_dias: Number(e.target.value) }))}
              className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </ConfigRow>
        </Secao>

        {/* Tipos de exame */}
        <Secao icone="🩺" titulo="Tipos de exame ativos">
          <div className="py-4 flex flex-col gap-1">
            {TIPOS_EXAME.map((t) => (
              <label
                key={t.id}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={crm.tipos_exame_ativos.includes(t.id)}
                  onChange={() => toggleTipoExame(t.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">{t.label}</span>
              </label>
            ))}
          </div>
        </Secao>

        {/* Botão salvar final */}
        <div className="flex justify-end pb-6">
          <button
            onClick={salvar}
            disabled={salvando}
            className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              salvoOk ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            } disabled:opacity-60`}
          >
            {salvando ? "Salvando..." : salvoOk ? "✅ Salvo!" : "Salvar todas as alterações"}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
