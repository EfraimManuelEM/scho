"use client";

import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

export default function UsuarioPage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    bi: "",
    telefone: "",
    genero: "",
    departamento: "",
    nascimento: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingGeral, setLoadingGeral] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingGeral(true);

    try {
      const res = await fetch("http://localhost:3333/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // 🔴 TRATAMENTO DE ERROS
      if (!res.ok) {
        if (data.message?.includes("users_email_unique")) {
          toast.error("❌ Este email já está a ser usado.");
          return;
        }

        if (data.message?.includes("users_bi_unique")) {
          toast.error("❌ Este BI já está a ser usado.");
          return;
        }

        toast.error("❌ Erro ao criar usuário.");
        return;
      }

      // ✅ SUCESSO
      toast.success("✅ Usuário criado com sucesso!");
      setForm({
        nome: "",
        email: "",
        senha: "",
        bi: "",
        telefone: "",
        genero: "",
        departamento: "",
        nascimento: "",
        role: "",
      });

    } catch (error) {
      toast.error("❌ Erro ao criar usuário! Tente novamente.");
    } finally {
      setLoading(false);
      setLoadingGeral(false);
    }
  };

   if (loadingGeral) {
     return (
       <div className="flex items-center text-balck justify-center h-screen bg-black/20">
         <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
       </div>
     );
  }

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h1 className="text-3xl font-bold col-span-1 md:col-span-2">
            Criar Usuário
          </h1>

          {/* Nome */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) =>
                setForm({ ...form, nome: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          {/* BI */}
          <div>
            <label className="block text-sm font-medium mb-1">BI</label>
            <input
              type="text"
              value={form.bi}
              onChange={(e) => setForm({ ...form, bi: e.target.value })}
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={form.senha}
              onChange={(e) =>
                setForm({ ...form, senha: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) =>
                setForm({ ...form, telefone: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* Gênero */}
          <div>
            <label className="block text-sm font-medium mb-1">Gênero</label>
            <select
              value={form.genero}
              onChange={(e) =>
                setForm({ ...form, genero: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="">Selecione</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
            </select>
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <select
              value={form.departamento}
              onChange={(e) =>
                setForm({ ...form, departamento: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="">Selecione</option>
              {departamentos.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Nascimento */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={form.nascimento}
              onChange={(e) =>
                setForm({ ...form, nascimento: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2"
              required
            >
              <option value="">Selecione</option>
              <option value="ADMIN">Administrador</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ASSISTENTE">Assistente</option>
            </select>
          </div>

          {/* Botão */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
            >
              {loading ? "Criando..." : "Criar Usuário"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
