-- ============================================================
-- Datos demo completos para la base inclusijob
--
-- Ejecutar sobre la base de datos: inclusijob
--
-- Credenciales:
--   Admin:
--     correo: admin.demo@inclusijob.local
--     password: AdminDemo26!
--
--   Postulantes:
--     correo: ana.postulante@inclusijob.local
--     password: PostulanteDemo26!
--
--     correo: luis.postulante@inclusijob.local
--     password: PostulanteDemo26!
--
--   Reclutadores:
--     correo: sofia.reclutador@inclusijob.local
--     password: ReclutadorDemo26!
--
--     correo: diego.reclutador@inclusijob.local
--     password: ReclutadorDemo26!
--
--     correo: valeria.reclutador@inclusijob.local
--     password: ReclutadorDemo26!
--
-- Este script es idempotente: borra solo los registros demo
-- por IDs/correos y luego los vuelve a insertar.
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar datos demo de este script.
DELETE FROM `tokens`
WHERE `id_token` BETWEEN 1901 AND 1910
   OR `id_usuario` BETWEEN 1001 AND 1006;

DELETE FROM `chabots`
WHERE `id_chatbot` BETWEEN 1801 AND 1810
   OR `id_usuario` BETWEEN 1001 AND 1006;

DELETE FROM `certificaciones`
WHERE `id_certificaciones` BETWEEN 1701 AND 1710
   OR `id_postulante` BETWEEN 1101 AND 1102;

DELETE FROM `postulante_discapacidad`
WHERE `id_postulante` BETWEEN 1101 AND 1102;

DELETE FROM `postulaciones`
WHERE `id_postulacion` BETWEEN 1501 AND 1510
   OR `id_postulante` BETWEEN 1101 AND 1102
   OR `id_vacante` BETWEEN 1401 AND 1410;

DELETE FROM `reporte_vacante`
WHERE `id_reporte` BETWEEN 1601 AND 1610
   OR `id_usuario` BETWEEN 1001 AND 1006
   OR `id_vacante` BETWEEN 1401 AND 1410;

DELETE FROM `vacante_discapacidad`
WHERE `id_vacante` BETWEEN 1401 AND 1410;

DELETE FROM `vacantes`
WHERE `id_vacante` BETWEEN 1401 AND 1410
   OR `id_reclutador` BETWEEN 1301 AND 1303;

DELETE FROM `postulantes`
WHERE `id_postulante` BETWEEN 1101 AND 1102
   OR `id_usuario` BETWEEN 1001 AND 1006;

DELETE FROM `reclutadores`
WHERE `id_reclutador` BETWEEN 1301 AND 1303
   OR `id_usuario` BETWEEN 1001 AND 1006
   OR `id_empresas` BETWEEN 1201 AND 1203;

DELETE FROM `usuarios`
WHERE `id_usuario` BETWEEN 1001 AND 1006
   OR `correo` IN (
        'admin.demo@inclusijob.local',
        'ana.postulante@inclusijob.local',
        'luis.postulante@inclusijob.local',
        'sofia.reclutador@inclusijob.local',
        'diego.reclutador@inclusijob.local',
        'valeria.reclutador@inclusijob.local'
   );

DELETE FROM `empresas`
WHERE `id_empresas` BETWEEN 1201 AND 1203;

SET FOREIGN_KEY_CHECKS = 1;

-- Catalogos base requeridos por el sistema.
INSERT INTO `rol` (`id_rol`, `nombre_rol`) VALUES
  (1, 'Administrador'),
  (2, 'Postulante'),
  (3, 'Reclutador')
ON DUPLICATE KEY UPDATE
  `nombre_rol` = VALUES(`nombre_rol`);

INSERT INTO `tipo_discapacidad`
  (`id_tipo_discapacidad`, `nombre_discapacidad`, `descripcion`)
VALUES
  (1, 'Motriz', 'Limitacion en el movimiento o movilidad fisica.'),
  (2, 'Visual', 'Perdida total o parcial de la vision.'),
  (3, 'Auditiva', 'Perdida total o parcial de la audicion.'),
  (4, 'Intelectual', 'Limitaciones en el funcionamiento intelectual.'),
  (5, 'Psicosocial', 'Condiciones relacionadas con la salud mental.')
ON DUPLICATE KEY UPDATE
  `nombre_discapacidad` = VALUES(`nombre_discapacidad`),
  `descripcion` = VALUES(`descripcion`);

-- Usuarios demo.
-- Los hashes fueron generados con password_hash(..., PASSWORD_BCRYPT).
INSERT INTO `usuarios`
  (`id_usuario`, `nombres`, `apellidos`, `correo`, `contraseña`, `telefono`,
   `foto_perfil`, `estado`, `fecha_registro`, `correo_validado`, `id_rol`)
VALUES
  (1001, 'Mariana', 'Admin Torres', 'admin.demo@inclusijob.local',
   '$2y$10$uLVfUruTQYw9e5mvewyX2.1R5ryA9SH2GFIWIdcsp2DG9Z6Zu3qDi',
   '5551001001', 'uploads/fotos_perfil/admin_demo.png', 1, '2026-06-01 08:00:00', 1, 1),

  (1002, 'Ana Sofia', 'Martinez Gomez', 'ana.postulante@inclusijob.local',
   '$2y$10$bHarRsvsnIEYuoW6HHZCF.wwBG1KtAKlKz1fIomSU8GF6KM52P2rq',
   '5551001002', 'uploads/fotos_perfil/postulante_ana_demo.png', 1, '2026-06-12 10:20:00', 1, 2),

  (1003, 'Luis Alberto', 'Nava Perez', 'luis.postulante@inclusijob.local',
   '$2y$10$bHarRsvsnIEYuoW6HHZCF.wwBG1KtAKlKz1fIomSU8GF6KM52P2rq',
   '5551001003', 'uploads/fotos_perfil/postulante_luis_demo.png', 1, '2026-06-14 11:40:00', 1, 2),

  (1004, 'Sofia', 'Mendez Ruiz', 'sofia.reclutador@inclusijob.local',
   '$2y$10$VChRUHMb3bWk44K3Jb1QROFX0EoC8Rb4sL1Yc6sqwfne2ikCHBs56',
   '5551001004', 'uploads/fotos_perfil/reclutador_sofia_demo.png', 1, '2026-06-10 09:30:00', 1, 3),

  (1005, 'Diego', 'Luna Torres', 'diego.reclutador@inclusijob.local',
   '$2y$10$VChRUHMb3bWk44K3Jb1QROFX0EoC8Rb4sL1Yc6sqwfne2ikCHBs56',
   '5551001005', 'uploads/fotos_perfil/reclutador_diego_demo.png', 1, '2026-06-11 12:00:00', 1, 3),

  (1006, 'Valeria', 'Cortes Marin', 'valeria.reclutador@inclusijob.local',
   '$2y$10$VChRUHMb3bWk44K3Jb1QROFX0EoC8Rb4sL1Yc6sqwfne2ikCHBs56',
   '5551001006', 'uploads/fotos_perfil/reclutador_valeria_demo.png', 1, '2026-06-18 13:15:00', 1, 3);

-- Perfiles de postulantes.
INSERT INTO `postulantes`
  (`id_postulante`, `descripcion_discapacidad`, `esfuerzo_fisico_posible`,
   `experiencia`, `habilidades`, `cv`, `portafolio_url`, `id_usuario`)
VALUES
  (1101,
   'Discapacidad motriz con movilidad asistida. Requiere espacios accesibles, elevador, rampas y estaciones de trabajo con buena ergonomia.',
   0,
   '4 anos en soporte administrativo, seguimiento de tickets, captura de informacion, control documental y atencion a clientes por canales escritos.',
   'Excel intermedio, Google Workspace, CRM, organizacion documental, comunicacion escrita, seguimiento de solicitudes y trabajo remoto.',
   'uploads/cv/cv_ana_martinez_demo.pdf',
   'https://portafolio.demo.inclusijob.local/ana-martinez',
   1002),

  (1102,
   'Discapacidad visual parcial. Usa lector de pantalla, alto contraste y documentos digitales accesibles.',
   0,
   '2 anos en pruebas de accesibilidad web, soporte de mesa de ayuda, revision de contenidos digitales y documentacion tecnica.',
   'Accesibilidad WCAG basica, soporte tecnico, redaccion, pruebas funcionales, uso de lectores de pantalla y control de incidencias.',
   'uploads/cv/cv_luis_nava_demo.pdf',
   'https://portafolio.demo.inclusijob.local/luis-nava',
   1003);

INSERT INTO `postulante_discapacidad`
  (`id_postulante`, `id_tipo_discapacidad`)
VALUES
  (1101, 1),
  (1101, 3),
  (1102, 2),
  (1102, 5);

INSERT INTO `certificaciones`
  (`id_certificaciones`, `nombre_certificacion`, `institucion_dada`, `pdf`,
   `fecha_emitido`, `id_postulante`)
VALUES
  (1701, 'Atencion al cliente inclusiva', 'Capacitate para el Empleo',
   'uploads/certificaciones/ana_atencion_cliente_demo.pdf', '2025-10-18', 1101),
  (1702, 'Excel para gestion administrativa', 'Fundacion Carlos Slim',
   'uploads/certificaciones/ana_excel_demo.pdf', '2026-02-07', 1101),
  (1703, 'Introduccion a accesibilidad web', 'W3C Web Accessibility Initiative',
   'uploads/certificaciones/luis_accesibilidad_demo.pdf', '2026-01-22', 1102),
  (1704, 'Soporte tecnico nivel 1', 'Google Career Certificates',
   'uploads/certificaciones/luis_soporte_demo.pdf', '2025-11-11', 1102);

-- Empresas y reclutadores.
INSERT INTO `empresas`
  (`id_empresas`, `nombre_empresas`, `descripcion`, `direccion`,
   `telefono_empresa`, `correo_empresa`, `sitio_web`, `estado_validacion`,
   `fecha_registro_empres`)
VALUES
  (1201, 'Accesa Servicios Digitales',
   'Empresa de servicios administrativos y soporte remoto con politicas de accesibilidad laboral.',
   'Av. Insurgentes Sur 1200, Ciudad de Mexico', '5552001201',
   'talento@accesa.demo', 'https://accesa.demo', 1, '2026-06-10 09:00:00'),

  (1202, 'Nova Retail Inclusivo',
   'Cadena de retail con vacantes hibridas y estaciones de trabajo adaptadas.',
   'Paseo de la Reforma 250, Ciudad de Mexico', '5552001202',
   'rh@novaretail.demo', 'https://novaretail.demo', 1, '2026-06-11 09:45:00'),

  (1203, 'Humana BPO',
   'Centro de operaciones BPO en proceso de validacion administrativa.',
   'Blvd. Manuel Avila Camacho 88, Naucalpan', '5552001203',
   'empleo@humanabpo.demo', 'https://humanabpo.demo', 0, '2026-07-07 16:30:00');

INSERT INTO `reclutadores`
  (`id_reclutador`, `puesto`, `id_usuario`, `id_empresas`)
VALUES
  (1301, 'Coordinadora de Atraccion de Talento', 1004, 1201),
  (1302, 'Especialista de Reclutamiento Inclusivo', 1005, 1202),
  (1303, 'Lider de Seleccion BPO', 1006, 1203);

-- Vacantes demo.
INSERT INTO `vacantes`
  (`id_vacante`, `titulo_puesto`, `descripcion_puesto`, `requisitos`,
   `modalidad`, `salario_min`, `salario_max`, `estado`, `fecha_publicacion`,
   `fecha_cierre`, `id_reclutador`)
VALUES
  (1401, 'Asistente administrativo remoto',
   'Gestion de correos, captura de datos, seguimiento de solicitudes y apoyo documental para clientes internos.',
   'Experiencia administrativa minima de 1 ano\nManejo de Excel y correo electronico\nBuena redaccion\nDisponibilidad de lunes a viernes',
   'Remota', 12000.00, 16000.00, 'activa', '2026-07-01 09:20:00', '2026-08-15', 1301),

  (1402, 'Ejecutiva de soporte por chat',
   'Atencion a usuarios por canales escritos, registro de tickets y escalamiento de incidencias.',
   'Excelente comunicacion escrita\nExperiencia en soporte o atencion a clientes\nManejo basico de CRM\nInternet estable',
   'Remota', 11000.00, 15000.00, 'activa', '2026-07-02 10:10:00', '2026-08-20', 1301),

  (1403, 'Analista de calidad documental',
   'Revision de expedientes digitales, validacion de datos y reporte de inconsistencias.',
   'Atencion al detalle\nExcel intermedio\nOrganizacion documental\nExperiencia revisando informacion',
   'Hibrida', 14000.00, 18000.00, 'activa', '2026-06-28 13:00:00', '2026-08-10', 1302),

  (1404, 'Auxiliar de recursos humanos',
   'Apoyo en agenda de entrevistas, actualizacion de bases de candidatos y comunicacion con postulantes.',
   'Trato amable\nManejo de agenda\nRedaccion clara\nUso de hojas de calculo',
   'Presencial', 10000.00, 13000.00, 'activa', '2026-06-25 08:45:00', '2026-07-30', 1302),

  (1405, 'Capturista de datos accesible',
   'Captura y verificacion de informacion en sistemas internos con metas semanales.',
   'Velocidad de captura\nConcentracion\nDisponibilidad de medio tiempo\nManejo basico de computadora',
   'Hibrida', 9000.00, 12000.00, 'activa', '2026-07-03 15:15:00', '2026-08-22', 1301),

  (1406, 'Coordinadora de seguimiento a clientes',
   'Seguimiento de cuentas por correo y telefono, elaboracion de reportes y actualizacion de estatus.',
   'Experiencia en atencion a clientes\nExcel intermedio\nSeguimiento puntual\nComunicacion escrita profesional',
   'Remota', 15000.00, 21000.00, 'activa', '2026-07-04 11:40:00', '2026-08-25', 1302),

  (1407, 'Probadora de accesibilidad web junior',
   'Ejecucion de pruebas funcionales con lector de pantalla, reporte de hallazgos y documentacion de ajustes accesibles.',
   'Conocimiento basico de WCAG\nUso de lector de pantalla\nRedaccion clara\nAtencion al detalle',
   'Remota', 13000.00, 18000.00, 'activa', '2026-07-05 10:00:00', '2026-08-26', 1302),

  (1408, 'Moderadora de comunidad digital',
   'Revision de mensajes, respuesta a comentarios y escalamiento de casos sensibles.',
   'Empatia\nOrtografia\nManejo de redes sociales\nDisponibilidad vespertina',
   'Remota', 10000.00, 14000.00, 'activa', '2026-06-30 16:00:00', '2026-08-12', 1301),

  (1409, 'Auxiliar de archivo temporal',
   'Proyecto temporal de organizacion de archivo fisico y digital.',
   'Orden documental\nDisponibilidad inmediata\nManejo basico de computadora',
   'Presencial', 8500.00, 10500.00, 'cerrada', '2026-05-20 09:00:00', '2026-06-20', 1302),

  (1410, 'Disenadora de contenido visual',
   'Creacion de piezas graficas para redes internas y material de capacitacion.',
   'Portafolio grafico\nManejo de Canva o Illustrator\nCreatividad\nTrabajo por entregables',
   'Remota', 13000.00, 19000.00, 'activa', '2026-07-02 12:00:00', '2026-08-18', 1301);

INSERT INTO `vacante_discapacidad`
  (`id_vacante`, `id_tipo_discapacidad`)
VALUES
  (1401, 1), (1401, 3),
  (1402, 3), (1402, 5),
  (1403, 1), (1403, 3),
  (1404, 1),
  (1405, 1), (1405, 4),
  (1406, 1), (1406, 3), (1406, 5),
  (1407, 2), (1407, 5),
  (1408, 2), (1408, 5),
  (1409, 1),
  (1410, 2);

-- Postulaciones con estados distintos.
INSERT INTO `postulaciones`
  (`id_postulacion`, `estado`, `fecha_postulacion`, `id_postulante`, `id_vacante`)
VALUES
  (1501, 'pendiente',  '2026-07-02 14:35:00', 1101, 1401),
  (1502, 'entrevista', '2026-07-03 09:10:00', 1101, 1403),
  (1503, 'aceptado',   '2026-06-29 16:25:00', 1101, 1404),
  (1504, 'rechazado',  '2026-06-24 11:00:00', 1101, 1409),
  (1505, 'pendiente',  '2026-07-06 10:30:00', 1102, 1407),
  (1506, 'entrevista', '2026-07-07 12:15:00', 1102, 1408);

INSERT INTO `reporte_vacante`
  (`id_reporte`, `motivo`, `fecha_reporte`, `id_vacante`, `id_usuario`)
VALUES
  (1601,
   'La descripcion solicita disponibilidad para actividades fisicas, pero la vacante aparece como compatible con discapacidad motriz. Requiere revision.',
   '2026-07-04 18:20:00', 1404, 1002),
  (1602,
   'La informacion salarial no coincide con lo indicado durante el primer contacto.',
   '2026-07-05 12:05:00', 1402, 1002);

INSERT INTO `chabots`
  (`id_chatbot`, `tipo_interaccion`, `mensaje_usuario`, `respuesta_ia`,
   `resultado`, `calificacion`, `archivo_cv`, `fecha`, `id_usuario`)
VALUES
  (1801, 'recomendacion_vacantes',
   'Recomiendame vacantes remotas compatibles con mi perfil.',
   'Se recomiendan vacantes de asistencia administrativa, soporte por chat y seguimiento a clientes.',
   '3 recomendaciones compatibles', 5, NULL, '2026-07-05 13:30:00', 1002),
  (1802, 'orientacion_perfil',
   'Como puedo mejorar mi perfil para empleos administrativos?',
   'Agrega certificaciones recientes, destaca Excel intermedio y sube un CV actualizado.',
   'perfil_mejorado', 4, 'cv_ana_martinez_demo.pdf', '2026-07-05 14:05:00', 1002),
  (1803, 'recomendacion_vacantes',
   'Busco vacantes compatibles con lector de pantalla.',
   'Se recomiendan pruebas de accesibilidad web y moderacion digital.',
   '2 recomendaciones compatibles', 5, NULL, '2026-07-08 11:00:00', 1003);

-- Token demo vencido para no interferir con login ni recuperacion.
INSERT INTO `tokens`
  (`id_token`, `token`, `tipo`, `tiempo_expira`, `veces_usado`,
   `tiempo_creado`, `id_usuario`)
VALUES
  (1901, 'demo-token-vencido-ana-1101', 'verificacion',
   '2026-06-13 10:20:00', 1, '2026-06-12 10:20:00', 1002);

-- Mantener AUTO_INCREMENT por encima de los IDs demo.
ALTER TABLE `usuarios` AUTO_INCREMENT = 1007;
ALTER TABLE `postulantes` AUTO_INCREMENT = 1103;
ALTER TABLE `empresas` AUTO_INCREMENT = 1204;
ALTER TABLE `reclutadores` AUTO_INCREMENT = 1304;
ALTER TABLE `vacantes` AUTO_INCREMENT = 1411;
ALTER TABLE `postulaciones` AUTO_INCREMENT = 1507;
ALTER TABLE `reporte_vacante` AUTO_INCREMENT = 1603;
ALTER TABLE `certificaciones` AUTO_INCREMENT = 1705;
ALTER TABLE `chabots` AUTO_INCREMENT = 1804;
ALTER TABLE `tokens` AUTO_INCREMENT = 1902;
ALTER TABLE `rol` AUTO_INCREMENT = 4;
ALTER TABLE `tipo_discapacidad` AUTO_INCREMENT = 6;

COMMIT;

-- ============================================================
-- Resumen:
-- - 6 usuarios: 1 admin, 2 postulantes y 3 reclutadores.
-- - 3 empresas: 2 aprobadas y 1 pendiente.
-- - 10 vacantes, 6 postulaciones, 2 reportes.
-- - 4 certificaciones y 3 interacciones de chatbot.
-- ============================================================
