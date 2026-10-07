# S4 – Super Simple Scheduling System

Aplicación para administrar estudiantes y clases, sus inscripciones y búsquedas,
expuesta mediante una API REST y una interfaz web.

> En construcción. La documentación completa (instalación, endpoints, arquitectura
> y decisiones técnicas) se completa al cerrar el proyecto.

## Levantar todo con Docker

Requisitos: Docker.

```bash
cp .env.example .env          # ajustar DB_PASSWORD
docker compose up --build
```

| Servicio | URL |
|---|---|
| Interfaz web | http://localhost:3000 |
| API REST | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |

La base se crea con las migraciones de Flyway e incluye datos de ejemplo.
`docker compose down -v` borra el volumen para empezar de cero.
Ejemplos de todos los endpoints en [`docs/api.http`](docs/api.http).

## Desarrollo local (sin Docker para la app)

Requisitos: Java 21, Node 20+, Docker.

```bash
cp .env.example .env          # ajustar DB_PASSWORD
docker compose up -d db       # PostgreSQL 16
cd backend
./mvnw spring-boot:run       # lee ../.env automáticamente
```

En otra terminal, el frontend (requiere Node 20+):

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173 (proxy de /api a :8080)
```

Pruebas:

```bash
cd backend && ./mvnw verify   # requiere Docker para Testcontainers
cd frontend && npm test
```
