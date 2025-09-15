-- =====================================================
-- SCRIPT PARA CREAR BASE DE DATOS TECNOROUTE EN XAMPP
-- Ejecutar en phpMyAdmin o MySQL Workbench
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tecnoroute_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE tecnoroute_db;

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================

-- 1. Asegúrate de que XAMPP esté ejecutándose (Apache y MySQL)
-- 2. Abre phpMyAdmin (http://localhost/phpmyadmin)
-- 3. Ejecuta este script (solo la creación de BD)
-- 4. En tu proyecto Django, ejecuta:
--    python manage.py migrate
-- 5. Ejecuta el script de datos: python create_production_data.py
-- 6. El sistema estará listo con datos reales

-- CREDENCIALES DE ACCESO (se crearán con el script):
-- Administrador: admin / admin123
-- Usuario 1: juan_perez / password123
-- Usuario 2: maria_gonzalez / password123
-- Conductor 1: conductor_12345678 / conductor123
-- Conductor 2: conductor_87654321 / conductor123

-- También se puede hacer login con los emails correspondientes

SELECT 'Base de datos TECNOROUTE creada exitosamente' as Status;