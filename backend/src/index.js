import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import uploadRoutes from './upload.js'
import { makeCrud } from './crud.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT) || 4000

const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim())
app.use(cors({ origin: origins.includes('*') ? true : origins }))
app.use(express.json())

// Archivos subidos (fotos de fotógrafos / espacios)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Autenticación y subida de imágenes
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)

// Recursos (CRUD)
app.use(
  '/api/photographers',
  makeCrud({
    table: 'photographers',
    fields: ['name', 'email', 'phone', 'specialty', 'schedule', 'price', 'instagram', 'photo', 'active', 'sort_order'],
    publicList: true,
    orderBy: 'sort_order ASC, id ASC',
  }),
)

app.use(
  '/api/spaces',
  makeCrud({
    table: 'spaces',
    fields: ['title', 'description', 'image', 'active', 'sort_order'],
    publicList: true,
    orderBy: 'sort_order ASC, id ASC',
  }),
)

app.use(
  '/api/clients',
  makeCrud({
    table: 'clients',
    fields: ['name', 'phone', 'email', 'notes'],
    orderBy: 'name ASC',
  }),
)

app.use(
  '/api/appointments',
  makeCrud({
    table: 'appointments',
    fields: ['client_name', 'client_phone', 'photographer', 'date', 'time', 'duration', 'session_type', 'status', 'notes'],
    orderBy: '`date` DESC, id DESC',
  }),
)

app.use(
  '/api/payments',
  makeCrud({
    table: 'payments',
    fields: ['client_name', 'photographer', 'appointment_id', 'concept', 'amount', 'method', 'status', 'date', 'notes'],
    orderBy: '`date` DESC, id DESC',
  }),
)

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'studio-white-api' }))

// Manejo de errores (incluye multer: tamaño/formato)
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || 'Error del servidor.' })
  next()
})

app.listen(PORT, () => {
  console.log(`✓ API Studio White en http://localhost:${PORT}`)
})
