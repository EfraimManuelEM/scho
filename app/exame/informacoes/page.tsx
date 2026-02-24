import Nav from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, FileText, GraduationCap, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function Informacoes() {
const courses = [
    {
    name: "Ciências e Tecnologias",
    duration: "3 anos",
    vacancies: 120,
    description: "Formação científica e tecnológica com foco em Matemática, Física, Química e Biologia.",
    },
    {
    name: "Ciências Socioeconómicas",
    duration: "3 anos",
    vacancies: 90,
    description: "Preparação em Economia, Gestão e Ciências Sociais para futuros profissionais.",
    },
    {
    name: "Línguas e Humanidades",
    duration: "3 anos",
    vacancies: 80,
    description: "Estudo aprofundado de línguas, literatura, história e filosofia.",
    },
    {
    name: "Artes Visuais",
    duration: "3 anos",
    vacancies: 60,
    description: "Desenvolvimento de competências artísticas e criativas em diversas áreas.",
    },
]

const regulations = [
    {
    title: "Requisitos de Candidatura",
    items: [
        "Ter concluído o 9º ano de escolaridade",
        "Idade mínima de 14 anos no ano de ingresso",
        "Apresentar documentação completa até a data limite",
    ],
    },
    {
    title: "Processo de Seleção",
    items: [
        "Prova escrita de Português (50 pontos)",
        "Prova escrita de Matemática (50 pontos)",
        "Classificação final do 9º ano (peso de 40%)",
        "Nota mínima de aprovação: 9,5 valores",
    ],
    },
    {
    title: "Documentação Necessária",
    items: [
        "Certificado de habilitações do 9º ano",
        "Documento de identificação válido",
        "2 fotografias tipo passe",
        "Comprovativo de pagamento da taxa de inscrição",
    ],
    },
    {
    title: "Datas Importantes",
    items: [
        "Inscrições: 1 a 30 de Junho",
        "Realização do exame: 15 de Julho",
        "Publicação de resultados: 25 de Julho",
        "Matrícula: 1 a 10 de Agosto",
    ],
    },
]

return (
    <main className="min-h-screen bg-background">
    <Nav />

      {/* Hero Section */}
    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4">
            <Badge className="mb-2" variant="secondary">
            Ano Letivo 2025/2026
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Exame de Acesso</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Informações completas sobre o processo de candidatura, regulamento e cursos disponíveis
            </p>
        </div>
        </div>
    </section>

      {/* Regulations Section */}
    <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Regulamento</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {regulations.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {index === 0 && <Users className="h-5 w-5 text-primary" />}
                    {index === 1 && <BookOpen className="h-5 w-5 text-primary" />}
                    {index === 2 && <FileText className="h-5 w-5 text-primary" />}
                    {index === 3 && <Calendar className="h-5 w-5 text-primary" />}
                    {section.title}
                </CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{item}</span>
                    </li>
                    ))}
                </ul>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </section>

      {/* Courses Section */}
    <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Cursos Disponíveis</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                        Duração: <strong className="text-foreground">{course.duration}</strong>
                    </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                        Vagas: <strong className="text-foreground">{course.vacancies}</strong>
                    </span>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </section>

      {/* CTA Section */}
    <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
        <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Pronto para se candidatar?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-base">
                Não perca os prazos de inscrição. Prepare-se para o seu futuro académico.
            </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
            <Link
                href="/exame"
                className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 font-semibold hover:bg-background/90 transition-colors"
            >
                Consultar Resultados
            </Link>
            </CardContent>
        </Card>
        </div>
    </section>
    </main>
)
}
