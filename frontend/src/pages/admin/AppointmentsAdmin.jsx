import ResourceManager from '../../components/admin/ResourceManager'
import { api } from '../../lib/api'

const byName = (o) => o.name

export default function AppointmentsAdmin() {
  return (
    <ResourceManager
      title="Citas"
      subtitle="Reservas y agenda del estudio."
      resource={api.appointments}
      newLabel="Nueva cita"
      defaults={{ status: 'pendiente' }}
      filters={[
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: ['pendiente', 'confirmada', 'completada', 'cancelada'],
        },
        { key: 'photographer', label: 'Fotógrafo', type: 'select', fromData: true },
        { key: 'date', label: 'Fecha', type: 'date' },
      ]}
      columns={[
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'time', label: 'Hora' },
        { key: 'client_name', label: 'Cliente' },
        { key: 'photographer', label: 'Fotógrafo' },
        { key: 'session_type', label: 'Sesión' },
        { key: 'status', label: 'Estado', type: 'badge' },
      ]}
      fields={[
        {
          key: 'client_name',
          label: 'Cliente',
          required: true,
          type: 'autocomplete',
          source: api.clients,
          optionLabel: byName,
          fill: { client_phone: 'phone' },
          placeholder: 'Buscar cliente por nombre...',
        },
        { key: 'client_phone', label: 'Teléfono / WhatsApp', placeholder: 'Se completa al elegir cliente' },
        {
          key: 'photographer',
          label: 'Fotógrafo',
          type: 'autocomplete',
          source: api.photographers,
          optionLabel: byName,
          placeholder: 'Buscar fotógrafo por nombre...',
        },
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'time', label: 'Hora', type: 'time' },
        { key: 'duration', label: 'Duración', placeholder: '2 horas' },
        { key: 'session_type', label: 'Tipo de sesión', placeholder: 'Producto, retrato, video...' },
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          required: true,
          options: ['pendiente', 'confirmada', 'completada', 'cancelada'],
        },
        { key: 'notes', label: 'Notas', type: 'textarea', placeholder: 'Detalles de la reserva...' },
      ]}
    />
  )
}
