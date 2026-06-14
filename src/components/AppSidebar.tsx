import { 
  LayoutDashboard, 
  FileText, 
  Kanban, 
  Calendar, 
  Users, 
  Clock, 
  Settings,
  HeartPulse,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Solicitações", url: "/app/solicitacoes", icon: FileText },
  { title: "Pipeline", url: "/app/pipeline", icon: Kanban },
  { title: "Agenda", url: "/app/agenda", icon: Calendar },
];

const managementItems = [
  { title: "Setor Responsável", url: "/app/setor", icon: Users },
  { title: "Histórico", url: "/app/historico", icon: Clock },
  { title: "Configurações", url: "/app/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, signOut } = useAuth();
  const { role } = useRole();
  const location = useLocation();

  const displayName = profile?.name || user?.email || "—";
  const initial = (profile?.name?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <HeartPulse className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-sidebar-primary truncate">OcupaMed</h1>
              <p className="text-[10px] text-sidebar-muted">CRM Saúde Ocupacional</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={toggleSidebar} className="text-sidebar-muted hover:text-sidebar-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider font-semibold mb-1">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/app"}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider font-semibold mb-1">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-sidebar-accent-foreground">
              {initial}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {displayName}
                </p>
                <span
                  className={
                    "inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none " +
                    (role === "admin"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-blue-500/20 text-blue-300")
                  }
                >
                  {role === "admin" ? "Admin" : "Vendedor"}
                </span>
              </div>
              <button
                onClick={signOut}
                title="Sair"
                className="text-sidebar-muted hover:text-sidebar-foreground transition-colors shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
