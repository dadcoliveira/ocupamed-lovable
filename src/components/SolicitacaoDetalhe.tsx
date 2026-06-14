import { useState } from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";
import { Status, Prioridade, SolicitacaoDetalhada } from "@/data/mockData";

interface Props {
  solicitacaoId: string;
  onVoltar: () => void;
}

const STATUS_OPCOES: { id: Status; label: string; cor: string; bg: string }[] = [
  { id: "novo",                 label: "Novo",           cor: "text-blue-700",   bg: "bg-blue-100" },
  { id: "em_triagem",           label: "Em Triagem",     cor: "text-yellow-700", bg: "bg-yellow-100" },
  { id: "aguardando_documento", label: "Ag. Documento",  cor: "text-orange-700", bg: "bg-orange-100" },
  { id: "agendado",             label: "Agendado",       cor: "text-purple-700", bg: "bg-purple-100" },
  { id: "em_atendimento",       label: "Em Atendimento", cor: "text-cyan-700",   bg: "bg-cyan-100" },
  { id: "concluido",            label: "Concluído",      cor: "text-green-700",  bg: "bg-green-100" },
  { id: "cancelado",            label: "Cancelado",      cor: "text-red-700",    bg: "bg-red-100" },
];

const PRIORIDADE_OPCOES: { id: Prioridade; label: string; cor: string }[] = [
  { id: "urgente", label: "Urgente", cor: "text-red-600" },
  { id: "alta",    label: "Alta",    cor: "text-orange-600" },
  { id: "media",   label: "Média",   cor: "text-blue-600" },
  { id: "baixa",   label: "Baixa",   cor: "text-gray-500" },
];

const LABEL_TIPO: Record<string, string> = {
  admissional:         "Admissional",
  demissional:         "Demissional",
  periodico:           "Periódico",
  retorno_afastamento: "Retorno Afastamento",
  mudanca_funcao:      "Mudança de Função",
  monitoramento:       "Monitoramento",
};

const ICONE_HISTORICO: Record<string, string> = {
  criacao:     "🆕",
  status:      "🔄",
  nota:        "📝",
  observacao:  "📝",
  documento:   "📄",
  agendamento: "📅",
};

type DocLocal = {
  id: string;
  nome: string;
  obrigatorio: boolean;
  entregue: boolean;
  entregue_em?: string;
};

export default function SolicitacaoDetalhe({ solicitacaoId, onVoltar }: Props) {
  const { solicitacoes, updateSolicitacao } = useSolicitacoes();
  const original = solicitacoes.find((s) => s.id === solicitacaoId);

  const [dados, setDados] = useState<SolicitacaoDetalhada | null>(() => original ?? null);

  const [documentos, setDocumentos] = useState<DocLocal[]>(() =>
    (original?.documentos ?? []).map((d, i) => ({
      id: `doc-${i}`,
      nome: d.nome,
      obrigatorio: d.obrigatorio,
      entregue: d.entregue,
      entregue_em: d.entregue_em,
    }))
  );
  const [novaNota, setNovaNota] = useState("");
  const [novoAgendamento, setNovoAgendamento] = useState(
    original?.agendado_para?.slice(0, 16) || ""
  );
  const [novoMedico, setNovoMedico] = useState(original?.medico_responsavel || "");
  const [abaAtiva, setAbaAtiva] = useState<"dados" | "documentos" | "historico">("dados");
  const [salvando, setSalvando] = useState(false);
  const [salvoOk, setSalvoOk] = useState(false);

  if (!dados) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-gray-400">Solicitação não encontrada.</p>
      </div>
    );
  }

  const statusAtual = STATUS_OPCOES.find((s) => s.id === dados.status)!;
  const prazoVencido =
    dados.status !== "concluido" &&
    dados.status !== "cancelado" &&
    new Date(dados.prazo) < new Date();

  function adicionarHistorico(tipo: SolicitacaoDetalhada["historico"][0]["tipo"], descricao: string) {
    const novo = {
      id: `h${Date.now()}`,
      data: new Date().toISOString(),
      autor: "Você",
      tipo,
      descricao,
    };
    return [...(dados!.historico || []), novo];
  }

  function mudarStatus(novoStatus: Status) {
    if (novoStatus === dados!.status) return;
    const labelAnterior = STATUS_OPCOES.find((s) => s.id === dados!.status)?.label;
    const labelNovo = STATUS_OPCOES.find((s) => s.id === novoStatus)?.label;
    const historico = adicionarHistorico(
      "status",
      `Status alterado de "${labelAnterior}" para "${labelNovo}".`
    );
    setDados((d) => d ? { ...d, status: novoStatus, historico } : d);
  }

  function mudarPrioridade(nova: Prioridade) {
    if (nova === dados!.prioridade) return;
    const historico = adicionarHistorico(
      "observacao",
      `Prioridade alterada para "${nova}".`
    );
    setDados((d) => d ? { ...d, prioridade: nova, historico } : d);
  }

  function toggleDocumento(id: string) {
    const doc = documentos.find((d) => d.id === id);
    if (!doc) return;
    const novoEntregue = !doc.entregue;
    const historico = adicionarHistorico(
      "documento",
      `Documento "${doc.nome}" marcado como ${novoEntregue ? "entregue ✅" : "pendente ⏳"}.`
    );
    setDocumentos((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, entregue: novoEntregue, entregue_em: novoEntregue ? new Date().toISOString() : undefined }
          : d
      )
    );
    setDados((d) => d ? { ...d, historico } : d);
  }

  function adicionarNota() {
    if (!novaNota.trim()) return;
    const historico = adicionarHistorico("observacao", novaNota.trim());
    setDados((d) => d ? { ...d, historico } : d);
    setNovaNota("");
  }

  function salvarAgendamento() {
    if (!novoAgendamento) return;
    const historico = adicionarHistorico(
      "agendamento",
      `Agendamento definido para ${new Date(novoAgendamento).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })}${novoMedico ? ` com ${novoMedico}` : ""}.`
    );
    setDados((d) =>
      d
        ? {
            ...d,
            agendado_para: new Date(novoAgendamento).toISOString(),
            medico_responsavel: novoMedico || d.medico_responsavel,
            status: d.status === "novo" || d.status === "em_triagem" ? "agendado" : d.status,
            historico,
          }
        : d
    );
  }

  function salvar() {
    if (!dados) return;
    setSalvando(true);
    setTimeout(() => {
      updateSolicitacao(dados.id, dados);
      setSalvando(false);
      setSalvoOk(true);
      setTimeout(() => setSalvoOk(false), 2500);
    }, 600);
  }

  const docsEntregues = documentos.filter((d) => d.entregue).length;
  const docsTotal = documentos.length;
  const progresso = docsTotal > 0 ? Math.round((docsEntregues / docsTotal) * 100) : 0;
  const docsObrigPendentes = documentos.filter((d) => d.obrigatorio && !d.entregue).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onVoltar}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
          >
            ← Voltar
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Solicitações</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-800">{dados.colaborador}</span>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{dados.colaborador}</h1>
            <p className="text-sm text-gray-500">
              {dados.empresa} · {LABEL_TIPO[dados.tipo] || dados.tipo}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusAtual.bg} ${statusAtual.cor}`}>
              {statusAtual.label}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              dados.prioridade === "urgente" ? "bg-red-100 text-red-700 border-red-200" :
              dados.prioridade === "alta"    ? "bg-orange-100 text-orange-700 border-orange-200" :
              dados.prioridade === "media"   ? "bg-blue-100 text-blue-700 border-blue-200" :
              "bg-gray-100 text-gray-600 border-gray-200"
            }`}>
              {dados.prioridade}
            </span>
            {prazoVencido && (
              <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-red-50 text-red-600 border border-red-200">
                ⏰ Prazo vencido
              </span>
            )}
            <button
              onClick={salvar}
              disabled={salvando}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                salvoOk
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-60`}
            >
              {salvando ? "Salvando..." : salvoOk ? "✅ Salvo!" : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {(["dados", "documentos", "historico"] as const).map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                abaAtiva === aba
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {aba === "dados" && "📋 Dados"}
              {aba === "documentos" && `📄 Documentos${docsObrigPendentes > 0 ? ` (${docsObrigPendentes} pendentes)` : ""}`}
              {aba === "historico" && `🕐 Histórico (${dados.historico?.length || 0})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── ABA DADOS ── */}
        {abaAtiva === "dados" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Coluna principal */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Informações gerais */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Informações gerais</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Colaborador",   valor: dados.colaborador },
                    { label: "Empresa",       valor: dados.empresa },
                    { label: "Tipo de exame", valor: LABEL_TIPO[dados.tipo] || dados.tipo },
                    { label: "Setor",         valor: dados.setor || "—" },
                    { label: "Telefone",      valor: dados.telefone || "—" },
                    { label: "E-mail",        valor: dados.email || "—" },
                    { label: "Recebido em",   valor: new Date(dados.recebido_em).toLocaleDateString("pt-BR") },
                    { label: "Prazo",         valor: new Date(dados.prazo).toLocaleDateString("pt-BR") },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      <p className={`font-medium ${item.label === "Prazo" && prazoVencido ? "text-red-600" : "text-gray-800"}`}>
                        {item.valor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agendamento */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">📅 Agendamento</h3>
                {dados.agendado_para && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-700">
                      {new Date(dados.agendado_para).toLocaleString("pt-BR", {
                        weekday: "long", day: "2-digit", month: "long",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                    {dados.medico_responsavel && (
                      <p className="text-xs text-purple-500 mt-0.5">
                        Médico: {dados.medico_responsavel}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Data e hora</label>
                    <input
                      type="datetime-local"
                      value={novoAgendamento}
                      onChange={(e) => setNovoAgendamento(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Médico responsável</label>
                    <input
                      type="text"
                      value={novoMedico}
                      onChange={(e) => setNovoMedico(e.target.value)}
                      placeholder="Nome do médico..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <button
                    onClick={salvarAgendamento}
                    disabled={!novoAgendamento}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40"
                  >
                    {dados.agendado_para ? "Atualizar agendamento" : "Confirmar agendamento"}
                  </button>
                </div>
              </div>

              {/* Adicionar nota */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📝 Adicionar nota</h3>
                <textarea
                  value={novaNota}
                  onChange={(e) => setNovaNota(e.target.value)}
                  placeholder="Digite uma observação, instrução ou nota interna..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={adicionarNota}
                  disabled={!novaNota.trim()}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40"
                >
                  Adicionar nota
                </button>
              </div>
            </div>

            {/* Coluna lateral */}
            <div className="flex flex-col gap-5">

              {/* Alterar status */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">🔄 Alterar status</h3>
                <div className="flex flex-col gap-2">
                  {STATUS_OPCOES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => mudarStatus(s.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        dados.status === s.id
                          ? `${s.bg} ${s.cor} border-current`
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {dados.status === s.id ? "● " : "○ "}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alterar prioridade */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">🚦 Prioridade</h3>
                <div className="flex flex-col gap-2">
                  {PRIORIDADE_OPCOES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => mudarPrioridade(p.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        dados.prioridade === p.id
                          ? `bg-gray-100 ${p.cor} border-gray-300 font-bold`
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {dados.prioridade === p.id ? "● " : "○ "}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo docs */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📄 Documentos</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: `${docsTotal > 0 ? (docsEntregues / docsTotal) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {docsEntregues}/{docsTotal}
                  </span>
                </div>
                {docsObrigPendentes > 0 && (
                  <p className="text-xs text-orange-600 font-medium">
                    ⚠️ {docsObrigPendentes} obrigatório(s) pendente(s)
                  </p>
                )}
                <button
                  onClick={() => setAbaAtiva("documentos")}
                  className="mt-2 w-full text-xs text-blue-500 hover:underline text-left"
                >
                  Gerenciar documentos →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ABA DOCUMENTOS ── */}
        {abaAtiva === "documentos" && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-700">
                Documentos — {docsEntregues} de {docsTotal} entregues
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {progresso}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    doc.entregue
                      ? "bg-green-50 border-green-200"
                      : doc.obrigatorio
                      ? "bg-orange-50 border-orange-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggleDocumento(doc.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      doc.entregue
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {doc.entregue && "✓"}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${doc.entregue ? "text-green-800 line-through" : "text-gray-800"}`}>
                      {doc.nome}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {doc.obrigatorio && (
                        <span className="text-xs text-orange-600 font-medium">obrigatório</span>
                      )}
                      {doc.entregue && doc.entregue_em && (
                        <span className="text-xs text-green-600">
                          entregue em {new Date(doc.entregue_em).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                      {!doc.entregue && (
                        <span className="text-xs text-gray-400">pendente</span>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    doc.entregue
                      ? "bg-green-100 text-green-700"
                      : doc.obrigatorio
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {doc.entregue ? "✅ Entregue" : doc.obrigatorio ? "⚠️ Pendente" : "Opcional"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABA HISTÓRICO ── */}
        {abaAtiva === "historico" && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-5">
              Histórico de atividades
            </h3>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={novaNota}
                onChange={(e) => setNovaNota(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && adicionarNota()}
                placeholder="Adicionar nota rápida... (Enter para salvar)"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={adicionarNota}
                disabled={!novaNota.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40"
              >
                + Nota
              </button>
            </div>

            <div className="flex flex-col gap-0">
              {[...(dados.historico || [])].reverse().map((item, idx, arr) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm flex-shrink-0">
                      {ICONE_HISTORICO[item.tipo] || "📌"}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-100 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-800">{item.autor}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.data).toLocaleString("pt-BR", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
