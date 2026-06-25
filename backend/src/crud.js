import { Router } from 'express'
import { pool } from './db.js'
import { requireAuth } from './auth.js'

// Fábrica de rutas CRUD para una tabla.
//  table     -> nombre de la tabla (controlado por nosotros, no por el usuario)
//  fields    -> columnas editables permitidas
//  publicList-> si true, expone GET / (solo registros con active = 1)
//  orderBy   -> orden (cadena fija y segura)
export function makeCrud({ table, fields, publicList = false, orderBy = 'id ASC' }) {
  const router = Router()

  const pick = (body = {}) => {
    const out = {}
    for (const f of fields) if (body[f] !== undefined) out[f] = body[f]
    if ('active' in out) out.active = out.active ? 1 : 0
    if ('sort_order' in out) out.sort_order = Number(out.sort_order) || 0
    if ('amount' in out) out.amount = out.amount === '' || out.amount == null ? null : Number(out.amount)
    return out
  }

  const cols = (obj) => Object.keys(obj).map((c) => `\`${c}\``)

  // ---- Público: solo activos ----
  if (publicList) {
    router.get('/', async (req, res) => {
      try {
        const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE active = 1 ORDER BY ${orderBy}`)
        res.json(rows)
      } catch (err) {
        console.error(`[${table}] public list:`, err.message)
        res.status(500).json({ error: 'Error del servidor.' })
      }
    })
  }

  // ---- Admin: listar todo ----
  router.get('/admin', requireAuth, async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` ORDER BY ${orderBy}`)
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: 'Error del servidor.' })
    }
  })

  // ---- Admin: crear ----
  router.post('/admin', requireAuth, async (req, res) => {
    const data = pick(req.body)
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Faltan datos.' })
    try {
      const c = cols(data)
      const ph = c.map(() => '?').join(', ')
      const [result] = await pool.query(
        `INSERT INTO \`${table}\` (${c.join(', ')}) VALUES (${ph})`,
        Object.values(data),
      )
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [result.insertId])
      res.status(201).json(rows[0])
    } catch (err) {
      console.error(`[${table}] create:`, err.message)
      res.status(500).json({ error: 'No se pudo crear el registro.' })
    }
  })

  // ---- Admin: actualizar ----
  router.put('/admin/:id', requireAuth, async (req, res) => {
    const data = pick(req.body)
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Nada que actualizar.' })
    try {
      const sets = cols(data).map((c) => `${c} = ?`).join(', ')
      await pool.query(`UPDATE \`${table}\` SET ${sets} WHERE id = ?`, [...Object.values(data), req.params.id])
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [req.params.id])
      if (!rows[0]) return res.status(404).json({ error: 'Registro no encontrado.' })
      res.json(rows[0])
    } catch (err) {
      console.error(`[${table}] update:`, err.message)
      res.status(500).json({ error: 'No se pudo actualizar.' })
    }
  })

  // ---- Admin: eliminar ----
  router.delete('/admin/:id', requireAuth, async (req, res) => {
    try {
      await pool.query(`DELETE FROM \`${table}\` WHERE id = ?`, [req.params.id])
      res.json({ ok: true })
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar.' })
    }
  })

  return router
}
