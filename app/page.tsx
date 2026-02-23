'use client';

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* =======================
   TIPAGEM DO CURSO
======================= */
interface Curso {
  id: string;
  nome: string;
  codigo: string;
  duracao: string;
  departamento: string;
  image: string;
  descricao: string;
}

/* =======================
   COMPONENTE PRINCIPAL
======================= */
export default function Home() {
  /* ---------- CARROSSEL ---------- */
  const carrossel = [
    { src: '/akatsuki.jpg', text: 'Akatsuki' },
    { src: '/doflamingo.jpg', text: 'Doflamingo' },
    { src: '/don.jpg', text: 'Don Lorenzo' },
    { src: '/teclado.jpeg', text: 'Teclado' },
  ];

  /* ---------- ESTADOS ---------- */
  const [curso, setCurso] = useState<Curso[]>([]);
  const [carros, setCarros] = useState(0);
  const router = useRouter();

  /* ---------- BUSCAR CURSOS ---------- */
  useEffect(() => {
    fetchCurso();
  }, []);

  const fetchCurso = async () => {
    try {
      const response = await axios.get("http://localhost:3333/curso");
      setCurso(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  /* ---------- AUTO SLIDE DO CARROSSEL ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCarros((prev) => (prev + 1) % carrossel.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carrossel.length]);

  /* =======================
     RENDER
  ======================= */
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* ================= HERO / CARROSSEL ================= */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {carrossel.map((item, i) => (
          <div
            key={item.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === carros ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={item.src}
              alt={item.text}
              fill
              className="object-cover"
              priority={i === 0}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />

            {i === carros && (
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="container mx-auto max-w-6xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                    {item.text}
                  </h1>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= INTRODUÇÃO ================= */}
      <section className="container mx-auto px-6 py-16 max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bem-vindo à nossa escola de Programação
        </h2>
        <p className="text-lg text-muted-foreground">
          Oferecemos cursos de alta qualidade para todos os níveis — do iniciante ao avançado.
          Nossa equipe é composta por profissionais apaixonados e dedicados.
        </p>
      </section>

      {/* ================= CURSOS ================= */}
      <section className="container mx-auto px-6 pb-20 max-w-6xl">
        <CardHeader className="text-center mb-10">
          <CardTitle className="text-3xl md:text-4xl">
            Nossos Cursos
          </CardTitle>
          <CardDescription>
            Explore nossas formações e desenvolva suas habilidades no mundo da programação.
          </CardDescription>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {curso.slice(0, 3).map((c) => (
            <Card
              key={c.id}
              className="group border-2 hover:border-primary transition-all duration-300 rounded-2xl shadow-lg cursor-pointer"
              onClick={() => router.push(`/detalhe/${c.id}`)}
            >
              <CardContent className="p-6 flex flex-col items-center">
                <img
                  src={c.image}
                  alt={c.nome}
                  width={400}
                  height={250}
                  className="rounded-lg mb-4 object-cover h-48 w-full transition-transform group-hover:scale-105"
                />

                <CardTitle className="text-xl font-semibold mb-2">
                  {c.nome}
                </CardTitle>

                <CardDescription className="text-center">
                  {c.descricao.length > 100 ? c.descricao.substring(0, 100) + '...' : c.descricao}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
