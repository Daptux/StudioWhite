# Studio White — Frontend

Sitio web (React + Vite + Tailwind) y panel de administración (`/login`, `/admin`).

Las instrucciones completas (instalar, correr backend + frontend, base de datos y
despliegue) están en el **README principal** en la raíz del proyecto: [`../README.md`](../README.md).

Comandos rápidos (desde esta carpeta):

```bash
npm install      # dependencias
npm run dev      # desarrollo (necesita el backend corriendo en :4000)
npm run build    # genera dist/
```

> En desarrollo, las llamadas a `/api` y `/uploads` se redirigen al backend
> (Node en :4000) mediante el proxy de Vite (ver `vite.config.js`).
