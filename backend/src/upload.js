import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { requireAuth } from './auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, 'img-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|webp|jpg)/.test(file.mimetype)
    cb(ok ? null : new Error('Formato no permitido (usa JPG, PNG o WEBP).'), ok)
  },
})

const router = Router()

// POST /api/upload  (campo "file") -> { path: "uploads/xxx.jpg" }
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' })
  res.json({ path: 'uploads/' + req.file.filename })
})

export default router
