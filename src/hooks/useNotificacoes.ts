export type TipoNotificacao =
  | "prazo_vencido"
  | "prazo_proximo"
  | "doc_pendente"
  | "novo_agendamento"
  | "status_atualizado";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  criado_em: string;
  lida: boolean;
  solicitacao_id?: string;
  colaborador?: string;
}

export const ICONE: Record<TipoNotificacao, string> = {
  prazo_vencido:     "🔴",
  prazo_proximo:     "🟠",
  doc_pendente:      "📄",
  novo_agendamento:  "📅",
  status_atualizado: "🔄",
};

export { useNotificacoesContext as useNotificacoes } from "@/contexts/NotificacoesContext";
