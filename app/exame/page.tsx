"use client"

import Nav from "@/components/nav"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { LoaderCircle } from "lucide-react"

interface Prova {
  id: string
  candidatoId: number
  candidatoNome: string;
  nota: number
  status: "Aprovado" | "Reprovado" | "Segunda Fase"
}

export default function Exame() {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [provas, setProvas] = useState<Prova[]>([])
  const [resultado, setResultado] = useState<Prova | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  /* ================= BUSCAR TODAS AS PROVAS ================= */
  useEffect(() => {
    const fetchProvas = async () => {
      try {
        const response = await axios.get("http://localhost:3333/prova")
        setProvas(response.data)
      } catch (error) {
        console.error("Erro ao buscar provas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProvas()
  }, [])

  /* ================= PESQUISA ================= */
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setErro("");
  setResultado(null);

  const termo = registrationNumber.trim().toLowerCase();

  if (!termo) {
    setErro("Digite o nome ou número de inscrição.");
    return;
  }

  const encontrada = provas.find((p) =>
    p.candidatoNome.toLowerCase().includes(termo) ||
    p.id.toString() === termo
  );

  if (!encontrada) {
    setErro("Nenhum resultado encontrado para este nome ou número de inscrição.");
    return;
  }

  setResultado(encontrada);
};

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin mr-2" />
        Carregando provas...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Nav />

      {/* HERO */}
      <div className="relative h-[60vh] w-full">
        <Image src="/don.jpg" alt="Exame" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Resultados do Exame
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* FORMULÁRIO */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle>Consultar Resultado</CardTitle>
            <CardDescription>
              Digite o seu número de inscrição
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Número de inscrição"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />

              <Button type="submit" className="w-full cursor-pointer">
                Consultar
              </Button>
            </form>

            {erro && (
              <p className="text-red-600 text-center mt-4">{erro}</p>
            )}
          </CardContent>
        </Card>

        {/* RESULTADO (SÓ APARECE APÓS PESQUISA) */}
        {resultado && (
          <Card className="mt-8 border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle>Resultado</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Nome do Candidato:</span>
                <strong>{resultado.candidatoNome || resultado.candidatoId }</strong>
              </div>

              <div className="flex justify-between">
                <span>Nota:</span>
                <strong>{resultado.nota}</strong>
              </div>

              <div className="flex justify-between">
                <span>Status:</span>
                <strong
                  className={
                    resultado.status === "Aprovado"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {resultado.status}
                </strong>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setResultado(null)
                  setRegistrationNumber("")
                }}
              >
                Nova consulta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
