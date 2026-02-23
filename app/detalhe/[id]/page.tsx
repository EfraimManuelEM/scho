"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

interface Curso {
  id: string;
  nome: string;
  codigo: string;
  duracao: string;
  departamento: string;
  image: string;
  descricao: string;
}

export default function Detalhe() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCurso = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/curso/${id}`
        );

        setCurso(response.data);
      } catch (error) {
        console.error("Erro ao buscar curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, [id]);

  if (loading) {
    return (
           <div className="flex items-center text-balck justify-center h-screen bg-black/20">
             <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
           </div>
         ); 
  }

  if (!curso) {
    return <p className="p-8 text-center">Curso não encontrado</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <section className="pt-24 pb-16 px-6 flex justify-center">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border overflow-hidden">

          {/* IMAGEM */}
          <div className="relative h-64 w-full">
            <img
              src={
                curso.image.startsWith("http")
                  ? curso.image
                  : `http://localhost:3333/${curso.image}`
              }
              alt={curso.nome}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">
                {curso.nome}
              </h1>
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-semibold border-b pb-2">
              Informações do Curso
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-xl p-5">
                <h3 className="text-xl font-semibold mb-2">📘 Detalhes</h3>
                <ul className="space-y-1">
                  <li><strong>Nome:</strong> {curso.nome}</li>
                  <li><strong>Código:</strong> {curso.codigo}</li>
                  <li><strong>Departamento:</strong> {curso.departamento}</li>
                </ul>
              </div>

              <div className="bg-gray-100 rounded-xl p-5">
                <h3 className="text-xl font-semibold mb-2">🕒 Duração</h3>
                <p><strong>Anos:</strong> {curso.duracao}</p>
                <p><strong>Descrição:</strong> {curso.descricao}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-6">
              <button
                onClick={() => router.push("/exame/candidatura")}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800"
              >
                Inscrever-se
              </button>

              <button
                onClick={() => router.back()}
                className="border border-black px-8 py-3 rounded-lg hover:bg-black hover:text-white"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
