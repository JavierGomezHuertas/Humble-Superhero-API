<img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />

# API de Superhéroes con NestJS y Redis

  API para gestión de superhéroes con almacenamiento en Redis. Permite crear y listar superhéroes con sus características principales.

## 🚀 Características

- Crear nuevos superhéroes con:
  - Nombre
  - Superpoder
  - Puntuación de humildad (1-10)
- Listar superhéroes ordenados por humildad (descendente)
- Validación de datos integrada
- Almacenamiento persistente en Redis

## 📋 Requisitos Previos

- Node.js v20+
- npm v9+
- Redis Server v5.0.14.1
- Nest CLI (opcional)
  npm install -g @nestjs/cli

## 🔧 Instalación

Clonar repositorio:
git clone https://github.com/JavierGomezHuertas/superhero-api.git
cd superhero-api

Instalar dependencias:
npm install

Iniciar Redis:
redis-server

## 🏃 Ejecución

npm run start:dev        La API estará disponible en: http://localhost:3000

## 📡 Endpoints

POST /superheroes - Crear superhéroe    http://localhost:3000/superheroes
GET /superheroes - Listar superhéroes   http://localhost:3000/superheroes

## 🛠️ Validaciones

Nombre: Texto no vacío
Superpoder: Texto no vacío
HumilityScore:
Número entero
Entre 1 y 10
Máximo 1 decimal (ej: 7.5)

## 🧪 Pruebas

npm test


## ⏳ Si tuviera más tiempo...

Estas son algunas mejoras y características que implementaría en futuras versiones:

## 🔄 Validaciones Mejoradas
  - Detección de duplicados: Evitar registros idénticos comprobando combinación única de `nombre + superpoder + puntuación`
  - Validación de formato 
  - Rechazar nombres/superpoderes que solo contengan números (`/^\d+$/`)
  - Manejo correcto de decimales usando punto (ej: `10.1` → error, `10,1` → conversión automática a 10.1)

## 🖼️ Gestión Multimedia
  - Foto de perfil de los héroes 
  - Soporte para subir imágenes (AWS S3/Local storage)
  - Miniaturas automáticas
  - Validación de formatos y tamaño

## 🛠️ Operaciones CRUD Completas
  - PATCH /superheroes/:id**: Actualización parcial de heroes
  - PUT /superheroes/:id**: Reemplazo completo del registro
  - DELETE /superheroes/:id**: Borrado de heroe
  - Soft Delete**: Borrado lógico manteniendo histórico

## 📚 Testing
  - Pruebas E2E: 
  - Cobertura de endpoints
  - Mock de Redis para tests aislados

## 🌐 Internacionalización
  - Mensajes de error en múltiples idiomas
  - Soporte UTC para fechas/horas
  - Traducciones automáticas de superpoderes

## 📦 Despliegue
  - Docker Optimizado
  - Configuración por entorno


## 👥 Colaboración en Equipo

Ejemplo de practicas para trabajo en equipo:

### 🤝 Estrategia de Trabajo
1. Git Flow Adaptado
   - Ramas `feature/` para nuevas funcionalidades
   - Pull Requests con revisión
   - Commits semánticos (`feat:`, `fix:`, `docs:`, etc.)

2. División de Tareas por Fortalezas
   A[Backend]
   B[Redis]
   C[Testing]

## 🛠️ Ejemplo de Implementación Conjunta
Caso: Añadir Autenticación JWT

Planificación (30 mins)

Diagramar arquitectura juntos

Definir endpoints necesarios

Desarrollo Paralelo

Partner A: Configura módulo @nestjs/jwt

Partner B: Diseña modelo de usuarios en Redis

Unir ambos componentes

Testear flujo completo

## 📌 Prácticas Clave
Dailys 15 mins cada mañana para:

Compartir progreso

Identificar bloqueos

Alinear prioridades
