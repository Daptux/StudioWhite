import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { signToken, requireAuth } from '../auth.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ? LIMIT 1', [username])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' })

    const token = signToken({ id: user.id, username: user.username })
    res.json({ token, user: { username: user.username } })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Error del servidor.' })
  }
})

// GET /api/auth/me  -> verifica sesión
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.user.username } })
})

export default router
