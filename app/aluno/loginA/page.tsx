"use client";

import { LogIn, LogOut, GraduationCap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginAluno() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro você pode validar com API ou backend
    router.push("/aluno/[id]"); // Redireciona para o painel do aluno
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-b from-red-500 to-red-600 py-6 text-center text-white">
          <GraduationCap size={50} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Login do Aluno</h1>
          <p className="text-sm opacity-90">Acesse sua conta para ver os resultados</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-300">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="email"
                required
                placeholder="exemplo@email.com"
                className="w-full outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-300">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                type="password"
                required
                placeholder="Digite sua senha"
                className="w-full outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Entrar
          </button>
        </form>

        {/* Rodapé */}
        <div className="flex justify-center items-center gap-2 pb-6">
          <Link
            href="/"
            className="flex items-center text-red-500 hover:text-red-600 transition text-sm font-medium"
          >
            <LogOut size={16} className="mr-1" /> Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  );
}
