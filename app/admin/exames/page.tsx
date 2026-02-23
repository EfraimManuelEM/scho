"use client";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Prova {
  id: string;
  createdAt: string;
  candidatoId: number;
  candidatoNome: string
  nota: number;
  status: "Aprovado" | "Reprovado" | "Segunda Fase";
}

export default function Exames() {
  const [prova, setProva] = useState<Prova[]>([])
  const [pesquisa, setPesquisa] = useState<Prova[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;
  const paginasVisiveis = 5;

  useEffect(() => {
    fetchProva();
  }, []);
  
    const fetchProva = async () => {
      try {
        const response = await axios.get("http://localhost:3333/prova");
        setProva(response.data);
        setPesquisa(response.data);
      } catch (error) {
        console.error("Erro ao buscar prova:", error)
      }
    }

      // Paginação
      const totalPaginas = Math.ceil(pesquisa.length / itensPorPagina);
      const inicio = (paginaAtual - 1) * itensPorPagina;
      const fim = inicio + itensPorPagina;
      const ProvaPagina = pesquisa.slice(inicio, fim);
    
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

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo principal */}
      <section className="flex-1 p-8 overflow-y-auto max-h-[100vh] transition-all duration-300">
        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📘 Exames Realizados
          </h1>
          <p className="text-gray-500 mt-1">
            Visualize todos os exames realizados, com suas notas e status de aprovação.
          </p>
        </header>

        {/* Barra de busca */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Total de exames:{" "}
            <span className="font-semibold text-gray-900">{prova.length}</span>
          </p>
          <input
            type="text"
            placeholder="🔍 Pesquisar aluno..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-full sm:w-64"
          onChange={(e) => {
            const query = e.target.value.toLocaleLowerCase();
            const filtrados = prova.filter((p) => 
              p.candidatoNome.toLocaleLowerCase().includes(query)
            );
            setPesquisa(filtrados);
            setPaginaAtual(1)
          }}
          />
        </div>

        {/* Tabela de exames */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Data</th>
                <th className="px-6 py-3 text-left">Nota</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {ProvaPagina.map((exame, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{exame.candidatoNome || exame.candidatoId}</td>
                  <td className="px-6 py-3 text-gray-600">{exame.createdAt}</td>
                  <td className="px-6 py-3 text-gray-700 font-semibold">
                    {exame.nota}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${
                        exame.status === "Aprovado"
                          ? "bg-green-100 text-green-700 border-green-400"
                          : exame.status === "Reprovado"
                          ? "bg-red-100 text-red-700 border-red-400"
                          : "bg-yellow-100 text-yellow-700 border-yellow-400"
                      }`}
                    >
                      {exame.status === "Aprovado" && (
                        <span className="mr-1.5">✅</span>
                      )}
                      {exame.status === "Reprovado" && (
                        <span className="mr-1.5">❌</span>
                      )}
                      {exame.status}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-300 hover:bg-green-100 transition"
                    >
                      Aprovar
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 transition"
                    >
                      Reprovar
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
    </div>
  );
}
