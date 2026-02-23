"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Curso {
  id: string;
  nome: string;
}

export default function Turma() {
    const anos = [
    { label: "1º ano", value: 1 },
    { label: "2º ano", value: 2 },
    { label: "3º ano", value: 3 },
    { label: "4º ano", value: 4 },
  ];
  const turnos = ["Manhã", "Tarde", "Noite"];
  const [form, setForm] = useState({
    nome: "",
    cursoId: "",
    ano: "",
    turno: "",
    sala: "",
    totalAlunos: "",
  });
  const [curso, setCurso] = useState<Curso[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGeral, setLoadingGeral] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get("http://localhost:3333/curso");
        setCurso(response.data);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    }
    fetchCursos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingGeral(true);
    setErro("");

     try {
      await axios.post("http://localhost:3333/turma", {
        nome: form.nome,
        cursoId: Number(form.cursoId),
        ano: Number(form.ano),
        turno: form.turno,
        sala: form.sala,
        totalAlunos: Number(form.totalAlunos),
      });
      toast.success("✅ Turma criada com sucesso!");
      setForm({
        nome: "",
        cursoId: "",
        ano: "",
        turno: "",
        sala: "",
        totalAlunos: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar a turma.");
    } finally {
      setLoading(false);
      setLoadingGeral(false);
    }
  }

     if (loadingGeral) {
       return (
         <div className="flex items-center text-black justify-center h-screen bg-black/20">
           <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
         </div>
       );
     }


  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Adicionar Turma</h1>
          <p className="text-gray-500 text-sm">
            Preencha os campos abaixo para criar uma nova turma.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 max-w-2xl mx-auto space-y-6"
        >
          {erro && <p className="text-red-500">{erro}</p>}
          {/* Nome da Turma */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nome da Turma
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Turma A"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Curso */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Curso
            </label>
            <select
              name="cursoId"
              value={form.cursoId}
              onChange={(e) => setForm({ ...form, cursoId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Selecione o curso...</option>
              {curso.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ano
            </label>
             <select
            value={form.ano}
            onChange={e => setForm({ ...form, ano: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Selecione o ano</option>
            {anos.map(a => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          </div>

          {/* Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Turno
            </label>
            <select
              name="turno"
              value={form.turno}
              onChange={(e) => setForm({ ...form, turno: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Selecione o turno...</option>
              {turnos.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sala */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sala
            </label>
            <input
              type="text"
              name="sala"
              value={form.sala}
              onChange={handleChange}
              placeholder="Ex: 101"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

           {/* Total de Alunos */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Total de Alunos
            </label>
            <input
              type="text"
              name="totalAlunos"
              value={form.totalAlunos}
              onChange={handleChange}
              placeholder="Ex: Total de Alunos"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Salvando..." : "Adicionar Turma"}
          </button>
        </form>
      </section>
    </main>
  );
}
