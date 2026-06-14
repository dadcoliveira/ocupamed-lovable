import { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS = [
  "Novo",
  "Em triagem",
  "Aguardando contato",
  "Agendado",
  "Concluído",
  "Cancelado",
  "Atendimento de setor responsável",
] as const;

type LeadStatus = (typeof STATUS_OPTIONS)[number];

const statusStyles: Record<LeadStatus, string> = {
  "Novo": "bg-secondary/15 text-secondary border-secondary/30",
  "Em triagem": "bg-warning/15 text-warning-foreground border-warning/40",
  "Aguardando contato": "bg-muted text-muted-foreground border-border",
  "Agendado": "bg-primary/15 text-primary border-primary/30",
  "Concluído": "bg-success/15 text-success border-success/30",
  "Cancelado": "bg-destructive/15 text-destructive border-destructive/30",
  "Atendimento de setor responsável": "bg-sector/15 text-sector border-sector/30",
};

interface LeadStatusSelectProps {
  leadId: string;
  fallbackStatus?: string;
}

export function LeadStatusSelect({ leadId, fallbackStatus }: LeadStatusSelectProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["lead-status", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id,status")
        .eq("id", leadId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [optimistic, setOptimistic] = useState<string | null>(null);
  useEffect(() => setOptimistic(null), [data?.status]);

  const mutation = useMutation({
    mutationFn: async (newStatus: LeadStatus) => {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);
      if (error) throw error;
      return newStatus;
    },
    onMutate: (newStatus) => setOptimistic(newStatus),
    onSuccess: (newStatus) => {
      toast.success("Status atualizado", { description: `Novo status: ${newStatus}` });
      queryClient.invalidateQueries({ queryKey: ["lead-status", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err: any) => {
      setOptimistic(null);
      toast.error("Não foi possível atualizar o status", {
        description: err?.message ?? "Tente novamente em instantes.",
      });
    },
  });

  const currentStatus = (optimistic ?? data?.status ?? fallbackStatus ?? "Novo") as LeadStatus;
  const isKnown = (STATUS_OPTIONS as readonly string[]).includes(currentStatus);
  const styles = isKnown ? statusStyles[currentStatus] : "bg-muted text-muted-foreground border-border";

  // Lead não existe no banco — não permitir update
  const leadMissing = !isLoading && !data;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={mutation.isPending || isLoading || leadMissing}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
          "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          styles,
        )}
        title={leadMissing ? "Lead não encontrado no banco — alteração indisponível" : "Alterar status"}
      >
        {(mutation.isPending || isLoading) && <Loader2 className="h-3 w-3 animate-spin" />}
        <span>{currentStatus}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {STATUS_OPTIONS.map((option) => {
          const isCurrent = option === currentStatus;
          return (
            <DropdownMenuItem
              key={option}
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                if (!isCurrent) mutation.mutate(option);
              }}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block h-2 w-2 rounded-full",
                    statusStyles[option].split(" ")[0],
                  )}
                />
                {option}
              </span>
              {isCurrent && <Check className="h-3.5 w-3.5 text-success" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
