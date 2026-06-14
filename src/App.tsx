import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SolicitacoesProvider } from "@/contexts/SolicitacoesContext";
import { NotificacoesProvider } from "@/contexts/NotificacoesContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import DebugLeads from "./pages/DebugLeads";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function ProtectedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <SolicitacoesProvider>
      <NotificacoesProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/debug-leads" element={<DebugLeads />} />
          <Route path="/app/*" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NotificacoesProvider>
    </SolicitacoesProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={BASE}>
        <AuthProvider>
          <ProtectedApp />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
