import { useState, useMemo } from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";

type Visualizacao = "semana" | "dia" | "lista";

const LABEL_TIPO: Record<string, string> = {
  admissional:         "Admissional",
  demissional:         "Demissional",
  periodico:           "Periódico",
  retorno_afastamento: "Retorno Afas.",
  mudanca_funcao:      "Mud. Função",
  monitoramento:       "Monitoramento",
};

const COR_PRIORIDADE: Record<string, string> = {
  urgente: "bg-red-100 border-red-300 text-red-800",
  alta:    "bg-orange-100 border-orange-300 text-orange-800",
  media:   "bg-blue-100 border-blue-300 text-blue-800",
  baixa:   "bg-gray-100 border-gray-300 text-gray-700",
};

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function isMesmaData(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inicioSemana(data: Date) {
  const d = new Date(data);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDias(data: Date, n: number) {
  const d = new Date(data);
  d.setDate(d.getDate() + n);
  return d;
}

// ── Card de agendamento ──────────────────────────────────────────
function AgendamentoCard({
  sol,
  compact = false,
  onClick,
}: {
  sol: { id: string; colaborador: string; empresa: string; tipo: string; prioridade: string; agendado_para?: string; medico_responsavel?: string };
  compact?: boolean;
  onClick?: () => void;
}) {
  const hora = sol.agendado_para
    ? new Date(sol.agendado_para).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border px-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity ${
        COR_PRIORIDADE[sol.prioridade] || COR_PRIORIDADE.baixa
      } ${compact ? "text-xs" : "text-sm"}`}
    >
      <div className="flex items-center gap-1.5 font-semibold truncate">
        <span>{hora}</span>
        <span className="truncate">{sol.colaborador}</span>
      </div>
      {!compact && (
        <>
          <p className="truncate text-xs opacity-75 mt-0.5">{sol.empresa}</p>
          <p className="truncate text-xs opacity-60">
            {LABEL_TIPO[sol.tipo] || sol.tipo}
            {sol.medico_responsavel ? ` · ${sol.medico_responsavel}` : ""}
          </p>
        </>
      )}
    </div>
  );
}

export default function Agenda() {
  const { solicitacoes } = useSolicitacoes();

  const hoje = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [visualizacao, setVisualizacao] = useState<Visualizacao>("semana");
  const [dataBase, setDataBase] = useState(new Date(hoje));
  const [diaSelecionado, setDiaSelecionado] = useState(new Date(hoje));
  const [detalhe, setDetalhe] = useState<typeof solicitacoes[0] | null>(null);

  // Todos os agendamentos (exceto cancelados)
  const agendamentos = useMemo(
    () => solicitacoes.filter((s) => s.agendado_para && s.status !== "cancelado"),
    [solicitacoes]
  );

  // Agendamentos de um dia específico
  function agendamentosDoDia(dia: Date) {
    return agendamentos
      .filter((s) => isMesmaData(new Date(s.agendado_para!), dia))
      .sort(
        (a, b) =>
          new Date(a.agendado_para!).getTime() - new Date(b.agendado_para!).getTime()
      );
  }

  // Semana atual
  const semana = useMemo(() => {
    const inicio = inicioSemana(dataBase);
    return Array.from({ length: 7 }, (_, i) => addDias(inicio, i));
  }, [dataBase]);

  function navegar(direcao: -1 | 1) {
    if (visualizacao === "semana") {
      setDataBase((d) => addDias(d, direcao * 7));
    } else if (visualizacao === "dia") {
      const novo = addDias(diaSelecionado, direcao);
      setDiaSelecionado(novo);
      setDataBase(novo);
    } else {
      setDataBase((d) => addDias(d, direcao * 7));
    }
  }

  function irParaHoje() {
    setDataBase(new Date(hoje));
    setDiaSelecionado(new Date(hoje));
  }

  const tituloHeader = useMemo(() => {
    if (visualizacao === "dia") {
      return diaSelecionado.toLocaleDateString("pt-BR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
      });
    }
    const inicio = semana[0];
    const fim = semana[6];
    if (inicio.getMonth() === fim.getMonth()) {
      return `${inicio.getDate()} – ${fim.getDate()} de ${MESES[inicio.getMonth()]} ${inicio.getFullYear()}`;
    }
    return `${inicio.getDate()} ${MESES[inicio.getMonth()]} – ${fim.getDate()} ${MESES[fim.getMonth()]} ${fim.getFullYear()}`;
  }, [visualizacao, semana, diaSelecionado]);

  const agendamentosHoje = agendamentosDoDia(hoje);
  const agendamentosDiaSel = agendamentosDoDia(diaSelecionado);

  // Lista próximos 30 dias
  const listaProximos = useMemo(() => {
    const dias: { dia: Date; items: typeof agendamentos }[] = [];
    for (let i = 0; i < 30; i++) {
      const dia = addDias(hoje, i);
      const items = agendamentosDoDia(dia);
      if (items.length > 0) dias.push({ dia, items });
    }
    return dias;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agendamentos]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Agenda</h1>
            <p className="text-sm text-gray-500">
              {agendamentos.length} agendamentos · {agendamentosHoje.length} hoje
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Visualização */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(["semana", "dia", "lista"] as Visualizacao[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVisualizacao(v)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    visualizacao === v
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {v === "semana" ? "Semana" : v === "dia" ? "Dia" : "Lista"}
                </button>
              ))}
            </div>

            {/* Navegação */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navegar(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={irParaHoje}
                className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={() => navegar(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ›
              </button>
            </div>

            <span className="text-sm font-medium text-gray-700 capitalize">
              {tituloHeader}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Sidebar mini-calendário + resumo */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">

          {/* Mini calendário do mês */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                {MESES[dataBase.getMonth()]} {dataBase.getFullYear()}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setDataBase((d) => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 text-sm"
                >‹</button>
                <button
                  onClick={() => setDataBase((d) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 text-sm"
                >›</button>
              </div>
            </div>

            {/* Cabeçalho dias */}
            <div className="grid grid-cols-7 mb-1">
              {DIAS_SEMANA.map((d) => (
                <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
                  {d[0]}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            {(() => {
              const primeiroDia = new Date(dataBase.getFullYear(), dataBase.getMonth(), 1);
              const ultimoDia = new Date(dataBase.getFullYear(), dataBase.getMonth() + 1, 0);
              const offset = primeiroDia.getDay();
              const totalCelulas = offset + ultimoDia.getDate();
              const celulas = Array.from({ length: Math.ceil(totalCelulas / 7) * 7 }, (_, i) => {
                const diaNum = i - offset + 1;
                if (diaNum < 1 || diaNum > ultimoDia.getDate()) return null;
                return new Date(dataBase.getFullYear(), dataBase.getMonth(), diaNum);
              });

              return (
                <div className="grid grid-cols-7 gap-0.5">
                  {celulas.map((dia, i) => {
                    if (!dia) return <div key={i} />;
                    const temAgend = agendamentosDoDia(dia).length > 0;
                    const ehHoje = isMesmaData(dia, hoje);
                    const ehSelecionado = isMesmaData(dia, diaSelecionado);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setDiaSelecionado(dia);
                          setVisualizacao("dia");
                        }}
                        className={`relative w-7 h-7 mx-auto flex items-center justify-center text-xs rounded-full transition-all ${
                          ehSelecionado
                            ? "bg-blue-600 text-white font-bold"
                            : ehHoje
                            ? "bg-blue-100 text-blue-700 font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {dia.getDate()}
                        {temAgend && !ehSelecionado && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Resumo hoje */}
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Hoje</p>
            {agendamentosHoje.length === 0 ? (
              <p className="text-xs text-gray-400">Nenhum agendamento hoje</p>
            ) : (
              <div className="flex flex-col gap-2">
                {agendamentosHoje.map((s) => (
                  <div key={s.id} onClick={() => setDetalhe(s)} className="cursor-pointer">
                    <AgendamentoCard sol={s} compact />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Área principal */}
        <main className="flex-1 overflow-y-auto p-5">

          {/* VISUALIZAÇÃO SEMANA */}
          {visualizacao === "semana" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[420px]">
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {semana.map((dia, i) => {
                      const ehHoje = isMesmaData(dia, hoje);
                      const count = agendamentosDoDia(dia).length;
                      return (
                        <div
                          key={i}
                          onClick={() => { setDiaSelecionado(dia); setVisualizacao("dia"); }}
                          className={`p-3 text-center border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                            ehHoje ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-xs text-gray-400 font-medium">{DIAS_SEMANA[dia.getDay()]}</p>
                          <p className={`text-lg font-bold mt-0.5 ${ehHoje ? "text-blue-600" : "text-gray-800"}`}>
                            {dia.getDate()}
                          </p>
                          {count > 0 && (
                            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                              {count}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-7 min-h-64">
                    {semana.map((dia, i) => {
                      const items = agendamentosDoDia(dia);
                      const ehHoje = isMesmaData(dia, hoje);
                      return (
                        <div
                          key={i}
                          className={`p-2 border-r border-gray-100 last:border-r-0 min-h-32 ${
                            ehHoje ? "bg-blue-50/40" : ""
                          }`}
                        >
                          {items.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                              <p className="text-xs text-gray-300">—</p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {items.map((s) => (
                                <AgendamentoCard
                                  key={s.id}
                                  sol={s}
                                  compact
                                  onClick={() => setDetalhe(s)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISUALIZAÇÃO DIA */}
          {visualizacao === "dia" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className={`px-5 py-4 border-b border-gray-200 ${
                isMesmaData(diaSelecionado, hoje) ? "bg-blue-50" : ""
              }`}>
                <h2 className="text-base font-semibold text-gray-800 capitalize">
                  {diaSelecionado.toLocaleDateString("pt-BR", {
                    weekday: "long", day: "2-digit", month: "long",
                  })}
                </h2>
                <p className="text-sm text-gray-500">
                  {agendamentosDiaSel.length} agendamento(s)
                </p>
              </div>

              {agendamentosDiaSel.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">Nenhum agendamento neste dia</p>
                  <p className="text-sm mt-1">Use as setas para navegar entre os dias</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {agendamentosDiaSel.map((s) => {
                    const hora = new Date(s.agendado_para!).toLocaleTimeString("pt-BR", {
                      hour: "2-digit", minute: "2-digit",
                    });
                    return (
                      <div
                        key={s.id}
                        onClick={() => setDetalhe(s)}
                        className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="text-center w-14 flex-shrink-0">
                          <p className="text-lg font-bold text-blue-600">{hora}</p>
                        </div>
                        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                          s.prioridade === "urgente" ? "bg-red-400" :
                          s.prioridade === "alta"    ? "bg-orange-400" :
                          s.prioridade === "media"   ? "bg-blue-400" : "bg-gray-300"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{s.colaborador}</p>
                          <p className="text-xs text-gray-500">{s.empresa}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {LABEL_TIPO[s.tipo] || s.tipo}
                            </span>
                            {s.medico_responsavel && (
                              <span className="text-xs text-purple-600">
                                👨‍⚕️ {s.medico_responsavel}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              s.prioridade === "urgente" ? "bg-red-100 text-red-700" :
                              s.prioridade === "alta"    ? "bg-orange-100 text-orange-700" :
                              s.prioridade === "media"   ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {s.prioridade}
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-300 text-lg flex-shrink-0">›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VISUALIZAÇÃO LISTA */}
          {visualizacao === "lista" && (
            <div className="flex flex-col gap-4">
              {listaProximos.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-gray-400">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">Nenhum agendamento nos próximos 30 dias</p>
                </div>
              ) : (
                listaProximos.map(({ dia, items }) => {
                  const ehHoje = isMesmaData(dia, hoje);
                  const amanha = isMesmaData(dia, addDias(hoje, 1));
                  const labelDia = ehHoje
                    ? "Hoje"
                    : amanha
                    ? "Amanhã"
                    : dia.toLocaleDateString("pt-BR", {
                        weekday: "long", day: "2-digit", month: "long",
                      });

                  return (
                    <div key={dia.toISOString()} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className={`px-5 py-3 border-b border-gray-100 flex items-center gap-3 ${
                        ehHoje ? "bg-blue-50" : ""
                      }`}>
                        <span className={`text-sm font-semibold capitalize ${
                          ehHoje ? "text-blue-700" : "text-gray-700"
                        }`}>
                          {labelDia}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {items.length} agendamento(s)
                        </span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {items.map((s) => {
                          const hora = new Date(s.agendado_para!).toLocaleTimeString("pt-BR", {
                            hour: "2-digit", minute: "2-digit",
                          });
                          return (
                            <div
                              key={s.id}
                              onClick={() => setDetalhe(s)}
                              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <span className="text-sm font-bold text-blue-600 w-12 flex-shrink-0">{hora}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{s.colaborador}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {s.empresa} · {LABEL_TIPO[s.tipo] || s.tipo}
                                  {s.medico_responsavel ? ` · ${s.medico_responsavel}` : ""}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                s.prioridade === "urgente" ? "bg-red-100 text-red-700" :
                                s.prioridade === "alta"    ? "bg-orange-100 text-orange-700" :
                                s.prioridade === "media"   ? "bg-blue-100 text-blue-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {s.prioridade}
                              </span>
                              <span className="text-gray-300">›</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal detalhe rápido */}
      {detalhe && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setDetalhe(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">{detalhe.colaborador}</h3>
                <p className="text-sm text-gray-500">{detalhe.empresa}</p>
              </div>
              <button
                onClick={() => setDetalhe(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >×</button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Data/hora</span>
                <span className="font-medium text-gray-800">
                  {new Date(detalhe.agendado_para!).toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo de exame</span>
                <span className="font-medium text-gray-800">{LABEL_TIPO[detalhe.tipo] || detalhe.tipo}</span>
              </div>
              {detalhe.medico_responsavel && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Médico</span>
                  <span className="font-medium text-gray-800">{detalhe.medico_responsavel}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Prioridade</span>
                <span className={`font-semibold ${
                  detalhe.prioridade === "urgente" ? "text-red-600" :
                  detalhe.prioridade === "alta"    ? "text-orange-600" :
                  detalhe.prioridade === "media"   ? "text-blue-600" : "text-gray-500"
                }`}>
                  {detalhe.prioridade}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-gray-800">{detalhe.status.replace(/_/g, " ")}</span>
              </div>
            </div>

            <button
              onClick={() => setDetalhe(null)}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
