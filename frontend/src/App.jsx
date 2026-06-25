import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import PublicSite from './pages/PublicSite'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AppointmentsAdmin from './pages/admin/AppointmentsAdmin'
import ClientsAdmin from './pages/admin/ClientsAdmin'
import PhotographersAdmin from './pages/admin/PhotographersAdmin'
import SpacesAdmin from './pages/admin/SpacesAdmin'
import PaymentsAdmin from './pages/admin/PaymentsAdmin'

// Protege las rutas del panel
function Protected({ children }) {
  const { token, ready } = useAuth()
  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-stone-400">Cargando…</div>
  }
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="citas" element={<AppointmentsAdmin />} />
        <Route path="clientes" element={<ClientsAdmin />} />
        <Route path="fotografos" element={<PhotographersAdmin />} />
        <Route path="espacios" element={<SpacesAdmin />} />
        <Route path="pagos" element={<PaymentsAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
