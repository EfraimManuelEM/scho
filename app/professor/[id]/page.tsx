"use client";
import { useState } from "react";
import { Award, LogOut, User, GraduationCap, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Professor() {
  const turmas = [
    { id: 1, nome: "Turma A", curso: "Engenharia Informática", turno: "Manhã" },
    { id: 2, nome: "Turma B", curso: "Gestão", turno: "Tarde" },
  ];

  const alunosPorTurma = {
    1: [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Carlos Alberto" },
      { id: 3, nome: "Ana Paula" },
      { id: 4, nome: "Fernando Gomes" },
      { id: 5, nome: "Mariana Lopes" },
      { id: 6, nome: "Ricardo Pinto" },
      { id: 7, nome: "Sandra Rocha" },
    ],
    2: [
      { id: 8, nome: "Maria Santos" },
      { id: 9, nome: "Antonio Lima" },
      { id: 10, nome: "Beatriz Costa" },
      { id: 11, nome: "Rui Fernandes" },
      { id: 12, nome: "Paula Tavares" },
      { id: 13, nome: "Tiago Cruz" },
    ],
  };

  const router = useRouter();
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [notas, setNotas] = useState<{ [key: number]: string }>({});
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const porPagina = 5;

  const handleNotaChange = (alunoId: number, valor: string) => {
    setNotas((prev) => ({ ...prev, [alunoId]: valor }));
  };

  const handleLancarNotas = () => {
    alert("✅ Notas lançadas com sucesso!");
    console.log("Notas lançadas:", notas);
  };

  const alunosFiltrados =
    turmaSelecionada !== ""
      ? alunosPorTurma[turmaSelecionada].filter((aluno) =>
          aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
        )
      : [];

  const totalPaginas = Math.ceil(alunosFiltrados.length / porPagina);
  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;
  const alunosPaginados = alunosFiltrados.slice(inicio, fim);

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina > 0 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200 py-3 px-4 sm:px-8 flex flex-wrap justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <GraduationCap className="text-blue-600" size={26} />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Painel do Professor
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <User className="text-gray-700" size={20} />
            <span className="font-semibold text-sm sm:text-base">
              Efraim Manuel
            </span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-sm sm:text-base text-red-500 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <section className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Cabeçalho */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            👨‍🏫 Lançamento de Notas
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Selecione uma turma e registre as notas dos alunos de forma rápida e organizada.
          </p>
        </header>

        {/* Turmas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {turmas.map((turma) => (
            <div
              key={turma.id}
              className={`p-5 bg-white rounded-2xl border shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 ${
                turmaSelecionada === turma.id ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
              }`}
              onClick={() => {
                setTurmaSelecionada(turma.id);
                setPaginaAtual(1);
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-800">{turma.nome}</h2>
                <Award className="text-blue-500" size={20} />
              </div>
              <p className="text-gray-600 text-sm mt-1">{turma.curso}</p>
              <p className="text-gray-500 text-sm">{turma.turno}</p>
            </div>
          ))}
        </div>

        {/* Alunos e lançamento de notas */}
        {turmaSelecionada && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                📋 Alunos da {turmas.find((t) => t.id === turmaSelecionada)?.nome}
              </h2>

              {/* Campo de pesquisa */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar aluno..."
                  value={pesquisa}
                  onChange={(e) => {
                    setPesquisa(e.target.value);
                    setPaginaAtual(1);
                  }}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[500px]">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Nome do Aluno</th>
                    <th className="px-4 py-3 text-left">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosPaginados.length > 0 ? (
                    alunosPaginados.map((aluno, i) => (
                      <tr
                        key={aluno.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">{inicio + i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{aluno.nome}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={notas[aluno.id] || ""}
                            onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                            placeholder="0-20"
                            className="w-24 sm:w-28 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        Nenhum aluno encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition ${
                    paginaAtual === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={18} /> Anterior
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition ${
                    paginaAtual === totalPaginas
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Próxima <ChevronRight size={18} />
                </button>
              </div>
            )}

            <div className="flex justify-end mt-8">
              <button
                onClick={handleLancarNotas}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition cursor-pointer"
              >
                💾 Lançar Notas
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
