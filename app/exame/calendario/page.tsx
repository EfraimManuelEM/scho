import Nav from "@/components/nav"
import { Calendar, Clock, FileText, Users, CheckCircle, Award } from "lucide-react"

export default function Calendario() {
  const timelineEvents = [
    {
      date: "15 Jan - 15 Fev 2025",
      title: "Período de Inscrições",
      description:
        "Abertura das inscrições para o exame de acesso. Candidatos devem submeter documentação completa online.",
      icon: FileText,
      status: "upcoming",
    },
    {
      date: "20 Fev 2025",
      title: "Encerramento das Inscrições",
      description: "Data limite para submissão de candidaturas e pagamento de taxas.",
      icon: Clock,
      status: "upcoming",
    },
    {
      date: "25 Fev 2025",
      title: "Publicação da Lista de Candidatos",
      description: "Lista oficial de candidatos admitidos ao exame será publicada no portal.",
      icon: Users,
      status: "upcoming",
    },
    {
      date: "10 Mar 2025",
      title: "Realização do Exame Escrito",
      description: "Prova escrita nas instalações da escola. Duração: 3 horas.",
      icon: FileText,
      status: "upcoming",
    },
    {
      date: "15-20 Mar 2025",
      title: "Entrevistas Individuais",
      description: "Entrevistas com candidatos selecionados. Agendamento por email.",
      icon: Users,
      status: "upcoming",
    },
    {
      date: "25 Mar 2025",
      title: "Publicação dos Resultados Preliminares",
      description: "Resultados preliminares disponíveis no portal de consulta.",
      icon: CheckCircle,
      status: "upcoming",
    },
    {
      date: "26-28 Mar 2025",
      title: "Período de Recursos",
      description: "Candidatos podem submeter recursos contra os resultados.",
      icon: FileText,
      status: "upcoming",
    },
    {
      date: "5 Abr 2025",
      title: "Resultados Finais",
      description: "Publicação dos resultados finais e lista de candidatos aprovados.",
      icon: Award,
      status: "upcoming",
    },
  ]

  const importantDates = [
    { label: "Início das Inscrições", date: "15 Janeiro 2025" },
    { label: "Fim das Inscrições", date: "20 Fevereiro 2025" },
    { label: "Data do Exame", date: "10 Março 2025" },
    { label: "Resultados Finais", date: "5 Abril 2025" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Nav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              Calendário Académico
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Calendário do Exame de Acesso
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Acompanhe todas as datas importantes do processo de admissão. Não perca nenhum prazo crucial para sua
              candidatura.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Dates Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {importantDates.map((item, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-sm text-muted-foreground mb-2">{item.label}</div>
              <div className="text-xl font-bold text-primary">{item.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cronograma Completo</h2>
            <p className="text-lg text-muted-foreground">
              Todas as etapas do processo de admissão em ordem cronológica
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2" />

            {/* Timeline Events */}
            <div className="space-y-8">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                return (
                  <div key={index} className="relative flex items-start gap-6 md:gap-8">
                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? "md:pr-[calc(50%+3rem)]" : "md:pl-[calc(50%+3rem)]"}`}>
                      <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="text-sm font-semibold text-primary mb-2">{event.date}</div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Notas Importantes
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Todas as datas estão sujeitas a alterações. Consulte regularmente o portal oficial.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Os candidatos serão notificados por email sobre qualquer mudança no calendário.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>É responsabilidade do candidato verificar os prazos e cumprir todas as etapas.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Para mais informações, consulte o regulamento completo na página de informações.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para se candidatar?</h2>
          <p className="text-lg mb-8 opacity-90">Não perca os prazos. Inicie sua candidatura hoje mesmo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/informacoes"
              className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-background/90 transition-colors"
            >
              Ver Regulamento
            </a>
            <a
              href="/exame"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20"
            >
              Consultar Resultados
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
