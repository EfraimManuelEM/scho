"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gerarPerguntasAleatorias, Pergunta } from "@/src/utils/gerarPergunta";

export default function ProvaPage() {
  const router = useRouter();

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [verificandoLogin, setVerificandoLogin] = useState(true);

  useEffect(() => {
    const candidatoString = localStorage.getItem("candidato");
    const token = localStorage.getItem("token");

    if (!candidatoString || !token) {
      router.replace("/exame/loginC");
      return;
    }

    try {
      const user = JSON.parse(candidatoString);
    // 🔥 Correção do role
    if (user.role?.toUpperCase() !== "CANDIDATO") {
      router.replace("/exame/loginC");
      return;
    }

      const jaFez = localStorage.getItem(`prova_feita_${user.email}`);
      if (jaFez) {
        alert("Você já realizou a prova.");
        router.replace("/exame/loginC");
        return;
      }

      const selecionadas = gerarPerguntasAleatorias(10);

      setPerguntas(selecionadas);
      setVerificandoLogin(false);

    } catch (error) {
      console.error("Erro ao validar usuário:", error);
      localStorage.removeItem("candidato");
      router.replace("/exame/loginC");
    }
  }, [router]);

  const responder = (perguntaId: number, opcaoIndex: number) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: opcaoIndex,
    }));
  };

  const finalizarProva = () => {
    const candidatoString = localStorage.getItem("candidato");
    if (!candidatoString) return;

    const user = JSON.parse(candidatoString);

    let acertos = 0;

    perguntas.forEach((p) => {
      if (respostas[p.id] === p.resposta) {
        acertos++;
      }
    });

    const nota = ((acertos / perguntas.length) * 100).toFixed(2);

    alert(`Prova finalizada!\nAcertos: ${acertos}\nNota: ${nota}%`);

    localStorage.setItem(`prova_feita_${user.email}`, "true");

    router.replace("/exame/loginC");
  };

  if (verificandoLogin) {
    return <p className="p-10 text-center">Carregando prova...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Prova Teórica
      </h1>

      {perguntas.map((p, index) => (
        <div key={p.id} className="mb-6 p-4 border rounded-lg shadow">
          <h2 className="font-semibold mb-3">
            {index + 1}. {p.pergunta}
          </h2>

          {p.opcoes.map((opcao, i) => (
            <label key={i} className="block mb-2 cursor-pointer">
              <input
                type="radio"
                name={`pergunta-${p.id}`}
                checked={respostas[p.id] === i}
                onChange={() => responder(p.id, i)}
                className="mr-2"
              />
              {opcao}
            </label>
          ))}
        </div>
      ))}

      <div className="text-center mt-8">
        <button
          onClick={finalizarProva}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Finalizar Prova
        </button>
      </div>
    </div>
  );
}
