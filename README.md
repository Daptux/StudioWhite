# Studio White — Sitio + Panel de Administración

Proyecto dividido en 3 partes para un despliegue limpio:

```
EstudioFotografico/
├── frontend/    → Sitio web (React + Vite + Tailwind) y panel admin (/login, /admin)
├── backend/     → API (Node.js + Express + MySQL): auth y fotógrafos
└── database/    → Esquema SQL (schema.sql)
```

- **Sitio público:** landing del estudio + sección "Fotógrafos disponibles".
- **Panel admin** (solo el dueño) con **sidebar** y secciones:
  - **Resumen**: estadísticas (citas pendientes, clientes, fotógrafos activos, total cobrado) y próximas citas.
  - **Citas**: agenda/reservas del estudio (fecha, hora, cliente, tipo, estado).
  - **Clientes**: directorio de clientes.
  - **Fotógrafos**: crear/editar/eliminar con foto, mostrar/ocultar.
  - **Espacios**: editar imágenes y textos de la sección "Espacios" de la web.
  - **Pagos**: pagos por el uso del estudio (monto, método, estado).
  - Botones de **iniciar/cerrar sesión** y **volver a la página**.

---

## 1. Requisitos

- **Node.js 18+**
- **XAMPP** con **MySQL encendido** (Apache no es necesario para desarrollar).

## 2. Instalación (una sola vez)

Desde la carpeta raíz del proyecto:

```bash
npm run install:all     # instala backend + frontend
npm run setup           # crea la base de datos, tablas y el admin por defecto
```

> `npm run setup` lee `backend/.env`. Por defecto usa MySQL de XAMPP
> (host 127.0.0.1, usuario `root`, sin contraseña, base `studio_white`).

**Acceso al panel por defecto:**
- Usuario: `admin`
- Contraseña: `studiowhite2026`

(Para cambiarlos: edita `backend/.env` y vuelve a correr `npm run setup`.)

## 3. Desarrollo

```bash
npm run dev
```

Esto levanta **las dos partes a la vez**:
- Frontend: http://localhost:5173
- Backend (API): http://localhost:4000

Rutas del sitio:
- `/` → página pública
- `/login` → inicio de sesión del panel
- `/admin` → panel (requiere sesión)

> En desarrollo, el frontend habla con el backend a través del *proxy* de Vite,
> así que no hay problemas de CORS.

## 4. Compilar el frontend

```bash
npm run build
```

Genera `frontend/dist/` (el sitio estático listo para subir).

---

## 5. Despliegue

Son **dos despliegues** (frontend estático + backend Node) y **una base de datos MySQL**.

### A) Base de datos (MySQL en Hostinger)
1. Crea una base de datos MySQL en el panel de Hostinger.
2. Importa `database/schema.sql` desde phpMyAdmin.
3. Crea el admin: ejecuta el `setup` apuntando a esa base, **o** inserta
   manualmente un registro en `admin_users` con la contraseña hasheada (bcrypt).

### B) Backend (Node.js)
- Súbelo a un hosting con Node (Hostinger "Node.js app", VPS, Render, Railway, etc.).
- Configura las variables de entorno (ver `backend/.env.example`): datos de la BD,
  `JWT_SECRET` (uno largo y aleatorio) y `CORS_ORIGIN` con el dominio del sitio.
- Comando de arranque: `npm start`.

### C) Frontend (estático → Hostinger `public_html`)
1. Si el backend queda en **otro dominio**, edita `frontend/.env`:
   ```
   VITE_API_URL=https://tu-backend.com
   ```
2. `npm run build`.
3. Sube **el contenido de `frontend/dist/`** a `public_html`.
   - Incluye el archivo **`.htaccess`** (ya va en el build) para que `/login` y
     `/admin` funcionen como SPA.

> Si pones backend y frontend bajo el **mismo dominio** (frontend en la raíz y el
> backend en una subruta/subdominio que sirva `/api` y `/uploads`), puedes dejar
> `VITE_API_URL` vacío.

---

## 6. ¿Qué puede cambiar el dueño sin tocar código?

- **Fotógrafos**: todo desde el panel `/admin` (incluida su foto).
- **WhatsApp, Instagram, dirección, horarios, textos del menú**: `frontend/src/config/site.js`.
- **Precios de paquetes**: `frontend/src/data/packages.js`.
- **Preguntas frecuentes**: `frontend/src/data/faqs.js`.
- **Imágenes del sitio (hero/espacios)**: reemplazar archivos en `frontend/public/img/`.

---

## Stack

- **Frontend:** React 18, Vite 5, Tailwind 3, React Router, Framer Motion, Lucide.
- **Backend:** Node.js, Express, MySQL (`mysql2`), JWT, bcryptjs, Multer (subida de fotos).
- **BD:** MySQL.
