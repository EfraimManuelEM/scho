'use client';

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

interface Curso {
  id: string;
  nome: string;
  codigo: string;
  duracao: string;
  departamento: string;
  image: string;
  descricao: string;
}

export default function Cursos() {
  const router = useRouter();
  const [curso, setCurso] = useState<Curso[]>([]);

  useEffect(() => {
    fetchCurso();
  }, []);

  const fetchCurso = async () => {
    try {
      const response = await axios.get("http://localhost:3333/curso");
      console.log("CURSOS:", response.data);
      setCurso(response.data);
    } catch (error) {
      console.error("Erro ao buscar curso:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      {/* HEADER */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4">Nossos Cursos</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Descubra nossos cursos e transforme sua carreira na tecnologia.
        </p>
      </section>

      {/* LISTA */}
      <section className="flex-1 flex justify-center px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          {curso.map((c) => (
            <Card
              key={c.id}
              className="group bg-white rounded-3xl shadow-xl hover:-translate-y-2 transition-all p-6 flex flex-col items-center"
            >
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6">
                <img
                  src={
                    c.image?.startsWith("http")
                      ? c.image
                      : `http://localhost:3333/${c.image}`
                  }
                  alt={c.nome}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <CardTitle className="text-2xl font-bold mb-3 text-center">
                {c.nome}
              </CardTitle>

              <CardDescription className="text-gray-600 text-center mb-6">
                {c.descricao.length > 100 ? c.descricao.substring(0, 100) + '...' : c.descricao}
              </CardDescription>

              <button
                onClick={() => router.push(`/detalhe/${c.id}`)}
                className="mt-auto bg-black text-white px-8 py-2 rounded-full hover:bg-gray-800 transition"
              >
                Saiba mais
              </button>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
