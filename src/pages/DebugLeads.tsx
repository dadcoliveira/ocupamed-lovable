import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type DebugLead = {
  id: string;
  created_at: string;
  requester_name: string | null;
  company: string | null;
  employee_name: string | null;
  request_type: string | null;
  priority: string | null;
  preferred_date: string | null;
  preferred_period: string | null;
  status: string | null;
};

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ok"; rows: DebugLead[] };

export default function DebugLeads() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(
          "id, created_at, requester_name, company, employee_name, request_type, priority, preferred_date, preferred_period, status"
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (cancelled) return;

      if (error) {
        setState({ kind: "error", message: error.message });
        return;
      }

      setState({ kind: "ok", rows: (data ?? []) as DebugLead[] });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        /debug-leads
      </h1>
      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Página isolada de depuração. Lê <code>public.leads</code> uma única vez
        (limit 20, order by <code>created_at desc</code>).
      </p>

      {state.kind === "loading" && (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}>
          Carregando...
        </div>
      )}

      {state.kind === "error" && (
        <div style={{ padding: 12, border: "1px solid #c00", background: "#fee", color: "#900", borderRadius: 6, fontSize: 14, whiteSpace: "pre-wrap" }}>
          <strong>Erro:</strong> {state.message}
        </div>
      )}

      {state.kind === "ok" && state.rows.length === 0 && (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}>
          nenhum lead encontrado
        </div>
      )}

      {state.kind === "ok" && state.rows.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
            {state.rows.length} registro(s).
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {state.rows.map((l) => (
              <li key={l.id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, marginBottom: 10, fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", background: "#fff" }}>
                <div><strong>id:</strong> {l.id}</div>
                <div><strong>created_at:</strong> {l.created_at}</div>
                <div><strong>requester_name:</strong> {String(l.requester_name)}</div>
                <div><strong>company:</strong> {String(l.company)}</div>
                <div><strong>employee_name:</strong> {String(l.employee_name)}</div>
                <div><strong>request_type:</strong> {String(l.request_type)}</div>
                <div><strong>priority:</strong> {String(l.priority)}</div>
                <div><strong>preferred_date:</strong> {String(l.preferred_date)}</div>
                <div><strong>preferred_period:</strong> {String(l.preferred_period)}</div>
                <div><strong>status:</strong> {String(l.status)}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
