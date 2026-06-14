import { useAuth } from "@/contexts/AuthContext";

export function useRole() {
  const { profile } = useAuth();
  const role = profile?.role ?? "vendedor";
  return {
    role,
    isAdmin: role === "admin",
    isVendedor: role === "vendedor",
  };
}
