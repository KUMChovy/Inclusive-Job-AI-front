-- ============================================================
-- Limpieza de datos para la base inclusijob
--
-- IMPORTANTE:
-- - Este script borra usuarios, postulantes, empresas, reclutadores,
--   vacantes, postulaciones, reportes, certificaciones, tokens y chats.
-- - Reinicia los AUTO_INCREMENT.
-- - Al final vuelve a insertar los catalogos minimos necesarios:
--   rol y tipo_discapacidad.
--
-- Ejecutar sobre la base de datos: inclusijob
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET FOREIGN_KEY_CHECKS = 0;

-- Se usa DELETE en lugar de TRUNCATE porque MariaDB/phpMyAdmin puede
-- bloquear TRUNCATE cuando la tabla participa en llaves foraneas.
DELETE FROM `tokens`;
DELETE FROM `chabots`;
DELETE FROM `certificaciones`;
DELETE FROM `postulante_discapacidad`;
DELETE FROM `postulaciones`;
DELETE FROM `reporte_vacante`;
DELETE FROM `vacante_discapacidad`;
DELETE FROM `vacantes`;
DELETE FROM `postulantes`;
DELETE FROM `reclutadores`;
DELETE FROM `empresas`;
DELETE FROM `usuarios`;

-- Catalogos base: se limpian y se vuelven a sembrar.
DELETE FROM `rol`;
DELETE FROM `tipo_discapacidad`;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `rol` (`id_rol`, `nombre_rol`) VALUES
  (1, 'Administrador'),
  (2, 'Postulante'),
  (3, 'Reclutador');

INSERT INTO `tipo_discapacidad`
  (`id_tipo_discapacidad`, `nombre_discapacidad`, `descripcion`)
VALUES
  (1, 'Motriz', 'Limitacion en el movimiento o movilidad fisica.'),
  (2, 'Visual', 'Perdida total o parcial de la vision.'),
  (3, 'Auditiva', 'Perdida total o parcial de la audicion.'),
  (4, 'Intelectual', 'Limitaciones en el funcionamiento intelectual.'),
  (5, 'Psicosocial', 'Condiciones relacionadas con la salud mental.');

ALTER TABLE `rol` AUTO_INCREMENT = 4;
ALTER TABLE `tipo_discapacidad` AUTO_INCREMENT = 6;
ALTER TABLE `usuarios` AUTO_INCREMENT = 1;
ALTER TABLE `empresas` AUTO_INCREMENT = 1;
ALTER TABLE `reclutadores` AUTO_INCREMENT = 1;
ALTER TABLE `postulantes` AUTO_INCREMENT = 1;
ALTER TABLE `vacantes` AUTO_INCREMENT = 1;
ALTER TABLE `postulaciones` AUTO_INCREMENT = 1;
ALTER TABLE `reporte_vacante` AUTO_INCREMENT = 1;
ALTER TABLE `certificaciones` AUTO_INCREMENT = 1;
ALTER TABLE `chabots` AUTO_INCREMENT = 1;
ALTER TABLE `tokens` AUTO_INCREMENT = 1;

COMMIT;

-- ============================================================
-- La base queda sin datos operativos.
-- Conserva solo:
-- - 3 roles base.
-- - 5 tipos de discapacidad base.
-- ============================================================
