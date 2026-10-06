-- Demo data so the system can be explored right after `docker compose up`.
-- Repeatable migration: runs after the versioned ones and again only if this file changes.
-- ON CONFLICT DO NOTHING keeps it idempotent and never overwrites user edits.

INSERT INTO students (student_code, first_name, last_name) VALUES
    ('S-0001', 'Ana',       'Pérez'),
    ('S-0002', 'Luis',      'Gómez'),
    ('S-0003', 'María',     'Fernández'),
    ('S-0004', 'Carlos',    'Rojas'),
    ('S-0005', 'Lucía',     'Mamani'),
    ('S-0006', 'Diego',     'Quispe'),
    ('S-0007', 'Valentina', 'Torres'),
    ('S-0008', 'Jorge',     'Vargas'),
    ('S-0009', 'Camila',    'Flores'),
    ('S-0010', 'Andrés',    'Castro'),
    ('S-0011', 'Sofía',     'Ramírez'),
    ('S-0012', 'Mateo',     'Choque')
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO courses (code, title, description) VALUES
    ('MATH-101', 'Cálculo I',                   'Límites, derivadas e integrales de funciones de una variable.'),
    ('PHYS-101', 'Física I',                    'Mecánica clásica: cinemática, dinámica, trabajo y energía.'),
    ('CS-101',   'Introducción a la Programación', 'Fundamentos de algoritmos y programación estructurada.'),
    ('CS-201',   'Estructuras de Datos',        'Listas, pilas, colas, árboles, grafos y análisis de complejidad.'),
    ('DB-101',   'Bases de Datos',              'Modelo relacional, SQL, normalización y transacciones.'),
    ('ENG-101',  'Inglés Técnico',              'Lectura y redacción de documentación técnica en inglés.'),
    ('ART-110',  'Taller de Fotografía',        NULL)
ON CONFLICT (code) DO NOTHING;

-- Enrollments by code so the script does not depend on generated ids.
-- ART-110 and S-0012 are intentionally left without enrollments (empty states in the UI).
INSERT INTO enrollments (student_id, course_id)
SELECT s.id, c.id
FROM (VALUES
    ('S-0001', 'MATH-101'), ('S-0001', 'CS-101'),   ('S-0001', 'ENG-101'),
    ('S-0002', 'MATH-101'), ('S-0002', 'PHYS-101'),
    ('S-0003', 'CS-101'),   ('S-0003', 'CS-201'),   ('S-0003', 'DB-101'),
    ('S-0004', 'PHYS-101'), ('S-0004', 'MATH-101'),
    ('S-0005', 'DB-101'),   ('S-0005', 'CS-201'),
    ('S-0006', 'ENG-101'),
    ('S-0007', 'CS-101'),   ('S-0007', 'MATH-101'),
    ('S-0008', 'DB-101'),
    ('S-0009', 'CS-201'),   ('S-0009', 'ENG-101'),
    ('S-0010', 'PHYS-101'), ('S-0010', 'CS-101'),
    ('S-0011', 'MATH-101'), ('S-0011', 'DB-101')
) AS pairs (student_code, course_code)
JOIN students s ON s.student_code = pairs.student_code
JOIN courses  c ON c.code = pairs.course_code
ON CONFLICT (student_id, course_id) DO NOTHING;
