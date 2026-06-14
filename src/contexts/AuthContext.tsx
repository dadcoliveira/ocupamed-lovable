import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseAuth, isSupabaseConfigured } from "@/lib/supabaseAuth";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "vendedor";
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!supabaseAuth) return null;
  try {
    const { data, error } = await supabaseAuth
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      email: data.email ?? "",
      name: data.name ?? "",
      role: data.role === "admin" ? "admin" : "vendedor",
    };
  } catch {
    return null;
  }
}

/** Resolves with null after `ms` ms — used to race against hanging Supabase calls */
function timeout<T>(ms: number): Promise<T | null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabaseAuth) return;

    // Race getSession against a 5s timeout so loading never hangs forever
    Promise.race([
      supabaseAuth.auth.getSession(),
      timeout<{ data: { session: null } }>(5000).then(() => ({ data: { session: null } })),
    ])
      .then(async (result) => {
        try {
          const u = result?.data?.session?.user ?? null;
          setUser(u);
          if (u) setProfile(await fetchProfile(u.id));
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabaseAuth.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setProfile(u ? await fetchProfile(u.id) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabaseAuth) throw new Error("Supabase não configurado");
    const { error } = await supabaseAuth.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    if (!supabaseAuth) return;
    await supabaseAuth.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, configured: isSupabaseConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
