import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";
import { Status, Prioridade } from "@/data/mockData";

const statusLabels: Record<Status, string> = {
  novo: "Novo",
  em_triagem: "Em Triagem",
  aguardando_documento: "Aguardando Documento",
  agendado: "Agendado",
  em_atendimento: "Em Atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusColors: Record<Status, string> = {
  novo: "bg-blue-100 text-blue-700 border-blue-200",
  em_triagem: "bg-yellow-100 text-yellow-700 border-yellow-200",
  aguardando_documento: "bg-orange-100 text-orange-700 border-orange-200",
  agendado: "bg-purple-100 text-purple-700 border-purple-200",
  em_atendimento: "bg-cyan-100 text-cyan-700 border-cyan-200",
  concluido: "bg-green-100 text-green-700 border-green-200",
  cancelado: "bg-red-100 text-red-700 border-red-200",
};

const prioridadeColors: Record<Prioridade, string> = {
  baixa: "bg-gray-100 text-gray-600 border-gray-200",
  media: "bg-blue-100 text-blue-600 border-blue-200",
  alta: "bg-orange-100 text-orange-700 border-orange-200",
  urgente: "bg-red-100 text-red-700 border-red-200",
};

const tipoLabels: Record<string, string> = {
  admissional: "Admissional",
  demissional: "Demissional",
  periodico: "Periódico",
  retorno_afastamento: "Retorno de Afastamento",
  mudanca_funcao: "Mudança de Função",
  monitoramento: "Monitoramento",
  aso: "ASO",
  triagem_inicial: "Triagem Inicial",
};

const periodoLabels: Record<string, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  qualquer: "Qualquer horário",
};

const eventoIcons: Record<string, string> = {
  status: "🔄",
  observacao: "📝",
  documento: "📄",
  contato: "📞",
  agendamento: "📅",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SolicitacaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { solicitacoes, updateStatus, updatePrioridade, marcarDocumento, addHistorico } = useSolicitacoes();

  const [novaObservacao, setNovaObservacao] = useState("");
  const [abaAtiva, setAbaAtiva] = useState<"dados" | "documentos" | "historico">("dados");

  const solicitacao = solicitacoes.find((s) => s.id === id);

  function handleVoltar() {
    navigate("/app/solicitacoes");
  }

  if (!solicitacao) {
    return (
      <div className="p-8 text-center text-gray-500">
        Solicitação não encontrada.
        <button onClick={handleVoltar} className="ml-4 text-blue-600 underline">
          Voltar
        </button>
      </div>
    );
  }

  function adicionarObservacao() {
    if (!novaObservacao.trim() || !id) return;
    addHistorico(id, novaObservacao.trim(), "Usuário");
    setNovaObservacao("");
  }

  const docsPendentes = solicitacao.documentos.filter((d) => d.obrigatorio && !d.entregue).length;
  const docsEntregues = solicitacao.documentos.filter((d) => d.entregue).length;
  const docsTotal = solicitacao.documentos.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={handleVoltar}
            className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm"
          >
            ← Voltar
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Solicitações</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-800">{solicitacao.id}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{solicitacao.colaborador}</h1>
            <p className="text-sm text-gray-500">
              {solicitacao.empresa} · {solicitacao.cargo}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[solicitacao.status]}`}>
              {statusLabels[solicitacao.status]}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${prioridadeColors[solicitacao.prioridade]}`}>
              {solicitacao.prioridade.charAt(0).toUpperCase() + solicitacao.prioridade.slice(1)}
            </span>
            {docsPendentes > 0 && (
              <span className="text-xs font-medium px-3 py-1 rounded-full border bg-red-50 text-red-600 border-red-200">
                ⚠ {docsPendentes} doc{docsPendentes > 1 ? "s" : ""} pendente{docsPendentes > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda — ações rápidas */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Alterar Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Alterar Status</p>
            <div className="flex flex-col gap-2">
              {(Object.keys(statusLabels) as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => id && updateStatus(id, s)}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                    solicitacao.status === s
                      ? statusColors[s] + " font-semibold"
                      : "border-gray-100 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {solicitacao.status === s ? "✓ " : ""}
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Alterar Prioridade */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Prioridade</p>
            <div className="grid grid-cols-2 gap-2">
              {(["baixa", "media", "alta", "urgente"] as Prioridade[]).map((p) => (
                <button
                  key={p}
                  onClick={() => id && updatePrioridade(id, p)}
                  className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                    solicitacao.prioridade === p
                      ? prioridadeColors[p] + " font-semibold"
                      : "border-gray-100 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {solicitacao.prioridade === p ? "✓ " : ""}
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Resumo documentos */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Documentos</p>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: docsTotal > 0 ? `${(docsEntregues / docsTotal) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{docsEntregues}/{docsTotal}</span>
            </div>
            {docsPendentes > 0 ? (
              <p className="text-xs text-red-500">⚠ {docsPendentes} obrigatório(s) pendente(s)</p>
            ) : (
              <p className="text-xs text-green-600">✓ Todos os obrigatórios entregues</p>
            )}
          </div>

          {/* Info rápida */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Informações</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo</span>
                <span className="font-medium text-gray-800">{tipoLabels[solicitacao.tipo] ?? solicitacao.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prazo</span>
                <span className={`font-medium ${new Date(solicitacao.prazo) < new Date() && solicitacao.status !== "concluido" ? "text-red-600" : "text-gray-800"}`}>
                  {formatDate(solicitacao.prazo)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recebido</span>
                <span className="font-medium text-gray-800">{formatDate(solicitacao.recebido_em)}</span>
              </div>
              {solicitacao.agendado_para && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Agendado</span>
                  <span className="font-medium text-purple-700">{formatDateTime(solicitacao.agendado_para)}</span>
                </div>
              )}
              {solicitacao.medico_responsavel && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Médico</span>
                  <span className="font-medium text-gray-800">{solicitacao.medico_responsavel}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Preferência</span>
                <span className="font-medium text-gray-800">{periodoLabels[solicitacao.preferencia_periodo]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita — abas */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {(["dados", "documentos", "historico"] as const).map((aba) => (
                <button
                  key={aba}
                  onClick={() => setAbaAtiva(aba)}
                  className={`flex-1 py-3 text-sm font-medium transition-all ${
                    abaAtiva === aba
                      ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {aba === "dados" && "📋 Dados"}
                  {aba === "documentos" && `📄 Documentos ${docsPendentes > 0 ? `(${docsPendentes} ⚠)` : ""}`}
                  {aba === "historico" && `🕐 Histórico (${solicitacao.historico.length})`}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Aba Dados */}
              {abaAtiva === "dados" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Colaborador</p>
                    <p className="text-sm font-medium text-gray-800">{solicitacao.colaborador}</p>
                    <p className="text-xs text-gray-500">{solicitacao.cpf}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Cargo</p>
                    <p className="text-sm font-medium text-gray-800">{solicitacao.cargo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Empresa</p>
                    <p className="text-sm font-medium text-gray-800">{solicitacao.empresa}</p>
                    <p className="text-xs text-gray-500">{solicitacao.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Solicitante</p>
                    <p className="text-sm font-medium text-gray-800">{solicitacao.solicitante}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Telefone</p>
                    <p className="text-sm font-medium text-gray-800">{solicitacao.telefone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">E-mail</p>
                    <p className="text-sm font-medium text-gray-800">{solicitacao.email}</p>
                  </div>
                  {solicitacao.observacao && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Observação</p>
                      <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                        {solicitacao.observacao}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Aba Documentos */}
              {abaAtiva === "documentos" && (
                <div className="flex flex-col gap-3">
                  {solicitacao.documentos.map((doc, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        doc.entregue
                          ? "bg-green-50 border-green-200"
                          : doc.obrigatorio
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{doc.entregue ? "✅" : doc.obrigatorio ? "❌" : "⬜"}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.nome}</p>
                          <p className="text-xs text-gray-500">
                            {doc.obrigatorio ? "Obrigatório" : "Opcional"} ·{" "}
                            {doc.entregue ? "Entregue" : "Pendente"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => id && marcarDocumento(id, i)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          doc.entregue
                            ? "border-gray-300 text-gray-600 hover:bg-gray-100"
                            : "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
                        }`}
                      >
                        {doc.entregue ? "Desmarcar" : "Marcar entregue"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Aba Histórico */}
              {abaAtiva === "historico" && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={novaObservacao}
                      onChange={(e) => setNovaObservacao(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && adicionarObservacao()}
                      placeholder="Adicionar observação ou registro..."
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      onClick={adicionarObservacao}
                      disabled={!novaObservacao.trim()}
                      className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Registrar
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[...solicitacao.historico].reverse().map((evento) => (
                      <div key={evento.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">
                            {eventoIcons[evento.tipo]}
                          </div>
                          <div className="w-px flex-1 bg-gray-100 mt-1" />
                        </div>
                        <div className="pb-4 flex-1">
                          <p className="text-sm text-gray-800">{evento.descricao}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDateTime(evento.data)} · {evento.autor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
