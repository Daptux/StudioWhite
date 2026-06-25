import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Users, Camera, CreditCard, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { api } from '../../lib/api'

const money = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v || 0))

export default function Dashboard() {
  const { token } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all([
      api.appointments.list(token),
      api.clients.list(token),
      api.payments.list(token),
      api.photographers.list(token),
    ])
      .then(([appointments, clients, payments, photographers]) => {
        if (alive) setData({ appointments, clients, payments, photographers })
      })
      .catch(() => alive && setData({ appointments: [], clients: [], payments: [], photographers: [] }))
    return () => {
      alive = false
    }
  }, [token])

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20 text-stone-400">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const pendientes = data.appointments.filter((a) => a.status === 'pendiente').length
  const totalPagado = data.payments.filter((p) => p.status === 'pagado').reduce((s, p) => s + Number(p.amount || 0), 0)
  const activos = data.photographers.filter((p) => p.active).length

  const today = new Date().toISOString().slice(0, 10)
  const proximas = data.appointments
    .filter((a) => a.status !== 'cancelada' && (a.date || '').slice(0, 10) >= today)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 5)

  const stats = [
    { label: 'Citas pendientes', value: pendientes, icon: CalendarDays, to: '/admin/citas' },
    { label: 'Clientes', value: data.clients.length, icon: Users, to: '/admin/clientes' },
    { label: 'Fotógrafos activos', value: activos, icon: Camera, to: '/admin/fotografos' },
    { label: 'Total cobrado', value: money(totalPagado), icon: CreditCard, to: '/admin/pagos' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-stone-900">Resumen</h1>
        <p className="mt-1 text-sm text-stone-500">Una mirada rápida a tu estudio.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-soft"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon size={20} />
            </span>
            <p className="mt-4 font-display text-3xl font-medium text-stone-900">{value}</p>
            <p className="mt-0.5 text-sm text-stone-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-display text-xl font-medium text-stone-900">Próximas citas</h2>
          <Link to="/admin/citas" className="flex items-center gap-1 text-sm text-accent hover:underline">
            Ver todas <ArrowRight size={15} />
          </Link>
        </div>
        {proximas.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-stone-400">No hay citas próximas.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {proximas.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-medium text-stone-900">{a.client_name}</p>
                  <p className="text-sm text-stone-500">
                    {(a.date || '').slice(0, 10)} {a.time ? `· ${a.time}` : ''} {a.session_type ? `· ${a.session_type}` : ''}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${
                    a.status === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
