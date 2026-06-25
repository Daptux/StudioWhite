-- ============================================================
--  Studio White - Esquema de base de datos (MySQL)
--  Solo crea estructura. Los datos de ejemplo los siembra setup.js
--  (idempotente). Ejecuta:  npm run setup   (dentro de backend/)
-- ============================================================

CREATE DATABASE IF NOT EXISTS studio_white
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studio_white;

-- Administrador (un solo usuario gestiona el panel)
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Fotógrafos disponibles (se muestran en la página)
CREATE TABLE IF NOT EXISTS photographers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) DEFAULT NULL,
  phone       VARCHAR(40)  DEFAULT NULL,
  specialty   VARCHAR(150) DEFAULT NULL,
  schedule    VARCHAR(255) DEFAULT NULL,
  price       VARCHAR(120) DEFAULT NULL,
  instagram   VARCHAR(255) DEFAULT NULL,
  photo       VARCHAR(255) DEFAULT NULL,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Espacios del estudio (imágenes de la sección "Espacios")
CREATE TABLE IF NOT EXISTS spaces (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description VARCHAR(500) DEFAULT NULL,
  image       VARCHAR(255) DEFAULT NULL,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Clientes
CREATE TABLE IF NOT EXISTS clients (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  phone      VARCHAR(40)  DEFAULT NULL,
  email      VARCHAR(150) DEFAULT NULL,
  notes      VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Citas / reservas del estudio
CREATE TABLE IF NOT EXISTS appointments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_name   VARCHAR(150) NOT NULL,
  client_phone  VARCHAR(40)  DEFAULT NULL,
  photographer  VARCHAR(150) DEFAULT NULL,
  date          DATE         DEFAULT NULL,
  time          VARCHAR(20)  DEFAULT NULL,
  duration      VARCHAR(50)  DEFAULT NULL,
  session_type  VARCHAR(120) DEFAULT NULL,
  status        VARCHAR(30)  NOT NULL DEFAULT 'pendiente',
  notes         VARCHAR(500) DEFAULT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Pagos por uso del estudio
CREATE TABLE IF NOT EXISTS payments (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  client_name    VARCHAR(150) NOT NULL,
  photographer   VARCHAR(150) DEFAULT NULL,
  appointment_id INT          DEFAULT NULL,
  concept        VARCHAR(200) DEFAULT NULL,
  amount       DECIMAL(12,2) DEFAULT NULL,
  method       VARCHAR(40)  DEFAULT NULL,
  status       VARCHAR(30)  NOT NULL DEFAULT 'pagado',
  date         DATE         DEFAULT NULL,
  notes        VARCHAR(500) DEFAULT NULL,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
