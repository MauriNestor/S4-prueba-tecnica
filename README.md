# S4 – Super Simple Scheduling System

[![CI](https://github.com/MauriNestor/S4-prueba-tecnica/actions/workflows/ci.yml/badge.svg)](https://github.com/MauriNestor/S4-prueba-tecnica/actions/workflows/ci.yml)

Aplicación para administrar **estudiantes** y **clases**, inscribir estudiantes en clases y consultar
la relación en ambos sentidos. Expone una **API REST** documentada con OpenAPI y una **interfaz web**,
persiste en **PostgreSQL** y se levanta completa con **Docker Compose**.

- [Inicio rápido](#inicio-rápido)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Configuración](#configuración)
- [Desarrollo local](#desarrollo-local)
- [Pruebas y calidad](#pruebas-y-calidad)
- [API](#api)
- [Reglas de negocio](#reglas-de-negocio)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Arquitectura y decisiones](#arquitectura-y-decisiones)
- [Uso de IA](#uso-de-ia)

---

## Inicio rápido

Requisito: **Docker** (con Docker Compose v2).

```bash
git clone https://github.com/MauriNestor/S4-prueba-tecnica.git
cd S4-prueba-tecnica
cp .env.example .env            # opcional: cambia DB_PASSWORD
docker compose up --build
```

Cuando los tres servicios estén `healthy`:

| Servicio | URL |
|---|---|
| Interfaz web | http://localhost:3000 |
| API REST | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Especificación OpenAPI | http://localhost:8080/v3/api-docs |

La base de datos se crea con las migraciones de Flyway y se cargan **datos de ejemplo**
(12 estudiantes, 7 clases y 22 inscripciones). Para empezar de cero: `docker compose down -v`.

El arranque es ordenado: `db` → `backend` → `frontend`, y cada servicio espera a que el anterior
pase su *healthcheck*.

## Funcionalidades

| Requisito del enunciado | Cómo se cumple |
|---|---|
| Crear, editar y eliminar estudiantes | Formularios en la UI y `POST/PUT/DELETE /api/students`, con validaciones en cliente y servidor |
| Listar estudiantes | Tabla paginada y ordenable (código, nombre, apellido, última actualización) |
| Crear, editar y eliminar clases | Formularios en la UI y `POST/PUT/DELETE /api/classes` |
| Listar clases (código, título y descripción) | Tabla paginada y ordenable; la descripción es opcional y se muestra `—` si falta |
| Relacionar estudiantes y clases | Inscripción desde el detalle del estudiante o de la clase; un estudiante puede tomar varias clases |
| Estudiantes de una clase | Detalle de la clase y `GET /api/classes/{id}/students` |
| Clases de un estudiante | Detalle del estudiante y `GET /api/students/{id}/classes` |
| Búsqueda | Buscador en cada listado; ver [comportamiento de la búsqueda](#búsqueda-paginación-y-orden) |

Además, la interfaz incluye:

- **Mensajes:** notificaciones de éxito y error, y los errores de validación de la API aparecen en el campo correspondiente.
- **Estados de la interfaz:** carga con *skeletons*, listado vacío, sin resultados, error de conexión con "Reintentar" y página 404.
- **Navegación:** la búsqueda, la página y el orden quedan en la URL (recargar o volver atrás conserva la vista), y el diseño se adapta a móvil.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Java 21, Spring Boot 4.1 (Web MVC, Data JPA, Validation, Actuator), Maven |
| Base de datos | PostgreSQL 16, migraciones con Flyway |
| Documentación de la API | springdoc-openapi (Swagger UI) |
| Frontend | React 19, TypeScript, Vite, Mantine, TanStack Query, React Router, React Hook Form + Zod |
| Pruebas | JUnit 5, Mockito, Spring MockMvc, Testcontainers; Vitest + Testing Library |
| Contenedores | Dockerfiles multi-stage, nginx (sirve la SPA y hace de proxy de `/api`), Docker Compose |
| CI | GitHub Actions |

## Configuración

Toda la configuración se toma de variables de entorno. `docker compose` las lee del archivo `.env`,
que está en `.gitignore`. En el repositorio solo se publica [`.env.example`](.env.example), con
valores de desarrollo.

| Variable | Por defecto | Uso |
|---|---|---|
| `DB_PASSWORD` | — (obligatoria) | Contraseña de PostgreSQL |
| `DB_NAME` | `s4` | Nombre de la base |
| `DB_USER` | `s4` | Usuario de la base |
| `DB_PORT` | `5432` | Puerto de PostgreSQL publicado en el host |
| `API_PORT` | `8080` | Puerto de la API publicado en el host |
| `WEB_PORT` | `3000` | Puerto de la interfaz publicado en el host |

## Desarrollo local

Para trabajar en el código sin reconstruir imágenes. Requisitos: Java 21, Node 22 (o 20.19+) y Docker.

```bash
cp .env.example .env
docker compose up -d db                # solo PostgreSQL

cd backend
./mvnw spring-boot:run                 # http://localhost:8080 (lee ../.env automáticamente)

# en otra terminal
cd frontend
npm install
npm run dev                            # http://localhost:5173 (Vite hace proxy de /api a :8080)
```

## Pruebas y calidad

```bash
cd backend && ./mvnw verify            # 52 pruebas; requiere Docker (Testcontainers)
cd frontend && npm test                # 10 pruebas
cd frontend && npm run lint && npm run build
```

| Nivel | Qué cubre |
|---|---|
| Servicios (JUnit + Mockito) | Normalización de códigos, duplicados (409), recursos inexistentes (404), inscripción idempotente |
| Controladores (`@WebMvcTest`) | Códigos HTTP, header `Location`, formato de errores, validaciones 400, JSON mal formado, orden no permitido |
| Repositorios (Testcontainers, PostgreSQL real) | Búsqueda (mayúsculas/minúsculas, nombre completo, comodines), restricciones únicas, borrado en cascada, consultas de la relación |
| Datos de ejemplo | Las migraciones y el seed se aplican sin errores |
| Frontend (Vitest + Testing Library) | Interpretación de errores de la API en el cliente HTTP; validación, error 409 y alta en el formulario de estudiante |
| Colección HTTP | [`docs/api.http`](docs/api.http): 27 peticiones con el código esperado anotado, incluido un flujo completo y los casos de error |

La [CI](.github/workflows/ci.yml) ejecuta en cada push las pruebas del backend; el lint, las pruebas
y el build del frontend; y la construcción de las imágenes Docker.

## API

Base: `/api`. Documentación interactiva en **Swagger UI** y ejemplos listos para ejecutar en
[`docs/api.http`](docs/api.http) (extensión *REST Client* de VS Code).

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/students` | Lista paginada; `search`, `page`, `size`, `sort` | 200, 400 |
| GET | `/students/{id}` | Detalle | 200, 404 |
| POST | `/students` | Crear | 201 + `Location`, 400, 409 |
| PUT | `/students/{id}` | Reemplazar | 200, 400, 404, 409 |
| DELETE | `/students/{id}` | Eliminar (y sus inscripciones) | 204, 404 |
| GET | `/students/{id}/classes` | Clases del estudiante | 200, 404 |
| GET | `/classes` | Lista paginada; `search`, `page`, `size`, `sort` | 200, 400 |
| GET | `/classes/{id}` | Detalle | 200, 404 |
| POST | `/classes` | Crear | 201 + `Location`, 400, 409 |
| PUT | `/classes/{id}` | Reemplazar | 200, 400, 404, 409 |
| DELETE | `/classes/{id}` | Eliminar (y sus inscripciones) | 204, 404 |
| GET | `/classes/{id}/students` | Estudiantes de la clase | 200, 404 |
| PUT | `/classes/{classId}/students/{studentId}` | Inscribir (idempotente) | 204, 404 |
| DELETE | `/classes/{classId}/students/{studentId}` | Quitar la inscripción | 204, 404 |

**Cuerpos de petición**

```json
// POST/PUT /api/students
{ "studentCode": "S-0013", "firstName": "Ana", "lastName": "Pérez" }

// POST/PUT /api/classes   (description es opcional)
{ "code": "MATH-201", "title": "Cálculo II", "description": "Integrales múltiples." }
```

**Errores.** Todas las respuestas de error usan el formato estándar
[RFC 7807 (Problem Details)](https://www.rfc-editor.org/rfc/rfc7807). Las de validación agregan un
mapa `errors` con el mensaje de cada campo:

```json
{
  "title": "Validation failed",
  "status": 400,
  "detail": "One or more fields are invalid",
  "instance": "/api/students",
  "errors": { "studentCode": "studentCode is required" }
}
```

### Búsqueda, paginación y orden

- `search`: busca el texto **en cualquier parte** del campo, sin distinguir mayúsculas de minúsculas.
  - Estudiantes: código, nombre, apellido y nombre completo (`"ana pérez"` encuentra a Ana Pérez).
  - Clases: código, título y descripción.
  - Los caracteres `%` y `_` se buscan literalmente; no actúan como comodines.
- `page` empieza en 0 y `size` es 20 por defecto, con un máximo de 100.
- `sort=campo,asc|desc` solo acepta estos campos; cualquier otro devuelve 400:
  - estudiantes: `studentCode`, `firstName`, `lastName`, `createdAt`, `updatedAt` (por defecto `lastName,firstName`);
  - clases: `code`, `title`, `createdAt`, `updatedAt` (por defecto `code`).
- Las listas paginadas responden con `{ content, page, size, totalElements, totalPages }`.

## Reglas de negocio

- **Códigos únicos:** los códigos de estudiante y de clase se guardan sin espacios y en mayúsculas
  (`s-001` y `S-001` son el mismo). Si se repite un código, la API responde **409**.
- **Formato de los campos:**
  - El código es obligatorio, de hasta 20 caracteres, y solo admite letras, números y `-`.
  - Nombre y apellido son obligatorios, de hasta 100 caracteres.
  - El título de la clase es obligatorio, de hasta 150 caracteres; la descripción es opcional, de hasta 1000.
- **Inscripciones:**
  - Un estudiante puede estar en muchas clases y una clase puede tener muchos estudiantes.
  - Inscribir dos veces deja **una sola** inscripción; la petición se puede repetir sin efectos extra.
  - Quitar una inscripción que no existe responde 404.
- **Eliminación:** borrar un estudiante o una clase borra también sus inscripciones. Lo hace la base de
  datos (`ON DELETE CASCADE`), y la interfaz avisa cuántas se perderán antes de confirmar.

## Estructura del repositorio

```
.
├── backend/                    API Spring Boot
│   ├── src/main/java/com/hexagon/s4/
│   │   ├── common/             manejo de errores, paginación, búsqueda, OpenAPI
│   │   ├── student/            entidad, repositorio, servicio, controlador y DTOs
│   │   ├── course/             "clases" (mismo patrón)
│   │   └── enrollment/         relación estudiante ↔ clase
│   ├── src/main/resources/db/
│   │   ├── migration/          esquema (Flyway V1–V3)
│   │   └── seed/               datos de ejemplo (migración repetible)
│   └── Dockerfile
├── frontend/                   SPA React
│   ├── src/api/                cliente HTTP y funciones por endpoint
│   ├── src/hooks/              consultas y mutaciones (TanStack Query), estado en la URL
│   ├── src/components/         layout, tablas, formularios, modales, estados
│   ├── src/pages/              listados y detalles
│   ├── nginx.conf
│   └── Dockerfile
├── design/                     referencias de diseño (Google Stitch)
├── docs/
│   ├── ARCHITECTURE.md         arquitectura y decisiones técnicas
│   └── api.http                colección de peticiones
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Arquitectura y decisiones

El detalle está en **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: diagramas de componentes y
datos, el recorrido de una petición, la estructura del backend y del frontend, y las decisiones
técnicas con su justificación y sus limitaciones conocidas.

En resumen:

- **Backend en capas organizadas por módulo:** `student`, `course` y `enrollment`, cada uno con controller → service → repository.
- **Relación como tabla propia:** la tabla `enrollments` tiene restricción de unicidad y borrado en cascada.
- **Esquema versionado con Flyway:** Hibernate solo valida que coincida.
- **Errores homogéneos:** todos siguen el formato Problem Details.
- **Un solo origen:** nginx sirve la SPA y reenvía `/api` al backend, así que no hace falta configurar CORS.

## Diseño

La interfaz se diseñó primero en Google Stitch. Las pantallas de referencia y los *tokens*
(colores, tipografías, radios, sombras) están en [`design/`](design). El tema de Mantine
(`frontend/src/theme.ts`) se construyó a partir de esos tokens.

## Uso de IA

Este proyecto se desarrolló con asistencia de herramientas de IA, permitida en la evaluación:

- **Claude (Anthropic), mediante Claude Code:**
  - planificación por fases;
  - generación de código del backend, del frontend y de las pruebas;
  - configuración de Docker y CI;
  - redacción de esta documentación.
- **Google Stitch:** generación de las pantallas de referencia y del sistema de diseño.

Yo definí el alcance y las tecnologías, revisé cada fase antes de continuar y validé el resultado
ejecutando la aplicación y las pruebas. Las decisiones técnicas y sus motivos están documentados en
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Seguridad

- No hay secretos en el repositorio: credenciales por variables de entorno y `.env` ignorado por Git.
- Los contenedores del backend y del frontend corren con usuarios sin privilegios.
- Las respuestas de error no exponen *stack traces* ni detalles internos.
- La aplicación no implementa autenticación porque el enunciado no la pide. Ver
  [limitaciones](docs/ARCHITECTURE.md#limitaciones-y-mejoras-futuras).
