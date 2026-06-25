import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { login, token, ready } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Si ya hay sesión, ir directo al panel
  useEffect(() => {
    if (ready && token) navigate('/admin', { replace: true })
  }, [ready, token, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username.trim(), form.password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex flex-col items-center gap-1">
          <span className="font-display text-4xl font-semibold leading-none tracking-tight text-charcoal">
            SW
          </span>
          <span className="font-display text-base font-semibold uppercase tracking-[0.22em] text-charcoal">
            Studio White
          </span>
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.35em] text-accent">
            Creative House
          </span>
        </Link>

        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-soft">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Lock size={20} />
            </span>
            <h1 className="font-display text-2xl font-medium text-stone-900">Panel de administración</h1>
            <p className="mt-1 text-sm text-stone-500">Inicia sesión para gestionar fotógrafos</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-stone-500 transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Volver a la página
        </Link>
      </div>
    </div>
  )
}
