"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    {name: 'Início', path: '/'},
    {name: 'Cursos', path: '/curso'},
    {name: 'Sobre', path: '/sobre'},
    {name: "Candidatura", path: "/exame/candidatura"},
  ]

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">ESCOLA</p>
          </Link>

          {/* Menu Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.path ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/login">
              <button className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-3 border-t border-border">
            {links.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleLinkClick}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  pathname === item.path
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/exame" onClick={handleLinkClick}>
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium">
                Exame de Acesso
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
