"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement 
} from "chart.js";
import { 
  Pie, 
  Bar, 
  Line 
} from "react-chartjs-2";
import { LoaderCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface Curso {
  id: number;
  nome: string;
  codigo: string;
  duracao: string;
  departamento: string;
}

interface Candidato {
  id: string;
  nome: string;
  bi: string;
  genero: string;
  email: string;
  senha: string;
  telefone: string;
  telefone2: string;
  nomePai: string;
  nomeMae: string;
  turno: string;
  endereco: string;
  mediaFinal: string;
  cursoId: string;
  cursoNome?: string; // opcional se você incluir join com curso
}

interface Prova {
  id: string;
  createdAt: string;
  candidatoId: number;
  nota: number;
  status: "Aprovado" | "Reprovado" | "Segunda Fase";
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string; 
  departamento: string;
  dataEntrada: string;
}

interface Turma {
  id: number
  nome: string,
  cursoId: string,
  cursoNome?: string,
  ano: string,
  turno: string,
  sala: string,
  totalAlunos: number,
  createdAt: string,
}

interface Matricula {
  id: number;
  telefone: string; 
  candidatoId: string; 
  cursoId: string; 
  cursoNome: string; 
  candidatoNome: string; 
  candidatoBi: string; 
  candidatoEmail: string; 
  candidatoNascimento: string;
  candidatoTurno: string;
  turmaNome: string; 
  turmaId: string;
  createdAt: string;
}

interface Pagamento {
  id: number,
  tipo: string;
  valor: string;
  metodo: string;
  candidatoId: string;
  candidatoNome: string;
  matriculaId: string;
  createdAt: string;
}

export default function Admin() {
  const [curso, setCurso] = useState<Curso[]>([]);
  const [candidato, setCandidato] = useState<Candidato[]>([])
  const [prova, setProva] = useState<Prova[]>([])
  const [usuario, setUsuario] = useState<Usuario[]>([]);
  const [turma, setTurma] = useState<Turma[]>([]);
  const [matricula, setMatricula] = useState<Matricula[]>([]);
  const [pagamento, setPagamento] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true)
  const [verificandoLogin, setVerificandoLogin] = useState(true);

useEffect(() => {
  const carregarDados = async () => {
    try {
      setLoading(true);
      setVerificandoLogin(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 🔐 Verificar usuário logado
      const userRes = await axios.get(
        "http://localhost:3333/user",
        config
      );

      if (!userRes.data) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setVerificandoLogin(false);

      // 📦 Buscar todos os dados em paralelo
      const [
        cursoRes,
        candidatoRes,
        usuarioRes,
        turmaRes,
        matriculaRes,
        pagamentoRes
      ] = await Promise.all([
        axios.get("http://localhost:3333/curso", config),
        axios.get("http://localhost:3333/candidato", config),
        axios.get("http://localhost:3333/user", config),
        axios.get("http://localhost:3333/turma", config),
        axios.get("http://localhost:3333/matricula", config),
        axios.get("http://localhost:3333/pagamento", config),
      ]);

      setCurso(cursoRes.data);
      setCandidato(candidatoRes.data);
      setUsuario(usuarioRes.data);
      setTurma(turmaRes.data);
      setMatricula(matriculaRes.data);
      setPagamento(pagamentoRes.data);

    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    } finally {
      setLoading(false);
      setVerificandoLogin(false);
    }
  };

  carregarDados();
}, []);

  /* --- Dados para gráficos --- */
  const cursosLabels = curso.map(c => c.nome);
  const cursosValores = curso.map(c => parseInt(c.duracao) || 1); 

  const aprovado = prova.filter(u => u.status === "Aprovado").length;
  const reprovado = prova.filter(u => u.status === "Reprovado").length;
  const segunda = prova.filter(u => u.status === "Segunda Fase").length;
  const totalProvas = prova.length;

  const matriculaPorMes = matricula.reduce((acc, mat) => {
    const mes = new Date(mat.createdAt).getMonth();
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  const pagamentoPorMes = pagamento.reduce((acc, pag) =>{
    const mes = new Date(pag.createdAt).getMonth();
    acc[mes] = (acc[mes] || 0) + parseFloat(pag.valor);
    return acc;
  }, {} as { [key: number]: number })

   if (loading) {
     return (
       <div className="flex items-center text-balck justify-center h-screen bg-black/20">
         <p className=" text-2xl flex"><LoaderCircle size={35} className=" animate-spin mr-2" /> Carregando...</p>
       </div>
     );
   }

  if (verificandoLogin) {
    return <p className="p-10 text-center">Verificando se o usuário está logado...</p>;
  }

  return (
    <main className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
 
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Cabeçalho */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Painel do Administrador</h2>
          <p className="text-gray-500 text-sm">
            Bem-vindo ao painel de controle do sistema escolar.
          </p>
        </header>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Matrículas Feitas" value={String(matricula.length)} />
          <StatCard title="Turmas Criadas" value={String(turma.length)} />
          <StatCard title="Funcionário" value={String(usuario.length)} />
          <StatCard title="Total de Cursos" value={String(curso.length)} />
          <StatCard title="Total de Candidatos" value={String(candidato.length)} />
          <StatCard title="Pagamentos" value={String(pagamento.length)} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ChartCard title="Evolução de Pagamentos (Jan-Out)">
              <Line
                data={{
                  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                  datasets: [
                    {
                      label: "Pagamentos",
                      data: [
                        pagamentoPorMes[0] || 0,
                        pagamentoPorMes[1] || 0,
                        pagamentoPorMes[2] || 0,
                        pagamentoPorMes[3] || 0,
                        pagamentoPorMes[4] || 0,
                        pagamentoPorMes[5] || 0,
                        pagamentoPorMes[6] || 0,
                        pagamentoPorMes[7] || 0,
                        pagamentoPorMes[8] || 0,
                        pagamentoPorMes[9] || 0,
                        pagamentoPorMes[10] || 0,
                        pagamentoPorMes[11] || 0,
                      ],
                      borderColor: "#6366F1",
                      backgroundColor: "rgba(99,102,241,0.2)",
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointBackgroundColor: "#6366F1",
                    },
                  ],
                }}
              />
          </ChartCard>

          <ChartCard title="Matrículas, Turmas e Funcionários">
            <Bar
              data={{
                labels: ["Matrículas", "Turmas", "Funcionários"],
                datasets: [
                  {
                    label: "Quantidade",
                    data: [matricula.length, turma.length, usuario.length],
                    backgroundColor: ["#EF4444", "#3B82F6", "#FACC15"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ChartCard title="Evolução de Matrículas (Jan-Out)">
            <Line
              data={{
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out"],
                datasets: [
                  {
                    label: "Matrículas",
                    data: [matriculaPorMes[0] 
                          || 0, matriculaPorMes[1] 
                          || 0, matriculaPorMes[2] 
                          || 0, matriculaPorMes[3] 
                          || 0, matriculaPorMes[4] 
                          || 0, matriculaPorMes[5] 
                          || 0, matriculaPorMes[6] 
                          || 0, matriculaPorMes[7] 
                          || 0, matriculaPorMes[8] 
                          || 0, matriculaPorMes[9] || 0
                        ],
                    borderColor: "#EF4444",
                    backgroundColor: "#EF4444",
                    fill: false,
                    tension: 0.3,
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard title="Distribuição por Curso">
            <Pie
              data={{
                labels: cursosLabels,
                datasets: [
                  {
                    data: cursosValores,
                    backgroundColor: [
                      "#EF4444",
                      "#22C55E",
                      "#3B82F6",
                      "#FACC15",
                      "#8B5CF6",
                      "#10B981",
                      "#F97316",
                    ],
                  },
                ],
              }}
            />
          </ChartCard>
        </div>

      </div>
    </main>
  );
}

/* --- Componentes Auxiliares --- */
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 text-center hover:shadow-md transition">
      <h4 className="text-sm text-gray-500 font-medium mb-2">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4 text-gray-700">{title}</h3>
      {children}
    </div>
  );
}
