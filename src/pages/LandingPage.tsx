import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  HeartPulse, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Zap,
  ChevronRight,
  Star,
} from "lucide-react";

const dores = [
  { icon: MessageSquare, title: "Solicitações desorganizadas", desc: "Pedidos chegam por WhatsApp, telefone e site sem controle centralizado." },
  { icon: Clock, title: "Tempo perdido na triagem", desc: "Equipe gasta horas classificando e encaminhando solicitações manualmente." },
  { icon: BarChart3, title: "Sem visibilidade operacional", desc: "Gestores não sabem quantas solicitações estão pendentes ou atrasadas." },
];

const comoFunciona = [
  { step: "01", title: "Receba", desc: "Solicitações chegam de qualquer canal e são centralizadas automaticamente." },
  { step: "02", title: "Classifique", desc: "Triagem inteligente por tipo de exame, prioridade e urgência." },
  { step: "03", title: "Agende", desc: "Pré-agendamento rápido com visão completa da agenda e disponibilidade." },
  { step: "04", title: "Acompanhe", desc: "Pipeline visual para controlar todo o fluxo, da entrada à conclusão." },
];

const beneficios = [
  { icon: Zap, title: "Agilidade na triagem", desc: "Reduza o tempo de classificação em até 70%." },
  { icon: Shield, title: "Controle total", desc: "Nunca mais perca uma solicitação ou perca um prazo." },
  { icon: BarChart3, title: "Visão estratégica", desc: "Dashboards em tempo real para decisões informadas." },
  { icon: CheckCircle, title: "Padronização", desc: "Fluxos consistentes para toda a equipe." },
  { icon: Star, title: "Experiência premium", desc: "Interface moderna que impressiona gestores e clientes." },
  { icon: MessageSquare, title: "Multicanal", desc: "Centralize WhatsApp, site e telefone em um só lugar." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">OcupaMed</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#dores" className="text-muted-foreground hover:text-foreground transition-colors">Problema</a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">Benefícios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Button size="sm">Solicitar Demo</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 text-xs px-4 py-1.5">
            CRM Operacional para Saúde Ocupacional
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Organize sua clínica com{" "}
            <span className="text-secondary">inteligência operacional</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Do WhatsApp à conclusão do exame: centralize solicitações, automatize triagens 
            e acompanhe cada etapa com um painel premium feito para clínicas ocupacionais.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button size="lg" className="px-8">
              Solicitar Demonstração
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Link to="/app">
              <Button variant="outline" size="lg" className="px-8">
                Ver Painel ao Vivo
              </Button>
            </Link>
          </div>

          {/* Mockup */}
          <div className="mt-16 relative">
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="bg-muted/50 h-8 flex items-center px-4 gap-2 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/40" />
                <div className="w-3 h-3 rounded-full bg-warning/40" />
                <div className="w-3 h-3 rounded-full bg-success/40" />
              </div>
              <div className="p-6 bg-gradient-to-br from-muted/30 to-background">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Novas", value: "12" },
                    { label: "Triagem", value: "5" },
                    { label: "Agendados", value: "8" },
                    { label: "Concluídos", value: "34" },
                  ].map(k => (
                    <div key={k.label} className="bg-card rounded-xl p-4 border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase">{k.label}</p>
                      <p className="text-2xl font-bold text-foreground">{k.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-xl p-4 border border-border h-32" />
                  <div className="bg-card rounded-xl p-4 border border-border h-32" />
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Dores */}
      <section id="dores" className="py-20 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Sua clínica enfrenta esses desafios?</h2>
            <p className="text-muted-foreground mt-3">Problemas comuns que resolvemos diariamente</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dores.map((d) => (
              <Card key={d.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <d.icon className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{d.title}</h3>
                <p className="text-sm text-muted-foreground">{d.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Como funciona</h2>
            <p className="text-muted-foreground mt-3">Quatro passos para uma operação eficiente</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {comoFunciona.map((c) => (
              <div key={c.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{c.step}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Por que escolher o OcupaMed</h2>
            <p className="text-muted-foreground mt-3">Benefícios reais para sua operação clínica</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beneficios.map((b) => (
              <div key={b.title} className="flex gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pronto para transformar sua operação?
          </h2>
          <p className="text-lg text-muted-foreground mt-4 mb-8">
            Agende uma demonstração gratuita e veja como o OcupaMed pode 
            elevar o nível da sua clínica ocupacional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-10">
              Solicitar Demonstração Gratuita
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">OcupaMed</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 OcupaMed. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
