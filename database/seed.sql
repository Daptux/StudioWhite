-- ============================================================
--  Studio White - Datos iniciales (seed)
--  Siembra el usuario admin + datos de ejemplo (espacios y fotógrafos).
--
--  Requiere haber ejecutado antes "schema.sql" (crea la estructura).
--  Uso (XAMPP / phpMyAdmin / consola MySQL):
--      mysql -u root -p < database/schema.sql
--      mysql -u root -p < database/seed.sql
--
--  Alternativa recomendada: "npm run setup" (dentro de backend/),
--  que hace lo mismo y genera el hash de la contraseña dinámicamente.
--
--  Es idempotente: puedes ejecutarlo varias veces sin duplicar datos.
-- ============================================================

USE studio_white;

-- ------------------------------------------------------------
-- Usuario administrador por defecto
--   usuario:     admin
--   contraseña:  studiowhite2026
--   (el hash bcrypt corresponde a esa contraseña; cámbiala en
--    producción ejecutando "npm run setup" con otro ADMIN_PASSWORD)
-- ------------------------------------------------------------
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$xzjUd5KIVvPAkLfO/61KXOFIliZRk5/83LuKNHwGVxaCIgvJ5tKP.')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- ------------------------------------------------------------
-- Espacios del estudio (sección "Espacios")
-- Solo se insertan si la tabla está vacía (evita duplicados al re-ejecutar).
-- ------------------------------------------------------------
INSERT INTO spaces (title, description, image, sort_order)
SELECT * FROM (
  SELECT 'Set principal' AS title, 'Amplio y versátil, listo para cualquier sesión de foto o video.' AS description, 'img/studio-1.jpg' AS image, 1 AS sort_order UNION ALL
  SELECT 'Fondo infinito', 'Ciclorama blanco continuo para fotos limpias y de producto.', 'img/studio-2.jpg', 2 UNION ALL
  SELECT 'Maquillaje y vestidor', 'Zona privada para alistarte y cambiar de looks con comodidad.', 'img/studio-3.jpg', 3 UNION ALL
  SELECT 'Fotografía de producto', 'Iluminación controlada y fondos neutros para destacar tu producto.', 'img/gallery-1.jpg', 4 UNION ALL
  SELECT 'Contenido y video', 'Espacio flexible para reels, TikToks y producciones audiovisuales.', 'img/gallery-2.jpg', 5 UNION ALL
  SELECT 'Zona de espera', 'Un área cómoda para tu equipo o para organizar la producción.', 'img/gallery-3.jpg', 6
) AS nuevos
WHERE NOT EXISTS (SELECT 1 FROM spaces);

-- ------------------------------------------------------------
-- Fotógrafos de ejemplo (sección "Fotógrafos")
-- Solo se insertan si la tabla está vacía (evita duplicados al re-ejecutar).
-- ------------------------------------------------------------
INSERT INTO photographers (name, email, phone, specialty, schedule, price, instagram, active, sort_order)
SELECT * FROM (
  SELECT 'Laura Gómez' AS name, 'laura@studiowhite.com' AS email, '573001112233' AS phone, 'Retrato y marca personal' AS specialty, 'Lun-Vie 9:00am - 6:00pm' AS schedule, 'Desde $90.000 / sesión' AS price, 'https://instagram.com/' AS instagram, 1 AS active, 1 AS sort_order UNION ALL
  SELECT 'Andrés Ríos', 'andres@studiowhite.com', '573004445566', 'Producto y e-commerce', 'Mar-Sáb 10:00am - 7:00pm', 'Desde $120.000 / sesión', 'https://instagram.com/', 1, 2
) AS nuevos
WHERE NOT EXISTS (SELECT 1 FROM photographers);
