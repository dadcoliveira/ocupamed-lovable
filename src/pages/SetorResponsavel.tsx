import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, ArrowRight } from "lucide-react";

const casosSetor = [
  {
    id: "SOL-006",
    colaborador: "Ricardo Nunes",
    empresa: "Transportadora Veloz",
    tipo: "ASO",
    motivo: "Atividade de risco — necessita avaliação especial de medicina do trabalho",
    responsavel: "Coord. Operacional",
    statusInterno: "Em análise",
    data: "04/04/2026",
  },
  {
    id: "SOL-011",
    colaborador: "José Almeida",
    empresa: "Petroquímica Sul",
    tipo: "Retorno ao Trabalho",
    motivo: "Afastamento superior a 30 dias por doença ocupacional — requer parecer multidisciplinar",
    responsavel: "Dra. Patrícia",
    statusInterno: "Aguardando documentação",
    data: "03/04/2026",
  },
  {
    id: "SOL-012",
    colaborador: "Sandra Machado",
    empresa: "Mineração Norte",
    tipo: "Periódico",
    motivo: "Exposição a agentes químicos — encaminhado para avaliação toxicológica complementar",
    responsavel: "Dr. Ricardo",
    statusInterno: "Parecer emitido",
    data: "02/04/2026",
  },
];

export default function SetorResponsavel() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Setor Responsável</h1>
          <p className="text-sm text-muted-foreground mt-1">Casos encaminhados para avaliação especializada</p>
        </div>
        <Badge variant="sector">{casosSetor.length} casos ativos</Badge>
      </div>

      <div className="space-y-4">
        {casosSetor.map((caso) => (
          <Card key={caso.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sector/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-sector" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{caso.colaborador}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">{caso.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{caso.empresa} · {caso.tipo}</p>
                </div>
              </div>
              <Badge variant="setor" className="text-[10px]">{caso.statusInterno}</Badge>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Motivo:</span> {caso.motivo}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{caso.responsavel}</span>
                <span>{caso.data}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
