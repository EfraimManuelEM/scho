"use client";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { ChevronLeft, ChevronRight, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import correto do autotable
import { Button } from "@/components/ui/button";


interface Turma {
  id: number;
  nome: string;
  cursoId: string;
  cursoNome?: string;
  ano: string;
  turno: string;
  sala: string;
  totalAlunos: number;
  createdAt: string;
}

export default function ListaTurma() {
  const [turma, setTurma] = useState<Turma[]>([]);
  const [pesquisa, setPesquisa] = useState<Turma[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);

  const itensPorPagina = 10;
  const paginasVisiveis = 5;

  useEffect(() => {
    fetchTurma();
  }, []);

  const fetchTurma = async () => {
    try {
      const response = await axios.get("http://localhost:3333/turma");
      setTurma(response.data);
      setPesquisa(response.data);
    } catch (error) {
      toast.error("Erro ao buscar turmas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
       <div className="flex items-center text-black justify-center h-screen bg-black/20">
         <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
       </div>
     );
   }

   const handleDelete = async (t: Turma) => {
    const confirmacao =confirm(
      `Tem certeza que deseja excluir a turma "${t.nome}"? Esta ação não pode ser desfeita.`
    )
    if(!confirmacao)return;

    try {
      await axios.delete(`http://localhost:3333/turma/${t.id}`)
      setTurma(prev => prev.filter(t => t.id !== t.id));
      setPesquisa(prev => prev.filter(t => t.id !== t.id));
      toast.success("Turma excluída com sucesso");
    } catch {
      toast.error("Erro ao excluir turma");
    }
   }

  // Paginação
  const totalPaginas = Math.ceil(pesquisa.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const candidatosPagina = pesquisa.slice(inicio, fim);

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
    const exportPDF = (tipo: "todos" | "pagina" | "individual", turmaSelecionada?: Turma) => {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
    
      let dados: Turma[] = [];
    
      if (tipo === "todos") dados = pesquisa;
      else if (tipo === "pagina") dados = candidatosPagina;
      else if (tipo === "individual" && turmaSelecionada) dados = [turmaSelecionada];
    
      if (dados.length === 0) {
        toast.error("Nenhum dado para exportar");
        return;
      }
    
// =============================
// CONFIGURAÇÃO DAS COLUNAS
// =============================
const colunas = [
  { header: "#", dataKey: "index" },
  { header: "Turma", dataKey: "nome" },
  { header: "Curso", dataKey: "cursoNome" },
  { header: "Ano Letivo", dataKey: "ano" },
  { header: "Turno", dataKey: "turno" },
  { header: "Total Alunos", dataKey: "totalAlunos" },
  { header: "Sala", dataKey: "sala" },
  { header: "Criado em", dataKey: "createdAt" },
];

// =============================
// PREPARAÇÃO DOS DADOS
// =============================
const linhas = dados.map((u, i) => ({
  index: i + 1,
  nome: u.nome ?? "-",
  cursoNome: u.cursoNome ?? "-",
  ano: u.ano ?? "-",
  turno: u.turno ?? "-",
  totalAlunos: u.totalAlunos ?? 0,
  sala: u.sala ?? "-",
  createdAt: new Date(u.createdAt).toLocaleDateString("pt-BR"),
}));

// =============================
// TÍTULO PRINCIPAL
// =============================
doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(30, 30, 30);
doc.text(
  "RELATÓRIO DE TURMAS",
  doc.internal.pageSize.getWidth() / 2,
  40,
  { align: "center" }
);

// Linha decorativa moderna
doc.setDrawColor(41, 128, 185);
doc.setLineWidth(2);
doc.line(60, 50, doc.internal.pageSize.getWidth() - 60, 50);

// Data de geração
doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.setTextColor(120);
doc.text(
  `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
  doc.internal.pageSize.getWidth() - 40,
  60,
  { align: "right" }
);

// =============================
// TABELA
// =============================
autoTable(doc, {
  startY: 75,
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
    fillColor: [245, 247, 250], // zebra elegante
  },

  columnStyles: {
    index: { cellWidth: 100, halign: "center" },
    nome: { cellWidth: 100, halign: "center"  },
    cursoNome: { cellWidth: 100 },
    ano: { cellWidth: 90, halign: "center" },
    turno: { cellWidth: 100, halign: "center" },
    totalAlunos: { 
      cellWidth: 100, 
      halign: "center",
      fontStyle: "bold" // destaque importante
    },
    sala: { cellWidth: 100, halign: "center" },
    createdAt: { cellWidth: 100, halign: "center" },
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
    
      doc.save(`turmas_${tipo}.pdf`);
    };
    

  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto max-h-[100vh] transition-all duration-300">
        
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lista de Turmas</h1>
            <p className="text-gray-500 text-sm mt-1">
              Veja todas as turmas cadastradas e suas informações principais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Pesquisar turma..."
            className="mt-4 sm:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full sm:w-64"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              const filtrados = turma.filter((t) =>
                t.nome.toLowerCase().includes(query) ||
                t.sala.toLowerCase().includes(query) ||
                t.turno.toLowerCase().includes(query) 
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

        <p className="text-sm text-gray-600 mb-4">
          Total de turmas: <span className="font-semibold text-gray-900">{turma.length}</span>
        </p>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0">
              <tr>
                {[
                  "#",
                  "Nome da Turma",
                  "Curso",
                  "Ano",
                  "Turno",
                  "Total de Alunos",
                  "Sala",
                  "Data de Criação",
                  "Ações",
                ].map((head) => (
                  <th key={head} className="px-4 py-3 text-left whitespace-nowrap">{head}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {candidatosPagina.map((t, i) => (
                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{inicio + i + 1}</td>
                  <td className="px-4 py-3 font-medium">{t.nome}</td>
                  <td className="px-4 py-3">{t.cursoNome || t.cursoId}</td>
                  <td className="px-4 py-3">{t.ano}</td>
                  <td className="px-4 py-3">{t.turno}</td>
                  <td className="px-4 py-3">{t.totalAlunos}</td>
                  <td className="px-4 py-3">{t.sala}</td>

                  {/* DATA FORMATADA */}
                  <td className="px-4 py-3">
                    {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(t)}
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
