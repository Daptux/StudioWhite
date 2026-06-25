import ResourceManager from '../../components/admin/ResourceManager'
import { api } from '../../lib/api'

export default function PhotographersAdmin() {
  return (
    <ResourceManager
      title="Fotógrafos"
      subtitle="Profesionales que se muestran en la página."
      resource={api.photographers}
      newLabel="Nuevo fotógrafo"
      defaults={{ active: 1, sort_order: 0 }}
      columns={[
        { key: 'photo', label: 'Foto', type: 'image' },
        { key: 'name', label: 'Nombre' },
        { key: 'specialty', label: 'Especialidad' },
        { key: 'price', label: 'Precio' },
        { key: 'active', label: 'Estado', type: 'bool' },
      ]}
      fields={[
        { key: 'name', label: 'Nombre', required: true, placeholder: 'Nombre completo' },
        { key: 'photo', label: 'Foto', type: 'image' },
        { key: 'specialty', label: 'Especialidad', placeholder: 'Retrato y producto' },
        { key: 'price', label: 'Precio', placeholder: 'Desde $90.000 / sesión' },
        { key: 'phone', label: 'WhatsApp / Teléfono', placeholder: '573001234567' },
        { key: 'email', label: 'Correo', type: 'email', placeholder: 'correo@ejemplo.com' },
        { key: 'schedule', label: 'Horarios', placeholder: 'Lun-Vie 9am - 6pm' },
        { key: 'instagram', label: 'Instagram (URL)', placeholder: 'https://instagram.com/usuario' },
        { key: 'sort_order', label: 'Orden', type: 'number' },
        { key: 'active', label: 'Visible en la página', type: 'checkbox' },
      ]}
    />
  )
}
