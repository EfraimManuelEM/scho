"use client";

import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoaderCircle, ToggleRight } from "lucide-react";

interface Curso {
  id: string;
  nome: string;
}

export default function Candidatura() {
    const [form, setForm] = useState({
        nome: "",
        bi: "",
        genero: "",
        email: "",
        senha: "",
        telefone: "",
        telefone2: "",
        nomePai: "", 
        nomeMae: "",
        nascimento: "",
        turno: "",
        endereco: "",
        mediaFinal: "",
        cursoId: "",
    });
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingGeral, setLoadingGeral] = useState(false);
    const router = useRouter();
    const [cursos, setCursos] = useState<Curso[]>([]);
  
    const availableServices = [
  
      "Manhã",
      "Tarde ",
      "Noite",
  
    ]; const Generos = [
  
      "Masculino",
      "Femenino",
  
  
    ];

      // Buscar cursos do backend
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await axios.get("http://localhost:3333/curso"); // supondo que exista /api/curso
        setCursos(res.data);
      } catch (err) {
        toast.error("Erro ao buscar cursos");
      }
    };
    fetchCursos();
  }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErro("");
      setLoading(true);
      setLoadingGeral(true);

      try {
        await axios.post("http://localhost:3333/candidato", form, {
          headers: { "content-Type": "application/json" },
        });

        toast.success("Candidato criado com sucesso!")

        router.push("/");
      } catch (err) {
        toast.error( "Erro ao cadastrar candidato!");
      } 
      finally {
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
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 pb-16 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-center text-black mb-6">
            Candidatura ao Exame de Acesso
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Preencha o formulário abaixo com suas informações pessoais e escolha o curso desejado.
            Após o envio, entraremos em contacto por e-mail com mais detalhes sobre o exame.
          </p>


          {erro && <p className="text-red-500">{erro}</p>}
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* DADOS PESSOAIS */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Dados Pessoais</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="Digite seu nome completo"
                    onChange={handleChange}
                    value={form.nome}
                    name="nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número do Bilhete</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="Digite o número do seu BI"
                    onChange={handleChange}
                    value={form.bi}
                    name="bi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de nascimento</label>
                  <input
                    type="date"
                    required
                    name="nascimento"
                    onChange={handleChange}
                    value={form.nascimento}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    value={form.genero}
                    onChange={(e) => setForm({...form, genero: e.target.value})}
                    name="genero"
                  >
                    <option value="">Selecione o genero</option>
                    {Generos.map((g) => (
                      <option value={g} key={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* CONTATO */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Contato</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="exemplo@email.com"
                    onChange={handleChange}
                    value={form.email}
                    name="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="(244) 999 999 999"
                    onChange={handleChange}
                    value={form.telefone}
                    name="telefone"
                  />
                </div>
              </div>
            </div>

            {/* INFORMAÇÕES FAMILIARES */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Filiação</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Pai</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="Nome do pai"
                    onChange={handleChange}
                    value={form.nomePai}
                    name="nomePai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Mãe</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="Nome da mãe"
                    onChange={handleChange}
                    value={form.nomeMae}
                    name="nomeMae"
                  />
                </div>
              </div>
            </div>

            {/* INFORMAÇÕES ACADÊMICAS */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informações Acadêmicas</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curso desejado</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    name="cursoId"
                    value={form.cursoId}
                    onChange={(e) => setForm({ ...form, cursoId: e.target.value})}
                  >
                    <option value="">Selecione o curso</option>
                      {cursos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    name="turno"
                    onChange={(e) => setForm({...form, turno: e.target.value})}
                    value={form.turno}
                  >
                    <option value="">Selecione o turno</option>
                    {availableServices.map((t) => (
                      <option value={t} key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="Digite seu endereço completo"
                    onChange={handleChange}
                    value={form.endereco}
                    name="endereco"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Média Final</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                    placeholder="Digite sua média final"
                    onChange={handleChange}
                    value={form.mediaFinal}
                    name="mediaFinal"
                  />
                </div>
              </div>
            </div>

            {/* BOTÃO */}
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar candidatura"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
