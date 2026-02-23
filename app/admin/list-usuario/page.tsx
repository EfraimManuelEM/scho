"use client";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronLeft, ChevronRight, FileText, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import correto do autotable

interface Usuario {
  id: string;
  nome: string;
  email: string;
  bi: string;
  telefone: string;
  genero: string;
  departamento: string;
  createdAt: string;
  nascimento: string;
  role: string;
}

export default function ListaUsuario() {
  const [usuario, setUsuario] = useState<Usuario[]>([]);
  const [pesquisa, setPesquisa] = useState<Usuario[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectCurso, setSelectCurso] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itensPorPagina = 10;
  const paginasVisiveis = 5;

  const departamentos = [
    "Engenharia",
    "Recursos Humanos",
    "Marketing",
    "Vendas",
    "TI",
    "Financeiro",
    "Atendimento ao Cliente",
    "Pesquisa e Desenvolvimento",
    "Produção",
    "Logística",
  ];

  useEffect(() => {
    fecthUusario();
  }, []);

  const fecthUusario = async () => {
    try {
      const response = await axios.get("http://localhost:3333/user");
      setUsuario(response.data);
      setPesquisa(response.data);
    } catch (error) {
      toast.error("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (func: Usuario) => {
    const confirmacao = confirm(`Tem certeza que deseja excluir o funcionário ${func.nome}?`);
    if (!confirmacao) return;

    try {
      await axios.delete(`http://localhost:3333/user/${func.id}`);
      setUsuario(prev => prev.filter(u => u.id !== func.id));
      setPesquisa(prev => prev.filter(u => u.id !== func.id));
      toast.success("Funcionário excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir funcionário");
    }
  };

  const handleEditar = (func: Usuario) => {
    setSelectCurso({ ...func });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectCurso) return;

    try {
      await axios.put(`http://localhost:3333/user/${selectCurso.id}`, {
        nome: selectCurso.nome,
        email: selectCurso.email,
        role: selectCurso.role,
        telefone: selectCurso.telefone,
        departamento: selectCurso.departamento,
      });

      setUsuario(prev => prev.map(u => u.id === selectCurso.id ? selectCurso : u));
      setPesquisa(prev => prev.map(u => u.id === selectCurso.id ? selectCurso : u));
      toast.success("Funcionário atualizado com sucesso");
      setIsModalOpen(false);
    } catch {
      toast.error("Erro ao atualizar funcionário");
    }
  };

  // Paginação
  const totalPaginas = Math.ceil(pesquisa.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const UsuarioPagina = pesquisa.slice(inicio, fim);

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
const exportPDF = (tipo: "todos" | "pagina" | "individual", usuarioSelecionado?: Usuario) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  let dados: Usuario[] = [];

  if (tipo === "todos") dados = pesquisa;
  else if (tipo === "pagina") dados = UsuarioPagina;
  else if (tipo === "individual" && usuarioSelecionado) dados = [usuarioSelecionado];

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
    { header: "Cargo", dataKey: "role" },
    { header: "Telefone", dataKey: "telefone" },
    { header: "Departamento", dataKey: "departamento" },
    { header: "Data de Entrada", dataKey: "createdAt" },
    { header: "Gênero", dataKey: "genero" },
    { header: "Nascimento", dataKey: "nascimento" },
  ];

  // Preparar linhas
  const linhas = dados.map((u, i) => ({
    index: i + 1,
    nome: u.nome,
    email: u.email,
    bi: u.bi,
    role: u.role,
    telefone: u.telefone,
    departamento: u.departamento,
    createdAt: new Date(u.createdAt).toLocaleDateString("pt-BR"),
    genero: u.genero,
    nascimento: new Date(u.nascimento).toLocaleDateString("pt-BR"),
  }));

  // --- TÍTULO ---
  doc.setFontSize(18);
  doc.setTextColor(33, 37, 41);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de Funcionários", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

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

  doc.save(`funcionarios_${tipo}.pdf`);
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black/20">
        <p className="text-2xl flex text-black">
          <LoaderCircle size={35} className="animate-spin mr-2" /> Carregando...
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto max-h-[100vh] transition-all duration-300">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Funcionários Cadastrados</h1>
            <p className="text-gray-500 text-sm mt-1">Lista de todos os funcionários cadastrados no sistema.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="🔍 Pesquisar funcionário..."
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full sm:w-64"
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const filtrados = usuario.filter((p) =>
                  p.nome.toLowerCase().includes(query) || p.bi.toLowerCase().includes(query)
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
          Total de funcionários: <span className="font-semibold text-gray-900">{usuario.length}</span>
        </p>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0">
              <tr>
                {["#", "Nome", "E-mail", "BI", "Cargo", "Telefone", "Departamento", "Data de Entrada", "Gênero", "Nascimento", "Ações"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left whitespace-nowrap">{head}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {UsuarioPagina.map((func, i) => (
                <tr key={func.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{func.nome}</td>
                  <td className="px-3 py-2">{func.email}</td>
                  <td className="px-3 py-2">{func.bi}</td>
                  <td className="px-3 py-2">{func.role}</td>
                  <td className="px-3 py-2">{func.telefone}</td>
                  <td className="px-3 py-2">{func.departamento}</td>
                  <td className="px-3 py-2">{new Date(func.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-3 py-2">{func.genero}</td>
                  <td className="px-3 py-2">{new Date(func.nascimento).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-center space-x-2 flex justify-center gap-2">
                    <button 
                      onClick={() => handleEditar(func)} 
                      className="text-blue-600 hover:text-blue-700 transition cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>

                    <button 
                      onClick={() => handleDelete(func)} 
                      className="text-red-500 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                    {/*<button onClick={() => exportPDF("individual", func)} className="text-green-600 hover:text-green-700 transition cursor-pointer">
                      <FileText size={18} />
                    </button>*/}
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
            className={`p-2 rounded-md border ${paginaAtual === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
          >
            <ChevronLeft size={18} />
          </button>

          {paginas.map((num) => (
            <button
              key={num}
              onClick={() => setPaginaAtual(num)}
              className={`px-3 py-1 border rounded-md ${paginaAtual === num ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-100"}`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((prev) => prev + 1)}
            className={`p-2 rounded-md border ${paginaAtual === totalPaginas ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Modal Edição */}
        {isModalOpen && selectCurso && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white p-6 rounded-xl w-96 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Editar Funcionário</h2>

              <input value={selectCurso.nome} onChange={(e) => setSelectCurso({ ...selectCurso, nome: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Nome" />
              <input value={selectCurso.email} onChange={(e) => setSelectCurso({ ...selectCurso, email: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Email" />
              <input value={selectCurso.telefone} onChange={(e) => setSelectCurso({ ...selectCurso, telefone: e.target.value })} className="w-full border p-2 rounded mb-2" placeholder="Telefone" />

              <select value={selectCurso.departamento} onChange={(e) => setSelectCurso({ ...selectCurso, departamento: e.target.value })} className="w-full border p-2 rounded mb-2">
                <option value="">Selecione o Departamento</option>
                {departamentos.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>

              <select 
              value={selectCurso.role} 
              onChange={(e) => setSelectCurso({ ...selectCurso, role: e.target.value })} 
              className="w-full border p-2 rounded mb-2" 
              required
              >
                <option value="">Selecione o Cargo</option>
                <option value="ADMIN">Administrador</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ASSISTENTE">Assistente</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleUpdate}>Salvar</Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}