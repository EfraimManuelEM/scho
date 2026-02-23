"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("perfil");
  const toggleSection = (section: string) =>
    setActiveSection(activeSection === section ? "" : section);

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Configurações</h1>
          <p className="text-gray-500 text-sm">
            Gerencie seu perfil, preferências e segurança do sistema.
          </p>
        </header>

        <div className="space-y-6">
          {/* PERFIL */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-2xl">
            <button
              onClick={() => toggleSection("perfil")}
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
            >
              <span className="text-xl font-semibold text-gray-700">Perfil</span>
              <span className="text-gray-500">{activeSection === "perfil" ? "▲" : "▼"}</span>
            </button>
            {activeSection === "perfil" && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition">
                  Salvar Perfil
                </button>
              </div>
            )}
          </div>

          {/* PREFERÊNCIAS */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-2xl">
            <button
              onClick={() => toggleSection("preferencias")}
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
            >
              <span className="text-xl font-semibold text-gray-700">Preferências</span>
              <span className="text-gray-500">{activeSection === "preferencias" ? "▲" : "▼"}</span>
            </button>
            {activeSection === "preferencias" && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tema</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Notificações</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="all">Todas</option>
                    <option value="email">Somente Email</option>
                    <option value="none">Nenhuma</option>
                  </select>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition">
                  Salvar Preferências
                </button>
              </div>
            )}
          </div>

          {/* SEGURANÇA */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-2xl">
            <button
              onClick={() => toggleSection("seguranca")}
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
            >
              <span className="text-xl font-semibold text-gray-700">Segurança</span>
              <span className="text-gray-500">{activeSection === "seguranca" ? "▲" : "▼"}</span>
            </button>
            {activeSection === "seguranca" && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nova Senha</label>
                  <input
                    type="password"
                    placeholder="Digite nova senha"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar Senha</label>
                  <input
                    type="password"
                    placeholder="Confirme a nova senha"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-medium transition">
                  Alterar Senha
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
