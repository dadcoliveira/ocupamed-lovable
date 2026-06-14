import { useState } from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";
import { Status } from "@/data/mockData";

const COLUNAS: { id: Status; label: string; cor: string; bg: string; borda: string }[] = [
  { id: "novo",                 label: "Novo",           cor: "text-blue-700",   bg: "bg-blue-50",   borda: "border-blue-200" },
  { id: "em_triagem",           label: "Em Triagem",     cor: "text-yellow-700", bg: "bg-yellow-50", borda: "border-yellow-200" },
  { id: "aguardando_documento", label: "Ag. Documento",  cor: "text-orange-700", bg: "bg-orange-50", borda: "border-orange-200" },
  { id: "agendado",             label: "Agendado",       cor: "text-purple-700", bg: "bg-purple-50", borda: "border-purple-200" },
  { id: "em_atendimento",       label: "Em Atendimento", cor: "text-cyan-700",   bg: "bg-cyan-50",   borda: "border-cyan-200" },
  { id: "concluido",            label: "Concluído",      cor: "text-green-700",  bg: "bg-green-50",  borda: "border-green-200" },
];

const COR_PRIORIDADE: Record<string, string> = {
  urgente: "bg-red-100 text-red-700 border-red-200",
  alta:    "bg-orange-100 text-orange-700 border-orange-200",
  media:   "bg-blue-100 text-blue-700 border-blue-200",
  baixa:   "bg-gray-100 text-gray-600 border-gray-200",
};

const LABEL_TIPO: Record<string, string> = {
  admissional:         "Admissional",
  demissional:         "Demissional",
  periodico:           "Periódico",
  retorno_afastamento: "Retorno Afas.",
  mudanca_funcao:      "Mud. Função",
  monitoramento:       "Monitoramento",
};

function isPrazoVencido(prazo: string, status: Status) {
  if (status === "concluido" || status === "cancelado") return false;
  return new Date(prazo) < new Date();
}

function temDocPendente(docs: { obrigatorio: boolean; entregue: boolean }[]) {
  return docs.some((d) => d.obrigatorio && !d.entregue);
}

export default function Pipeline() {
  const { solicitacoes, updateStatus } = useSolicitacoes();
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Status | null>(null);
  const [busca, setBusca] = useState("");

  const filtrados = busca.trim()
    ? solicitacoes.filter(
        (c) =>
          c.colaborador.toLowerCase().includes(busca.toLowerCase()) ||
          c.empresa.toLowerCase().includes(busca.toLowerCase())
      )
    : solicitacoes;

  function handleDragStart(e: React.DragEvent, id: string) {
    setDragging(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, colId: Status) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOver(colId);
  }

  function handleDrop(e: React.DragEvent, colId: Status) {
    e.preventDefault();
    if (!dragging) return;
    updateStatus(dragging, colId);
    setDragging(null);
    setOver(null);
  }

  function handleDragEnd() {
    setDragging(null);
    setOver(null);
  }

  function moverCard(id: string, direcao: "esq" | "dir") {
    const ordemStatus = COLUNAS.map((c) => c.id);
    const card = solicitacoes.find((c) => c.id === id);
    if (!card) return;
    const idx = ordemStatus.indexOf(card.status);
    const novoIdx = direcao === "dir" ? idx + 1 : idx - 1;
    if (novoIdx < 0 || novoIdx >= ordemStatus.length) return;
    updateStatus(id, ordemStatus[novoIdx]);
  }

  const totalPorColuna = (colId: Status) =>
    filtrados.filter((c) => c.status === colId).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500">
            {solicitacoes.length} solicitações · arraste para mover entre etapas
          </p>
        </div>
        <input
          type="text"
          placeholder="Buscar colaborador ou empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Legenda prioridade */}
      <div className="px-4 py-2 flex items-center gap-3 bg-white border-b border-gray-100 overflow-x-auto flex-nowrap">
        <span className="text-xs text-gray-400 font-medium flex-shrink-0">Prioridade:</span>
        {["urgente", "alta", "media", "baixa"].map((p) => (
          <span
            key={p}
            className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${COR_PRIORIDADE[p]}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </span>
        ))}
        <span className="ml-4 text-xs text-gray-400 flex-shrink-0">⏰ prazo vencido</span>
        <span className="text-xs text-gray-400 flex-shrink-0">📄 doc pendente</span>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto px-4 py-5 snap-x snap-mandatory">
        <div className="flex gap-4 h-full">
          {COLUNAS.map((col) => {
            const colCards = filtrados.filter((c) => c.status === col.id);
            const isOver = over === col.id;

            return (
              <div
                key={col.id}
                className={`flex flex-col w-[85vw] md:w-64 flex-shrink-0 snap-start rounded-xl border-2 transition-all ${
                  isOver
                    ? "border-blue-400 bg-blue-50 scale-[1.01]"
                    : `${col.borda} bg-gray-50`
                }`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragLeave={() => setOver(null)}
              >
                {/* Cabeçalho coluna */}
                <div className={`px-4 py-3 rounded-t-xl ${col.bg} border-b ${col.borda}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${col.cor}`}>{col.label}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.cor} border ${col.borda}`}
                    >
                      {totalPorColuna(col.id)}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {colCards.length === 0 && (
                    <div
                      className={`flex-1 flex items-center justify-center rounded-lg border-2 border-dashed min-h-24 transition-all ${
                        isOver ? "border-blue-300 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <p className="text-xs text-gray-400">Solte aqui</p>
                    </div>
                  )}

                  {colCards.map((card) => {
                    const vencido = isPrazoVencido(card.prazo, card.status);
                    const docPend = temDocPendente(card.documentos);
                    const isDraggingThis = dragging === card.id;
                    const ordemStatus = COLUNAS.map((c) => c.id);
                    const idx = ordemStatus.indexOf(card.status);

                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white rounded-xl border p-3 shadow-sm cursor-grab active:cursor-grabbing transition-all select-none ${
                          isDraggingThis
                            ? "opacity-40 scale-95 rotate-1"
                            : "hover:shadow-md hover:-translate-y-0.5"
                        } ${vencido ? "border-red-200" : "border-gray-200"}`}
                      >
                        {/* Badges topo */}
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${COR_PRIORIDADE[card.prioridade]}`}
                          >
                            {card.prioridade}
                          </span>
                          {vencido && (
                            <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
                              ⏰ vencido
                            </span>
                          )}
                          {docPend && (
                            <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded-full">
                              📄 doc
                            </span>
                          )}
                        </div>

                        {/* Dados */}
                        <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                          {card.colaborador}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{card.empresa}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {LABEL_TIPO[card.tipo] || card.tipo}
                        </p>

                        {/* Prazo */}
                        <div
                          className={`mt-2 text-xs font-medium ${
                            vencido ? "text-red-500" : "text-gray-400"
                          }`}
                        >
                          📅 {new Date(card.prazo).toLocaleDateString("pt-BR")}
                        </div>

                        {/* Agendamento */}
                        {card.agendado_para && (
                          <div className="mt-1 text-xs text-purple-600 font-medium">
                            🕐{" "}
                            {new Date(card.agendado_para).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}

                        {/* Botões mover */}
                        <div className="flex gap-1 mt-3">
                          <button
                            onClick={() => moverCard(card.id, "esq")}
                            disabled={idx === 0}
                            className="flex-1 text-xs py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            ← Voltar
                          </button>
                          <button
                            onClick={() => moverCard(card.id, "dir")}
                            disabled={idx === COLUNAS.length - 1}
                            className="flex-1 text-xs py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Avançar →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
