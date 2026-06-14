import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HeartPulse, Loader2, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const { signIn, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err?.message ?? "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "#0f766e" }}
          >
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OcupaMed CRM</h1>
          <p className="text-sm text-gray-500 mt-1">CRM Saúde Ocupacional</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {!configured ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <p className="text-sm font-medium text-gray-700">Autenticação não configurada</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Adicione as variáveis <code className="font-mono bg-gray-100 px-1 rounded">VITE_SUPABASE_URL</code> e{" "}
                <code className="font-mono bg-gray-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> nos Secrets do projeto para ativar o login.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Entrar na sua conta
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition"
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 0 2px #0f766e40")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition"
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 0 2px #0f766e40")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "")}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{ backgroundColor: "#0f766e" }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">OcupaMed © 2026</p>
      </div>
    </div>
  );
}
