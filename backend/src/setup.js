// ============================================================
//  Setup: crea la base de datos, las tablas y el admin por defecto.
//  Uso:  npm run setup   (dentro de backend/)
// ============================================================
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql')

async function main() {
  const schema = fs.readFileSync(schemaPath, 'utf8')

  // 1) Conexión sin base de datos (para poder crearla) con multiples sentencias
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  })

  console.log('→ Ejecutando schema.sql ...')
  await conn.query(schema) // crea DB, tablas y datos de ejemplo

  // 2) Crear / actualizar el admin por defecto
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'studiowhite2026'
  const hash = await bcrypt.hash(password, 10)

  const dbName = process.env.DB_NAME || 'studio_white'
  await conn.query('USE ' + dbName)
  await conn.query(
    `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, hash],
  )

  // Migraciones suaves: agrega columnas nuevas si faltan (para BD ya existentes)
  const ensureColumn = async (table, column, definition) => {
    const [[{ c }]] = await conn.query(
      `SELECT COUNT(*) AS c FROM information_schema.columns
       WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
      [dbName, table, column],
    )
    if (c === 0) {
      await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN ${definition}`)
      console.log(`  · Columna ${table}.${column} agregada`)
    }
  }
  await ensureColumn('payments', 'photographer', 'photographer VARCHAR(150) DEFAULT NULL AFTER client_name')
  await ensureColumn('appointments', 'photographer', 'photographer VARCHAR(150) DEFAULT NULL AFTER client_phone')
  await ensureColumn('payments', 'appointment_id', 'appointment_id INT DEFAULT NULL AFTER photographer')

  // 3) Sembrar espacios (solo si la tabla está vacía)
  const [[{ c: spacesCount }]] = await conn.query('SELECT COUNT(*) AS c FROM spaces')
  if (spacesCount === 0) {
    const spaces = [
      ['Set principal', 'Amplio y versátil, listo para cualquier sesión de foto o video.', 'img/studio-1.jpg', 1],
      ['Fondo infinito', 'Ciclorama blanco continuo para fotos limpias y de producto.', 'img/studio-2.jpg', 2],
      ['Maquillaje y vestidor', 'Zona privada para alistarte y cambiar de looks con comodidad.', 'img/studio-3.jpg', 3],
      ['Fotografía de producto', 'Iluminación controlada y fondos neutros para destacar tu producto.', 'img/gallery-1.jpg', 4],
      ['Contenido y video', 'Espacio flexible para reels, TikToks y producciones audiovisuales.', 'img/gallery-2.jpg', 5],
      ['Zona de espera', 'Un área cómoda para tu equipo o para organizar la producción.', 'img/gallery-3.jpg', 6],
    ]
    await conn.query(
      'INSERT INTO spaces (title, description, image, sort_order) VALUES ?',
      [spaces.map((s) => [s[0], s[1], s[2], s[3]])],
    )
    console.log('  · Espacios de ejemplo creados')
  }

  // 4) Sembrar fotógrafos de ejemplo (solo si la tabla está vacía)
  const [[{ c: photogCount }]] = await conn.query('SELECT COUNT(*) AS c FROM photographers')
  if (photogCount === 0) {
    await conn.query(
      `INSERT INTO photographers (name, email, phone, specialty, schedule, price, instagram, active, sort_order) VALUES
       ('Laura Gómez', 'laura@studiowhite.com', '573001112233', 'Retrato y marca personal', 'Lun-Vie 9:00am - 6:00pm', 'Desde $90.000 / sesión', 'https://instagram.com/', 1, 1),
       ('Andrés Ríos', 'andres@studiowhite.com', '573004445566', 'Producto y e-commerce', 'Mar-Sáb 10:00am - 7:00pm', 'Desde $120.000 / sesión', 'https://instagram.com/', 1, 2)`,
    )
    console.log('  · Fotógrafos de ejemplo creados')
  }

  await conn.end()

  console.log('\n✓ Base de datos lista.')
  console.log(`✓ Admin: usuario "${username}"  /  contraseña "${password}"`)
  console.log('  (cámbialos en backend/.env y vuelve a correr "npm run setup" si quieres)\n')
}

main().catch((err) => {
  console.error('\n✗ Error en el setup:', err.message)
  console.error('  Verifica que MySQL (XAMPP) esté encendido y los datos de backend/.env.\n')
  process.exit(1)
})
