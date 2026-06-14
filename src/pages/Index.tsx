import { useState } from "react";
import Dashboard from "./Dashboard";
import Solicitacoes from "./Solicitacoes";
import Pipeline from "./Pipeline";
import Agenda from "./Agenda";
import Relatorios from "./Relatorios";
import Configuracoes from "./Configuracoes";
import Historico from "./Historico";
import Notificacoes from "./Notificacoes";
import { useNotificacoes } from "@/hooks/useNotificacoes";

export type Pagina = "dashboard" | "solicitacoes" | "pipeline" | "agenda" | "relatorios" | "historico" | "notificacoes" | "configuracoes";

export interface NavState {
  pagina: Pagina;
  filtroStatus?: string;
  filtroPrioridade?: string;
  filtroAlerta?: "prazo_vencido" | "docs_pendentes" | null;
}

export default function Index() {
  const [nav, setNav] = useState<NavState>({ pagina: "dashboard" });
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const { naoLidas } = useNotificacoes();

  function navegar(estado: NavState) {
    setNav(estado);
    setSidebarAberta(false);
  }

  const NAV_PRINCIPAL = [
    { id: "dashboard",    label: "Dashboard",    icone: "📊" },
    { id: "solicitacoes", label: "Solicitações", icone: "📋" },
    { id: "pipeline",     label: "Pipeline",     icone: "🔀" },
    { id: "agenda",       label: "Agenda",       icone: "📅" },
  ] as const;

  const NAV_GESTAO = [
    { id: "relatorios",    label: "Relatórios",    icone: "📈" },
    { id: "historico",     label: "Histórico",     icone: "🕐" },
    { id: "configuracoes", label: "Configurações", icone: "⚙️" },
  ] as const;

  const navBtn = (id: Pagina, label: string, icone: string, extra?: React.ReactNode) => (
    <button
      key={id}
      onClick={() => navegar({ pagina: id })}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
        nav.pagina === id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span>{icone}</span>
      <span className="flex-1">{label}</span>
      {extra}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Overlay mobile ── */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed md:static inset-y-0 left-0 z-30",
          "w-[280px] md:w-56",
          "bg-white border-r border-gray-200",
          "flex flex-col flex-shrink-0",
          "transition-transform duration-200 ease-in-out",
          sidebarAberta ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">OcupaMed</p>
            <p className="text-xs text-gray-400">CRM Saúde Ocupacional</p>
          </div>
          {/* Botão fechar — apenas mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-gray-700 p-1 text-xl leading-none"
            onClick={() => setSidebarAberta(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Principal</p>

          {NAV_PRINCIPAL.map((item) => navBtn(item.id, item.label, item.icone))}

          <p className="text-xs font-semibold text-gray-400 uppercase px-2 mt-4 mb-1">Gestão</p>

          {/* Notificações com badge */}
          {navBtn(
            "notificacoes",
            "Notificações",
            "🔔",
            naoLidas > 0 ? (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {naoLidas}
              </span>
            ) : undefined,
          )}

          {NAV_GESTAO.map((item) => navBtn(item.id, item.label, item.icone))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">v1.0 · OcupaMed CRM</p>
        </div>
      </aside>

      {/* ── Área principal ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar mobile */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <p className="text-base font-bold text-gray-900">OcupaMed</p>
          <div className="flex items-center gap-3">
            {naoLidas > 0 && (
              <button
                onClick={() => navegar({ pagina: "notificacoes" })}
                className="relative text-gray-500 p-1"
                aria-label="Notificações"
              >
                <span className="text-lg">🔔</span>
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {naoLidas > 9 ? "9+" : naoLidas}
                </span>
              </button>
            )}
            <button
              onClick={() => setSidebarAberta(true)}
              className="text-gray-500 hover:text-gray-800 p-1"
              aria-label="Abrir menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto">
          {nav.pagina === "dashboard" && (
            <Dashboard onNavegar={navegar} />
          )}
          {nav.pagina === "solicitacoes" && (
            <Solicitacoes
              filtroStatusInicial={nav.filtroStatus}
              filtroPrioridadeInicial={nav.filtroPrioridade}
              filtroAlertaInicial={nav.filtroAlerta}
              onVoltar={() => navegar({ pagina: "dashboard" })}
            />
          )}
          {nav.pagina === "pipeline" && <Pipeline />}
          {nav.pagina === "agenda" && <Agenda />}
          {nav.pagina === "relatorios" && <Relatorios />}
          {nav.pagina === "historico" && <Historico />}
          {nav.pagina === "notificacoes" && <Notificacoes />}
          {nav.pagina === "configuracoes" && <Configuracoes />}
        </main>
      </div>
    </div>
  );
}
