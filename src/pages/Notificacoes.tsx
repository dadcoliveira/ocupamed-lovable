import { useState } from "react";
import { useNotificacoes, TipoNotificacao } from "@/hooks/useNotificacoes";

// ── Mapeamento de tipo → visual ────────────────────────────────────
type FiltroNotif = "todas" | "nao_lidas" | TipoNotificacao;

const TIPO_CONFIG: Record<
  TipoNotificacao,
  { icone: string; cor: string; label: string; urgente?: boolean }
> = {
  prazo_vencido:     { icone: "⏰", cor: "bg-red-100 text-red-600 border-red-200",         label: "Prazo",       urgente: true },
  prazo_proximo:     { icone: "⏰", cor: "bg-orange-100 text-orange-600 border-orange-200", label: "Prazo" },
  doc_pendente:      { icone: "📄", cor: "bg-orange-100 text-orange-600 border-orange-200", label: "Documento" },
  novo_agendamento:  { icone: "📅", cor: "bg-blue-100 text-blue-600 border-blue-200",       label: "Agendamento" },
  status_atualizado: { icone: "🔄", cor: "bg-purple-100 text-purple-600 border-purple-200", label: "Status" },
};

const FILTROS: { id: FiltroNotif; label: string }[] = [
  { id: "todas",            label: "Todas" },
  { id: "nao_lidas",        label: "Não lidas" },
  { id: "prazo_vencido",    label: "⏰ Prazo vencido" },
  { id: "prazo_proximo",    label: "⏰ Prazo próximo" },
  { id: "doc_pendente",     label: "📄 Documento" },
  { id: "novo_agendamento", label: "📅 Agendamento" },
  { id: "status_atualizado",label: "🔄 Status" },
];

function formatarData(iso: string) {
  const d = new Date(iso);
  const agora = new Date();
  const diff = Math.floor((agora.getTime() - d.getTime()) / 1000);
  if (diff < 60)    return "agora mesmo";
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function Notificacoes() {
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas, remover } =
    useNotificacoes();

  const [filtro, setFiltro] = useState<FiltroNotif>("todas");

  function limparLidas() {
    notificacoes.filter((n) => n.lida).forEach((n) => remover(n.id));
  }

  const filtradas = notificacoes.filter((n) => {
    if (filtro === "todas")     return true;
    if (filtro === "nao_lidas") return !n.lida;
    return n.tipo === filtro;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Notificações</h1>
            {naoLidas > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {naoLidas} nova{naoLidas > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {naoLidas > 0 && (
              <button
                onClick={marcarTodasLidas}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Marcar todas como lidas
              </button>
            )}
            <button
              onClick={limparLidas}
              className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
            >
              Limpar lidas
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 flex-nowrap">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                filtro === f.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {f.label}
              {f.id === "nao_lidas" && naoLidas > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {naoLidas}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista ── */}
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-2">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <span className="text-5xl">🔔</span>
            <p className="text-base font-medium">Nenhuma notificação aqui</p>
            <p className="text-sm">Tudo em dia por enquanto!</p>
          </div>
        ) : (
          filtradas.map((notif) => {
            const cfg = TIPO_CONFIG[notif.tipo];
            const urgente = cfg.urgente === true;
            return (
              <div
                key={notif.id}
                className={`relative bg-white rounded-2xl border transition-all ${
                  notif.lida
                    ? "border-gray-100 opacity-70"
                    : urgente
                    ? "border-red-200 shadow-sm shadow-red-50"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Barra lateral colorida */}
                {!notif.lida && (
                  <div
                    className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
                      urgente ? "bg-red-500" : "bg-blue-500"
                    }`}
                  />
                )}

                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Ícone */}
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 ${cfg.cor}`}
                  >
                    {cfg.icone}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {notif.titulo}
                        </span>
                        {urgente && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                            URGENTE
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.cor}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatarData(notif.criado_em)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{notif.descricao}</p>

                    {notif.colaborador && (
                      <p className="text-xs text-blue-500 font-medium mt-1">
                        👤 {notif.colaborador}
                      </p>
                    )}

                    {/* Ações */}
                    <div className="flex items-center gap-3 mt-3">
                      {!notif.lida && (
                        <button
                          onClick={() => marcarLida(notif.id)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          ✓ Marcar como lida
                        </button>
                      )}
                      {notif.solicitacao_id && (
                        <button className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
                          Ver solicitação →
                        </button>
                      )}
                      <button
                        onClick={() => remover(notif.id)}
                        className="text-xs text-gray-300 hover:text-red-400 hover:underline ml-auto"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
