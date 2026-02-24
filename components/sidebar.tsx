"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Users,
  LogOut,
  DollarSign,
  Briefcase,
  ClipboardList,
  BookOpen,
  LibraryBig,
  UsersRound,
  ListOrdered,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  // 🔐 Pega role do usuário logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setRole(parsed.role); // "ADMIN" ou "ASSISTENTE"
    }
  }, []);

  // Fecha automaticamente em telas pequenas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📌 ROTAS COM PERMISSÃO POR ITEM
  const routes = [
    {
      section: "Gestão Acadêmica",
      items: [
        {
          nome: "Candidatos",
          icone: <Users />,
          href: "/admin/list-cadidato",
          roles: ["ADMIN", "ASSISTENTE"],
        },
        {
          nome: "Cursos",
          icone: <BookOpen />,
          href: "/admin/add-curso",
          roles: ["ADMIN"], // ❌ Assistente NÃO vê
        },
        {
          nome: "Listar Cursos",
          icone: <LibraryBig />,
          href: "/admin/list-curso",
          roles: ["ADMIN", "ASSISTENTE"],
        },
        {
          nome: "Matrículas",
          icone: <FolderOpen />,
          href: "/admin/matricula",
          roles: ["ADMIN", "ASSISTENTE"],
        },
        {
          nome: "Listas de Matrículas",
          icone: <ClipboardList />,
          href: "/admin/list-matricula",
          roles: ["ADMIN", "ASSISTENTE"],
        },
        {
          nome: "Turmas",
          icone: <UsersRound />,
          href: "/admin/add-turma",
          roles: ["ADMIN", "ASSISTENTE"],
        },
        {
          nome: "Listar Turmas",
          icone: <ListOrdered />,
          href: "/admin/list-turma",
          roles: ["ADMIN", "ASSISTENTE"],
        },
      ],
    },
    {
      section: "Financeiro",
      items: [
        {
          nome: "Pagamentos",
          icone: <DollarSign />,
          href: "/admin/pagamento",
          roles: ["ADMIN", "ASSISTENTE"],
        },
        {
          nome: "Lista de Pagamentos",
          icone: <DollarSign />,
          href: "/admin/list-pagamento",
          roles: ["ADMIN", "ASSISTENTE"],
        },
      ],
    },
    {
      section: "Pessoal",
      items: [
        {
          nome: "Adicionar Funcionário",
          icone: <Briefcase />,
          href: "/admin/usuario",
          roles: ["ADMIN"], // ❌ Assistente NÃO vê
        },
        {
          nome: "Lista de Funcionário",
          icone: <Users />,
          href: "/admin/list-usuario",
          roles: ["ADMIN"],
        },
      ],
    },
  ];

  // 🎯 Detecta rota ativa
  const activeHref = (() => {
    if (!pathname) return undefined;
    const normalize = (p?: string) => (p ?? "").replace(/\/$/, "");
    const p = normalize(pathname);

    const items = routes.flatMap((r) => r.items);
    const exact = items.find((it) => normalize(it.href) === p);
    if (exact) return exact.href;

    const prefixMatches = items
      .map((it) => ({ ...it, hrefNorm: normalize(it.href) }))
      .filter((it) => p.startsWith(it.hrefNorm + "/"))
      .sort((a, b) => b.hrefNorm.length - a.hrefNorm.length);

    return prefixMatches[0]?.href;
  })();

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 shadow-md transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h1 className={`font-bold text-xl text-red-600 ${!open && "hidden"}`}>
          Administrador
        </h1>
        <button className="cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
        {routes.map((section, i) => {
          const allowedItems = section.items.filter((item) =>
            item.roles.includes(role || "")
          );

          if (allowedItems.length === 0) return null;

          return (
            <div key={i}>
              {open && (
                <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
                  {section.section}
                </h2>
              )}

              <div className="space-y-1">
                {allowedItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    open={open}
                    icon={item.icone}
                    label={item.nome}
                    href={item.href}
                    active={item.href === activeHref}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-gray-200 p-4">
        <SidebarItem open={open} icon={<LogOut />} label="Sair" href="/login" />
      </div>
    </aside>
  );
}

/* 🔹 COMPONENTE ITEM */
function SidebarItem({
  icon,
  label,
  active = false,
  open,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  open: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href ?? "#"}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
        ${
          active
            ? "bg-red-500 text-white shadow-sm"
            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
        }`}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="font-medium">{label}</span>}
    </Link>
  );
}