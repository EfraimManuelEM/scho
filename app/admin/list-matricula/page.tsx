"use client";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { ChevronLeft, ChevronRight, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import correto do autotable
import { Button } from "@/components/ui/button";

interface Matricula {
  id: number;
  telefone: string; 
  candidatoId: string; 
  cursoId: string; 
  cursoNome: string; 
  candidatoNome: string; 
  candidatoBi: string; 
  candidatoEmail: string; 
  candidatoNascimento: string;
  candidatoTurno: string;
  classeId: string;
  classeNome: string;
  classeValor: string;
  turmaNome: string; 
  turmaAno: string;
  turmaTurno: string;
  turmaSala: string;
  turmaId: string;
  createdAt: string;
}

export default function ListMatricula() {
  const [matricula, setMatricula] = useState<Matricula[]>([]);
  const [pesquisa, setPesquisa] = useState<Matricula[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);
  
    const itensPorPagina = 10;
    const paginasVisiveis = 5;

    useEffect(() => {
      fetchMatricula();
    }, []);

    const fetchMatricula = async () => {
      try {
      const response = await axios.get("http://localhost:3333/matricula");
      setMatricula(response.data);
      setPesquisa(response.data)
      } catch (error) {
        toast.error("Erro ao buscar matriculas");
      } finally {
        setLoading(false);
      }
    }

     if (loading) {
         return (
           <div className="flex items-center text-balck justify-center h-screen bg-black/20">
             <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
           </div>
         );
       }

    const handleDelete = async (mat: Matricula) => {
      const confiirmacao = confirm(
        `Tem certeza que deseja excluir a matrícula de ${mat.candidatoNome}?`
      );
      if (!confiirmacao) return;

      try {
        await axios.delete(`http://localhost:3333/matricula/${mat.id}`)

        setMatricula(prev => prev.filter(m => m.id !== mat.id));
        setPesquisa(prev => prev.filter(m => m.id !== mat.id));

        toast.success("Matrícula excluída com sucesso");
      } catch {
        toast.error("Erro ao excluir matrícula");
      }
    }

  // Paginação
  const totalPaginas = Math.ceil(pesquisa.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const MatriculaPagina = pesquisa.slice(inicio, fim);

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
  const exportPDF = (tipo: "todos" | "pagina" | "individual", matriculaSelecionada?: Matricula) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
  
    let dados: Matricula[] = [];
  
    if (tipo === "todos") dados = pesquisa;
    else if (tipo === "pagina") dados = MatriculaPagina;
    else if (tipo === "individual" && matriculaSelecionada) dados = [matriculaSelecionada];
  
    if (dados.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }
  
    // Definir colunas
    const colunas = [
      { header: "#", dataKey: "index" },
      { header: "Nome", dataKey: "candidatoNome" },
      { header: "BI", dataKey: "bi" },
      { header: "Curso", dataKey: "curso" },
      { header: "Turma", dataKey: "turmaNome" },
      { header: "Turno", dataKey: "candidatoTurno" },
      { header: "Telefone", dataKey: "telefone" },
      { header: "Classe", dataKey: "classeNome" },
      { header: "Valor", dataKey: "classeValor" },
      { header: "Data de Matrícula", dataKey: "createdAt" },
    ];
  
    // Preparar linhas
    const linhas = dados.map((u, i) => ({
      index: i + 1,
      nome: u.candidatoNome,
      bi: u.candidatoBi,
      curso: u.cursoNome,
      turma: u.turmaNome,
      turno: u.candidatoTurno,
      telefone: u.telefone,
      classe: u.classeNome,
      valor: u.classeValor,
      createdAt: new Date(u.createdAt).toLocaleDateString("pt-BR"),
    }));
  
    // --- TÍTULO ---
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Matrículas", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
  
    // --- LINHA SEPARADORA ---
    doc.setLineWidth(1);
    doc.setDrawColor(41, 120, 185);
    doc.line(20, 45, doc.internal.pageSize.getWidth() - 20, 45);
  
    // --- TABELA ---
    autoTable(doc, {
      startY: 60,
      head: [colunas.map(c => c.header)],
      body: linhas.map(l => Object.values(l)),
      theme: "striped", // zebra
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: 50,
        fontSize: 10,
        halign: "left",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },  // "#"
        1: { cellWidth: 90, halign: "center" },                    // Nome
        2: { cellWidth: 90, halign: "center" },                    // E-mail
        3: { cellWidth: 90, halign: "center" },                     // BI
        4: { cellWidth: 90, halign: "center" },                     // Cargo
        5: { cellWidth: 70, halign: "center" },                    // Telefone
        6: { cellWidth: 120, halign: "center" },                    // Departamento
        7: { cellWidth: 90, halign: "center" },                     // Data de Entrada
        8: { cellWidth: 60, halign: "center" },                     // Gênero
        9: { cellWidth: 90, halign: "center" },                     // Nascimento
      },
      styles: { cellPadding: 6, fontSize: 10 },
      margin: { left: 25, right: 25, top: 20 }, // margens mais equilibradas
      tableWidth: doc.internal.pageSize.getWidth() - 50, // ocupa toda largura exceto margens
      didDrawPage: (data) => {
        // --- RODAPÉ ---
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
      },
    });
  
    doc.save(`matriculas_${tipo}.pdf`);
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
              Matrículas Feitas
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Lista completa das matrículas já registradas no sistema.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Pesquisar matrícula..."
            className="mt-4 sm:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full sm:w-64"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              const filtrados = matricula.filter((m) =>
                m.candidatoBi.toLowerCase().includes(query) ||
                m.candidatoNome.toLowerCase().includes(query)
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
          Total de matrículas:{" "}
          <span className="font-semibold text-gray-900">
            {matricula.length}
          </span>
        </p>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0">
              <tr>
                {[
                  "#",
                  "Nome",
                  "Nº BI",
                  "Curso",
                  "Turma",
                  "Turno",
                  "Telefone",
                  "Classe",
                  "Valor",
                  "Data da Matrícula",
                  "Ações",
                ].map((head) => (
                  <th key={head} className="px-4 py-3 text-left whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {MatriculaPagina.map((mat, i) => (
                <tr 
                  key={mat.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{mat.candidatoNome || mat.candidatoId}</td>
                  <td className="px-4 py-3">{mat.candidatoBi || mat.candidatoId}</td>
                  <td className="px-4 py-3">{mat.cursoNome || mat.cursoId}</td>
                  <td className="px-4 py-3">{mat.turmaNome || mat.turmaId}</td>
                  <td className="px-4 py-3">{mat.candidatoTurno || mat.candidatoId}</td>
                  <td className="px-4 py-3">{mat.telefone}</td>
                  <td className="px-4 py-3">{mat.classeNome || mat.classeId} Classe</td>
                  <td className="px-4 py-3">{mat.classeValor || mat.classeId} KZ</td>
                  <td className="px-4 py-3">{new Date(mat.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                     <button
                     onClick={() => handleDelete(mat)}
                        className="text-red-600 cursor-pointer hover:text-red-700 transition"
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
