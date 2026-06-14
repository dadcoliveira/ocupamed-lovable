import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/services/api";
import type { LeadDashboardResponse } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Loader2, Inbox, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

const STATUS_OPTIONS = [
  "Novo",
  "Em triagem",
  "Aguardando contato",
  "Agendado",
  "Concluído",
  "Cancelado",
  "Atendimento de setor responsável",
] as const;

type Lead = {
  id: string;
  created_at: string;
  requester_name: string | null;
  company: string | null;
  employee_name: string | null;
  request_type: string | null;
  status: string;
  priority: string | null;
  urgency: string | null;
  preferred_date: string | null;
  preferred_period: string | null;
  initial_notes: string | null;
  conversation_summary: string | null;
  dashboard_summary: string | null;
};

type LeadDetails = Record<string, unknown> | null;

type HistoryRow = {
  id: string;
  created_at: string;
  event_type: string;
  description: string;
  old_value: string | null;
  new_value: string | null;
  author_type: string | null;
  event_origin: string | null;
};

type ScheduleRow = {
  id: string;
  preferred_date: string | null;
  preferred_period: string | null;
  schedule_status: string;
  schedule_notes: string | null;
  confirmed_at: string | null;
};

const DETAIL_FIELDS: { key: string; label: string }[] = [
  { key: "employee_role", label: "Cargo do colaborador" },
  { key: "admission_deadline", label: "Prazo admissional" },
  { key: "dismissal_deadline", label: "Prazo demissional" },
  { key: "periodic_type", label: "Tipo de periódico" },
  { key: "periodic_quantity", label: "Quantidade periódico" },
  { key: "periodic_window", label: "Janela do periódico" },
  { key: "has_return_date", label: "Possui data de retorno" },
  { key: "return_date", label: "Data de retorno" },
  { key: "has_return_document", label: "Possui documento de retorno" },
  { key: "current_job_role", label: "Cargo atual" },
  { key: "new_role", label: "Novo cargo" },
  { key: "has_role_change_deadline", label: "Possui prazo de mudança de função" },
  { key: "role_change_deadline", label: "Prazo de mudança de função" },
  { key: "aso_purpose", label: "Finalidade do ASO" },
  { key: "aso_other_purpose", label: "Outra finalidade do ASO" },
  { key: "already_knows_exam_type", label: "Já conhece o tipo de exame" },
  { key: "triage_exam_type", label: "Tipo de exame (triagem)" },
  { key: "specific_question", label: "Pergunta específica" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatValue(v: unknown) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  return String(v);
}

function statusVariant(status: string) {
  const s = (status ?? "").toLowerCase();
  if (s.includes("conclu")) return "bg-success/15 text-success border-success/30";
  if (s.includes("cancel")) return "bg-destructive/10 text-destructive border-destructive/30";
  if (s.includes("setor") || s.includes("respons"))
    return "bg-sector/15 text-sector border-sector/30";
  if (s.includes("andamento") || s.includes("progres"))
    return "bg-secondary/15 text-secondary border-secondary/30";
  if (s.includes("novo")) return "bg-primary/10 text-primary border-primary/30";
  return "bg-muted text-muted-foreground border-border";
}

function priorityVariant(priority: string | null) {
  const p = (priority ?? "").toLowerCase();
  if (p.includes("alta") || p.includes("urgente"))
    return "bg-destructive/10 text-destructive border-destructive/30";
  if (p.includes("media") || p.includes("média"))
    return "bg-warning/15 text-warning-foreground border-warning/40";
  if (p.includes("baixa")) return "bg-success/15 text-success border-success/30";
  return "bg-muted text-muted-foreground border-border";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
      {children}
    </h2>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground break-words">{value}</p>
    </div>
  );
}

function EmptyBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Inbox className="h-4 w-4" />
      <span>{children}</span>
    </div>
  );
}

function extractLead(raw: LeadDashboardResponse): Lead | null {
  // n8n may return { lead: {...}, ... } or a flat object or an array with one item
  let src: Record<string, unknown>;
  if (Array.isArray(raw)) {
    src = (raw as any[])[0] ?? {};
  } else {
    src = ((raw as any).lead ?? raw) as Record<string, unknown>;
  }

  const id = src.lead_id ?? src.id;
  if (!id) {
    console.warn("[LeadDetail] extractLead: nenhum campo id/lead_id encontrado em", raw);
    return null;
  }

  return {
    id: String(id),
    created_at: String(src.created_at ?? ""),
    requester_name: (src.requester_name as string) ?? null,
    company: (src.company as string) ?? null,
    employee_name: (src.employee_name as string) ?? null,
    request_type: (src.request_type as string) ?? null,
    status: String(src.status ?? ""),
    priority: (src.priority as string) ?? null,
    urgency: (src.urgency as string) ?? null,
    preferred_date: (src.preferred_date as string) ?? null,
    preferred_period: (src.preferred_period as string) ?? null,
    initial_notes: (src.initial_notes as string) ?? null,
    conversation_summary: (src.conversation_summary as string) ?? null,
    dashboard_summary: (src.dashboard_summary as string) ?? null,
  };
}

function normalizeArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (val && typeof val === "object") return [val as T];
  return [];
}

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useRole();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [details, setDetails] = useState<LeadDetails>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (!lead || newStatus === lead.status) return;
    const previous = lead.status;
    setSavingStatus(true);
    setLead({ ...lead, status: newStatus });
    try {
      await api.updateLeadStatus(lead.id, newStatus, "");
      toast.success("Status atualizado", { description: `Novo status: ${newStatus}` });
    } catch (e: any) {
      setLead({ ...lead, status: previous });
      toast.error("Não foi possível atualizar o status", {
        description: e?.message ?? "Erro desconhecido",
      });
    } finally {
      setSavingStatus(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const raw = await api.getLeadDashboard(id) as LeadDashboardResponse;

        if (cancelled) return;

        const extracted = extractLead(raw);
        if (!extracted) throw new Error("Lead não encontrado");

        const rawAny = raw as any;
        setLead(extracted);
        setDetails((rawAny.details as LeadDetails) ?? null);
        setHistory(
          normalizeArray<any>(rawAny.history).map((h: any) => ({
            id: String(h.id ?? Math.random()),
            created_at: String(h.created_at ?? ""),
            event_type: String(h.event_type ?? ""),
            description: String(h.description ?? ""),
            old_value: h.old_value ?? null,
            new_value: h.new_value ?? null,
            author_type: h.author_type ?? null,
            event_origin: h.event_origin ?? null,
          }))
        );
        setSchedule(
          normalizeArray<any>(rawAny.schedule).map((s: any) => ({
            id: String(s.id ?? Math.random()),
            preferred_date: s.preferred_date ?? null,
            preferred_period: s.preferred_period ?? null,
            schedule_status: String(s.schedule_status ?? ""),
            schedule_notes: s.schedule_notes ?? null,
            confirmed_at: s.confirmed_at ?? null,
          }))
        );
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erro desconhecido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-10 flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Carregando solicitação...</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 border-destructive/40 bg-destructive/5">
          <div className="flex items-start gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Não foi possível carregar a solicitação.</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Solicitação não encontrada.</p>
        <Link
          to="/app/solicitacoes"
          className="text-secondary hover:underline text-sm mt-2 inline-block"
        >
          Voltar
        </Link>
      </div>
    );
  }

  const detailEntries = details
    ? DETAIL_FIELDS.filter(
        (f) =>
          details[f.key] !== null &&
          details[f.key] !== undefined &&
          details[f.key] !== ""
      )
    : [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/app/solicitacoes">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">
              {lead.employee_name ?? lead.requester_name ?? "Solicitação"}
            </h1>
            <Badge variant="outline" className={statusVariant(lead.status)}>
              {lead.status}
            </Badge>
            {lead.priority && (
              <Badge variant="outline" className={priorityVariant(lead.priority)}>
                {lead.priority}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {lead.id} · {lead.request_type ?? "—"} · {lead.company ?? "—"}
          </p>
        </div>
      </div>

      {/* 1. Dados principais */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Dados principais</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Solicitante" value={formatValue(lead.requester_name)} />
          <Field label="Empresa" value={formatValue(lead.company)} />
          <Field label="Colaborador" value={formatValue(lead.employee_name)} />
          <Field label="Tipo" value={formatValue(lead.request_type)} />
          <Field
            label="Status"
            value={
              isAdmin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={savingStatus}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
                      statusVariant(lead.status),
                    )}
                    title="Alterar status"
                  >
                    {savingStatus && <Loader2 className="h-3 w-3 animate-spin" />}
                    <span>{lead.status}</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {STATUS_OPTIONS.map((option) => {
                      const isCurrent = option === lead.status;
                      return (
                        <DropdownMenuItem
                          key={option}
                          onSelect={(e) => {
                            e.preventDefault();
                            if (!isCurrent) handleStatusChange(option);
                          }}
                          className="flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span>{option}</span>
                          {isCurrent && <Check className="h-3.5 w-3.5 text-success" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Badge variant="outline" className={statusVariant(lead.status)}>
                  {lead.status}
                </Badge>
              )
            }
          />
          <Field
            label="Prioridade"
            value={
              lead.priority ? (
                <Badge variant="outline" className={priorityVariant(lead.priority)}>
                  {lead.priority}
                </Badge>
              ) : (
                "—"
              )
            }
          />
          <Field label="Urgência" value={formatValue(lead.urgency)} />
          <Field label="Recebido em" value={formatDate(lead.created_at)} />
        </div>
      </Card>

      {/* 2. Preferência de atendimento */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Preferência de atendimento</SectionTitle>
        {!lead.preferred_date && !lead.preferred_period ? (
          <EmptyBlock>Sem preferência informada.</EmptyBlock>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Data preferida" value={formatValue(lead.preferred_date)} />
            <Field
              label="Período preferido"
              value={formatValue(lead.preferred_period)}
            />
          </div>
        )}
      </Card>

      {/* 3. Observações e resumo */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Observações e resumo</SectionTitle>
        {!lead.initial_notes &&
        !lead.conversation_summary &&
        !lead.dashboard_summary ? (
          <EmptyBlock>Sem observações registradas.</EmptyBlock>
        ) : (
          <div className="space-y-4">
            {lead.initial_notes && (
              <Field label="Notas iniciais" value={lead.initial_notes} />
            )}
            {lead.conversation_summary && (
              <Field label="Resumo da conversa" value={lead.conversation_summary} />
            )}
            {lead.dashboard_summary && (
              <Field label="Resumo do dashboard" value={lead.dashboard_summary} />
            )}
          </div>
        )}
      </Card>

      {/* 4. Dados específicos */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Dados específicos</SectionTitle>
        {detailEntries.length === 0 ? (
          <EmptyBlock>Sem dados específicos cadastrados.</EmptyBlock>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailEntries.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                value={formatValue(details?.[f.key])}
              />
            ))}
          </div>
        )}
      </Card>

      {/* 5. Histórico */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Histórico</SectionTitle>
        {history.length === 0 ? (
          <EmptyBlock>Sem histórico registrado.</EmptyBlock>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={h.id}
                className="border border-border rounded-md p-3 bg-muted/20"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {h.event_type}
                    </Badge>
                    {h.event_origin && (
                      <span className="text-xs text-muted-foreground">
                        · {h.event_origin}
                      </span>
                    )}
                    {h.author_type && (
                      <span className="text-xs text-muted-foreground">
                        · {h.author_type}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(h.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-2">{h.description}</p>
                {(h.old_value || h.new_value) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {h.old_value ?? "—"} → {h.new_value ?? "—"}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* 6. Pré-agendamento */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Pré-agendamento</SectionTitle>
        {schedule.length === 0 ? (
          <EmptyBlock>Sem pré-agendamento registrado.</EmptyBlock>
        ) : (
          <ul className="space-y-3">
            {schedule.map((s) => (
              <li
                key={s.id}
                className="border border-border rounded-md p-3 bg-muted/20"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="outline" className={statusVariant(s.schedule_status)}>
                    {s.schedule_status}
                  </Badge>
                  {s.confirmed_at && (
                    <span className="text-xs text-muted-foreground">
                      Confirmado em {formatDate(s.confirmed_at)}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <Field
                    label="Data preferida"
                    value={formatValue(s.preferred_date)}
                  />
                  <Field
                    label="Período preferido"
                    value={formatValue(s.preferred_period)}
                  />
                </div>
                {s.schedule_notes && (
                  <p className="text-sm text-foreground mt-3 whitespace-pre-wrap">
                    {s.schedule_notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
