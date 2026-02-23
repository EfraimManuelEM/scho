"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface Candidato {
  id: string;
  nome: string;
  bi: string;
  genero: string;
  email: string;
  senha: string;
  telefone: string;
  nascimento: string;
  nomePai: string;
  nomeMae: string;
  turno: string;
  endereco: string;
  mediaFinal: string;
  cursoId: string;
  cursoNome?: string; // opcional se você incluir join com curso
}

export default function ListaCandidato() {
  const [candidato, setCandidato] = useState<Candidato[]>([]);
  const [pesquisa, setPesquisa] = useState<Candidato[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);

  const itensPorPagina = 10;
  const paginasVisiveis = 5;

  useEffect(() => {
    fetchCandidato();
  }, []);

  const fetchCandidato = async () => {
    try {
      const response = await axios.get("http://localhost:3333/candidato");
      setCandidato(response.data);
      setPesquisa(response.data);
    } catch (error) {
      console.error("Erro ao buscar candidato.", error);
    }
  };

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
  const exportPDF = (tipo: "todos" | "pagina" | "individual", candidatoSelecionado?: Candidato) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
  
    let dados: Candidato[] = [];
  
    if (tipo === "todos") dados = pesquisa;
    else if (tipo === "pagina") dados = candidatosPagina;
    else if (tipo === "individual" && candidatoSelecionado) dados = [candidatoSelecionado];
  
    if (dados.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }
  
// Definir colunas
const colunas = [
  { header: "#", dataKey: "index" },
  { header: "Nome", dataKey: "nome" },
  { header: "E-mail", dataKey: "email" },
  { header: "BI", dataKey: "bi" },
  { header: "Telefone", dataKey: "telefone" },
  { header: "Gênero", dataKey: "genero" },
  { header: "Nascimento", dataKey: "nascimento" },
  { header: "Curso", dataKey: "cursoNome" },
  { header: "Turno", dataKey: "turno" },
  { header: "Endereço", dataKey: "endereco" },
  { header: "Média Final", dataKey: "mediaFinal" },
];

// Preparar linhas
const linhas = dados.map((u, i) => ({
  index: i + 1,
  nome: u.nome ?? "",
  email: u.email ?? "",
  bi: u.bi ?? "",
  telefone: u.telefone ?? "",
  genero: u.genero ?? "",
  nascimento: new Date(u.nascimento).toLocaleDateString("pt-BR"),
  cursoNome: u.cursoNome ?? "",
  turno: u.turno ?? "",
  endereco: u.endereco ?? "",
  mediaFinal: u.mediaFinal ?? "",
}));

// --- TÍTULO ---
doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(25, 25, 25);
doc.text("RELATÓRIO DE CANDIDATOS", doc.internal.pageSize.getWidth() / 2, 40, {
  align: "center",
});

// Linha decorativa elegante
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
    fontSize: 10,
  },

  bodyStyles: {
    fontSize: 9,
    textColor: 50,
    valign: "middle",
  },

  alternateRowStyles: {
    fillColor: [245, 247, 250],
  },

  columnStyles: {
    index: { cellWidth: 30, halign: "center" },
    nome: { cellWidth: 80, halign: "center" },
    email: { cellWidth: 80, halign: "center" },
    bi: { cellWidth: 80, halign: "center" },
    telefone: { cellWidth: 80, halign: "center" },
    genero: { cellWidth: 60, halign: "center" },
    nascimento: { cellWidth: 80, halign: "center" },
    cursoNome: { cellWidth: 80, halign: "center" },
    turno: { cellWidth: 70, halign: "center" },
    endereco: { cellWidth: 70, halign: "center" },
    mediaFinal: { cellWidth: 70, halign: "center", fontStyle: "bold" },
  },

  styles: {
    cellPadding: 7,
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
    doc.save(`candidatos_${tipo}.pdf`);
  };

  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto max-h-[100vh] transition-all duration-300">
        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Candidaturas Feitas</h1>
            <p className="text-gray-500 text-sm mt-1">
              Lista detalhada dos candidatos que submeteram suas inscrições.
            </p>
          </div> 

          {/* Pesquisa */}
           <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Pesquisar candidato..."
            className="mt-4 sm:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full sm:w-64"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              const filtrados = candidato.filter(
                (cand) =>
                  cand.nome.toLowerCase().includes(query) ||
                  cand.bi.toLowerCase().includes(query)
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
          Total de candidatos:{" "}
          <span className="font-semibold text-gray-900">{pesquisa.length}</span>
        </p>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0">
              <tr>
                {[
                  "#",
                  "Nome",
                  "Nº Bilhete",
                  "Gênero",
                  "E-mail",
                  "Telefone",
                  "Curso",
                  "Endereço",
                  "Média Final",
                  "Ações",
                ].map((head) => (
                  <th key={head} className="px-4 py-3 text-left whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidatosPagina.length > 0 ? (
                candidatosPagina.map((cand, i) => (
                  <tr
                    key={cand.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{inicio + i + 1}</td>
                    <td className="px-4 py-3 font-medium">{cand.nome}</td>
                    <td className="px-4 py-3">{cand.bi}</td>
                    <td className="px-4 py-3">{cand.genero}</td>
                    <td className="px-4 py-3">{cand.email}</td>
                    <td className="px-4 py-3">{cand.telefone}</td>
                    <td className="px-4 py-3">{cand.cursoNome || cand.cursoId}</td>
                    <td className="px-4 py-3">{cand.endereco}</td>
                    <td className="px-4 py-3">{cand.mediaFinal}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setCandidatoSelecionado(cand)}
                        className="px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500">
                    Nenhum candidato encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual((prev) => prev - 1)}
            className={`p-2 rounded-md border transition cursor-pointer ${
              paginaAtual === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {paginas[0] > 1 && (
            <>
              <button
                onClick={() => setPaginaAtual(1)}
                className="px-3 py-1 border rounded-md cursor-pointer bg-white hover:bg-gray-100"
              >
                1
              </button>
              <span className="px-2">...</span>
            </>
          )}

          {paginas.map((num) => (
            <button
              key={num}
              onClick={() => setPaginaAtual(num)}
              className={`px-3 py-1 border rounded-md transition cursor-pointer ${
                paginaAtual === num
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          {paginas[paginas.length - 1] < totalPaginas && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => setPaginaAtual(totalPaginas)}
                className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 cursor-pointer"
              >
                {totalPaginas}
              </button>
            </>
          )}

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((prev) => prev + 1)}
            className={`p-2 rounded-md border transition cursor-pointer ${
              paginaAtual === totalPaginas
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Modal */}
        {candidatoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[90%] sm:w-[600px] p-6 relative">
              <button
                onClick={() => setCandidatoSelecionado(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl cursor-pointer"
              >
                ×
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Detalhes do Candidato</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <Info label="Nome" valor={candidatoSelecionado.nome} />
                <Info label="Nº Bilhete" valor={candidatoSelecionado.bi} />
                <Info label="Gênero" valor={candidatoSelecionado.genero} />
                <Info label="E-mail" valor={candidatoSelecionado.email} />
                <Info label="Telefone" valor={candidatoSelecionado.telefone} />
                <Info label="Data de Nascimento" valor={candidatoSelecionado.nascimento} />
                <Info label="Nome do Pai" valor={candidatoSelecionado.nomePai} />
                <Info label="Nome da Mãe" valor={candidatoSelecionado.nomeMae} />
                <Info label="Curso" valor={candidatoSelecionado.cursoNome || candidatoSelecionado.cursoId} />
                <Info label="Turno" valor={candidatoSelecionado.turno} />
                <Info label="Endereço" valor={candidatoSelecionado.endereco} />
                <Info label="Média Final" valor={candidatoSelecionado.mediaFinal} />
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setCandidatoSelecionado(null)}
                  className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Info({ label, valor }: { label: string; valor?: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium">{valor || "—"}</p>
    </div>
  );
}
