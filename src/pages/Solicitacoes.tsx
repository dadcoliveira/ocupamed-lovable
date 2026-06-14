import { useState, useMemo } from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";
import { Status, Prioridade } from "@/data/mockData";
import SolicitacaoDetalheComp from "@/components/SolicitacaoDetalhe";
import NovaSolicitacaoForm from "@/components/NovaSolicitacaoForm";

type TipoExameForm =
  | "admissional"
  | "demissional"
  | "periodico"
  | "retorno_afastamento"
  | "mudanca_funcao"
  | "monitoramento";

// ─── Labels e cores ───────────────────────────────────────────────
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
  novo: "bg-blue-100 text-blue-700",
  em_triagem: "bg-yellow-100 text-yellow-700",
  aguardando_documento: "bg-orange-100 text-orange-700",
  agendado: "bg-purple-100 text-purple-700",
  em_atendimento: "bg-cyan-100 text-cyan-700",
  concluido: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

const prioridadeColors: Record<Prioridade, string> = {
  baixa: "bg-gray-100 text-gray-500",
  media: "bg-blue-100 text-blue-600",
  alta: "bg-orange-100 text-orange-700",
  urgente: "bg-red-100 text-red-700",
};

const tipoLabels: Record<TipoExameForm, string> = {
  admissional: "Admissional",
  demissional: "Demissional",
  periodico: "Periódico",
  retorno_afastamento: "Retorno Afastamento",
  mudanca_funcao: "Mudança de Função",
  monitoramento: "Monitoramento",
};

function tipoLabel(tipo: string): string {
  return (tipoLabels as Record<string, string>)[tipo] ?? tipo;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function isPrazoVencido(prazo: string, status: Status) {
  if (status === "concluido" || status === "cancelado") return false;
  return new Date(prazo) < new Date();
}

// ─── Filtros ──────────────────────────────────────────────────────
interface Filtros {
  busca: string;
  status: Status | "";
  prioridade: Prioridade | "";
  tipo: TipoExameForm | "";
  prazoVencido: boolean;
  docsPendentes: boolean;
}

const filtrosIniciais: Filtros = {
  busca: "",
  status: "",
  prioridade: "",
  tipo: "",
  prazoVencido: false,
  docsPendentes: false,
};

type OrdenarPor = "recebido_em" | "prazo" | "colaborador" | "empresa" | "prioridade";

const prioridadeOrdem: Record<Prioridade, number> = {
  urgente: 0,
  alta: 1,
  media: 2,
  baixa: 3,
};

// ─── Props ────────────────────────────────────────────────────────
interface SolicitacoesProps {
  filtroStatusInicial?: string;
  filtroPrioridadeInicial?: string;
  filtroAlertaInicial?: "prazo_vencido" | "docs_pendentes" | null;
  onVoltar?: () => void;
}

// ─── Componente ───────────────────────────────────────────────────
export default function Solicitacoes({
  filtroStatusInicial,
  filtroPrioridadeInicial,
  filtroAlertaInicial,
}: SolicitacoesProps = {}) {
  const { solicitacoes, addSolicitacao } = useSolicitacoes();
  const [filtros, setFiltros] = useState<Filtros>(() => ({
    ...filtrosIniciais,
    status: (filtroStatusInicial as Status) || "",
    prioridade: (filtroPrioridadeInicial as Prioridade) || "",
    prazoVencido: filtroAlertaInicial === "prazo_vencido",
    docsPendentes: filtroAlertaInicial === "docs_pendentes",
  }));
  const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>("recebido_em");
  const [ordemAsc, setOrdemAsc] = useState(false);
  const [painelFiltros, setPainelFiltros] = useState(false);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);

  // ── Filtros ativos ──
  const filtrosAtivos = [
    filtros.status,
    filtros.prioridade,
    filtros.tipo,
    filtros.prazoVencido,
    filtros.docsPendentes,
  ].filter(Boolean).length;

  // ── Filtrar + ordenar ──
  const solicitacoesFiltradas = useMemo(() => {
    let lista = [...solicitacoes];

    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase();
      lista = lista.filter(
        (s) =>
          s.colaborador.toLowerCase().includes(q) ||
          s.empresa.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.cargo.toLowerCase().includes(q) ||
          s.solicitante.toLowerCase().includes(q) ||
          s.cpf.includes(q) ||
          s.cnpj.includes(q)
      );
    }

    if (filtros.status) lista = lista.filter((s) => s.status === filtros.status);
    if (filtros.prioridade) lista = lista.filter((s) => s.prioridade === filtros.prioridade);
    if (filtros.tipo) lista = lista.filter((s) => s.tipo === filtros.tipo);
    if (filtros.prazoVencido) lista = lista.filter((s) => isPrazoVencido(s.prazo, s.status));
    if (filtros.docsPendentes)
      lista = lista.filter((s) => s.documentos.some((d) => d.obrigatorio && !d.entregue));

    lista.sort((a, b) => {
      let cmp = 0;
      if (ordenarPor === "recebido_em")
        cmp = new Date(a.recebido_em).getTime() - new Date(b.recebido_em).getTime();
      else if (ordenarPor === "prazo")
        cmp = new Date(a.prazo).getTime() - new Date(b.prazo).getTime();
      else if (ordenarPor === "colaborador")
        cmp = a.colaborador.localeCompare(b.colaborador);
      else if (ordenarPor === "empresa")
        cmp = a.empresa.localeCompare(b.empresa);
      else if (ordenarPor === "prioridade")
        cmp = prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade];
      return ordemAsc ? cmp : -cmp;
    });

    return lista;
  }, [solicitacoes, filtros, ordenarPor, ordemAsc]);

  function toggleOrdem(campo: OrdenarPor) {
    if (ordenarPor === campo) setOrdemAsc((v) => !v);
    else { setOrdenarPor(campo); setOrdemAsc(true); }
  }

  function setFiltro<K extends keyof Filtros>(campo: K, valor: Filtros[K]) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais);
  }

  function iconeOrdem(campo: OrdenarPor) {
    if (ordenarPor !== campo) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-500 ml-1">{ordemAsc ? "↑" : "↓"}</span>;
  }

  const contagemStatus = useMemo(() => {
    const map: Partial<Record<Status, number>> = {};
    solicitacoes.forEach((s) => { map[s.status] = (map[s.status] || 0) + 1; });
    return map;
  }, [solicitacoes]);

  // ── Navegação inline — depois de todos os hooks ──
  if (selecionada) {
    return (
      <SolicitacaoDetalheComp
        solicitacaoId={selecionada}
        onVoltar={() => setSelecionada(null)}
      />
    );
  }

  if (criando) {
    return (
      <NovaSolicitacaoForm
        onVoltar={() => setCriando(false)}
        onSalvar={(nova) => {
          addSolicitacao(nova);
          setCriando(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Solicitações</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {solicitacoesFiltradas.length} de {solicitacoes.length} solicitações
              {filtrosAtivos > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  · {filtrosAtivos} filtro{filtrosAtivos > 1 ? "s" : ""} ativo
                  {filtrosAtivos > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setCriando(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
          >
            + Nova Solicitação
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Chips de status */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto mb-3 sm:mb-4 pb-1 flex-nowrap -mx-3 sm:mx-0 px-3 sm:px-0">
          <button
            onClick={() => setFiltro("status", "")}
            className={`text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border font-medium transition-all whitespace-nowrap ${
              filtros.status === ""
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Todos ({solicitacoes.length})
          </button>
          {(Object.keys(statusLabels) as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setFiltro("status", filtros.status === s ? "" : s)}
              className={`text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border font-medium transition-all whitespace-nowrap ${
                filtros.status === s
                  ? statusColors[s] + " border-current"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {statusLabels[s]} {contagemStatus[s] ? `(${contagemStatus[s]})` : "(0)"}
            </button>
          ))}
        </div>

        {/* Barra de busca + filtros */}
        <div className="flex gap-2 mb-3 sm:mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm">
              🔍
            </span>
            <input
              value={filtros.busca}
              onChange={(e) => setFiltro("busca", e.target.value)}
              placeholder="Buscar colaborador, empresa..."
              className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg pl-8 sm:pl-9 pr-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
            {filtros.busca && (
              <button
                onClick={() => setFiltro("busca", "")}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => setPainelFiltros((v) => !v)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
              painelFiltros || filtrosAtivos > 0
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            ⚙
            <span className="hidden sm:inline">Filtros</span>
            {filtrosAtivos > 0 && (
              <span className="bg-blue-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {filtrosAtivos}
              </span>
            )}
          </button>
          {filtrosAtivos > 0 && (
            <button
              onClick={limparFiltros}
              className="px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Painel de filtros avançados */}
        {painelFiltros && (
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Prioridade
              </label>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                {(["", "urgente", "alta", "media", "baixa"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFiltro("prioridade", p as Prioridade | "")}
                    className={`text-left text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${
                      filtros.prioridade === p
                        ? p === ""
                          ? "bg-gray-800 text-white border-gray-800"
                          : prioridadeColors[p as Prioridade] + " border-current font-medium"
                        : "border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p === "" ? "Todas" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Tipo de Exame
              </label>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <button
                  onClick={() => setFiltro("tipo", "")}
                  className={`text-left text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${
                    filtros.tipo === ""
                      ? "bg-gray-800 text-white border-gray-800"
                      : "border-gray-100 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Todos
                </button>
                {(Object.keys(tipoLabels) as TipoExameForm[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFiltro("tipo", filtros.tipo === t ? "" : t)}
                    className={`text-left text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${
                      filtros.tipo === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tipoLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Ordenar por
              </label>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                {(
                  [
                    ["recebido_em", "Data de recebimento"],
                    ["prazo", "Prazo limite"],
                    ["prioridade", "Prioridade"],
                    ["colaborador", "Colaborador (A-Z)"],
                    ["empresa", "Empresa (A-Z)"],
                  ] as [OrdenarPor, string][]
                ).map(([campo, label]) => (
                  <button
                    key={campo}
                    onClick={() => toggleOrdem(campo)}
                    className={`text-left text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all flex justify-between items-center ${
                      ordenarPor === campo
                        ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                        : "border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {ordenarPor === campo && (
                      <span className="text-blue-500 ml-1">{ordemAsc ? "↑" : "↓"}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Alertas
              </label>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <button
                  onClick={() => setFiltro("prazoVencido", !filtros.prazoVencido)}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all ${
                    filtros.prazoVencido
                      ? "bg-red-50 border-red-300 text-red-700 font-medium"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      filtros.prazoVencido ? "bg-red-500 border-red-500" : "border-gray-300"
                    }`}
                  >
                    {filtros.prazoVencido && <span className="text-white text-[10px]">✓</span>}
                  </span>
                  <span className="truncate">⏰ Prazo vencido</span>
                </button>
                <button
                  onClick={() => setFiltro("docsPendentes", !filtros.docsPendentes)}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all ${
                    filtros.docsPendentes
                      ? "bg-orange-50 border-orange-300 text-orange-700 font-medium"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      filtros.docsPendentes ? "bg-orange-500 border-orange-500" : "border-gray-300"
                    }`}
                  >
                    {filtros.docsPendentes && <span className="text-white text-[10px]">✓</span>}
                  </span>
                  <span className="truncate">📄 Docs pendentes</span>
                </button>
              </div>

              {filtrosAtivos > 0 && (
                <div className="mt-3 sm:mt-4">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase mb-1.5 sm:mb-2">
                    Filtros ativos
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {filtros.status && (
                      <span
                        className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 ${statusColors[filtros.status]}`}
                      >
                        {statusLabels[filtros.status]}
                        <button
                          onClick={() => setFiltro("status", "")}
                          className="hover:opacity-70"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filtros.prioridade && (
                      <span
                        className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 ${prioridadeColors[filtros.prioridade]}`}
                      >
                        {filtros.prioridade}
                        <button
                          onClick={() => setFiltro("prioridade", "")}
                          className="hover:opacity-70"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filtros.tipo && (
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                        {tipoLabels[filtros.tipo]}
                        <button
                          onClick={() => setFiltro("tipo", "")}
                          className="hover:opacity-70"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filtros.prazoVencido && (
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        Prazo vencido
                        <button
                          onClick={() => setFiltro("prazoVencido", false)}
                          className="hover:opacity-70"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filtros.docsPendentes && (
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                        Docs pendentes
                        <button
                          onClick={() => setFiltro("docsPendentes", false)}
                          className="hover:opacity-70"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabela */}
        {solicitacoesFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
            <p className="text-3xl sm:text-4xl mb-3">🔍</p>
            <p className="text-sm sm:text-base text-gray-600 font-medium">Nenhuma solicitação encontrada</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Tente ajustar os filtros ou a busca</p>
            <button
              onClick={limparFiltros}
              className="mt-4 text-xs sm:text-sm text-blue-600 underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full text-xs sm:text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase w-16 sm:w-auto">
                      ID
                    </th>
                    <th
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-800 select-none"
                      onClick={() => toggleOrdem("colaborador")}
                    >
                      Colaborador {iconeOrdem("colaborador")}
                    </th>
                    <th
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-800 select-none hidden md:table-cell"
                      onClick={() => toggleOrdem("empresa")}
                    >
                      Empresa {iconeOrdem("empresa")}
                    </th>
                    <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">
                      Tipo
                    </th>
                    <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-800 select-none"
                      onClick={() => toggleOrdem("prioridade")}
                    >
                      Prior. {iconeOrdem("prioridade")}
                    </th>
                    <th
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-800 select-none hidden sm:table-cell"
                      onClick={() => toggleOrdem("prazo")}
                    >
                      Prazo {iconeOrdem("prazo")}
                    </th>
                    <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell">
                      Docs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesFiltradas.map((sol, i) => {
                    const vencido = isPrazoVencido(sol.prazo, sol.status);
                    const docsPend = sol.documentos.filter((d) => d.obrigatorio && !d.entregue).length;
                    return (
                      <tr
                        key={sol.id}
                        onClick={() => setSelecionada(sol.id)}
                        className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-400 font-mono">{sol.id}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <p className="font-medium text-gray-800 leading-tight text-xs sm:text-sm">
                            {sol.colaborador}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[120px] sm:max-w-none">{sol.cargo}</p>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                          <p className="text-gray-700 leading-tight text-xs sm:text-sm">{sol.empresa}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">{sol.cnpj}</p>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                          <span className="text-[10px] sm:text-xs text-gray-600 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            {tipoLabel(sol.tipo)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <span
                            className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${statusColors[sol.status]}`}
                          >
                            {statusLabels[sol.status]}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <span
                            className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full capitalize ${prioridadeColors[sol.prioridade]}`}
                          >
                            {sol.prioridade}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                          <span
                            className={`text-[10px] sm:text-xs font-medium ${vencido ? "text-red-600" : "text-gray-600"}`}
                          >
                            {vencido && "⏰ "}
                            {formatDate(sol.prazo)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden xl:table-cell">
                          {docsPend > 0 ? (
                            <span className="text-[10px] sm:text-xs text-orange-600 font-medium">
                              ⚠ {docsPend} pendente{docsPend > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-xs text-green-600">✓ OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-400">
                Mostrando <strong>{solicitacoesFiltradas.length}</strong> de{" "}
                <strong>{solicitacoes.length}</strong> solicitações
              </p>
              {filtrosAtivos > 0 && (
                <button
                  onClick={limparFiltros}
                  className="text-[10px] sm:text-xs text-blue-600 hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
