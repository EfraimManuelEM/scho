"use client"

import Sidebar from "@/components/sidebar"
import { useState } from "react"
import { BookOpen, LoaderCircle, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"

interface CursoForm {
  nome: string
  codigo: string
  duracao: string
  departamento: string
  descricao: string
  ativo: boolean
  image: File | null
}

export default function AddCurso() {
  const [form, setForm] = useState<CursoForm>({
    nome: "",
    codigo: "",
    duracao: "",
    departamento: "",
    descricao: "",
    ativo: true,
    image: null,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  /* ===============================
     HANDLE CHANGE (INPUT + TEXTAREA)
  =============================== */
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target
  setForm((prev) => ({ ...prev, [name]: value }))
}

const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => 
  { 
    const { name, value } = e.target; 
    // Input de arquivo

    if (name === "image" && e.target.files && e.target.files[0]) 
      { 
        setForm((prev) => ({ ...prev, image: e.target.files![0] 

        })); 
      } else { 
        setForm((prev) => ({ ...prev, [name]: value })); 
      } 
    };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("nome", form.nome)
      formData.append("codigo", form.codigo)
      formData.append("duracao", form.duracao)
      formData.append("departamento", form.departamento)
      formData.append("descricao", form.descricao)

      if (form.image) {
        formData.append("image", form.image)
      }

      await axios.post("http://localhost:3333/curso", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Curso criado com sucesso!")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar o curso.")
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="flex items-center text-xl">
          <LoaderCircle className="animate-spin mr-2" size={32} />
          Carregando...
        </p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <section className="flex-1 p-8 overflow-y-auto">
        {/* Cabeçalho */}
        <header className="mb-10 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Adicionar Curso</h1>
        </header>

        {/* Formulário */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 max-w-3xl mx-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Imagem */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Imagem do Curso</h2>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChangeFile}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Campos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome do Curso *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Código *
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Duração
                </label>
                <input
                  type="number"
                  name="duracao"
                  value={form.duracao}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Departamento
                </label>
                <input
                  type="text"
                  name="departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Botão */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {loading ? "Salvando..." : <>Salvar Curso <Save size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
