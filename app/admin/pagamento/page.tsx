"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Matricula {
  id: number;
  candidatoId: number;
  candidatoNome: string;
  cursoId: number;
  cursoNome: string;
  classeId: number;
  classeNome: string;
  classeValor: string;
}

interface Candidato {
  id: string;
  nome: string;
  cursoNome?: string;
}

export default function Pagamento() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagamentoSalvo, setPagamentoSalvo] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    matriculaId: "",
    candidatoId: "",
    tipo: "",
    valor: "",
    metodo: "",
    referencia: "",
  });

  const valoresFixos = [
    { tipo: "Multa", valor: "500000" },
    { tipo: "Recurso", valor: "400000" },
    { tipo: "Candidatura", valor: "450000" },
    { tipo: "Outros", valor: "550000" },
  ];

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMatricula = await axios.get("http://localhost:3333/matricula");
        const resCandidato = await axios.get("http://localhost:3333/candidato");

        setMatriculas(resMatricula.data);
        setCandidatos(resCandidato.data);
      } catch {
        toast.error("Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= SELECIONADOS ================= */

  const matriculaSelecionada = matriculas.find(
    (m) => m.id === Number(form.matriculaId)
  );

const candidatoSelecionado = candidatos.find(
  (c) => String(c.id) === String(form.candidatoId)
);

  /* ================= CALCULAR VALOR ================= */

  useEffect(() => {
    if (!form.tipo) {
      setForm((prev) => ({ ...prev, valor: "" }));
      return;
    }

    let valorFinal = "";

    if (form.tipo === "Propina") {
      if (matriculaSelecionada) {
        valorFinal = matriculaSelecionada.classeValor;
      }
    } else {
      const encontrado = valoresFixos.find((v) => v.tipo === form.tipo);
      valorFinal = encontrado?.valor || "";
    }

    setForm((prev) => ({
      ...prev,
      valor: valorFinal,
    }));
  }, [form.tipo, matriculaSelecionada]);

  /* ================= SELECIONAR ALUNO ================= */

 const handleSelectAluno = (value: string) => {
  if (!value) {
    setForm({
      matriculaId: "",
      candidatoId: "",
      tipo: "",
      valor: "",
      metodo: "",
      referencia: "",
    });
    return;
  }

  if (value.startsWith("m-")) {
    const id = value.replace("m-", "");
    setForm((prev) => ({
      ...prev,
      matriculaId: id,
      candidatoId: "",
    }));
  }

  if (value.startsWith("c-")) {
    const id = value.replace("c-", "");
    setForm((prev) => ({
      ...prev,
      candidatoId: id,
      matriculaId: "",
    }));
  }

  setPagamentoSalvo(false);
};

  /* ================= SALVAR ================= */

  const salvarPagamento = async () => {
    if (!form.tipo || !form.metodo || !form.valor) {
      toast.warning("Preencha todos os dados.");
      return;
    }

    try {
      await axios.post("http://localhost:3333/pagamento", {
        tipo: form.tipo,
        valor: form.valor,
        metodo: form.metodo,
        matriculaId: form.matriculaId || null,
        candidatoId: form.candidatoId || null,
      });

      toast.success("Pagamento salvo com sucesso!");
      setPagamentoSalvo(true);
    } catch {
      toast.error("Erro ao salvar pagamento.");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin mr-2" />
        Carregando...
      </div>
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <section className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Realizar Pagamento</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="bg-white p-6 rounded-xl border">

            <input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Pesquisar matrícula"
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <div> 
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome do Aluno(a) / Candidato(a)
              </label>
              <select
                value={
                  form.matriculaId
                    ? `m-${form.matriculaId}`
                    : form.candidatoId
                    ? `c-${form.candidatoId}`
                    : ""
                }
                onChange={(e) => handleSelectAluno(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              >
                <option value="">Selecione o aluno(a) / candidato(a)</option>

                {matriculas
                  .filter((m) =>
                    m.candidatoNome.toLowerCase().includes(pesquisa.toLowerCase())
                  )
                  .map((m) => (
                    <option key={`m-${m.id}`} value={`m-${m.id}`}>
                      {m.candidatoNome} - Aluno(a)
                    </option>
                  ))}

                {candidatos
                  .filter((c) =>
                    c.nome.toLowerCase().includes(pesquisa.toLowerCase())
                  )
                  .map((c) => (
                    <option key={`c-${c.id}`} value={`c-${c.id}`}>
                      {c.nome} - Candidato(a)
                    </option>
                  ))}
              </select>
              </div>

            {/* Classe */}
            <div> 
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Classe
              </label>
            <input
              type="text"
              value={matriculaSelecionada ? matriculaSelecionada.classeNome : ""}
              readOnly
              className="w-full border p-2 rounded bg-gray-100 mb-4"
            />
            </div>

            {/* Tipo */}
            <div> 
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tipo de Pagamento
              </label>
            <select
              value={form.tipo}
              onChange={(e) =>
                setForm({ ...form, tipo: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Tipo</option>
              {form.candidatoId === "" && <option value="Propina">Propina</option>}
              <option value="Multa">Multa</option>
              <option value="Recurso">Recurso</option>
              <option value="Candidatura">Candidatura</option>
              <option value="Outros">Outros</option>
            </select>
            </div>

            {/* Valor */}
            <div> 
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Valor (Kz)
              </label>
            <input
              type="text"
              value={Number(form.valor || 0).toLocaleString("pt-AO")}
              readOnly
              className="w-full border p-2 rounded bg-gray-100 mb-4"
            />
            </div>

            {/* Método */}
            <div> 
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Método de Pagamento
              </label>
            <select
              value={form.metodo}
              onChange={(e) =>
                setForm({ ...form, metodo: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Método</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferência">Transferência</option>
              <option value="Multicaixa">Multicaixa</option>
            </select>
            </div>
          </div>

          {/* FATURA (SEU LAYOUT ORIGINAL MANTIDO) */}
          <div ref={printRef} className="bg-white p-10 rounded-xl border text-gray-800">
            {matriculaSelecionada || candidatoSelecionado ? (
              <>
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Instituto Superior Técnico</h2>
                    <p className="text-sm text-gray-500">
                      Luanda – Angola
                      <br /> NIF: 500002333
                      <br /> Tel: +244 923 000 000
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p><strong>Fatura Nº:</strong> #{Date.now()}</p>
                    <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <h3 className="text-center text-xl font-semibold mb-6">
                  FATURA DE PAGAMENTO
                </h3>

                <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                  <div>
                    <p>
                      <strong>Aluno(a):</strong>{" "}
                      {matriculaSelecionada?.candidatoNome || candidatoSelecionado?.nome}
                    </p>
                    <p>
                      <strong>Curso:</strong>{" "}
                      {matriculaSelecionada?.cursoNome || candidatoSelecionado?.cursoNome}
                    </p>
                  </div>
                  <div>
                    <p><strong>Método:</strong> {form.metodo}</p>
                  </div>
                </div>

                <table className="w-full border text-sm mb-6">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Descrição</th>
                      <th className="border px-3 py-2 text-center">Tipo</th>
                      <th className="border px-3 py-2 text-right">Valor (Kz)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-3 py-2">
                        Pagamento referente ao serviço
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {form.tipo}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {Number(form.valor || 0).toLocaleString("pt-AO")}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end mb-6">
                  <div className="w-64 bg-gray-100 p-4 rounded-lg text-right">
                    <p className="text-sm">Total a Pagar</p>
                    <p className="text-2xl font-bold">
                      {Number(form.valor || 0).toLocaleString("pt-AO")} Kz
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 text-center text-xs text-gray-500">
                  Documento gerado eletronicamente — válido sem assinatura
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center">
                Selecione uma matrícula para visualizar a fatura
              </p>
            )}
          </div>
        </div>

        {/* BOTÕES */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={salvarPagamento}
            disabled={pagamentoSalvo}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            💾 Salvar Pagamento
          </button>

          <button
            onClick={imprimir}
            disabled={!pagamentoSalvo}
            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            🖨️ Imprimir Fatura
          </button>
        </div>
      </section>
    </main>
  );
}