import { createContext, useContext, useState, ReactNode } from "react";
import { mockSolicitacoesDetalhadas, SolicitacaoDetalhada, Status, Prioridade } from "@/data/mockData";

interface SolicitacoesContextValue {
  solicitacoes: SolicitacaoDetalhada[];
  addSolicitacao: (s: SolicitacaoDetalhada) => void;
  updateStatus: (id: string, status: Status) => void;
  updatePrioridade: (id: string, prioridade: Prioridade) => void;
  marcarDocumento: (id: string, docIndex: number) => void;
  addHistorico: (id: string, descricao: string, autor: string) => void;
  updateSolicitacao: (id: string, partial: Partial<SolicitacaoDetalhada>) => void;
}

const SolicitacoesContext = createContext<SolicitacoesContextValue | null>(null);

export function SolicitacoesProvider({ children }: { children: ReactNode }) {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoDetalhada[]>(mockSolicitacoesDetalhadas);

  function addSolicitacao(s: SolicitacaoDetalhada) {
    setSolicitacoes((prev) => [s, ...prev]);
  }

  function updateStatus(id: string, status: Status) {
    setSolicitacoes((prev) =>
      prev.map((s) =>
        s.id !== id ? s : {
          ...s,
          status,
          historico: [...s.historico, {
            id: `H${Date.now()}`,
            data: new Date().toISOString(),
            tipo: "status" as const,
            descricao: `Status alterado para: ${status}`,
            autor: "Usuário",
          }],
        }
      )
    );
  }

  function updatePrioridade(id: string, prioridade: Prioridade) {
    setSolicitacoes((prev) =>
      prev.map((s) =>
        s.id !== id ? s : {
          ...s,
          prioridade,
          historico: [...s.historico, {
            id: `H${Date.now()}`,
            data: new Date().toISOString(),
            tipo: "observacao" as const,
            descricao: `Prioridade alterada para: ${prioridade}`,
            autor: "Usuário",
          }],
        }
      )
    );
  }

  function marcarDocumento(id: string, docIndex: number) {
    setSolicitacoes((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const docs = [...s.documentos];
        const doc = { ...docs[docIndex], entregue: !docs[docIndex].entregue };
        docs[docIndex] = doc;
        return {
          ...s,
          documentos: docs,
          historico: [...s.historico, {
            id: `H${Date.now()}`,
            data: new Date().toISOString(),
            tipo: "documento" as const,
            descricao: `Documento "${doc.nome}" marcado como ${doc.entregue ? "entregue" : "pendente"}.`,
            autor: "Usuário",
          }],
        };
      })
    );
  }

  function addHistorico(id: string, descricao: string, autor: string) {
    setSolicitacoes((prev) =>
      prev.map((s) =>
        s.id !== id ? s : {
          ...s,
          historico: [...s.historico, {
            id: `H${Date.now()}`,
            data: new Date().toISOString(),
            tipo: "observacao" as const,
            descricao,
            autor,
          }],
        }
      )
    );
  }

  function updateSolicitacao(id: string, partial: Partial<SolicitacaoDetalhada>) {
    setSolicitacoes((prev) =>
      prev.map((s) => s.id !== id ? s : { ...s, ...partial })
    );
  }

  return (
    <SolicitacoesContext.Provider value={{ solicitacoes, addSolicitacao, updateStatus, updatePrioridade, marcarDocumento, addHistorico, updateSolicitacao }}>
      {children}
    </SolicitacoesContext.Provider>
  );
}

export function useSolicitacoes() {
  const ctx = useContext(SolicitacoesContext);
  if (!ctx) throw new Error("useSolicitacoes must be used within SolicitacoesProvider");
  return ctx;
}
