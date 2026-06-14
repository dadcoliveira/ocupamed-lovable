import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSolicitacoes } from "@/contexts/SolicitacoesContext";
import type { Notificacao, TipoNotificacao } from "@/hooks/useNotificacoes";

interface NotificacoesContextValue {
  notificacoes: Notificacao[];
  naoLidas: number;
  marcarLida: (id: string) => void;
  marcarTodasLidas: () => void;
  remover: (id: string) => void;
}

const NotificacoesContext = createContext<NotificacoesContextValue | null>(null);

export function NotificacoesProvider({ children }: { children: React.ReactNode }) {
  const { solicitacoes } = useSolicitacoes();

  const geradas = useMemo(() => {
    const agora = new Date();
    const notifs: Notificacao[] = [];

    solicitacoes.forEach((s) => {
      const prazo = new Date(s.prazo);
      const diffDias = Math.ceil(
        (prazo.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDias < 0 && s.status !== "concluido" && s.status !== "cancelado") {
        notifs.push({
          id: `prazo_vencido_${s.id}`,
          tipo: "prazo_vencido" as TipoNotificacao,
          titulo: "Prazo vencido",
          descricao: `${s.colaborador} (${s.empresa}) — venceu há ${Math.abs(diffDias)} dia(s)`,
          criado_em: s.prazo,
          lida: false,
          solicitacao_id: s.id,
          colaborador: s.colaborador,
        });
      }

      if (diffDias >= 0 && diffDias <= 3 && s.status !== "concluido" && s.status !== "cancelado") {
        notifs.push({
          id: `prazo_proximo_${s.id}`,
          tipo: "prazo_proximo" as TipoNotificacao,
          titulo: diffDias === 0 ? "Prazo hoje!" : `Prazo em ${diffDias} dia(s)`,
          descricao: `${s.colaborador} (${s.empresa})`,
          criado_em: new Date().toISOString(),
          lida: false,
          solicitacao_id: s.id,
          colaborador: s.colaborador,
        });
      }

      const docsPendentes = (s.documentos || []).filter(
        (d) => d.obrigatorio && !d.entregue
      );
      if (docsPendentes.length > 0 && s.status !== "concluido" && s.status !== "cancelado") {
        notifs.push({
          id: `doc_pendente_${s.id}`,
          tipo: "doc_pendente" as TipoNotificacao,
          titulo: "Documentos pendentes",
          descricao: `${s.colaborador} — ${docsPendentes.length} doc(s) obrigatório(s) em falta`,
          criado_em: new Date().toISOString(),
          lida: false,
          solicitacao_id: s.id,
          colaborador: s.colaborador,
        });
      }

      if (s.agendado_para) {
        const agend = new Date(s.agendado_para);
        const ehHoje =
          agend.getFullYear() === agora.getFullYear() &&
          agend.getMonth() === agora.getMonth() &&
          agend.getDate() === agora.getDate();
        if (ehHoje) {
          notifs.push({
            id: `agendamento_${s.id}`,
            tipo: "novo_agendamento" as TipoNotificacao,
            titulo: "Agendamento hoje",
            descricao: `${s.colaborador} às ${agend.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}${s.medico_responsavel ? ` com ${s.medico_responsavel}` : ""}`,
            criado_em: s.agendado_para,
            lida: false,
            solicitacao_id: s.id,
            colaborador: s.colaborador,
          });
        }
      }
    });

    return notifs.sort(
      (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
    );
  }, [solicitacoes]);

  const [extras, setExtras] = useState<Notificacao[]>([]);
  const [lidas, setLidas] = useState<Set<string>>(new Set());
  const [removidas, setRemovidas] = useState<Set<string>>(new Set());

  const notificacoes: Notificacao[] = useMemo(() => {
    const todas = [...extras, ...geradas].filter((n) => !removidas.has(n.id));
    const vistas = new Set<string>();
    return todas
      .filter((n) => {
        if (vistas.has(n.id)) return false;
        vistas.add(n.id);
        return true;
      })
      .map((n) => ({ ...n, lida: lidas.has(n.id) ? true : n.lida }));
  }, [geradas, extras, lidas, removidas]);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const marcarLida = useCallback((id: string) => {
    setLidas((prev) => new Set(prev).add(id));
  }, []);

  const marcarTodasLidas = useCallback(() => {
    setLidas((prev) => {
      const next = new Set(prev);
      notificacoes.forEach((n) => next.add(n.id));
      return next;
    });
  }, [notificacoes]);

  const remover = useCallback((id: string) => {
    setRemovidas((prev) => new Set(prev).add(id));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setExtras((prev) => {
        if (prev.find((n) => n.id === "demo_live")) return prev;
        return [
          {
            id: "demo_live",
            tipo: "status_atualizado" as TipoNotificacao,
            titulo: "Status atualizado",
            descricao: "Nova solicitação recebida no sistema",
            criado_em: new Date().toISOString(),
            lida: false,
          },
          ...prev,
        ];
      });
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <NotificacoesContext.Provider
      value={{ notificacoes, naoLidas, marcarLida, marcarTodasLidas, remover }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoesContext(): NotificacoesContextValue {
  const ctx = useContext(NotificacoesContext);
  if (!ctx) throw new Error("useNotificacoesContext must be used inside NotificacoesProvider");
  return ctx;
}
