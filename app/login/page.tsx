"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRoundIcon, LogOutIcon } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Chamada à API AdonisJS
      const res = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "E-mail ou senha incorretos!");
        setLoading(false);
        return;
      }

      // 🔹 Salvar token e dados do usuário
      localStorage.setItem("token", data.token); 
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔹 Redirecionamento baseado no role
      switch (data.user.role) {
        case "ADMIN":
          router.push("/admin/list-cadidato");
          break;
        case "ASSISTENTE":
          router.push("/admin/list-cadidato");
          break;
        default:
          router.push("/");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {error && (
        <p className="text-red-500 text-sm text-center absolute top-4">{error}</p>
      )}

      <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LADO ESQUERDO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-10">
          <CircleUserRoundIcon size={80} className="text-gray-800 drop-shadow mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 text-center text-sm mb-1">Bem-vindo ao sistema</p>
        </div>

        {/* LADO DIREITO */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-red-500 to-red-600 flex flex-col justify-center items-center p-8 text-white">
          <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">E-mail</label>
              <input
                type="email"
                placeholder="Digite o seu e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-2 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Senha</label>
              <input
                type="password"
                placeholder="Digite a sua senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-lg px-4 py-2 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full flex justify-center items-center gap-2 bg-white text-black font-semibold py-2.5 rounded-lg shadow-md hover:bg-black hover:text-white transition-all duration-300"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center gap-2 text-white hover:underline hover:text-gray-100 transition"
          >
            <LogOutIcon size={18} /> Voltar à página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
