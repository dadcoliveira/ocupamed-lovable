import { useState } from "react";
import { Status, Prioridade, SolicitacaoDetalhada } from "@/data/mockData";

type TipoExameForm =
  | "admissional"
  | "demissional"
  | "periodico"
  | "retorno_afastamento"
  | "mudanca_funcao"
  | "monitoramento";

interface FormData {
  empresa: string;
  cnpj: string;
  colaborador: string;
  cpf: string;
  cargo: string;
  tipo: TipoExameForm;
  prioridade: Prioridade;
  prazo: string;
  preferencia_periodo: "manha" | "tarde" | "qualquer";
  observacao: string;
  solicitante: string;
  telefone: string;
  email: string;
  documentos: { nome: string; obrigatorio: boolean; entregue: boolean }[];
}

const tipoExameOptions: { value: TipoExameForm; label: string }[] = [
  { value: "admissional", label: "Admissional" },
  { value: "demissional", label: "Demissional" },
  { value: "periodico", label: "Periódico" },
  { value: "retorno_afastamento", label: "Retorno de Afastamento" },
  { value: "mudanca_funcao", label: "Mudança de Função" },
  { value: "monitoramento", label: "Monitoramento" },
];

const documentosPorTipo: Record<TipoExameForm, { nome: string; obrigatorio: boolean }[]> = {
  admissional: [
    { nome: "RG ou CNH", obrigatorio: true },
    { nome: "Guia de solicitação assinada", obrigatorio: true },
    { nome: "Ficha de função (GHE)", obrigatorio: true },
    { nome: "Foto 3x4", obrigatorio: false },
  ],
  demissional: [
    { nome: "RG ou CNH", obrigatorio: true },
    { nome: "Guia de solicitação assinada", obrigatorio: true },
    { nome: "Termo de rescisão", obrigatorio: true },
  ],
  periodico: [
    { nome: "RG ou CNH", obrigatorio: true },
    { nome: "Guia de solicitação assinada", obrigatorio: true },
    { nome: "GHE atualizado", obrigatorio: true },
    { nome: "Exames anteriores (último ASO)", obrigatorio: false },
  ],
  retorno_afastamento: [
    { nome: "RG ou CNH", obrigatorio: true },
    { nome: "Atestado médico de afastamento", obrigatorio: true },
    { nome: "Guia de solicitação assinada", obrigatorio: true },
    { nome: "Relatório do médico assistente", obrigatorio: false },
  ],
  mudanca_funcao: [
    { nome: "RG ou CNH", obrigatorio: true },
    { nome: "Guia de solicitação assinada", obrigatorio: true },
    { nome: "GHE novo cargo", obrigatorio: true },
  ],
  monitoramento: [
    { nome: "RG ou CNH", obrigatorio: true },
    { nome: "Guia de solicitação assinada", obrigatorio: true },
  ],
};

const estadoInicial: FormData = {
  empresa: "",
  cnpj: "",
  colaborador: "",
  cpf: "",
  cargo: "",
  tipo: "admissional",
  prioridade: "media",
  prazo: "",
  preferencia_periodo: "qualquer",
  observacao: "",
  solicitante: "",
  telefone: "",
  email: "",
  documentos: documentosPorTipo["admissional"].map((d) => ({ ...d, entregue: false })),
};

function formatCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCNPJ(v: string) {
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatTelefone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function gerarId() {
  return `SOL-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
}

interface Props {
  onVoltar: () => void;
  onSalvar: (solicitacao: SolicitacaoDetalhada) => void;
}

export default function NovaSolicitacaoForm({ onVoltar, onSalvar }: Props) {
  const [form, setForm] = useState<FormData>(estadoInicial);
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [erros, setErros] = useState<Partial<Record<keyof FormData, string>>>({});
  const [salvo, setSalvo] = useState(false);

  function set(campo: keyof FormData, valor: any) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  function onTipoChange(tipo: TipoExameForm) {
    setForm((prev) => ({
      ...prev,
      tipo,
      documentos: documentosPorTipo[tipo].map((d) => ({ ...d, entregue: false })),
    }));
  }

  function validarEtapa1() {
    const e: typeof erros = {};
    if (!form.empresa.trim()) e.empresa = "Obrigatório";
    if (!form.cnpj.trim() || form.cnpj.replace(/\D/g, "").length < 14) e.cnpj = "CNPJ inválido";
    if (!form.colaborador.trim()) e.colaborador = "Obrigatório";
    if (!form.cpf.trim() || form.cpf.replace(/\D/g, "").length < 11) e.cpf = "CPF inválido";
    if (!form.cargo.trim()) e.cargo = "Obrigatório";
    if (!form.solicitante.trim()) e.solicitante = "Obrigatório";
    if (!form.telefone.trim()) e.telefone = "Obrigatório";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function validarEtapa2() {
    const e: typeof erros = {};
    if (!form.prazo) e.prazo = "Obrigatório";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function avancar() {
    if (etapa === 1 && validarEtapa1()) setEtapa(2);
    else if (etapa === 2 && validarEtapa2()) setEtapa(3);
  }

  function salvar() {
    const nova: SolicitacaoDetalhada = {
      ...form,
      id: gerarId(),
      status: "novo" as Status,
      recebido_em: new Date().toISOString(),
      historico: [
        {
          id: `H${Date.now()}`,
          data: new Date().toISOString(),
          tipo: "status",
          descricao: "Solicitação criada. Status: Novo.",
          autor: "Usuário",
        },
      ],
    };
    onSalvar(nova);
    setSalvo(true);
  }

  function marcarDocumento(i: number) {
    const docs = [...form.documentos];
    docs[i] = { ...docs[i], entregue: !docs[i].entregue };
    setForm((prev) => ({ ...prev, documentos: docs }));
  }

  const etapas = ["Dados da Solicitação", "Tipo e Agendamento", "Documentos"];

  if (salvo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Solicitação criada!</h2>
          <p className="text-sm text-gray-500 mb-6">
            A solicitação foi registrada com sucesso e já aparece na lista com status{" "}
            <strong>Novo</strong>.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onVoltar}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
            >
              Ver lista de solicitações
            </button>
            <button
              onClick={() => { setForm(estadoInicial); setEtapa(1); setSalvo(false); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Nova solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onVoltar}
            className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1"
          >
            ← Voltar
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Solicitações</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-800">Nova Solicitação</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Nova Solicitação de Exame</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {etapas.map((label, i) => {
            const num = i + 1;
            const ativa = etapa === num;
            const concluida = etapa > num;
            return (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                      concluida
                        ? "bg-green-500 border-green-500 text-white"
                        : ativa
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {concluida ? "✓" : num}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium whitespace-nowrap ${
                      ativa ? "text-blue-600" : concluida ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < etapas.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-4 ${
                      etapa > num ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Etapa 1 */}
          {etapa === 1 && (
            <div className="p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-5">
                Dados da Empresa e Colaborador
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Empresa *
                  </label>
                  <input
                    value={form.empresa}
                    onChange={(e) => set("empresa", e.target.value)}
                    placeholder="Razão social da empresa"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.empresa ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.empresa && <p className="text-xs text-red-500 mt-1">{erros.empresa}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    CNPJ *
                  </label>
                  <input
                    value={form.cnpj}
                    onChange={(e) => set("cnpj", formatCNPJ(e.target.value))}
                    placeholder="00.000.000/0001-00"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.cnpj ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.cnpj && <p className="text-xs text-red-500 mt-1">{erros.cnpj}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Solicitante *
                  </label>
                  <input
                    value={form.solicitante}
                    onChange={(e) => set("solicitante", e.target.value)}
                    placeholder="Nome e setor (ex: Ana - RH)"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.solicitante ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.solicitante && (
                    <p className="text-xs text-red-500 mt-1">{erros.solicitante}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Telefone *
                  </label>
                  <input
                    value={form.telefone}
                    onChange={(e) => set("telefone", formatTelefone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.telefone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.telefone && (
                    <p className="text-xs text-red-500 mt-1">{erros.telefone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    E-mail
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="rh@empresa.com.br"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Colaborador</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Nome completo *
                  </label>
                  <input
                    value={form.colaborador}
                    onChange={(e) => set("colaborador", e.target.value)}
                    placeholder="Nome completo do colaborador"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.colaborador ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.colaborador && (
                    <p className="text-xs text-red-500 mt-1">{erros.colaborador}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    CPF *
                  </label>
                  <input
                    value={form.cpf}
                    onChange={(e) => set("cpf", formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.cpf ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.cpf && <p className="text-xs text-red-500 mt-1">{erros.cpf}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Cargo *
                  </label>
                  <input
                    value={form.cargo}
                    onChange={(e) => set("cargo", e.target.value)}
                    placeholder="Cargo / função"
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.cargo ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.cargo && <p className="text-xs text-red-500 mt-1">{erros.cargo}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 2 */}
          {etapa === 2 && (
            <div className="p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-5">
                Tipo de Exame e Preferências
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Tipo de Exame *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tipoExameOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => onTipoChange(opt.value)}
                        className={`text-sm px-3 py-2.5 rounded-lg border text-left transition-all ${
                          form.tipo === opt.value
                            ? "bg-blue-600 border-blue-600 text-white font-medium"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Prioridade *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["baixa", "media", "alta", "urgente"] as Prioridade[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => set("prioridade", p)}
                        className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                          form.prioridade === p
                            ? p === "urgente"
                              ? "bg-red-500 border-red-500 text-white font-medium"
                              : p === "alta"
                              ? "bg-orange-500 border-orange-500 text-white font-medium"
                              : p === "media"
                              ? "bg-blue-500 border-blue-500 text-white font-medium"
                              : "bg-gray-500 border-gray-500 text-white font-medium"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Período preferido
                  </label>
                  <div className="flex flex-col gap-2">
                    {(["manha", "tarde", "qualquer"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => set("preferencia_periodo", p)}
                        className={`text-sm px-3 py-2 rounded-lg border text-left transition-all ${
                          form.preferencia_periodo === p
                            ? "bg-purple-600 border-purple-600 text-white font-medium"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p === "manha" ? "☀️ Manhã" : p === "tarde" ? "🌤 Tarde" : "🕐 Qualquer horário"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Prazo limite *
                  </label>
                  <input
                    type="date"
                    value={form.prazo}
                    onChange={(e) => set("prazo", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      erros.prazo ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {erros.prazo && <p className="text-xs text-red-500 mt-1">{erros.prazo}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Observações
                  </label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => set("observacao", e.target.value)}
                    placeholder="Informações relevantes: exposição a agentes, histórico, restrições..."
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Etapa 3 */}
          {etapa === 3 && (
            <div className="p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Checklist de Documentos
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Marque os documentos já recebidos. Você pode atualizar depois na tela de detalhe.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-700">
                      {form.documentos.filter((d) => d.entregue).length}
                    </p>
                    <p className="text-xs text-blue-500">Entregues</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {form.documentos.filter((d) => d.obrigatorio && !d.entregue).length}
                    </p>
                    <p className="text-xs text-red-400">Obrigatórios pendentes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">{form.documentos.length}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {form.documentos.map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => marcarDocumento(i)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      doc.entregue
                        ? "bg-green-50 border-green-200"
                        : doc.obrigatorio
                        ? "bg-red-50 border-red-200 hover:bg-red-100"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        doc.entregue ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"
                      }`}
                    >
                      {doc.entregue && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{doc.nome}</p>
                      <p className="text-xs text-gray-500">
                        {doc.obrigatorio ? "Obrigatório" : "Opcional"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        doc.entregue ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {doc.entregue ? "Entregue" : "Pendente"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Resumo da solicitação
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Empresa: </span>
                    <span className="font-medium">{form.empresa}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Colaborador: </span>
                    <span className="font-medium">{form.colaborador}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tipo: </span>
                    <span className="font-medium">
                      {tipoExameOptions.find((t) => t.value === form.tipo)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Prioridade: </span>
                    <span className="font-medium capitalize">{form.prioridade}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Prazo: </span>
                    <span className="font-medium">
                      {form.prazo
                        ? new Date(form.prazo + "T12:00:00").toLocaleDateString("pt-BR")
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Período: </span>
                    <span className="font-medium">
                      {form.preferencia_periodo === "manha"
                        ? "Manhã"
                        : form.preferencia_periodo === "tarde"
                        ? "Tarde"
                        : "Qualquer"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={
                etapa === 1 ? onVoltar : () => setEtapa((prev) => (prev - 1) as 1 | 2 | 3)
              }
              className="text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
            >
              {etapa === 1 ? "Cancelar" : "← Voltar"}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Etapa {etapa} de 3</span>
              {etapa < 3 ? (
                <button
                  onClick={avancar}
                  className="text-sm px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  onClick={salvar}
                  className="text-sm px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all"
                >
                  ✓ Criar Solicitação
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
