/*
  InclusiveJob - Script de datos demo realistas
  ------------------------------------------------------------
  IMPORTANTE:
  - No inserta nada en la tabla `chabots`.
  - Usa empresas reales y URLs publicas reales.
  - Las personas/cuentas son DEMO.
  - Password comun para todas las cuentas creadas:
      Inclusive2026!
  - Ejecutar sobre la base: inclusijob
*/

USE inclusijob;
SET NAMES utf8mb4;

START TRANSACTION;

SET @PASSWORD_HASH = '$2y$10$nVPS6Sj3QwrdcAdLqv/hq./ibmVf98RoItXhfPk4OyDCYxMopHvPa';
SET @DEMO_PDF = 0x255044462D312E340A25E2E3CFD30A312030206F626A0A3C3C202F54797065202F436174616C6F67202F5061676573203220302052203E3E0A656E646F626A0A322030206F626A0A3C3C202F54797065202F5061676573202F4B696473205B33203020525D202F436F756E742031203E3E0A656E646F626A0A332030206F626A0A3C3C202F54797065202F50616765202F506172656E74203220302052202F4D65646961426F78205B30203020343230203138305D202F5265736F7572636573203C3C202F466F6E74203C3C202F4631203520302052203E3E203E3E202F436F6E74656E7473203420302052203E3E0A656E646F626A0A342030206F626A0A3C3C202F4C656E677468203533203E3E0A73747265616D0A42540A2F46312031382054660A3430203131302054640A28496E636C75736976654A6F622064656D6F205044462920546A0A45540A656E6473747265616D0A656E646F626A0A352030206F626A0A3C3C202F54797065202F466F6E74202F53756274797065202F5479706531202F42617365466F6E74202F48656C766574696361203E3E0A656E646F626A0A787265660A3020360A303030303030303030302036353533352066200A30303030303030303135203030303030206E200A30303030303030303634203030303030206E200A30303030303030313231203030303030206E200A30303030303030323437203030303030206E200A30303030303030333439203030303030206E200A747261696C65720A3C3C202F53697A652036202F526F6F74203120302052203E3E0A7374617274787265660A3431390A2525454F460A;

/* Roles base */
INSERT INTO rol (id_rol, nombre_rol) VALUES
  (1, 'Administrador'),
  (2, 'Postulante'),
  (3, 'Reclutador')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol);

/* Catalogo base de discapacidades */
INSERT INTO tipo_discapacidad (id_tipo_discapacidad, nombre_discapacidad, descripcion) VALUES
  (1, 'Motriz', 'Limitacion en el movimiento o movilidad fisica.'),
  (2, 'Visual', 'Perdida total o parcial de la vision.'),
  (3, 'Auditiva', 'Perdida total o parcial de la audicion.'),
  (4, 'Intelectual', 'Limitaciones en el funcionamiento intelectual.'),
  (5, 'Psicosocial', 'Condiciones relacionadas con la salud mental.')
ON DUPLICATE KEY UPDATE
  nombre_discapacidad = VALUES(nombre_discapacidad),
  descripcion = VALUES(descripcion);

/* Empresas reales con URLs publicas reales */
INSERT INTO empresas
  (nombre_empresas, descripcion, direccion, telefono_empresa, correo_empresa, sitio_web, estado_validacion)
SELECT 'Microsoft Mexico',
       'Empresa global de tecnologia, nube, productividad, inteligencia artificial y soluciones empresariales.',
       'Ciudad de Mexico, Mexico',
       '+52 55 5267 2000',
       'contacto@microsoft.com',
       'https://www.microsoft.com/es-mx',
       1
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresas = 'Microsoft Mexico');

INSERT INTO empresas
  (nombre_empresas, descripcion, direccion, telefono_empresa, correo_empresa, sitio_web, estado_validacion)
SELECT 'IBM Mexico',
       'Compania global de tecnologia enfocada en consultoria, nube, IA, automatizacion y datos.',
       'Ciudad de Mexico, Mexico',
       '+52 55 5270 3000',
       'contacto@ibm.com',
       'https://www.ibm.com/mx-es',
       1
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresas = 'IBM Mexico');

INSERT INTO empresas
  (nombre_empresas, descripcion, direccion, telefono_empresa, correo_empresa, sitio_web, estado_validacion)
SELECT 'BBVA Mexico',
       'Institucion financiera con servicios de banca digital, analitica, productos financieros y atencion al cliente.',
       'Ciudad de Mexico, Mexico',
       '+52 55 5226 2663',
       'contacto@bbva.mx',
       'https://www.bbva.mx',
       1
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresas = 'BBVA Mexico');

INSERT INTO empresas
  (nombre_empresas, descripcion, direccion, telefono_empresa, correo_empresa, sitio_web, estado_validacion)
SELECT 'Cinepolis',
       'Empresa mexicana de entretenimiento y exhibicion cinematografica con operaciones digitales y presenciales.',
       'Morelia, Michoacan, Mexico',
       '+52 443 322 3500',
       'contacto@cinepolis.com',
       'https://cinepolis.com',
       1
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresas = 'Cinepolis');

INSERT INTO empresas
  (nombre_empresas, descripcion, direccion, telefono_empresa, correo_empresa, sitio_web, estado_validacion)
SELECT 'Accenture Mexico',
       'Consultora global de tecnologia, transformacion digital, operaciones, datos, cloud y automatizacion.',
       'Ciudad de Mexico, Mexico',
       '+52 55 5284 7300',
       'contacto@accenture.com',
       'https://www.accenture.com/mx-es',
       1
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresas = 'Accenture Mexico');

INSERT INTO empresas
  (nombre_empresas, descripcion, direccion, telefono_empresa, correo_empresa, sitio_web, estado_validacion)
SELECT 'Platzi',
       'Plataforma latinoamericana de educacion online enfocada en tecnologia, negocios y habilidades digitales.',
       'Latinoamerica',
       '+52 55 0000 0000',
       'contacto@platzi.com',
       'https://platzi.com',
       0
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresas = 'Platzi');

/* Actualiza datos si las empresas ya existian */
UPDATE empresas SET sitio_web = 'https://www.microsoft.com/es-mx', estado_validacion = 1 WHERE nombre_empresas = 'Microsoft Mexico';
UPDATE empresas SET sitio_web = 'https://www.ibm.com/mx-es', estado_validacion = 1 WHERE nombre_empresas = 'IBM Mexico';
UPDATE empresas SET sitio_web = 'https://www.bbva.mx', estado_validacion = 1 WHERE nombre_empresas = 'BBVA Mexico';
UPDATE empresas SET sitio_web = 'https://cinepolis.com', estado_validacion = 1 WHERE nombre_empresas = 'Cinepolis';
UPDATE empresas SET sitio_web = 'https://www.accenture.com/mx-es', estado_validacion = 1 WHERE nombre_empresas = 'Accenture Mexico';
UPDATE empresas SET sitio_web = 'https://platzi.com', estado_validacion = 0 WHERE nombre_empresas = 'Platzi';

/* Usuarios demo */
INSERT INTO usuarios (nombres, apellidos, correo, `contraseña`, telefono, estado, correo_validado, id_rol) VALUES
('Sofia', 'Martinez Admin', 'admin.demo@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340001', 1, 1, 1),
('Laura', 'Mendez Microsoft', 'reclutador.microsoft@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340101', 1, 1, 3),
('Carlos', 'Herrera IBM', 'reclutador.ibm@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340102', 1, 1, 3),
('Andrea', 'Vargas BBVA', 'reclutador.bbva@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340103', 1, 1, 3),
('Miguel', 'Ortega Cinepolis', 'reclutador.cinepolis@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340104', 1, 1, 3),
('Paola', 'Rios Accenture', 'reclutador.accenture@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340105', 1, 1, 3),
('Daniel', 'Navarro Platzi', 'reclutador.platzi@inclusivejob.demo', @PASSWORD_HASH, '+52 5512340106', 1, 1, 3),
('Mariana', 'Gomez Herrera', 'postulante.mariana@inclusivejob.demo', @PASSWORD_HASH, '+52 5523450001', 1, 1, 2),
('Diego', 'Ramirez Soto', 'postulante.diego@inclusivejob.demo', @PASSWORD_HASH, '+52 5523450002', 1, 1, 2),
('Fernanda', 'Castillo Vega', 'postulante.fernanda@inclusivejob.demo', @PASSWORD_HASH, '+52 5523450003', 1, 1, 2),
('Luis', 'Hernandez Mora', 'postulante.luis@inclusivejob.demo', @PASSWORD_HASH, '+52 5523450004', 1, 1, 2),
('Camila', 'Torres Nunez', 'postulante.camila@inclusivejob.demo', @PASSWORD_HASH, '+52 5523450005', 1, 1, 2),
('Jorge', 'Salinas Pineda', 'postulante.jorge@inclusivejob.demo', @PASSWORD_HASH, '+52 5523450006', 1, 1, 2)
ON DUPLICATE KEY UPDATE
  nombres = VALUES(nombres),
  apellidos = VALUES(apellidos),
  `contraseña` = VALUES(`contraseña`),
  telefono = VALUES(telefono),
  estado = VALUES(estado),
  correo_validado = VALUES(correo_validado),
  id_rol = VALUES(id_rol);

/* Variables de empresas */
SELECT id_empresas INTO @EMP_MICROSOFT FROM empresas WHERE nombre_empresas = 'Microsoft Mexico' LIMIT 1;
SELECT id_empresas INTO @EMP_IBM FROM empresas WHERE nombre_empresas = 'IBM Mexico' LIMIT 1;
SELECT id_empresas INTO @EMP_BBVA FROM empresas WHERE nombre_empresas = 'BBVA Mexico' LIMIT 1;
SELECT id_empresas INTO @EMP_CINEPOLIS FROM empresas WHERE nombre_empresas = 'Cinepolis' LIMIT 1;
SELECT id_empresas INTO @EMP_ACCENTURE FROM empresas WHERE nombre_empresas = 'Accenture Mexico' LIMIT 1;
SELECT id_empresas INTO @EMP_PLATZI FROM empresas WHERE nombre_empresas = 'Platzi' LIMIT 1;

/* Variables de usuarios */
SELECT id_usuario INTO @USR_REC_MICROSOFT FROM usuarios WHERE correo = 'reclutador.microsoft@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_REC_IBM FROM usuarios WHERE correo = 'reclutador.ibm@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_REC_BBVA FROM usuarios WHERE correo = 'reclutador.bbva@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_REC_CINEPOLIS FROM usuarios WHERE correo = 'reclutador.cinepolis@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_REC_ACCENTURE FROM usuarios WHERE correo = 'reclutador.accenture@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_REC_PLATZI FROM usuarios WHERE correo = 'reclutador.platzi@inclusivejob.demo' LIMIT 1;

SELECT id_usuario INTO @USR_MARIANA FROM usuarios WHERE correo = 'postulante.mariana@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_DIEGO FROM usuarios WHERE correo = 'postulante.diego@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_FERNANDA FROM usuarios WHERE correo = 'postulante.fernanda@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_LUIS FROM usuarios WHERE correo = 'postulante.luis@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_CAMILA FROM usuarios WHERE correo = 'postulante.camila@inclusivejob.demo' LIMIT 1;
SELECT id_usuario INTO @USR_JORGE FROM usuarios WHERE correo = 'postulante.jorge@inclusivejob.demo' LIMIT 1;

/* Reclutadores */
INSERT INTO reclutadores (puesto, id_usuario, id_empresas)
SELECT 'Talent Acquisition Specialist', @USR_REC_MICROSOFT, @EMP_MICROSOFT
WHERE NOT EXISTS (SELECT 1 FROM reclutadores WHERE id_usuario = @USR_REC_MICROSOFT);
INSERT INTO reclutadores (puesto, id_usuario, id_empresas)
SELECT 'HR Business Partner', @USR_REC_IBM, @EMP_IBM
WHERE NOT EXISTS (SELECT 1 FROM reclutadores WHERE id_usuario = @USR_REC_IBM);
INSERT INTO reclutadores (puesto, id_usuario, id_empresas)
SELECT 'Especialista de Seleccion Digital', @USR_REC_BBVA, @EMP_BBVA
WHERE NOT EXISTS (SELECT 1 FROM reclutadores WHERE id_usuario = @USR_REC_BBVA);
INSERT INTO reclutadores (puesto, id_usuario, id_empresas)
SELECT 'Coordinador de Reclutamiento', @USR_REC_CINEPOLIS, @EMP_CINEPOLIS
WHERE NOT EXISTS (SELECT 1 FROM reclutadores WHERE id_usuario = @USR_REC_CINEPOLIS);
INSERT INTO reclutadores (puesto, id_usuario, id_empresas)
SELECT 'Recruiting Lead', @USR_REC_ACCENTURE, @EMP_ACCENTURE
WHERE NOT EXISTS (SELECT 1 FROM reclutadores WHERE id_usuario = @USR_REC_ACCENTURE);
INSERT INTO reclutadores (puesto, id_usuario, id_empresas)
SELECT 'People Operations', @USR_REC_PLATZI, @EMP_PLATZI
WHERE NOT EXISTS (SELECT 1 FROM reclutadores WHERE id_usuario = @USR_REC_PLATZI);

UPDATE reclutadores SET puesto = 'Talent Acquisition Specialist', id_empresas = @EMP_MICROSOFT WHERE id_usuario = @USR_REC_MICROSOFT;
UPDATE reclutadores SET puesto = 'HR Business Partner', id_empresas = @EMP_IBM WHERE id_usuario = @USR_REC_IBM;
UPDATE reclutadores SET puesto = 'Especialista de Seleccion Digital', id_empresas = @EMP_BBVA WHERE id_usuario = @USR_REC_BBVA;
UPDATE reclutadores SET puesto = 'Coordinador de Reclutamiento', id_empresas = @EMP_CINEPOLIS WHERE id_usuario = @USR_REC_CINEPOLIS;
UPDATE reclutadores SET puesto = 'Recruiting Lead', id_empresas = @EMP_ACCENTURE WHERE id_usuario = @USR_REC_ACCENTURE;
UPDATE reclutadores SET puesto = 'People Operations', id_empresas = @EMP_PLATZI WHERE id_usuario = @USR_REC_PLATZI;

SELECT id_reclutador INTO @REC_MICROSOFT FROM reclutadores WHERE id_usuario = @USR_REC_MICROSOFT LIMIT 1;
SELECT id_reclutador INTO @REC_IBM FROM reclutadores WHERE id_usuario = @USR_REC_IBM LIMIT 1;
SELECT id_reclutador INTO @REC_BBVA FROM reclutadores WHERE id_usuario = @USR_REC_BBVA LIMIT 1;
SELECT id_reclutador INTO @REC_CINEPOLIS FROM reclutadores WHERE id_usuario = @USR_REC_CINEPOLIS LIMIT 1;
SELECT id_reclutador INTO @REC_ACCENTURE FROM reclutadores WHERE id_usuario = @USR_REC_ACCENTURE LIMIT 1;
SELECT id_reclutador INTO @REC_PLATZI FROM reclutadores WHERE id_usuario = @USR_REC_PLATZI LIMIT 1;

/* Postulantes */
INSERT INTO postulantes (descripcion_discapacidad, esfuerzo_fisico_posible, experiencia, habilidades, cv, portafolio_url, id_usuario)
SELECT 'Baja vision. Requiere interfaces compatibles con lector de pantalla y alto contraste. 45%', 0,
       '3 anos como disenadora UX/UI enfocada en accesibilidad digital, prototipado y pruebas con usuarios.',
       '["UX Research","Figma","Accesibilidad WCAG","HTML semantico","Pruebas de usabilidad"]',
       @DEMO_PDF, 'https://www.behance.net/', @USR_MARIANA
WHERE NOT EXISTS (SELECT 1 FROM postulantes WHERE id_usuario = @USR_MARIANA);

INSERT INTO postulantes (descripcion_discapacidad, esfuerzo_fisico_posible, experiencia, habilidades, cv, portafolio_url, id_usuario)
SELECT 'Discapacidad motriz. Prefiere modalidad remota o espacios con accesibilidad fisica. 60%', 0,
       '4 anos desarrollando APIs REST, integraciones y bases de datos para aplicaciones web.',
       '["PHP","Laravel","Node.js","MySQL","APIs REST","Git"]',
       @DEMO_PDF, 'https://github.com/', @USR_DIEGO
WHERE NOT EXISTS (SELECT 1 FROM postulantes WHERE id_usuario = @USR_DIEGO);

INSERT INTO postulantes (descripcion_discapacidad, esfuerzo_fisico_posible, experiencia, habilidades, cv, portafolio_url, id_usuario)
SELECT 'Hipoacusia bilateral. Se comunica mejor por texto, videollamadas subtituladas y documentacion clara. 35%', 1,
       '2 anos en QA manual, pruebas funcionales, documentacion de bugs y seguimiento con equipos agiles.',
       '["QA Manual","Selenium","Jira","Pruebas funcionales","Documentacion"]',
       @DEMO_PDF, 'https://www.linkedin.com/', @USR_FERNANDA
WHERE NOT EXISTS (SELECT 1 FROM postulantes WHERE id_usuario = @USR_FERNANDA);

INSERT INTO postulantes (descripcion_discapacidad, esfuerzo_fisico_posible, experiencia, habilidades, cv, portafolio_url, id_usuario)
SELECT 'Condicion psicosocial controlada. Prefiere ambientes estructurados, objetivos claros y horarios estables. 30%', 1,
       'Analista de datos junior con experiencia en dashboards, limpieza de datos y reportes operativos.',
       '["Excel avanzado","Power BI","SQL","Python basico","Analisis de datos"]',
       @DEMO_PDF, 'https://www.kaggle.com/', @USR_LUIS
WHERE NOT EXISTS (SELECT 1 FROM postulantes WHERE id_usuario = @USR_LUIS);

INSERT INTO postulantes (descripcion_discapacidad, esfuerzo_fisico_posible, experiencia, habilidades, cv, portafolio_url, id_usuario)
SELECT 'Discapacidad intelectual leve. Destaca en tareas estructuradas, soporte tecnico basico y atencion guiada. 40%', 1,
       'Experiencia en mesa de ayuda, captura de tickets, seguimiento a usuarios y soporte de primer nivel.',
       '["Soporte tecnico","Atencion al cliente","Zendesk","Google Workspace","Documentacion"]',
       @DEMO_PDF, 'https://www.freecodecamp.org/', @USR_CAMILA
WHERE NOT EXISTS (SELECT 1 FROM postulantes WHERE id_usuario = @USR_CAMILA);

INSERT INTO postulantes (descripcion_discapacidad, esfuerzo_fisico_posible, experiencia, habilidades, cv, portafolio_url, id_usuario)
SELECT 'Discapacidad motriz y baja vision. Requiere herramientas accesibles y posibilidad de trabajo remoto. 55%', 0,
       'Frontend developer con experiencia en React, accesibilidad, componentes reutilizables y consumo de APIs.',
       '["React","JavaScript","CSS","Tailwind","Accesibilidad","Consumo de APIs"]',
       @DEMO_PDF, 'https://github.com/', @USR_JORGE
WHERE NOT EXISTS (SELECT 1 FROM postulantes WHERE id_usuario = @USR_JORGE);

UPDATE postulantes SET cv = @DEMO_PDF WHERE id_usuario IN (@USR_MARIANA, @USR_DIEGO, @USR_FERNANDA, @USR_LUIS, @USR_CAMILA, @USR_JORGE);

SELECT id_postulante INTO @POS_MARIANA FROM postulantes WHERE id_usuario = @USR_MARIANA LIMIT 1;
SELECT id_postulante INTO @POS_DIEGO FROM postulantes WHERE id_usuario = @USR_DIEGO LIMIT 1;
SELECT id_postulante INTO @POS_FERNANDA FROM postulantes WHERE id_usuario = @USR_FERNANDA LIMIT 1;
SELECT id_postulante INTO @POS_LUIS FROM postulantes WHERE id_usuario = @USR_LUIS LIMIT 1;
SELECT id_postulante INTO @POS_CAMILA FROM postulantes WHERE id_usuario = @USR_CAMILA LIMIT 1;
SELECT id_postulante INTO @POS_JORGE FROM postulantes WHERE id_usuario = @USR_JORGE LIMIT 1;

/* Discapacidades de postulantes */
INSERT IGNORE INTO postulante_discapacidad (id_postulante, id_tipo_discapacidad) VALUES
(@POS_MARIANA, 2),
(@POS_DIEGO, 1),
(@POS_FERNANDA, 3),
(@POS_LUIS, 5),
(@POS_CAMILA, 4),
(@POS_JORGE, 1),
(@POS_JORGE, 2);

/* Vacantes */
INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Especialista en Accesibilidad Digital',
       'Asegurar que productos web cumplan criterios WCAG, documentar hallazgos y colaborar con equipos UX e ingenieria.',
       'Experiencia con WCAG, pruebas con lectores de pantalla, HTML semantico y documentacion clara.',
       'hibrido', 35000, 58000, 'activa', NOW() - INTERVAL 18 DAY, CURDATE() + INTERVAL 45 DAY, @REC_MICROSOFT
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Especialista en Accesibilidad Digital' AND id_reclutador = @REC_MICROSOFT);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Desarrollador Frontend React',
       'Construir interfaces accesibles para herramientas internas y portales de productividad.',
       'React, JavaScript, CSS, consumo de APIs, control de versiones y buenas practicas de accesibilidad.',
       'remoto', 32000, 52000, 'activa', NOW() - INTERVAL 12 DAY, CURDATE() + INTERVAL 35 DAY, @REC_MICROSOFT
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Desarrollador Frontend React' AND id_reclutador = @REC_MICROSOFT);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Analista QA Software Accesible',
       'Ejecutar pruebas funcionales y de accesibilidad en aplicaciones empresariales.',
       'QA manual, Jira, documentacion de bugs, pruebas de regresion y comunicacion escrita.',
       'remoto', 24000, 38000, 'activa', NOW() - INTERVAL 10 DAY, CURDATE() + INTERVAL 30 DAY, @REC_IBM
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Analista QA Software Accesible' AND id_reclutador = @REC_IBM);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Consultor de Datos Junior',
       'Apoyar en limpieza de datos, tableros, reportes y automatizacion de consultas.',
       'SQL, Excel avanzado, Power BI o Tableau, pensamiento analitico y documentacion.',
       'hibrido', 26000, 42000, 'activa', NOW() - INTERVAL 8 DAY, CURDATE() + INTERVAL 28 DAY, @REC_IBM
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Consultor de Datos Junior' AND id_reclutador = @REC_IBM);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Ejecutivo de Soporte Digital',
       'Atender solicitudes de usuarios en canales digitales y documentar soluciones en base de conocimiento.',
       'Atencion al cliente, redaccion clara, manejo de tickets y herramientas colaborativas.',
       'presencial', 18000, 26000, 'activa', NOW() - INTERVAL 7 DAY, CURDATE() + INTERVAL 25 DAY, @REC_BBVA
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Ejecutivo de Soporte Digital' AND id_reclutador = @REC_BBVA);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Analista de Datos Banca Inclusiva',
       'Construir reportes para monitoreo operativo y analisis de experiencia de clientes.',
       'SQL, Power BI, Excel avanzado, analisis de datos y comunicacion con areas de negocio.',
       'hibrido', 30000, 48000, 'activa', NOW() - INTERVAL 6 DAY, CURDATE() + INTERVAL 40 DAY, @REC_BBVA
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Analista de Datos Banca Inclusiva' AND id_reclutador = @REC_BBVA);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Coordinador de Atencion a Clientes Digital',
       'Coordinar seguimiento a clientes en canales digitales y resolver incidencias de servicio.',
       'Atencion al cliente, organizacion, manejo de tickets, comunicacion clara y trabajo en equipo.',
       'presencial', 20000, 31000, 'activa', NOW() - INTERVAL 5 DAY, CURDATE() + INTERVAL 32 DAY, @REC_CINEPOLIS
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Coordinador de Atencion a Clientes Digital' AND id_reclutador = @REC_CINEPOLIS);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Disenador UX de Experiencias Accesibles',
       'Disenar flujos digitales inclusivos para usuarios con diferentes necesidades de accesibilidad.',
       'Figma, investigacion UX, pruebas de usabilidad, accesibilidad y documentacion de componentes.',
       'hibrido', 28000, 44000, 'activa', NOW() - INTERVAL 4 DAY, CURDATE() + INTERVAL 38 DAY, @REC_CINEPOLIS
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Disenador UX de Experiencias Accesibles' AND id_reclutador = @REC_CINEPOLIS);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Desarrollador Backend Java',
       'Desarrollar servicios backend, integraciones y APIs para soluciones empresariales.',
       'Java, Spring Boot, SQL, APIs REST, Git y buenas practicas de documentacion.',
       'remoto', 36000, 62000, 'activa', NOW() - INTERVAL 3 DAY, CURDATE() + INTERVAL 42 DAY, @REC_ACCENTURE
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Desarrollador Backend Java' AND id_reclutador = @REC_ACCENTURE);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Consultor RPA Junior',
       'Apoyar automatizaciones de procesos, documentar flujos y dar seguimiento a pruebas funcionales.',
       'Logica de procesos, Excel, SQL basico, documentacion y disposicion para aprender herramientas RPA.',
       'hibrido', 25000, 39000, 'activa', NOW() - INTERVAL 2 DAY, CURDATE() + INTERVAL 36 DAY, @REC_ACCENTURE
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Consultor RPA Junior' AND id_reclutador = @REC_ACCENTURE);

INSERT INTO vacantes (titulo_puesto, descripcion_puesto, requisitos, modalidad, salario_min, salario_max, estado, fecha_publicacion, fecha_cierre, id_reclutador)
SELECT 'Tutor de Tecnologia Accesible',
       'Acompanamiento a estudiantes en rutas de tecnologia y accesibilidad digital. Esta vacante pertenece a empresa pendiente.',
       'Comunicacion clara, tecnologia web, pedagogia y sensibilidad hacia accesibilidad.',
       'remoto', 18000, 30000, 'activa', NOW() - INTERVAL 1 DAY, CURDATE() + INTERVAL 30 DAY, @REC_PLATZI
WHERE NOT EXISTS (SELECT 1 FROM vacantes WHERE titulo_puesto = 'Tutor de Tecnologia Accesible' AND id_reclutador = @REC_PLATZI);

/* Variables de vacantes */
SELECT id_vacante INTO @VAC_MS_ACC FROM vacantes WHERE titulo_puesto = 'Especialista en Accesibilidad Digital' AND id_reclutador = @REC_MICROSOFT LIMIT 1;
SELECT id_vacante INTO @VAC_MS_REACT FROM vacantes WHERE titulo_puesto = 'Desarrollador Frontend React' AND id_reclutador = @REC_MICROSOFT LIMIT 1;
SELECT id_vacante INTO @VAC_IBM_QA FROM vacantes WHERE titulo_puesto = 'Analista QA Software Accesible' AND id_reclutador = @REC_IBM LIMIT 1;
SELECT id_vacante INTO @VAC_IBM_DATOS FROM vacantes WHERE titulo_puesto = 'Consultor de Datos Junior' AND id_reclutador = @REC_IBM LIMIT 1;
SELECT id_vacante INTO @VAC_BBVA_SOPORTE FROM vacantes WHERE titulo_puesto = 'Ejecutivo de Soporte Digital' AND id_reclutador = @REC_BBVA LIMIT 1;
SELECT id_vacante INTO @VAC_BBVA_DATOS FROM vacantes WHERE titulo_puesto = 'Analista de Datos Banca Inclusiva' AND id_reclutador = @REC_BBVA LIMIT 1;
SELECT id_vacante INTO @VAC_CINE_CLIENTES FROM vacantes WHERE titulo_puesto = 'Coordinador de Atencion a Clientes Digital' AND id_reclutador = @REC_CINEPOLIS LIMIT 1;
SELECT id_vacante INTO @VAC_CINE_UX FROM vacantes WHERE titulo_puesto = 'Disenador UX de Experiencias Accesibles' AND id_reclutador = @REC_CINEPOLIS LIMIT 1;
SELECT id_vacante INTO @VAC_ACC_JAVA FROM vacantes WHERE titulo_puesto = 'Desarrollador Backend Java' AND id_reclutador = @REC_ACCENTURE LIMIT 1;
SELECT id_vacante INTO @VAC_ACC_RPA FROM vacantes WHERE titulo_puesto = 'Consultor RPA Junior' AND id_reclutador = @REC_ACCENTURE LIMIT 1;
SELECT id_vacante INTO @VAC_PLATZI_TUTOR FROM vacantes WHERE titulo_puesto = 'Tutor de Tecnologia Accesible' AND id_reclutador = @REC_PLATZI LIMIT 1;

/* Discapacidades compatibles por vacante */
INSERT IGNORE INTO vacante_discapacidad (id_vacante, id_tipo_discapacidad) VALUES
(@VAC_MS_ACC, 2), (@VAC_MS_ACC, 1), (@VAC_MS_ACC, 3), (@VAC_MS_ACC, 5),
(@VAC_MS_REACT, 1), (@VAC_MS_REACT, 2), (@VAC_MS_REACT, 5),
(@VAC_IBM_QA, 3), (@VAC_IBM_QA, 5), (@VAC_IBM_QA, 1),
(@VAC_IBM_DATOS, 1), (@VAC_IBM_DATOS, 2), (@VAC_IBM_DATOS, 5),
(@VAC_BBVA_SOPORTE, 3), (@VAC_BBVA_SOPORTE, 4), (@VAC_BBVA_SOPORTE, 5),
(@VAC_BBVA_DATOS, 1), (@VAC_BBVA_DATOS, 2), (@VAC_BBVA_DATOS, 5),
(@VAC_CINE_CLIENTES, 3), (@VAC_CINE_CLIENTES, 4), (@VAC_CINE_CLIENTES, 5),
(@VAC_CINE_UX, 2), (@VAC_CINE_UX, 1), (@VAC_CINE_UX, 5),
(@VAC_ACC_JAVA, 1), (@VAC_ACC_JAVA, 2), (@VAC_ACC_JAVA, 5),
(@VAC_ACC_RPA, 1), (@VAC_ACC_RPA, 4), (@VAC_ACC_RPA, 5),
(@VAC_PLATZI_TUTOR, 1), (@VAC_PLATZI_TUTOR, 2), (@VAC_PLATZI_TUTOR, 3);

/* Postulaciones */
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'pendiente', NOW() - INTERVAL 6 DAY, @POS_MARIANA, @VAC_MS_ACC
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_MARIANA AND id_vacante = @VAC_MS_ACC);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'entrevista', NOW() - INTERVAL 4 DAY, @POS_JORGE, @VAC_MS_REACT
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_JORGE AND id_vacante = @VAC_MS_REACT);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'pendiente', NOW() - INTERVAL 5 DAY, @POS_FERNANDA, @VAC_IBM_QA
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_FERNANDA AND id_vacante = @VAC_IBM_QA);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'aceptado', NOW() - INTERVAL 3 DAY, @POS_LUIS, @VAC_IBM_DATOS
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_LUIS AND id_vacante = @VAC_IBM_DATOS);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'pendiente', NOW() - INTERVAL 2 DAY, @POS_CAMILA, @VAC_BBVA_SOPORTE
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_CAMILA AND id_vacante = @VAC_BBVA_SOPORTE);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'rechazado', NOW() - INTERVAL 8 DAY, @POS_DIEGO, @VAC_ACC_JAVA
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_DIEGO AND id_vacante = @VAC_ACC_JAVA);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'pendiente', NOW() - INTERVAL 1 DAY, @POS_MARIANA, @VAC_CINE_UX
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_MARIANA AND id_vacante = @VAC_CINE_UX);
INSERT INTO postulaciones (estado, fecha_postulacion, id_postulante, id_vacante)
SELECT 'pendiente', NOW() - INTERVAL 1 DAY, @POS_DIEGO, @VAC_ACC_RPA
WHERE NOT EXISTS (SELECT 1 FROM postulaciones WHERE id_postulante = @POS_DIEGO AND id_vacante = @VAC_ACC_RPA);

/* Certificaciones demo con PDF valido */
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Google UX Design Professional Certificate', 'Coursera / Google', @DEMO_PDF, '2024-05-12', @POS_MARIANA
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Google UX Design Professional Certificate' AND id_postulante = @POS_MARIANA);
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Web Accessibility Fundamentals', 'W3C Web Accessibility Initiative', @DEMO_PDF, '2024-09-20', @POS_MARIANA
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Web Accessibility Fundamentals' AND id_postulante = @POS_MARIANA);
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Back End Development and APIs', 'freeCodeCamp', @DEMO_PDF, '2023-11-03', @POS_DIEGO
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Back End Development and APIs' AND id_postulante = @POS_DIEGO);
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Software Testing Foundations', 'LinkedIn Learning', @DEMO_PDF, '2024-02-14', @POS_FERNANDA
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Software Testing Foundations' AND id_postulante = @POS_FERNANDA);
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Data Analysis with Python', 'IBM SkillsBuild', @DEMO_PDF, '2024-03-08', @POS_LUIS
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Data Analysis with Python' AND id_postulante = @POS_LUIS);
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Soporte de TI de Google', 'Coursera / Google', @DEMO_PDF, '2023-10-18', @POS_CAMILA
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Soporte de TI de Google' AND id_postulante = @POS_CAMILA);
INSERT INTO certificaciones (nombre_certificacion, institucion_dada, pdf, fecha_emitido, id_postulante)
SELECT 'Responsive Web Design', 'freeCodeCamp', @DEMO_PDF, '2024-06-01', @POS_JORGE
WHERE NOT EXISTS (SELECT 1 FROM certificaciones WHERE nombre_certificacion = 'Responsive Web Design' AND id_postulante = @POS_JORGE);

/* Reportes de vacantes: datos para probar panel admin y reclutador */
INSERT INTO reporte_vacante (motivo, fecha_reporte, id_vacante, id_usuario)
SELECT 'La descripcion no especifica ajustes razonables para entrevista ni herramientas accesibles.',
       NOW() - INTERVAL 2 DAY, @VAC_BBVA_SOPORTE, @USR_CAMILA
WHERE NOT EXISTS (SELECT 1 FROM reporte_vacante WHERE id_vacante = @VAC_BBVA_SOPORTE AND id_usuario = @USR_CAMILA);

INSERT INTO reporte_vacante (motivo, fecha_reporte, id_vacante, id_usuario)
SELECT 'La vacante solicita experiencia excesiva para un puesto junior; requiere revision de requisitos.',
       NOW() - INTERVAL 1 DAY, @VAC_ACC_RPA, @USR_DIEGO
WHERE NOT EXISTS (SELECT 1 FROM reporte_vacante WHERE id_vacante = @VAC_ACC_RPA AND id_usuario = @USR_DIEGO);

INSERT INTO reporte_vacante (motivo, fecha_reporte, id_vacante, id_usuario)
SELECT 'La publicacion pertenece a una empresa pendiente de aprobacion y no deberia mostrarse al postulante.',
       NOW() - INTERVAL 6 HOUR, @VAC_PLATZI_TUTOR, @USR_MARIANA
WHERE NOT EXISTS (SELECT 1 FROM reporte_vacante WHERE id_vacante = @VAC_PLATZI_TUTOR AND id_usuario = @USR_MARIANA);

COMMIT;

/* Cuentas creadas / actualizadas */
SELECT
  'CUENTA DEMO' AS tipo,
  r.nombre_rol AS rol,
  u.correo,
  'Inclusive2026!' AS password,
  CONCAT(u.nombres, ' ', u.apellidos) AS nombre
FROM usuarios u
INNER JOIN rol r ON r.id_rol = u.id_rol
WHERE u.correo LIKE '%.demo@inclusivejob.demo'
   OR u.correo LIKE 'reclutador.%@inclusivejob.demo'
   OR u.correo LIKE 'postulante.%@inclusivejob.demo'
ORDER BY u.id_rol, u.correo;

/* Resumen de datos demo insertados */
SELECT 'empresas_demo' AS entidad, COUNT(*) AS total
FROM empresas
WHERE nombre_empresas IN ('Microsoft Mexico','IBM Mexico','BBVA Mexico','Cinepolis','Accenture Mexico','Platzi')
UNION ALL
SELECT 'reclutadores_demo', COUNT(*)
FROM usuarios
WHERE correo LIKE 'reclutador.%@inclusivejob.demo'
UNION ALL
SELECT 'postulantes_demo', COUNT(*)
FROM usuarios
WHERE correo LIKE 'postulante.%@inclusivejob.demo'
UNION ALL
SELECT 'vacantes_demo', COUNT(*)
FROM vacantes
WHERE titulo_puesto IN (
  'Especialista en Accesibilidad Digital',
  'Desarrollador Frontend React',
  'Analista QA Software Accesible',
  'Consultor de Datos Junior',
  'Ejecutivo de Soporte Digital',
  'Analista de Datos Banca Inclusiva',
  'Coordinador de Atencion a Clientes Digital',
  'Disenador UX de Experiencias Accesibles',
  'Desarrollador Backend Java',
  'Consultor RPA Junior',
  'Tutor de Tecnologia Accesible'
)
UNION ALL
SELECT 'postulaciones_demo', COUNT(*)
FROM postulaciones p
INNER JOIN postulantes pos ON pos.id_postulante = p.id_postulante
INNER JOIN usuarios u ON u.id_usuario = pos.id_usuario
WHERE u.correo LIKE 'postulante.%@inclusivejob.demo'
UNION ALL
SELECT 'certificaciones_demo', COUNT(*)
FROM certificaciones c
INNER JOIN postulantes pos ON pos.id_postulante = c.id_postulante
INNER JOIN usuarios u ON u.id_usuario = pos.id_usuario
WHERE u.correo LIKE 'postulante.%@inclusivejob.demo'
UNION ALL
SELECT 'reportes_demo', COUNT(*)
FROM reporte_vacante rv
INNER JOIN usuarios u ON u.id_usuario = rv.id_usuario
WHERE u.correo LIKE 'postulante.%@inclusivejob.demo';

