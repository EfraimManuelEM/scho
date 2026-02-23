"use client";

import { CircleUserRoundIcon, LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔹 Atualiza state ao digitar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Envia login para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3333/loginC", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, senha: form.senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "E-mail ou senha inválidos");
        setLoading(false);
        return;
      }

      // 🔹 Salva token e dados do candidato como "user"
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.candidato));

      // 🔹 Redireciona para a prova
      router.replace("/prova");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        {/* Coluna esquerda */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-white">
          <CircleUserRoundIcon size={80} className="text-gray-800 drop-shadow mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 text-center text-sm mb-1">Bem-vindo ao sistema</p>
          <p className="text-gray-800 text-center font-medium">Área do Candidato</p>
        </div>

        {/* Coluna direita */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-red-500 to-red-600 flex flex-col justify-center items-center p-8 text-white">
          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Digite o seu e-mail"
                required
                className="w-full rounded-lg px-4 py-2 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Senha</label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Digite a sua senha"
                required
                className="w-full rounded-lg px-4 py-2 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full flex cursor-pointer justify-center items-center gap-2 bg-white text-black font-semibold py-2.5 rounded-lg shadow-md hover:bg-black hover:text-white transition-all duration-300"
            >
              <LogInIcon size={18} /> {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <Link
            href="/exame"
            className="mt-6 flex items-center gap-2 text-white hover:underline hover:text-gray-100 transition cursor-pointer"
          >
            <LogOutIcon size={18} /> Voltar à página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
