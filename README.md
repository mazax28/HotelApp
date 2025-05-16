# 🏨 Sistema de Reservas de Hotel

Este proyecto es una aplicación full-stack para la gestión y reserva de habitaciones de hotel. Incluye:

- Backend en **Node.js** con **Express** y **Prisma ORM**
- Base de datos local en **SQLite**
- Frontend en **React.js** (con Vite)
  
---

## 📁 Estructura General del Proyecto


HotelApp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── dev.db
│   ├── src/
│   │   ├── modules/
│   │   │   ├── clients/
│   │   │   ├── hotels/
│   │   │   ├── reservations/
│   │   │   └── rooms/
│   │   └── utils/
│   ├── .env
│   ├── index.js
│   └── app.js
├── frontend/
│   └── (Código React: formularios, vistas, conexión con API)


---

## ✅ Prerrequisitos

- Ubuntu 22.04.4 LTS o WSL con esa versión o similar
- Node.js >= 16.x
- npm o yarn
- virtualenv (activado)

---

## ⚙️ Instalación del Backend

1. Clona el repositorio:

   git clone <repo-url>
   cd HotelApp/backend

2. Instala las dependencias:
   
   npm install
   

3. Configura el archivo `.env` con esta variable:
   env
   DATABASE_URL="file:./prisma/dev.db"
   PORT=3000
   

4. Genera el cliente de Prisma:
   
   npx prisma generate
   

5. Aplica las migraciones:
   
   npx prisma migrate dev --name init
   

---

## 🧪 Cargar Datos de Prueba (Hoteles)

### Opción 1: Script de Seed

1. Buscar el archivo `seed.js` en `backend/`


2. Ejecuta el script:
   
   node seed.js
   

### Verificar datos en Prisma Studio


npx prisma studio


- Ingresa a la tabla `Hotel` y verifica que los datos de prueba han sido insertados correctamente.


## 🚀 Ejecutar Backend

Desde la carpeta `backend`:

npm run dev


El servidor debería iniciar en `http://localhost:3000`.


## 🌐 Ejecutar Frontend

1. Abre una nueva terminal en el directorio del frontend:
   
   cd ../frontend
   

2. Instala dependencias:
   
   npm install
   

3. Corre la aplicación:
   
   npm run dev
   

4. Abre en tu navegador:
   
   http://localhost:5173
   


## 🔍 Verificación

- Verifica en consola del navegador que **no haya errores 500**.
- El `select` de hoteles debe listar opciones si hay datos en la tabla `Hotel`.


## 🛠 Endpoints de la API (principales)

| Método | Ruta                | Descripción                     |
|--------|---------------------|---------------------------------|
| GET    | `/api/hotels`       | Lista todos los hoteles         |
| GET    | `/api/rooms`        | Lista habitaciones disponibles  |
| POST   | `/api/reservations` | Crear una reserva               |


## 📌 Notas

- El backend usa SQLite, ideal para pruebas locales.
- Prisma gestiona las migraciones, esquemas y conexión a la base de datos.
- El frontend se comunica por `Axios` con el backend (`localhost:3000`).


## 👨‍💻 Autor

Sistema desarrollado por Enrique Saldivar, Kevin Galeano, Marcos Zárate, Maria José Duarte y Ricardo Toledo
