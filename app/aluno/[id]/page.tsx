"use client";

import {
  BookOpenCheck,
  LogOut,
  User,
  Award,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Aluno() {
  const router = useRouter();

  const resultados = [
    { id: 1, disciplina: "Matemática", data: "25/10/2025", nota: 16, status: "Aprovado" },
    { id: 2, disciplina: "Língua Portuguesa", data: "26/10/2025", nota: 14, status: "Aprovado" },
    { id: 3, disciplina: "Física", data: "27/10/2025", nota: 10, status: "Aprovado" },
    { id: 4, disciplina: "Química", data: "28/10/2025", nota: 8, status: "Reprovado" },
    { id: 5, disciplina: "Biologia", data: "29/10/2025", nota: 15, status: "Aprovado" },
    { id: 6, disciplina: "História", data: "30/10/2025", nota: 12, status: "Aprovado" },
    { id: 7, disciplina: "Geografia", data: "31/10/2025", nota: 17, status: "Aprovado" },
    { id: 8, disciplina: "Inglês", data: "01/11/2025", nota: 13, status: "Aprovado" },
    { id: 9, disciplina: "Educação Moral e Cívica", data: "02/11/2025", nota: 18, status: "Aprovado" },
    { id: 10, disciplina: "Informática", data: "03/11/2025", nota: 11, status: "Aprovado" },
  ];

  const mediaGeral = (
    resultados.reduce((acc, r) => acc + r.nota, 0) / resultados.length
  ).toFixed(1);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200 py-3 px-4 sm:px-6 flex flex-wrap justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <Award className="text-red-500" size={26} />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Resultados das Provas
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
            className="flex items-center gap-1 text-sm sm:text-base text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <section className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            👋 Olá, Efraim
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Aqui estão os resultados oficiais das suas provas recentes.
          </p>
        </div>

        {/* Média Geral */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <BookOpenCheck className="text-red-500" /> Média Geral
            </h3>
            <p className="text-gray-600 text-sm">
              Cálculo automático baseado em todas as disciplinas.
            </p>
          </div>
          <span className="text-4xl font-bold text-red-500">{mediaGeral}</span>
        </div>

        {/* Resultados Detalhados */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow p-6 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="text-red-500" /> Resultados Detalhados
          </h3>

          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="py-3 px-4 whitespace-nowrap">Disciplina</th>
                <th className="py-3 px-4 whitespace-nowrap">Data</th>
                <th className="py-3 px-4 whitespace-nowrap">Nota</th>
                <th className="py-3 px-4 whitespace-nowrap">Situação</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{r.disciplina}</td>
                  <td className="py-3 px-4">{r.data}</td>
                  <td className="py-3 px-4">{r.nota} valores</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        r.status === "Aprovado"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
