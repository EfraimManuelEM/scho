"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

/* ================= INTERFACES ================= */

interface Curso {
  id: number;
  nome: string;
}

interface Classe {
  id: number;
  classe: string;
  valor: number;
}

interface Turma {
  id: number;
  nome: string;
  ano: string;
  turno: string;
  sala: string;
}

interface Candidato {
  id: number;
  nome: string;
  bi: string;
  telefone?: string;
  cursoId: number;
  turno: string;
  cursoNome: string;
}

/* ================= COMPONENT ================= */

export default function Matricula() {
  const printRef = useRef<HTMLDivElement>(null);

  const [curso, setCurso] = useState<Curso[]>([]);
  const [turma, setTurma] = useState<Turma[]>([]);
  const [candidato, setCandidato] = useState<Candidato[]>([]);
  const [classe, setClasse] = useState<Classe[]>([]);
  const [pesquisa, setPesquisa] = useState<Candidato[]>([]);
  const [termo, setTermo] = useState("");

  const [confirmando, setConfirmando] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    candidatoId: "",
    telefone: "",
    cursoId: "",
    turmaId: "",
    turno: "",
    classeId: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3333/curso"),
      axios.get("http://localhost:3333/turma"),
      axios.get("http://localhost:3333/candidato"),
      axios.get("http://localhost:3333/classe"),
    ])
      .then(([cursoRes, turmaRes, candidatoRes, classeRes]) => {
        setCurso(cursoRes.data);
        setTurma(turmaRes.data);
        setCandidato(candidatoRes.data);
        setClasse(classeRes.data);
        setPesquisa(candidatoRes.data);
      })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= SELEÇÕES ================= */

  const candidatoSelecionado = candidato.find(
    (c) => c.id === Number(form.candidatoId)
  );

  const cursoSelecionado = curso.find(
    (c) => c.id === Number(form.cursoId)
  );

  const turmaSelecionada = turma.find(
    (t) => t.id === Number(form.turmaId)
  );

  const classeSeleciona = classe.find(
    (l) => l.id === Number(form.classeId)
  );

  /* ================= FILTRO ================= */

  const filtrar = (texto: string) => {
    setTermo(texto);
    setPesquisa(
      candidato.filter(
        (c) =>
          c.nome.toLowerCase().includes(texto.toLowerCase()) ||
          c.bi.toLowerCase().includes(texto.toLowerCase())
      )
    );
  };

  /* ================= CONFIRMAR ================= */

  const confirmarMatricula = async () => {
    if (
      !form.candidatoId ||
      !form.cursoId ||
      !form.turmaId ||
      !form.classeId
    ) {
      toast.warning("Preencha todos os campos obrigatórios");
      return;
    }

    const turmaSel = turma.find((t) => t.id === Number(form.turmaId));
    if (!turmaSel) {
      toast.error("Turma inválida");
      return;
    }

    try {
    await axios.post("http://localhost:3333/matricula", {
      candidatoId: Number(form.candidatoId),
      cursoId: Number(form.cursoId),
      turmaId: Number(form.turmaId),
      classeId: Number(form.classeId),
      telefone: form.telefone || null,
    });

    toast.success("✅ Matrícula realizada com sucesso!");

  } catch (error: any) {

    const mensagem =
      error?.response?.data?.message ||
      "❌ Não foi possível realizar a matrícula";

    toast.error(mensagem);
  } finally {
      setConfirmando(false);
    }
  };

  /* ================= IMPRIMIR ================= */

  const imprimir = () => {
    if (!printRef.current) return;
    const conteudo = printRef.current.innerHTML;
    const original = document.body.innerHTML;
    document.body.innerHTML = conteudo;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="animate-spin mr-2" /> Carregando...
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Matrícula</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORMULÁRIO */}
          <div className="bg-white p-6 rounded-xl border">

            <input
              placeholder="Pesquisar por nome ou BI"
              onChange={(e) => filtrar(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            {/* CANDIDATO */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome do Aluno
              </label>
              <select
                value={form.candidatoId}
                onChange={(e) => {
                  const cand = candidato.find(
                    (c) => c.id === Number(e.target.value)
                  );
                  setForm({
                    ...form,
                    candidatoId: e.target.value,
                    cursoId: cand?.cursoId.toString() || "",
                    turno: cand?.turno || "",
                  });
                }}
                className="w-full border p-2 rounded mb-4"
              >
                <option value="">Selecione o aluno</option>
                {pesquisa.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* TELEFONE */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Telefone
              </label>
              <input
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
                }
                className="w-full border p-2 rounded mb-4"
              />
            </div>

            {/* CURSO AUTOMÁTICO */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Curso
              </label>
              <select
                value={form.cursoId}
                disabled
                className="w-full border p-2 rounded mb-4 bg-gray-100"
              >
                <option value="">Curso</option>
                {curso.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* TURMA */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Turma
              </label>
              <select
                value={form.turmaId}
                onChange={(e) =>
                  setForm({ ...form, turmaId: e.target.value })
                }
                className="w-full border p-2 rounded mb-4"
              >
                <option value="">Selecione a turma</option>
                {turma.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* TURNO AUTOMÁTICO */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Turno
              </label>
              <input
                value={turmaSelecionada?.turno || form.turno || ""}
                disabled
                className="w-full border p-2 rounded mb-4 bg-gray-100"
              />
            </div>

            {/* CLASSE */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Classe
              </label>
              <select
                value={form.classeId}
                onChange={(e) =>
                  setForm({ ...form, classeId: e.target.value })
                }
                className="w-full border p-2 rounded mb-4"
              >
                <option value="">Classe</option>
                {classe.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.classe}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={confirmarMatricula}
              disabled={confirmando}
              className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer font-medium transition disabled:bg-gray-300"
            >
              {confirmando ? "Aguarde..." : "Confirmar Matrícula"}
            </button>
          </div>

          {/* FATURA */}
          <div
            ref={printRef}
            className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden"
          >
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
              <div className="flex justify-center items-center mb-2">
                <img src="/logo.png" alt="Instituto" className="w-12 h-12 mr-2" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800 uppercase">
                    Instituto Superior Técnico
                  </h2>
                  <p className="text-xs text-gray-500">
                    Luanda - Angola | NIF: 500002333
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Tel: (+244) 923-000-000 | Email: info@instituto.ao
              </p>
            </div>

            <h3 className="text-lg font-semibold text-center text-gray-700 mb-4 uppercase border-b border-gray-200 pb-2">
              Fatura de Matrícula
            </h3>

            {candidatoSelecionado ? (
              <div className="text-sm text-gray-700 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <span className="font-semibold">Nome:</span> {candidatoSelecionado.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Bilhete:</span> {candidatoSelecionado.bi}
                  </p>
                  <p>
                    <span className="font-semibold">Telefone:</span> {form.telefone}
                  </p>
                  <p>
                    <span className="font-semibold">Curso:</span> {cursoSelecionado?.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Turma:</span> {turmaSelecionada?.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Turno:</span> {candidatoSelecionado?.turno}
                  </p>
                  <p>
                    <span className="font-semibold">Ano:</span> {turmaSelecionada?.ano}
                  </p>
                  <p>
                    <span className="font-semibold">Sala:</span> {turmaSelecionada?.sala}
                  </p>
                  <p>
                    <span className="font-semibold">Classe:</span> {classeSeleciona?.classe}
                  </p>
                  <p>
                    <span className="font-semibold">Valor:</span>{" "}
                    {classeSeleciona
                      ? classeSeleciona.valor.toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "AOA",
                        })
                      : ""}
                  </p>
                  <p>
                    <span className="font-semibold">Data:</span> {new Date().toLocaleDateString()} • Hora:{" "}
                    {new Date().toLocaleTimeString("pt-PT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded-lg text-center font-semibold text-gray-800">
                  Referência:{" "}
                  <span className="text-blue-700">
                    REF-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>

                <div className="mt-8 text-gray-600 text-xs italic text-center">
                  * Documento gerado eletronicamente — válido sem assinatura *
                </div>

                <div className="mt-8 flex justify-between text-xs text-gray-500">
                  <p>Emitido por: Secretaria Acadêmica</p>
                  <p>Assinatura: ____________________</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic text-center mt-8">
                Preencha os dados à esquerda para gerar a fatura.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={imprimir}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-medium transition disabled:bg-gray-300"
          >
            🖨️ Imprimir Fatura
          </button>
        </div>
      </section>
    </main>
  );
}
