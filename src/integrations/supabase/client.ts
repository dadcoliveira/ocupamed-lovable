const BASE_URL = "/api";

async function apiRequest<T>(path: string, options?: RequestInit): Promise<{ data: T | null; error: { message: string } | null }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { data: null, error: { message: (errData as any).error ?? `HTTP ${res.status}` } };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err?.message ?? "Network error" } };
  }
}

function makeQueryBuilder<T>(table: string) {
  const state = {
    fields: "*",
    filters: [] as Array<{ col: string; val: any }>,
    orderBy: null as { col: string; ascending: boolean } | null,
    limitN: null as number | null,
  };

  const builder = {
    select(fields: string) {
      state.fields = fields;
      return builder;
    },
    eq(col: string, val: any) {
      state.filters.push({ col, val });
      return builder;
    },
    order(col: string, opts?: { ascending?: boolean }) {
      state.orderBy = { col, ascending: opts?.ascending ?? true };
      return builder;
    },
    limit(n: number) {
      state.limitN = n;
      return builder;
    },
    async maybeSingle(): Promise<{ data: T | null; error: { message: string } | null }> {
      const idFilter = state.filters.find((f) => f.col === "id");
      const leadIdFilter = state.filters.find((f) => f.col === "lead_id");

      if (table === "leads" && idFilter) {
        const res = await apiRequest<any>(`/leads/${idFilter.val}`);
        if (res.error) return { data: null, error: res.error };
        const full = res.data as any;
        return { data: full?.lead ?? null, error: null };
      }
      if (table === "lead_details" && leadIdFilter) {
        const res = await apiRequest<any>(`/leads/${leadIdFilter.val}`);
        if (res.error) return { data: null, error: res.error };
        const full = res.data as any;
        return { data: full?.details ?? null, error: null };
      }

      const params = new URLSearchParams();
      if (state.limitN !== null) params.set("limit", "1");
      const qs = params.toString() ? `?${params.toString()}` : "";
      const res = await apiRequest<T[]>(`/${table}${qs}`);
      if (res.error) return { data: null, error: res.error };
      return { data: (res.data ?? [])[0] ?? null, error: null };
    },
    then(resolve: (result: { data: T[] | null; error: { message: string } | null }) => void) {
      const params = new URLSearchParams();
      if (state.limitN !== null) params.set("limit", String(state.limitN));
      const qs = params.toString() ? `?${params.toString()}` : "";

      const leadIdFilter = state.filters.find((f) => f.col === "lead_id");

      let path = `/${table}${qs}`;

      // For sub-tables, fetch from the lead detail endpoint and extract
      if ((table === "lead_history" || table === "lead_schedule") && leadIdFilter) {
        apiRequest<any>(`/leads/${leadIdFilter.val}`).then((res) => {
          if (res.error) { resolve({ data: null, error: res.error }); return; }
          const full = res.data as any;
          let data: T[] = (table === "lead_history" ? full?.history : full?.schedule) ?? [];
          if (state.orderBy) {
            const { col, ascending } = state.orderBy;
            data = [...data].sort((a: any, b: any) => {
              const av = a[col] ?? "";
              const bv = b[col] ?? "";
              return ascending ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
            });
          }
          resolve({ data, error: null });
        });
        return;
      }

      apiRequest<T[]>(path).then((res) => {
        if (res.error) { resolve({ data: null, error: res.error }); return; }
        let data = res.data ?? [];
        for (const f of state.filters) {
          data = data.filter((row: any) => row[f.col] === f.val);
        }
        if (state.orderBy) {
          const { col, ascending } = state.orderBy;
          data = [...data].sort((a: any, b: any) => {
            const av = a[col] ?? "";
            const bv = b[col] ?? "";
            return ascending ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
          });
        }
        resolve({ data, error: null });
      });
    },
  };

  return builder;
}

function makeUpdateBuilder<T>(table: string, data: any) {
  const filters: Array<{ col: string; val: any }> = [];

  const builder = {
    eq(col: string, val: any) {
      filters.push({ col, val });
      return builder;
    },
    then(resolve: (result: { error: { message: string } | null }) => void) {
      const idFilter = filters.find((f) => f.col === "id");
      if (!idFilter) {
        resolve({ error: { message: "No ID filter for update" } });
        return;
      }
      apiRequest(`/${table}/${idFilter.val}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((res) => {
        resolve({ error: res.error });
      });
    },
  };

  return builder;
}

export const supabase = {
  from<T = any>(table: string) {
    return {
      select(fields: string = "*") {
        return makeQueryBuilder<T>(table).select(fields);
      },
      update(data: any) {
        return makeUpdateBuilder<T>(table, data);
      },
    };
  },
};
