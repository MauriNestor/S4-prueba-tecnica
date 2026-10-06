# S4 – Super Simple Scheduling System

Aplicación para administrar estudiantes y clases, sus inscripciones y búsquedas,
expuesta mediante una API REST y una interfaz web.

> En construcción. La documentación completa (instalación, endpoints, arquitectura
> y decisiones técnicas) se completa al cerrar el proyecto.

## Desarrollo local (estado actual)

Requisitos: Java 21, Docker.

```bash
cp .env.example .env          # ajustar DB_PASSWORD
docker compose up -d db       # PostgreSQL 16
cd backend
./mvnw spring-boot:run       # lee ../.env automáticamente
```

Pruebas: `cd backend && ./mvnw verify` (requiere Docker para Testcontainers).
