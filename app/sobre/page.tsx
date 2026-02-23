import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Sobre() {
  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen w-full text-gray-800">
      <Navbar />

      {/* 🌟 HERO */}
      <section className="relative flex flex-col items-center justify-center text-center pt-32 pb-16 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-500 drop-shadow-sm mb-4">
          Sobre Nós
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Conheça a nossa trajetória, missão e compromisso com a educação em tecnologia.
        </p>
      </section>

      {/* 🧭 CONTEÚDO PRINCIPAL */}
      <section className="flex flex-col items-center justify-center px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col gap-8">
            {/* Nossa História */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
              <h2 className="text-3xl font-bold mb-3 text-red-500">
                Nossa História
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                Fundada com o propósito de transformar vidas por meio da educação
                em tecnologia, nossa escola nasceu do sonho de criar oportunidades
                para todos. Ao longo dos anos, capacitamos centenas de alunos a
                ingressar no mercado de trabalho e a realizar seus projetos
                pessoais, sempre com foco em qualidade, inovação e inclusão.
              </p>
            </div>

            {/* Missão & Valores */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
              <h2 className="text-3xl font-bold mb-3 text-red-500">
                Missão & Valores
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                Nossa missão é democratizar o acesso ao ensino de programação,
                promovendo inclusão, inovação e excelência. Valorizamos o respeito,
                a ética, a colaboração e o aprendizado contínuo. Acreditamos que o
                conhecimento é a ferramenta mais poderosa para transformar o futuro.
              </p>
            </div>

            {/* Contacto */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
              <h2 className="text-3xl font-bold mb-3 text-red-500">Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Email:</strong> contato@escoladeprogramacao.com<br />
                <strong>Telefone:</strong> (99) 99999-9999
              </p>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="flex flex-col gap-8 justify-between">
            {/* Localização */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-3 text-red-500">Localização</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Rua da Programação, 123 - Centro<br />
                Cidade Exemplo - País
              </p>

              <div className="flex-1 w-full h-72 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                <iframe
                  title="Mapa da Escola"
                  src="https://www.google.com/maps?q=-23.55052,-46.633308&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "100%" }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
