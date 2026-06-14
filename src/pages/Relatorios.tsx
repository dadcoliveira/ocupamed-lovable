import { useState, useMemo } from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";

type Periodo = "7d" | "30d" | "90d" | "custom";
type FormatoExport = "csv" | "json" | "txt";

const LABEL_TIPO: Record<string, string> = {
  admissional:         "Admissional",
  demissional:         "Demissional",
  periodico:           "Periódico",
  retorno_afastamento: "Retorno Afastamento",
  mudanca_funcao:      "Mudança de Função",
  monitoramento:       "Monitoramento",
};

const LABEL_STATUS: Record<string, string> = {
  novo:                 "Novo",
  em_triagem:           "Em Triagem",
  aguardando_documento: "Ag. Documento",
  agendado:             "Agendado",
  em_atendimento:       "Em Atendimento",
  concluido:            "Concluído",
  cancelado:            "Cancelado",
};

const COR_STATUS: Record<string, string> = {
  novo:                 "bg-blue-100 text-blue-700",
  em_triagem:           "bg-yellow-100 text-yellow-700",
  aguardando_documento: "bg-orange-100 text-orange-700",
  agendado:             "bg-purple-100 text-purple-700",
  em_atendimento:       "bg-cyan-100 text-cyan-700",
  concluido:            "bg-green-100 text-green-700",
  cancelado:            "bg-red-100 text-red-700",
};

function addDias(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function baixarArquivo(conteudo: string, nome: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

function BarraProgresso({
  valor,
  total,
  cor = "bg-blue-500",
}: {
  valor: number;
  total: number;
  cor?: string;
}) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${cor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

function KpiCard({
  icone, titulo, valor, sub, cor = "text-gray-900",
}: {
  icone: string; titulo: string; valor: string | number; sub?: string; cor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icone}</span>
      </div>
      <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{titulo}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Relatorios() {
  const { solicitacoes } = useSolicitacoes();

  const hoje = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [dataInicio, setDataInicio] = useState(addDias(hoje, -30).toISOString().slice(0, 10));
  const [dataFim, setDataFim] = useState(hoje.toISOString().slice(0, 10));
  const [filtroEmpresa, setFiltroEmpresa] = useState("todas");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [exportando, setExportando] = useState(false);
  const [exportOk, setExportOk] = useState(false);

  const intervalo = useMemo(() => {
    if (periodo === "custom") {
      return {
        inicio: new Date(dataInicio + "T00:00:00"),
        fim: new Date(dataFim + "T23:59:59"),
      };
    }
    const dias = periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
    return { inicio: addDias(hoje, -dias), fim: hoje };
  }, [periodo, dataInicio, dataFim, hoje]);

  const dados = useMemo(() => {
    return solicitacoes.filter((s) => {
      const recebido = new Date(s.recebido_em);
      const dentroIntervalo = recebido >= intervalo.inicio && recebido <= intervalo.fim;
      const empresaOk = filtroEmpresa === "todas" || s.empresa === filtroEmpresa;
      const tipoOk = filtroTipo === "todos" || s.tipo === filtroTipo;
      return dentroIntervalo && empresaOk && tipoOk;
    });
  }, [solicitacoes, intervalo, filtroEmpresa, filtroTipo]);

  const empresas = useMemo(
    () => [...new Set(solicitacoes.map((s) => s.empresa))].sort(),
    [solicitacoes]
  );
  const tipos = useMemo(
    () => [...new Set(solicitacoes.map((s) => s.tipo))].sort(),
    [solicitacoes]
  );

  const kpis = useMemo(() => {
    const total = dados.length;
    const concluidos = dados.filter((s) => s.status === "concluido").length;
    const cancelados = dados.filter((s) => s.status === "cancelado").length;
    const ativos = dados.filter((s) => s.status !== "concluido" && s.status !== "cancelado").length;
    const agora = new Date();
    const vencidos = dados.filter(
      (s) => new Date(s.prazo) < agora && s.status !== "concluido" && s.status !== "cancelado"
    ).length;
    const urgentes = dados.filter((s) => s.prioridade === "urgente").length;
    const agendados = dados.filter((s) => s.agendado_para).length;
    const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    const concl = dados.filter((s) => s.status === "concluido" && s.agendado_para);
    const tempoMedio =
      concl.length > 0
        ? Math.round(
            concl.reduce((acc, s) => {
              const diff =
                (new Date(s.agendado_para!).getTime() - new Date(s.recebido_em).getTime()) /
                86400000;
              return acc + diff;
            }, 0) / concl.length
          )
        : null;

    return { total, concluidos, cancelados, ativos, vencidos, urgentes, agendados, taxaConclusao, tempoMedio };
  }, [dados]);

  const porStatus = useMemo(() => {
    const map: Record<string, number> = {};
    dados.forEach((s) => { map[s.status] = (map[s.status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count);
  }, [dados]);

  const porTipo = useMemo(() => {
    const map: Record<string, number> = {};
    dados.forEach((s) => { map[s.tipo] = (map[s.tipo] || 0) + 1; });
    return Object.entries(map).map(([tipo, count]) => ({ tipo, count })).sort((a, b) => b.count - a.count);
  }, [dados]);

  const porEmpresa = useMemo(() => {
    const map: Record<string, number> = {};
    dados.forEach((s) => { map[s.empresa] = (map[s.empresa] || 0) + 1; });
    return Object.entries(map).map(([empresa, count]) => ({ empresa, count }))
      .sort((a, b) => b.count - a.count).slice(0, 8);
  }, [dados]);

  const porPrioridade = useMemo(() => {
    const map: Record<string, number> = {};
    dados.forEach((s) => { map[s.prioridade] = (map[s.prioridade] || 0) + 1; });
    return map;
  }, [dados]);

  const COR_PRIORIDADE: Record<string, string> = {
    urgente: "bg-red-500",
    alta:    "bg-orange-400",
    media:   "bg-blue-400",
    baixa:   "bg-gray-300",
  };

  function exportar(formato: FormatoExport) {
    setExportando(true);
    setTimeout(() => {
      const timestamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "h");
      const nomeBase = `ocupamed_relatorio_${timestamp}`;

      if (formato === "csv") {
        const cabecalho = ["ID","Colaborador","Empresa","Tipo","Status","Prioridade","Recebido em","Prazo","Agendado para","Médico","Setor"].join(";");
        const linhas = dados.map((s) =>
          [s.id, s.colaborador, s.empresa, LABEL_TIPO[s.tipo] || s.tipo, LABEL_STATUS[s.status] || s.status,
           s.prioridade, fmtData(s.recebido_em), fmtData(s.prazo),
           s.agendado_para ? fmtData(s.agendado_para) : "", s.medico_responsavel || "", s.setor || ""]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(";")
        );
        baixarArquivo([cabecalho, ...linhas].join("\n"), `${nomeBase}.csv`, "text/csv;charset=utf-8;");
      }

      if (formato === "json") {
        baixarArquivo(
          JSON.stringify({
            gerado_em: new Date().toISOString(),
            periodo: { inicio: intervalo.inicio.toISOString(), fim: intervalo.fim.toISOString() },
            filtros: { empresa: filtroEmpresa, tipo: filtroTipo },
            kpis,
            solicitacoes: dados,
          }, null, 2),
          `${nomeBase}.json`, "application/json"
        );
      }

      if (formato === "txt") {
        const linhas = [
          "═══════════════════════════════════════════",
          "       RELATÓRIO OCUPAMED CRM",
          "═══════════════════════════════════════════",
          `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
          `Período: ${fmtData(intervalo.inicio.toISOString())} a ${fmtData(intervalo.fim.toISOString())}`,
          `Empresa: ${filtroEmpresa === "todas" ? "Todas" : filtroEmpresa}`,
          `Tipo: ${filtroTipo === "todos" ? "Todos" : LABEL_TIPO[filtroTipo] || filtroTipo}`,
          "",
          "── RESUMO ──────────────────────────────────",
          `Total de solicitações : ${kpis.total}`,
          `Concluídas            : ${kpis.concluidos} (${kpis.taxaConclusao}%)`,
          `Ativas                : ${kpis.ativos}`,
          `Canceladas            : ${kpis.cancelados}`,
          `Prazo vencido         : ${kpis.vencidos}`,
          `Urgentes              : ${kpis.urgentes}`,
          `Agendadas             : ${kpis.agendados}`,
          kpis.tempoMedio !== null ? `Tempo médio conclusão : ${kpis.tempoMedio} dias` : "",
          "",
          "── POR STATUS ──────────────────────────────",
          ...porStatus.map(({ status, count }) => `${(LABEL_STATUS[status] || status).padEnd(22)}: ${count}`),
          "",
          "── POR TIPO ────────────────────────────────",
          ...porTipo.map(({ tipo, count }) => `${(LABEL_TIPO[tipo] || tipo).padEnd(22)}: ${count}`),
          "",
          "── SOLICITAÇÕES ────────────────────────────",
          ...dados.map((s) =>
            `[${fmtData(s.recebido_em)}] ${s.colaborador.padEnd(25)} | ${s.empresa.padEnd(20)} | ${(LABEL_STATUS[s.status] || s.status).padEnd(16)} | ${s.prioridade}`
          ),
          "",
          "═══════════════════════════════════════════",
        ];
        baixarArquivo(linhas.join("\n"), `${nomeBase}.txt`, "text/plain;charset=utf-8;");
      }

      setExportando(false);
      setExportOk(true);
      setTimeout(() => setExportOk(false), 2500);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
            <p className="text-sm text-gray-500">
              {dados.length} solicitações no período selecionado
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["csv", "json", "txt"] as FormatoExport[]).map((f) => (
              <button
                key={f}
                onClick={() => exportar(f)}
                disabled={exportando || dados.length === 0}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all disabled:opacity-40 ${
                  exportOk
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {exportando ? "..." : exportOk ? "✅" : `↓ ${f.toUpperCase()}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(["7d", "30d", "90d", "custom"] as Periodo[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    periodo === p ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "90 dias" : "Personalizado"}
                </button>
              ))}
            </div>

            {periodo === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <span className="text-gray-400 text-sm">até</span>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            )}

            <select
              value={filtroEmpresa}
              onChange={(e) => setFiltroEmpresa(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="todas">Todas as empresas</option>
              {empresas.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="todos">Todos os tipos</option>
              {tipos.map((t) => <option key={t} value={t}>{LABEL_TIPO[t] || t}</option>)}
            </select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icone="📋" titulo="Total de solicitações" valor={kpis.total} sub="no período" />
          <KpiCard
            icone="✅" titulo="Taxa de conclusão" valor={`${kpis.taxaConclusao}%`}
            sub={`${kpis.concluidos} concluídas`}
            cor={kpis.taxaConclusao >= 70 ? "text-green-600" : "text-orange-500"}
          />
          <KpiCard
            icone="⏰" titulo="Prazo vencido" valor={kpis.vencidos}
            sub={`${kpis.ativos} ativas no total`}
            cor={kpis.vencidos > 0 ? "text-red-600" : "text-green-600"}
          />
          <KpiCard
            icone="🚨" titulo="Urgentes" valor={kpis.urgentes}
            sub={`${kpis.agendados} agendadas`}
            cor={kpis.urgentes > 0 ? "text-red-600" : "text-gray-900"}
          />
        </div>

        {/* Status + Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribuição por status</h3>
            {porStatus.length === 0 ? (
              <p className="text-sm text-gray-400">Sem dados</p>
            ) : (
              <div className="flex flex-col gap-3">
                {porStatus.map(({ status, count }) => (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${COR_STATUS[status] || "bg-gray-100 text-gray-600"}`}>
                        {LABEL_STATUS[status] || status}
                      </span>
                      <span className="text-xs font-bold text-gray-700">{count}</span>
                    </div>
                    <BarraProgresso
                      valor={count} total={kpis.total}
                      cor={
                        status === "concluido"            ? "bg-green-500" :
                        status === "cancelado"            ? "bg-red-400" :
                        status === "agendado"             ? "bg-purple-400" :
                        status === "em_atendimento"       ? "bg-cyan-400" :
                        status === "aguardando_documento" ? "bg-orange-400" :
                        status === "em_triagem"           ? "bg-yellow-400" : "bg-blue-400"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribuição por tipo de exame</h3>
            {porTipo.length === 0 ? (
              <p className="text-sm text-gray-400">Sem dados</p>
            ) : (
              <div className="flex flex-col gap-3">
                {porTipo.map(({ tipo, count }, i) => {
                  const cores = ["bg-blue-500","bg-purple-500","bg-teal-500","bg-orange-400","bg-pink-400","bg-indigo-400"];
                  return (
                    <div key={tipo}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 font-medium">{LABEL_TIPO[tipo] || tipo}</span>
                        <span className="text-xs font-bold text-gray-700">{count}</span>
                      </div>
                      <BarraProgresso valor={count} total={kpis.total} cor={cores[i % cores.length]} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Empresa + Prioridade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Top empresas</h3>
            {porEmpresa.length === 0 ? (
              <p className="text-sm text-gray-400">Sem dados</p>
            ) : (
              <div className="flex flex-col gap-3">
                {porEmpresa.map(({ empresa, count }, i) => (
                  <div key={empresa} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-700 font-medium truncate">{empresa}</span>
                        <span className="text-xs font-bold text-gray-700 ml-2">{count}</span>
                      </div>
                      <BarraProgresso valor={count} total={kpis.total} cor="bg-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Por prioridade</h3>
            <div className="flex flex-col gap-4">
              {["urgente", "alta", "media", "baixa"].map((p) => {
                const count = porPrioridade[p] || 0;
                return (
                  <div key={p}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 capitalize">{p}</span>
                      <span className="text-xs font-bold text-gray-700">{count}</span>
                    </div>
                    <BarraProgresso valor={count} total={kpis.total} cor={COR_PRIORIDADE[p]} />
                  </div>
                );
              })}
            </div>
            {kpis.tempoMedio !== null && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Tempo médio de conclusão</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {kpis.tempoMedio}
                  <span className="text-sm font-normal text-gray-500 ml-1">dias</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabela detalhada */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Detalhamento ({dados.length})</h3>
            <button
              onClick={() => exportar("csv")}
              disabled={dados.length === 0}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors disabled:opacity-40"
            >
              ↓ Exportar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Colaborador","Empresa","Tipo","Status","Prioridade","Recebido","Prazo"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      Nenhuma solicitação no período selecionado
                    </td>
                  </tr>
                ) : (
                  dados.map((s) => {
                    const vencido =
                      new Date(s.prazo) < new Date() &&
                      s.status !== "concluido" &&
                      s.status !== "cancelado";
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{s.colaborador}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.empresa}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{LABEL_TIPO[s.tipo] || s.tipo}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COR_STATUS[s.status] || "bg-gray-100 text-gray-600"}`}>
                            {LABEL_STATUS[s.status] || s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${
                            s.prioridade === "urgente" ? "text-red-600" :
                            s.prioridade === "alta"    ? "text-orange-600" :
                            s.prioridade === "media"   ? "text-blue-600" : "text-gray-500"
                          }`}>
                            {s.prioridade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtData(s.recebido_em)}</td>
                        <td className={`px-4 py-3 whitespace-nowrap font-medium ${vencido ? "text-red-600" : "text-gray-600"}`}>
                          {fmtData(s.prazo)}
                          {vencido && <span className="ml-1 text-xs">⚠️</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
