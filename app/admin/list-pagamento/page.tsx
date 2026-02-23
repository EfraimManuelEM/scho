"use client";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { ChevronLeft, ChevronRight, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import correto do autotable
import { Button } from "@/components/ui/button";

interface Pagamento {
  id: number,
  tipo: string;
  metodo: string;
  valor: string;
  candidatoId: string;
  candidatoNome: string;
  matriculaId: string;
  matriculaNome: string;
  createdAt: string;
  referencia: string;
  classeId: string;
  classeNome: string;
}

export default function ListaPagamento() {
  const [pagamento, setPagamento] = useState<Pagamento[]>([]);
  const [pesquisa, setPesquisa] = useState<Pagamento[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);

  const itensPorPagina = 10;
  const paginasVisiveis = 5;

  useEffect(() => {
    fetchPagamento();
  }, []);

  const fetchPagamento = async () => {
    try {
      const response = await axios.get("http://localhost:3333/pagamento");
      setPagamento(response.data);
      setPesquisa(response.data);
    } catch (error) {
      toast.error("Erro ao buscar pagamentos")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
     return (
       <div className="flex items-center text-black justify-center h-screen bg-black/20">
         <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
       </div>
     );
   }


   const handleDelete = async (pag: Pagamento) => {
    const confirmacao = confirm(
      `Tem certeza que deseja excluir o pagamento de ${pag.candidatoNome}?`
    )
    if (!confirmacao)return;

    try {
      await axios.delete(`http://localhost:3333/pagamento/${pag.id}`);
      setPagamento(prev => prev.filter (pag => pag.id !== pag.id));
      setPesquisa(prev => prev.filter (pag => pag.id !== pag.id));
      toast.success("Pagamento excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir pagamento")
    }
   }


  // Paginação
  const totalPaginas = Math.ceil(pesquisa.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const PagamentoPagina = pesquisa.slice(inicio, fim);

  const gerarPaginas = () => {
    let paginas = [];
    if (totalPaginas <= paginasVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
      return paginas;
    }

    const meio = Math.floor(paginasVisiveis / 2);
    let inicioPaginas = Math.max(1, paginaAtual - meio);
    let fimPaginas = Math.min(totalPaginas, paginaAtual + meio);

    if (inicioPaginas === 1) fimPaginas = paginasVisiveis;
    else if (fimPaginas === totalPaginas) inicioPaginas = totalPaginas - paginasVisiveis + 1;

    for (let i = inicioPaginas; i <= fimPaginas; i++) paginas.push(i);
    return paginas;
  };

  const paginas = gerarPaginas();

   // Exportar PDF melhorado
  const exportPDF = (tipo: "todos" | "pagina" | "individual", pagamentoSelecionado?: Pagamento) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
  
    let dados: Pagamento[] = [];
  
    if (tipo === "todos") dados = pesquisa;
    else if (tipo === "pagina") dados = PagamentoPagina;
    else if (tipo === "individual" && pagamentoSelecionado) dados = [pagamentoSelecionado];
  
    if (dados.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }
  
   // Definir colunas
const colunas = [
  { header: "#", dataKey: "index" },
  { header: "Nome", dataKey: "nome" },
  { header: "Referência", dataKey: "referencia" },
  { header: "Classe", dataKey: "classeNome" },
  { header: "Tipo", dataKey: "tipo" },
  { header: "Método", dataKey: "metodo" },
  { header: "Valor (Kz)", dataKey: "valor" },
  { header: "Data da Transação", dataKey: "createdAt" },
];

// Preparar linhas
const linhas = dados.map((u, i) => ({
  index: i + 1,
  nome: u.candidatoNome ?? u.matriculaNome ?? "",
  referencia: u.referencia ?? "",
  classeNome: u.classeNome ?? "",
  tipo: u.tipo ?? "",
  metodo: u.metodo ?? "",
  valor: Number(u.valor).toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
  }),
  createdAt: new Date(u.createdAt).toLocaleDateString("pt-BR"),
}));

// --- TÍTULO ---
doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(25, 25, 25);
doc.text("RELATÓRIO DE PAGAMENTOS", doc.internal.pageSize.getWidth() / 2, 40, {
  align: "center",
});

// Linha decorativa moderna
doc.setDrawColor(41, 128, 185);
doc.setLineWidth(2);
doc.line(60, 50, doc.internal.pageSize.getWidth() - 60, 50);

// --- TABELA ---
autoTable(doc, {
  startY: 70,
  columns: colunas,
  body: linhas,
  theme: "striped",

  headStyles: {
    fillColor: [41, 128, 185],
    textColor: 255,
    fontStyle: "bold",
    halign: "center",
    fontSize: 11,
  },

  bodyStyles: {
    fontSize: 10,
    textColor: 50,
    valign: "middle",
  },

  alternateRowStyles: {
    fillColor: [245, 247, 250], // zebra suave
  },

  columnStyles: {
    index: { cellWidth: 30, halign: "center" },
    nome: { cellWidth: 130 },
    referencia: { cellWidth: 110, halign: "center" },
    classeNome: { cellWidth: 110 },
    tipo: { cellWidth: 90, halign: "center" },
    metodo: { cellWidth: 100, halign: "center" },
    valor: { cellWidth: 100, halign: "right", fontStyle: "bold" }, // destaque financeiro
    createdAt: { cellWidth: 110, halign: "center" },
  },

  styles: {
    cellPadding: 8,
    overflow: "linebreak",
  },

  margin: { left: 40, right: 40 },

  didDrawPage: (data) => {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      `Página ${data.pageNumber}`,
      doc.internal.pageSize.getWidth() - 130,
      doc.internal.pageSize.getHeight() - 15
    );
  },
});
  
    doc.save(`pagamentos_${tipo}.pdf`);
  };
  


  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo principal */}
      <section className="flex-1 p-8 overflow-y-auto max-h-[100vh] transition-all duration-300">
        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pagamentos Realizados
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Histórico de todos os pagamentos efetuados pelos estudantes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Pesquisar pagamento..."
            className="mt-4 sm:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full sm:w-64"
             onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const filtrados = pagamento.filter((p) =>
                  p.id.toString().includes(query) || 
                  (p.candidatoNome?.toLowerCase().includes(query.toLowerCase()) ||
                  p.matriculaNome?.toLowerCase().includes(query.toLowerCase()))
                );
                setPesquisa(filtrados);
                setPaginaAtual(1);
              }}
          />
           <Button 
            onClick={() => exportPDF("todos")}
            className="bg-green-600 hover:bg-green-700 text-white transition cursor-pointer"
          >
            Exportar
          </Button>
           </div>
        </header>

        {/* Contador */}
        <p className="text-sm text-gray-600 mb-4">
          Total de pagamentos:{" "}
          <span className="font-semibold text-gray-900">
            {pagamento.length}
          </span>
        </p>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0">
              <tr>
                {[
                  "#",
                  "Nome do Aluno",
                  "Referencia",
                  "Classe",
                  "Tipo",
                  "Método",
                  "Valor",
                  "Data da Transação",
                  "Ações",
                ].map((head) => (
                  <th key={head} className="px-4 py-3 text-left whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {PagamentoPagina.map((pag, i) => (
                <tr
                  key={pag.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{pag.candidatoNome || pag.candidatoId || pag.matriculaId || pag.matriculaNome}</td>
                  <td className="px-4 py-3">{pag.referencia}</td>
                  <td className="px-4 py-3">{pag.classeNome}</td>
                  <td className="px-4 py-3">{pag.tipo}</td>
                  <td className="px-4 py-3">{pag.metodo}</td>
                  <td className="px-4 py-3">{pag.valor} KZ</td>
                  <td className="px-4 py-3">{new Date(pag.createdAt).toLocaleDateString("pt-BR")}</td>


                  {/* Botões de ação */}
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(pag)}
                      className="text-red-600 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* PAGINAÇÃO */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    disabled={paginaAtual === 1}
                    onClick={() => setPaginaAtual((prev) => prev - 1)}
                    className={`p-2 rounded-md border ${
                      paginaAtual === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
        
                  {paginas.map((num) => (
                    <button
                      key={num}
                      onClick={() => setPaginaAtual(num)}
                      className={`px-3 py-1 border rounded-md ${
                        paginaAtual === num ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
        
                  <button
                    disabled={paginaAtual === totalPaginas}
                    onClick={() => setPaginaAtual((prev) => prev + 1)}
                    className={`p-2 rounded-md border ${
                      paginaAtual === totalPaginas
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
      </section>
    </main>
  );
}
