import ResourceManager from '../../components/admin/ResourceManager'
import { api } from '../../lib/api'

const byName = (o) => o.name

// "Nuevo pago" parte de una cita completada que aún no tiene pago.
const createFrom = {
  title: 'Elige una cita completada sin pagar',
  emptyText: 'No hay citas completadas pendientes de pago.',
  blankLabel: 'Pago libre (sin cita)',
  fetch: async (token) => {
    const [appts, pays] = await Promise.all([api.appointments.list(token), api.payments.list(token)])
    const paidIds = new Set(pays.map((p) => p.appointment_id).filter(Boolean))
    return appts.filter((a) => a.status === 'completada' && !paidIds.has(a.id))
  },
  label: (a) =>
    [a.client_name, a.photographer, a.session_type, (a.date || '').slice(0, 10)].filter(Boolean).join(' · '),
  toForm: (a) => ({
    client_name: a.client_name,
    photographer: a.photographer || '',
    appointment_id: a.id,
    concept: a.session_type || 'Alquiler de estudio',
    date: (a.date || '').slice(0, 10),
  }),
}

export default function PaymentsAdmin() {
  return (
    <ResourceManager
      title="Pagos"
      subtitle="Pagos por el uso del estudio."
      resource={api.payments}
      newLabel="Nuevo pago"
      createFrom={createFrom}
      defaults={{ status: 'pagado', method: 'Efectivo' }}
      filters={[
        { key: 'method', label: 'Método', type: 'select', options: ['Efectivo', 'Transferencia', 'Tarjeta', 'Otro'] },
        { key: 'photographer', label: 'Fotógrafo', type: 'select', fromData: true },
        { key: 'date', label: 'Fecha', type: 'date' },
      ]}
      columns={[
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'client_name', label: 'Cliente' },
        { key: 'photographer', label: 'Fotógrafo' },
        { key: 'concept', label: 'Concepto' },
        { key: 'amount', label: 'Monto', type: 'money' },
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
          placeholder: 'Buscar cliente por nombre...',
        },
        {
          key: 'photographer',
          label: 'Fotógrafo',
          type: 'autocomplete',
          source: api.photographers,
          optionLabel: byName,
          placeholder: 'Buscar fotógrafo por nombre...',
        },
        { key: 'concept', label: 'Concepto', placeholder: 'Alquiler 2 horas' },
        { key: 'amount', label: 'Monto (COP)', type: 'number', placeholder: '80000' },
        { key: 'method', label: 'Método', type: 'select', options: ['Efectivo', 'Transferencia', 'Tarjeta', 'Otro'] },
        { key: 'status', label: 'Estado', type: 'select', required: true, options: ['pagado', 'pendiente'] },
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'notes', label: 'Notas', type: 'textarea', placeholder: 'Observaciones...' },
      ]}
    />
  )
}
