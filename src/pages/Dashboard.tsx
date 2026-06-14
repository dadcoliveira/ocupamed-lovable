import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { mockDashboard, Status, Prioridade } from "@/data/mockData";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";

// ─── Cores ────────────────────────────────────────────────────────
const COR_STATUS: Record<Status, string> = {
  novo: "#3b82f6",
  em_triagem: "#eab308",
  aguardando_documento: "#f97316",
  agendado: "#a855f7",
  em_atendimento: "#06b6d4",
  concluido: "#22c55e",
  cancelado: "#ef4444",
};

const COR_PRIORIDADE: Record<Prioridade, string> = {
  urgente: "#ef4444",
  alta: "#f97316",
  media: "#3b82f6",
  baixa: "#9ca3af",
};

const LABEL_STATUS: Record<Status, string> = {
  novo: "Novo",
  em_triagem: "Em Triagem",
  aguardando_documento: "Ag. Documento",
  agendado: "Agendado",
  em_atendimento: "Em Atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const LABEL_TIPO: Record<string, string> = {
  admissional: "Admissional",
  demissional: "Demissional",
  periodico: "Periódico",
  retorno_afastamento: "Retorno Afas.",
  mudanca_funcao: "Mud. Função",
  monitoramento: "Monitoramento",
};

// ─── Tooltip customizado ──────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Tipos de navegação ───────────────────────────────────────────
interface NavState {
  pagina: string;
  filtroStatus?: string;
  filtroPrioridade?: string;
  filtroAlerta?: "prazo_vencido" | "docs_pendentes" | null;
}

// ─── Card de KPI ──────────────────────────────────────────────────
function KpiCard({
  label, valor, sub, cor, icone, onClick,
}: {
  label: string;
  valor: number | string;
  sub?: string;
  cor: string;
  icone: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 ${onClick ? "cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all" : ""}`}
      onClick={onClick}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${cor}`}>
        {icone}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{valor}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────
export default function Dashboard({ onNavegar }: { onNavegar?: (nav: NavState) => void }) {
  const { solicitacoes: sol } = useSolicitacoes();

  // ── Cálculos derivados ──
  const stats = useMemo(() => {
    const total = sol.length;
    const abertas = sol.filter(
      (s) => s.status !== "concluido" && s.status !== "cancelado"
    ).length;
    const urgentes = sol.filter(
      (s) => s.prioridade === "urgente" && s.status !== "concluido" && s.status !== "cancelado"
    ).length;
    const prazoVencido = sol.filter(
      (s) =>
        s.status !== "concluido" &&
        s.status !== "cancelado" &&
        new Date(s.prazo) < new Date()
    ).length;
    const docsPendentes = sol.filter((s) =>
      s.documentos.some((d) => d.obrigatorio && !d.entregue)
    ).length;
    const concluidos = sol.filter((s) => s.status === "concluido").length;
    const agendadosHoje = sol.filter((s) => {
      if (!s.agendado_para) return false;
      const hoje = new Date().toDateString();
      return new Date(s.agendado_para).toDateString() === hoje;
    }).length;

    // Por status
    const porStatus = (Object.keys(LABEL_STATUS) as Status[]).map((s) => ({
      name: LABEL_STATUS[s],
      value: sol.filter((x) => x.status === s).length,
      fill: COR_STATUS[s],
    })).filter((x) => x.value > 0);

    // Por prioridade
    const porPrioridade = (["urgente", "alta", "media", "baixa"] as Prioridade[]).map((p) => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      total: sol.filter((x) => x.prioridade === p).length,
      fill: COR_PRIORIDADE[p],
    }));

    // Por tipo
    const porTipo = Object.entries(LABEL_TIPO).map(([key, label]) => ({
      name: label,
      total: sol.filter((x) => x.tipo === key).length,
    })).filter((x) => x.total > 0);

    // Recebimentos por dia (últimos 7 dias)
    const hoje = new Date();
    const porDia = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() - (6 - i));
      const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const count = sol.filter((s) => {
        const rec = new Date(s.recebido_em);
        return rec.toDateString() === d.toDateString();
      }).length;
      return { dia: label, solicitacoes: count };
    });

    // Docs: % com todos obrigatórios entregues
    const docsOk = sol.filter((s) =>
      s.documentos.filter((d) => d.obrigatorio).every((d) => d.entregue)
    ).length;
    const pctDocsOk = total > 0 ? Math.round((docsOk / total) * 100) : 0;

    return {
      total, abertas, urgentes, prazoVencido,
      docsPendentes, concluidos, agendadosHoje,
      porStatus, porPrioridade, porTipo, porDia,
      pctDocsOk, docsOk,
    };
  }, [sol]);

  // ── Solicitações urgentes abertas ──
  const urgentesAbertas = sol
    .filter(
      (s) =>
        s.prioridade === "urgente" &&
        s.status !== "concluido" &&
        s.status !== "cancelado"
    )
    .slice(0, 5);

  // ── Próximos agendamentos ──
  const proximosAgendamentos = sol
    .filter((s) => s.agendado_para && s.status !== "concluido" && s.status !== "cancelado")
    .sort((a, b) => new Date(a.agendado_para!).getTime() - new Date(b.agendado_para!).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Visão geral · Atualizado agora ·{" "}
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long", day: "2-digit", month: "long", year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <KpiCard icone="📋" label="Total" valor={stats.total} cor="bg-gray-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes" }) : undefined} />
          <KpiCard icone="🔓" label="Em aberto" valor={stats.abertas} cor="bg-blue-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes" }) : undefined} />
          <KpiCard icone="🔴" label="Urgentes" valor={stats.urgentes} sub="abertas" cor="bg-red-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes", filtroPrioridade: "urgente" }) : undefined} />
          <KpiCard icone="⏰" label="Prazo vencido" valor={stats.prazoVencido} cor="bg-orange-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes", filtroAlerta: "prazo_vencido" }) : undefined} />
          <KpiCard icone="📄" label="Docs pendentes" valor={stats.docsPendentes} cor="bg-yellow-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes", filtroAlerta: "docs_pendentes" }) : undefined} />
          <KpiCard icone="✅" label="Concluídos" valor={stats.concluidos} cor="bg-green-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes", filtroStatus: "concluido" }) : undefined} />
          <KpiCard icone="📅" label="Agendados hoje" valor={stats.agendadosHoje} cor="bg-purple-100"
            onClick={onNavegar ? () => onNavegar({ pagina: "solicitacoes", filtroStatus: "agendado" }) : undefined} />
        </div>

        {/* ── Linha 2: Gráfico de linha + Pizza de status ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recebimentos por dia */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              📈 Solicitações recebidas — últimos 7 dias
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.porDia} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="solicitacoes"
                  name="Solicitações"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pizza de status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">🔵 Distribuição por status</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.porStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.porStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{ borderRadius: 12, fontSize: 12 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Linha 3: Barras de tipo + Barras de prioridade ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Por tipo de exame */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              🩺 Solicitações por tipo de exame
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={stats.porTipo}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Por prioridade */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              🚦 Solicitações por prioridade
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={stats.porPrioridade}
                margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total" radius={[6, 6, 0, 0]}>
                  {stats.porPrioridade.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Linha 4: Urgentes + Próximos agendamentos + Docs ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Urgentes abertas */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">🔴 Urgentes em aberto</p>
            {urgentesAbertas.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-sm text-gray-500">Nenhuma urgente em aberto</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {urgentesAbertas.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{s.colaborador}</p>
                      <p className="text-xs text-gray-500 truncate">{s.empresa}</p>
                      <p className="text-xs text-red-500 mt-0.5">
                        Prazo: {new Date(s.prazo).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                      {s.status.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos agendamentos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">📅 Próximos agendamentos</p>
            {proximosAgendamentos.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-2xl mb-1">📭</p>
                <p className="text-sm text-gray-500">Nenhum agendamento futuro</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {proximosAgendamentos.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{s.colaborador}</p>
                      <p className="text-xs text-gray-500 truncate">{s.empresa}</p>
                      <p className="text-xs text-purple-600 mt-0.5 font-medium">
                        {new Date(s.agendado_para!).toLocaleString("pt-BR", {
                          day: "2-digit", month: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {s.medico_responsavel && (
                      <p className="text-xs text-gray-400 flex-shrink-0 text-right max-w-[80px] leading-tight">
                        {s.medico_responsavel}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saúde dos documentos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">📄 Saúde dos documentos</p>

            <div className="flex flex-col items-center mb-5">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={
                      stats.pctDocsOk >= 80
                        ? "#22c55e"
                        : stats.pctDocsOk >= 50
                        ? "#f97316"
                        : "#ef4444"
                    }
                    strokeWidth="12"
                    strokeDasharray={`${(stats.pctDocsOk / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{stats.pctDocsOk}%</span>
                  <span className="text-xs text-gray-400">completos</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Docs completos</span>
                <span className="font-semibold text-green-600">{stats.docsOk}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Com pendência</span>
                <span className="font-semibold text-orange-600">{stats.docsPendentes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total de solicitações</span>
                <span className="font-semibold text-gray-700">{stats.total}</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stats.pctDocsOk >= 80
                        ? "bg-green-500"
                        : stats.pctDocsOk >= 50
                        ? "bg-orange-400"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${stats.pctDocsOk}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Linha 5: Métricas operacionais ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {mockDashboard.tempo_medio_triagem_horas}h
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1">Tempo médio de triagem</p>
            <p className="text-xs text-gray-400">da entrada até triagem concluída</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {mockDashboard.tempo_medio_agendamento_dias}d
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1">Tempo médio até agendamento</p>
            <p className="text-xs text-gray-400">da entrada até data agendada</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.total > 0 ? Math.round((stats.concluidos / stats.total) * 100) : 0}%
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1">Taxa de conclusão</p>
            <p className="text-xs text-gray-400">
              {stats.concluidos} de {stats.total} concluídos
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
