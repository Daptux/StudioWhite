// Cliente de la API. En desarrollo API_BASE queda vacío y se usa el proxy de Vite.
const API_BASE = import.meta.env.VITE_API_URL || ''

// Convierte una ruta de imagen en URL usable.
//  - "uploads/..."  -> sirve del backend (usa API_BASE en producción)
//  - "img/..."      -> asset estático del frontend (raíz del sitio)
//  - URL http(s)    -> tal cual
export function assetUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  const clean = p.replace(/^\//, '')
  if (clean.startsWith('uploads/')) return `${API_BASE}/${clean}`
  return `/${clean}`
}

async function request(path, { method = 'GET', body, token, isForm } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (isForm) {
    payload = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Ocurrió un error.')
  return data
}

// Genera los métodos CRUD para un recurso (/api/<name>)
function resource(name) {
  return {
    listPublic: () => request(`/api/${name}`),
    list: (token) => request(`/api/${name}/admin`, { token }),
    create: (token, data) => request(`/api/${name}/admin`, { method: 'POST', body: data, token }),
    update: (token, id, data) => request(`/api/${name}/admin/${id}`, { method: 'PUT', body: data, token }),
    remove: (token, id) => request(`/api/${name}/admin/${id}`, { method: 'DELETE', token }),
  }
}

export const api = {
  login: (username, password) => request('/api/auth/login', { method: 'POST', body: { username, password } }),
  me: (token) => request('/api/auth/me', { token }),

  photographers: resource('photographers'),
  spaces: resource('spaces'),
  clients: resource('clients'),
  appointments: resource('appointments'),
  payments: resource('payments'),

  upload: (token, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return request('/api/upload', { method: 'POST', body: fd, token, isForm: true })
  },
}
