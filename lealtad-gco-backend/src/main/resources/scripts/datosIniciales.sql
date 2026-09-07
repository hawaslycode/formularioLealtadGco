-- ===================================================================
-- SCRIPT DE INICIALIZACIÓN DE CATÁLOGOS - PROGRAMA DE LEALTAD GCO
-- Propósito: Generar la estructura DDL de los catálogos e inyectar 
-- los datos semilla (DML) requeridos por los selectores del frontend.
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. Catálogo de Tipos de Identificación
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_identificacion (
    id_tipo_identificacion SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipos_identificacion (nombre_tipo) VALUES 
('Cédula de Ciudadanía'), 
('Cédula de Extranjería'), 
('Pasaporte'), 
('NIT')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------
-- 2. Catálogo de Marcas (GCO)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS marcas (
    id_marca SERIAL PRIMARY KEY,
    nombre_marca VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO marcas (nombre_marca) VALUES 
('American Eagle'), 
('Naf Naf'), 
('Chevignon'), 
('Esprit'), 
('Rifle'), 
('Americanino')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------
-- 3. Catálogo Geográfico: Países
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paises (
    id_pais SERIAL PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO paises (nombre_pais) VALUES 
('Colombia'), 
('Ecuador'), 
('Perú')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------
-- 4. Catálogo Geográfico: Departamentos / Estados
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departamentos (
    id_departamento SERIAL PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL,
    id_pais INTEGER NOT NULL REFERENCES paises(id_pais),
    UNIQUE(nombre_departamento, id_pais)
);

INSERT INTO departamentos (nombre_departamento, id_pais) VALUES 
('Antioquia', 1), 
('Cundinamarca', 1), 
('Valle del Cauca', 1),
('Pichincha', 2),
('Lima', 3)
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------
-- 5. Catálogo Geográfico: Ciudades
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ciudades (
    id_ciudad SERIAL PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL,
    id_departamento INTEGER NOT NULL REFERENCES departamentos(id_departamento),
    UNIQUE(nombre_ciudad, id_departamento)
);

INSERT INTO ciudades (nombre_ciudad, id_departamento) VALUES 
('Medellín', 1), 
('Bello', 1), 
('Envigado', 1),
('Bogotá', 2), 
('Chía', 2),
('Cali', 3),
('Quito', 4),
('Miraflores', 5)
ON CONFLICT DO NOTHING;

-- 1. Tabla de Marcas del Grupo GCO
CREATE TABLE marcas (
    id_marca SERIAL PRIMARY KEY,
    nombre_marca VARCHAR(50) NOT NULL UNIQUE
);

-- Inserción de las marcas institucionales requeridas
INSERT INTO marcas (nombre_marca) VALUES 
('Americanino'), 
('American Eagle'), 
('Chevignon'), 
('Esprit'), 
('Naf Naf'), 
('Rifle');

-- 2. Tabla de Usuarios (Para Inicio de Sesión y Autenticación)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Clientes del Programa de Lealtad
CREATE TABLE clientes_lealtad (
    id_cliente SERIAL PRIMARY KEY,
    tipo_identificacion VARCHAR(20) NOT NULL,
    numero_identificacion VARCHAR(50) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    id_marca INT NOT NULL,
    id_usuario INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_marca FOREIGN KEY (id_marca) REFERENCES marcas(id_marca),
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 1. Crear la tabla de beneficios por marca
CREATE TABLE beneficios_marca (
    id_beneficio SERIAL PRIMARY KEY,
    id_marca INT NOT NULL,
    titulo_beneficio VARCHAR(150) NOT NULL,
    descripcion_beneficio TEXT NOT NULL,
    CONSTRAINT fk_marca_beneficio FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

-- 2. Insertar los beneficios institucionales para cada una de las 6 marcas del grupo
-- Nota: Asegúrate de que los id_marca correspondan a los creados previamente (1 al 6)
INSERT INTO beneficios_marca (id_marca, titulo_beneficio, descripcion_beneficio) VALUES
-- Americanino (id_marca = 1)
(1, 'Bono de Bienvenida', '20% de descuento en tu primera compra como miembro del programa de lealtad.'),
(1, 'Cashback Exclusivo', 'Acumula el 5% de tus compras en puntos redimibles en cualquier tienda Americanino.'),
-- American Eagle (id_marca = 2)
(2, 'Acceso Anticipado VIP', 'Entrada preferencial y anticipada a colecciones de temporada y rebajas especiales.'),
(2, 'Obsequio de Cumpleaños', 'Bono de $50.000 COP redimible durante el mes de tu cumpleaños.'),
-- Chevignon (id_marca = 3)
(3, 'Envío Gratuito', 'Envíos sin costo en todas tus compras realizadas a través de canales digitales.'),
(3, 'Garantía Extendida', 'Garantía preferencial en chaquetas de cuero y prendas de alta durabilidad.'),
-- Esprit (id_marca = 4)
(4, 'Descuento Aniversario', '30% de descuento en todo el catálogo durante el mes de aniversario de la marca.'),
(4, 'Taller de Estilo', 'Invitación exclusiva a asesorías de imagen personalizadas y eventos privados.'),
-- Naf Naf (id_marca = 5)
(5, 'Preventa Flash', 'Descuentos exclusivos de hasta el 40% en colecciones seleccionadas antes del público general.'),
(5, 'Acumulación Doble', 'Doble acumulación de puntos en compras realizadas los fines de semana.'),
-- Rifle (id_marca = 6)
(6, 'Puntos Redimibles', '1 punto por cada $1.000 COP gastados, utilizables como parte de pago en tiendas físicas.'),
(6, 'Mantenimiento de Prendas', 'Servicio de ajuste y dobladillos sin costo en jeans y pantalones.');