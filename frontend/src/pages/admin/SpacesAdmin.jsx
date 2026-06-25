import ResourceManager from '../../components/admin/ResourceManager'
import { api } from '../../lib/api'

export default function SpacesAdmin() {
  return (
    <ResourceManager
      title="Espacios"
      subtitle="Imágenes y textos de la sección “Espacios” de la página."
      resource={api.spaces}
      newLabel="Nuevo espacio"
      defaults={{ active: 1, sort_order: 0 }}
      columns={[
        { key: 'image', label: 'Imagen', type: 'image' },
        { key: 'title', label: 'Título' },
        { key: 'active', label: 'Estado', type: 'bool' },
      ]}
      fields={[
        { key: 'title', label: 'Título', required: true, placeholder: 'Set principal' },
        { key: 'image', label: 'Imagen', type: 'image' },
        { key: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Breve descripción del espacio' },
        { key: 'sort_order', label: 'Orden', type: 'number' },
        { key: 'active', label: 'Visible en la página', type: 'checkbox' },
      ]}
    />
  )
}
