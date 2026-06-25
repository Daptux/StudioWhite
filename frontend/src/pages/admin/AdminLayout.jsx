import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Camera,
  Image as ImageIcon,
  CreditCard,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../lib/auth'

const NAV = [
  { to: '/admin', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/admin/citas', label: 'Citas', icon: CalendarDays },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/fotografos', label: 'Fotógrafos', icon: Camera },
  { to: '/admin/espacios', label: 'Espacios', icon: ImageIcon },
  { to: '/admin/pagos', label: 'Pagos', icon: CreditCard },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-900 text-stone-900">
          <Camera size={15} strokeWidth={1.8} />
        </span>
        <span className="font-display text-xl font-semibold leading-none text-stone-900">
          Studio<span className="italic text-accent"> White</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.7} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-stone-200 px-3 py-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <ArrowLeft size={18} strokeWidth={1.7} />
          Volver a la página
        </Link>
        <button
          type="button"
          onClick={doLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} strokeWidth={1.7} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar fijo (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-stone-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil (drawer) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-stone-200 bg-white">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <div className="lg:pl-64">
        {/* Top bar móvil */}
        <div className="flex items-center gap-3 border-b border-stone-200 bg-white px-5 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-900 hover:bg-stone-100"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <span className="font-display text-lg font-semibold text-stone-900">
            Studio<span className="italic text-accent"> White</span>
          </span>
        </div>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
