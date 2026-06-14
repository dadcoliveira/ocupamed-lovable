import { DEMO_MODE, DEMO_DELAY } from "@/config/demoMode";
import { mockLeads, getMockLeadDashboard } from "@/data/mockData";

const N8N_BASE_URL = "https://ocupamed.app.n8n.cloud/webhook";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T = unknown>(endpoint: string, payload: object = {}): Promise<T> {
  const response = await fetch(`${N8N_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log(`[n8n] ${endpoint} — status ${response.status}, body:`, text);

  if (!text || text.trim() === "") {
    throw new Error("O servidor n8n retornou uma resposta vazia");
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    console.error(`[n8n] ${endpoint} — resposta não é JSON válido:`, text);
    throw new Error(`Resposta inválida do n8n: ${text.slice(0, 200)}`);
  }

  console.log(`[n8n] ${endpoint} — parsed:`, data);

  if (!response.ok || (data as any)?.success === false) {
    throw new Error((data as any)?.message || "Erro na requisição");
  }

  return data as T;
}

export type LeadRow = {
  id: string;
  lead_id?: string;
  created_at: string;
  requester_name: string | null;
  company: string | null;
  employee_name: string | null;
  request_type: string | null;
  priority: string | null;
  preferred_date: string | null;
  preferred_period: string | null;
  status: string;
};

export function leadUuid(l: LeadRow): string {
  return l.lead_id ?? l.id;
}

export type LeadDashboardResponse = {
  lead?: {
    id?: string;
    lead_id?: string;
    created_at?: string;
    requester_name?: string | null;
    company?: string | null;
    employee_name?: string | null;
    request_type?: string | null;
    status?: string;
    priority?: string | null;
    urgency?: string | null;
    preferred_date?: string | null;
    preferred_period?: string | null;
    initial_notes?: string | null;
    conversation_summary?: string | null;
    dashboard_summary?: string | null;
  };
  details?: Record<string, unknown> | null;
  history?: {
    id?: string;
    created_at?: string;
    event_type?: string;
    description?: string;
    old_value?: string | null;
    new_value?: string | null;
    author_type?: string | null;
    event_origin?: string | null;
  }[];
  schedule?: {
    id?: string;
    preferred_date?: string | null;
    preferred_period?: string | null;
    schedule_status?: string;
    schedule_notes?: string | null;
    confirmed_at?: string | null;
  }[];
} & Record<string, unknown>;

export const api = {
  getLeads: async (filters: Record<string, unknown> = {}): Promise<LeadRow[]> => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      let leads = [...mockLeads] as LeadRow[];
      if (filters.status) {
        leads = leads.filter((l) => l.status === filters.status);
      }
      if (filters.priority) {
        leads = leads.filter((l) => l.priority === filters.priority);
      }
      return leads;
    }
    const data = await request<{ leads?: LeadRow[] }>("/leads-list", filters);
    return Array.isArray(data.leads) ? data.leads : [];
  },

  getLeadDashboard: async (leadId: string): Promise<LeadDashboardResponse> => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      const dashboard = getMockLeadDashboard(leadId);
      if (!dashboard) throw new Error("Lead não encontrado");
      return dashboard as LeadDashboardResponse;
    }
    return request<LeadDashboardResponse>("/lead-dashboard", { lead_id: leadId });
  },

  createLead: async (payload: Record<string, unknown>) => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      const newId = crypto.randomUUID();
      const newLead = {
        id: newId,
        ...payload,
        status: "Novo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        summary: `${payload.request_type} | ${payload.requester_name} | ${payload.company}`,
      } as any;
      mockLeads.unshift(newLead);
      return { success: true, lead_id: newId, message: "Lead criado (demo)" };
    }
    return request("/create-lead", payload);
  },

  updateLead: async (payload: Record<string, unknown>) => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      const lead = mockLeads.find((l) => l.id === payload.lead_id);
      if (lead) {
        Object.assign(lead, payload);
        (lead as any).updated_at = new Date().toISOString();
      }
      return { success: true, lead_id: payload.lead_id, message: "Lead atualizado (demo)" };
    }
    return request("/update-lead", payload);
  },

  updateLeadStatus: async (leadId: string, status: string, notes = "") => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      const lead = mockLeads.find((l) => l.id === leadId);
      if (lead) {
        lead.status = status as any;
        (lead as any).updated_at = new Date().toISOString();
      }
      return { success: true, lead_id: leadId, status, message: "Status atualizado (demo)" };
    }
    return request("/lead-status-update", {
      lead_id: leadId,
      status,
      notes,
      author_type: "user",
      event_origin: "replit",
    });
  },

  updateSchedule: async (payload: Record<string, unknown>) => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      return { success: true, lead_id: payload.lead_id, message: "Agendamento atualizado (demo)" };
    }
    return request("/lead-schedule-update", payload);
  },

  humanEscalation: async (payload: Record<string, unknown>) => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      return { success: true, lead_id: payload.lead_id, message: "Encaminhado para humano (demo)" };
    }
    return request("/human-escalation", payload);
  },

  classifyMessage: async (payload: Record<string, unknown>) => {
    if (DEMO_MODE) {
      await delay(DEMO_DELAY);
      return {
        success: true,
        classification: {
          request_type: "exame_admissional",
          priority: "media",
          needs_human: false,
          summary: "Classificação simulada em modo demo",
          extracted_data: {},
        },
      };
    }
    return request("/crm-message-classifier", payload);
  },
};
