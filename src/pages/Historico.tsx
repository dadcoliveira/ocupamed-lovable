import { useState, useMemo } from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";

type TipoEvento = "status" | "nota" | "agendamento" | "criacao" | "documento" | "contato" | "observacao";

interface Atividade {
  id: string;
  data: string;
  usuario: string;
  acao: string;
  detalhe: string;
  tipo: TipoEvento;
  lead_id?: string;
  colaborador?: string;
  empresa?: string;
}

const LABEL_ACAO: Record<TipoEvento, string> = {
  status:      "Status Alterado",
  nota:        "Nota Adicionada",
  observacao:  "Nota Adicionada",
  agendamento: "Agendamento",
  criacao:     "Nova Solicitação",
  documento:   "Documento Validado",
  contato:     "Contato Realizado",
};

const ICONE_TIPO: Record<TipoEvento, string> = {
  status:      "🔄",
  nota:        "📝",
  observacao:  "📝",
  agendamento: "📅",
  criacao:     "✨",
  documento:   "📄",
  contato:     "📞",
};

const CORES_TIPO: Record<TipoEvento, string> = {
  status:      "bg-purple-100 text-purple-700 border-purple-200",
  nota:        "bg-yellow-100 text-yellow-700 border-yellow-200",
  observacao:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  agendamento: "bg-blue-100 text-blue-700 border-blue-200",
  criacao:     "bg-green-100 text-green-700 border-green-200",
  documento:   "bg-orange-100 text-orange-700 border-orange-200",
  contato:     "bg-cyan-100 text-cyan-700 border-cyan-200",
};

export default function Historico() {
  const { solicitacoes } = useSolicitacoes();

  const [aba, setAba] = useState<"geral" | "empresa">("geral");
  const [filtro, setFiltro] = useState("");

  // Aplanar todos os eventos de histórico de todas as solicitações
  const todasAtividades = useMemo<Atividade[]>(() => {
    const lista: Atividade[] = [];
    solicitacoes.forEach((sol) => {
      (sol.historico || []).forEach((ev) => {
        const tipo = (ev.tipo as TipoEvento) || "nota";
        lista.push({
          id: `${sol.id}_${ev.id}`,
          data: ev.data,
          usuario: ev.autor,
          acao: LABEL_ACAO[tipo] || ev.tipo,
          detalhe: ev.descricao,
          tipo,
          lead_id: sol.id,
          colaborador: sol.colaborador,
          empresa: sol.empresa,
        });
      });
    });
    return lista.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [solicitacoes]);

  const atividadesFiltradas = useMemo(() => {
    if (aba === "geral") return todasAtividades;
    const q = filtro.toLowerCase();
    return todasAtividades.filter(
      (a) =>
        a.empresa?.toLowerCase().includes(q) ||
        a.colaborador?.toLowerCase().includes(q)
    );
  }, [todasAtividades, aba, filtro]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Histórico</h1>
            <p className="text-sm text-gray-500">
              {todasAtividades.length} eventos registrados em {solicitacoes.length} solicitações
            </p>
          </div>

          {/* Abas */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setAba("geral")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                aba === "geral" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setAba("empresa")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                aba === "empresa" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Por Empresa
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Filtro (somente na aba Por Empresa) */}
        {aba === "empresa" && (
          <div className="mb-5">
            <input
              type="text"
              placeholder="Buscar por empresa ou colaborador..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 space-y-6 relative">
            {/* Linha vertical */}
            {atividadesFiltradas.length > 1 && (
              <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-100 pointer-events-none" />
            )}

            {atividadesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">Nenhuma atividade encontrada</p>
                {aba === "empresa" && filtro && (
                  <p className="text-sm mt-1">Tente outro nome de empresa ou colaborador</p>
                )}
              </div>
            ) : (
              atividadesFiltradas.map((atv) => {
                const cor = CORES_TIPO[atv.tipo] || CORES_TIPO.nota;
                return (
                  <div key={atv.id} className="relative flex items-start gap-4">
                    {/* Ícone */}
                    <div className={`mt-0.5 w-7 h-7 rounded-full border-2 border-white ring-4 ring-gray-50 z-10 flex items-center justify-center text-sm flex-shrink-0 ${cor}`}>
                      {ICONE_TIPO[atv.tipo] || "•"}
                    </div>

                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cor}`}>
                          {atv.acao}
                        </span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">
                          {new Date(atv.data).toLocaleString("pt-BR", {
                            day: "2-digit", month: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-800 font-medium leading-snug">{atv.detalhe}</p>

                      <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1">👤 {atv.usuario}</span>
                        {atv.colaborador && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span>{atv.colaborador}</span>
                          </>
                        )}
                        {atv.empresa && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="font-semibold text-blue-500">{atv.empresa}</span>
                          </>
                        )}
                        {atv.lead_id && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                              {atv.lead_id}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
