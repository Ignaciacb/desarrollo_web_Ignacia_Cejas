-- Active: 1758817574785@@127.0.0.1@3306@tarea2


-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tarea2;

-- Crear usuario
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';

GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';

FLUSH PRIVILEGES;
