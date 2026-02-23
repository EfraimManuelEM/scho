"use client";

import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Pencil,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Curso {
  id: number;
  nome: string
  codigo: string
  duracao: string
  departamento: string
  descricao: string
  ativo: boolean
  image: File | null
  createdAt: string
}

export default function ListCurso() {
  const [curso, setCurso] = useState<Curso[]>([]);
  const [pesquisa, setPesquisa] = useState<Curso[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectCurso, setSelectCurso] = useState<Curso | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const itensPorPagina = 10;
  const paginasVisiveis = 5;

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchCurso();
  }, []);

  const fetchCurso = async () => {
    try {
      const response = await axios.get("http://localhost:3333/curso");
      setCurso(response.data);
      setPesquisa(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar cursos");
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

  /* ================= PAGINAÇÃO ================= */
  const totalPaginas = Math.ceil(pesquisa.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const cursosPagina = pesquisa.slice(inicio, fim);

  const gerarPaginas = () => {
    let paginas: number[] = [];
    if (totalPaginas <= paginasVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
      return paginas;
    }

    const meio = Math.floor(paginasVisiveis / 2);
    let inicioPaginas = Math.max(1, paginaAtual - meio);
    let fimPaginas = Math.min(totalPaginas, paginaAtual + meio);

    if (inicioPaginas === 1) fimPaginas = paginasVisiveis;
    if (fimPaginas === totalPaginas)
      inicioPaginas = totalPaginas - paginasVisiveis + 1;

    for (let i = inicioPaginas; i <= fimPaginas; i++) paginas.push(i);
    return paginas;
  };

  const paginas = gerarPaginas();

  /* ================= EDITAR ================= */
  const handleEditar = (curso: Curso) => {
    setSelectCurso({ ...curso });
    setIsModalOpen(true);
  };

  const handleUpdateCurso = async () => {
    if (!selectCurso) return;

    try {
      await axios.patch(
        `http://localhost:3333/curso/${selectCurso.id}`,
        {
          nome: selectCurso.nome,
          codigo: selectCurso.codigo,
          duracao: selectCurso.duracao,
          departamento: selectCurso.departamento,
        }
      );

      setCurso(prev =>
        prev.map(c => (c.id === selectCurso.id ? selectCurso : c))
      );
      setPesquisa(prev =>
        prev.map(c => (c.id === selectCurso.id ? selectCurso : c))
      );

      toast.success("Curso atualizado com sucesso!");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error("Erro ao atualizar curso");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (cursoItem: Curso) => {
    const confirmacao = confirm(
      `Tem certeza que deseja excluir o curso "${cursoItem.nome}"?`
    );
    if (!confirmacao) return;

    try {
      await axios.delete(`http://localhost:3333/curso/${cursoItem.id}`);

      setCurso(prev => prev.filter(c => c.id !== cursoItem.id));
      setPesquisa(prev => prev.filter(c => c.id !== cursoItem.id));

      toast.success("Curso excluído com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir curso");
    }
  };

    // Exportar PDF melhorado
  const exportPDF = (tipo: "todos" | "pagina" | "individual", cursoSelecionado?: Curso) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
  
    let dados: Curso[] = [];
  
    if (tipo === "todos") dados = pesquisa;
    else if (tipo === "pagina") dados = cursosPagina;
    else if (tipo === "individual" && cursoSelecionado) dados = [cursoSelecionado];
  
    if (dados.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }
  
// Definir colunas
const colunas = [
  { header: "#", dataKey: "index" },
  { header: "Nome do Curso", dataKey: "nome" },
  { header: "Código", dataKey: "codigo" },
  { header: "Duração", dataKey: "duracao" },
  { header: "Departamento", dataKey: "departamento" },
  { header: "Descrição", dataKey: "descricao" },
  { header: "Data de Criação", dataKey: "createdAt" },
];

// Preparar linhas
const linhas = dados.map((u, i) => ({
  index: i + 1,
  nome: u.nome ?? "",
  codigo: u.codigo ?? "",
  duracao: u.duracao ?? "",
  departamento: u.departamento ?? "",
  descricao: u.descricao ?? "",
  createdAt: new Date(u.createdAt).toLocaleDateString("pt-BR"),
}));

// --- TÍTULO ---
doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(30, 30, 30);
doc.text("RELATÓRIO DE CURSOS", doc.internal.pageSize.getWidth() / 2, 40, {
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
    nome: { cellWidth: 140 },
    codigo: { cellWidth: 90, halign: "center" },
    duracao: { cellWidth: 80, halign: "center" },
    departamento: { cellWidth: 120 },
    descricao: { cellWidth: 200 }, // maior espaço
    createdAt: { cellWidth: 90, halign: "center" },
  },

  styles: {
    cellPadding: 8,
    overflow: "linebreak", // quebra texto automaticamente
  },

  margin: { left: 40, right: 40 },

  didDrawPage: (data) => {

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      `Página ${data.pageNumber}`,
      doc.internal.pageSize.getWidth() - 120,
      doc.internal.pageSize.getHeight() - 15
    );
  },
});
  
    doc.save(`cursos_${tipo}.pdf`);
  };
  

  /* ================= RENDER ================= */
  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Lista de Cursos</h1>
       

        {/* Pesquisa */}
        <div className="relative w-80">
          <div className="flex flex-col sm:flex-row gap-2">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar curso..."
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                setPesquisa(
                  curso.filter(
                    (c) =>
                      c.nome.toLowerCase().includes(query) ||
                      c.codigo.toLowerCase().includes(query)
                  )
                );
                setPaginaAtual(1);
              }}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <Button 
              onClick={() => exportPDF("todos")}
              className="bg-green-600 hover:bg-green-700 text-white transition cursor-pointer"
            >
              Exportar
            </Button>

          </div>
          </div>
         </header>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Duração</th>
                <th className="px-4 py-3 text-left">Departamento</th>
                <th className="px-4 py-3 text-left">Descrição</th>
                <th className="px-4 py-3 text-left">Data de Criação</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cursosPagina.map((c, i) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{inicio + i + 1}</td>
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3">{c.codigo}</td>
                  <td className="px-4 py-3">{c.duracao} Ano</td>
                  <td className="px-4 py-3">{c.departamento}</td>
                  <td className="px-4 py-3">{c.descricao}</td>
                  <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      {/*<button
                        onClick={() => handleEditar(c)}
                        className="text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>*/}
                      <button
                        onClick={() => handleDelete(c)}
                        className="text-red-600 cursor-pointer hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {cursosPagina.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    Nenhum curso encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {paginas.map((p) => (
            <button
              key={p}
              onClick={() => setPaginaAtual(p)}
              className={`px-3 py-1 rounded border ${
                paginaAtual === p
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Modal Edição */}
        {isModalOpen && selectCurso && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay transparente */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <div className="relative bg-white p-6 rounded-xl w-96 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Editar Curso</h2>

              <input
                value={selectCurso.nome}
                onChange={(e) =>
                  setSelectCurso({ ...selectCurso, nome: e.target.value })
                }
                className="w-full border p-2 rounded mb-2"
                placeholder="Nome"
              />

              <input
                value={selectCurso.codigo}
                onChange={(e) =>
                  setSelectCurso({ ...selectCurso, codigo: e.target.value })
                }
                className="w-full border p-2 rounded mb-2"
                placeholder="Código"
              />

              <input
                value={selectCurso.duracao}
                onChange={(e) =>
                  setSelectCurso({ ...selectCurso, duracao: e.target.value })
                }
                className="w-full border p-2 rounded mb-2"
                placeholder="Duração"
              />

              <input
                value={selectCurso.departamento}
                onChange={(e) =>
                  setSelectCurso({
                    ...selectCurso,
                    departamento: e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-4"
                placeholder="Departamento"
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateCurso}>Salvar</Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
