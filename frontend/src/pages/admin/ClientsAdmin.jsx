import ResourceManager from '../../components/admin/ResourceManager'
import { api } from '../../lib/api'

export default function ClientsAdmin() {
  return (
    <ResourceManager
      title="Clientes"
      subtitle="Directorio de clientes del estudio."
      resource={api.clients}
      newLabel="Nuevo cliente"
      columns={[
        { key: 'name', label: 'Nombre' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'email', label: 'Correo' },
        { key: 'notes', label: 'Notas' },
      ]}
      fields={[
        { key: 'name', label: 'Nombre', required: true, placeholder: 'Nombre del cliente' },
        { key: 'phone', label: 'Teléfono / WhatsApp', placeholder: '573001234567' },
        { key: 'email', label: 'Correo', type: 'email', placeholder: 'correo@ejemplo.com' },
        { key: 'notes', label: 'Notas', type: 'textarea', placeholder: 'Información adicional...' },
      ]}
    />
  )
}
