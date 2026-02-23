"use client"

import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const navigation = [
    { name: "Home", path: "/" },
    { name: "Cursos", path: "/curso" },
    { name: "Sobre", path: "/sobre" },
    { name: "Exame de Acesso", path: "/exame" },
    { name: "Alunos", path: "/aluno" },
    { name: "Login", path: "/login" },
  ]

  const about = [
    { name: "Nossa História", path: "/sobre#historia" },
    { name: "Missão & Valores", path: "/sobre#missao" },
    { name: "Calendário", path: "/calendario" },
    { name: "Informações", path: "/informacoes" },
  ]

  const contact = [
    { icon: <Mail className="w-4 h-4" />, text: "contato@escola.ao", href: "mailto:contato@escola.ao" },
    { icon: <Phone className="w-4 h-4" />, text: "+244 923 456 789", href: "tel:+244923456789" },
    { icon: <MapPin className="w-4 h-4" />, text: "Luanda, Angola", href: "#" },
  ]

  const socialMedia = [
    { name: "Facebook", path: "https://facebook.com", icon: <Facebook className="w-5 h-5" /> },
    { name: "Instagram", path: "https://instagram.com", icon: <Instagram className="w-5 h-5" /> },
    { name: "Twitter", path: "https://twitter.com", icon: <Twitter className="w-5 h-5" /> },
    { name: "LinkedIn", path: "https://linkedin.com", icon: <Linkedin className="w-5 h-5" /> },
  ]

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-white font-serif hover:text-primary transition-colors">LOGO</h2>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Formando os profissionais do futuro com excelência e dedicação.
            </p>
            <div className="flex gap-3 pt-2">
              {socialMedia.map((item, i) => (
                <a
                  key={i}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-900 rounded-lg"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navegação</h3>
            <ul className="space-y-3">
              {navigation.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.path}
                    className="text-sm text-gray-400 hover:text-primary transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Sobre Nós</h3>
            <ul className="space-y-3">
              {about.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.path}
                    className="text-sm text-gray-400 hover:text-primary transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-3">
              {contact.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-gray-500 group-hover:text-primary transition-colors">{item.icon}</span>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Escola. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacidade" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
