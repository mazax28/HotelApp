# HotelApp Backend

This is the backend service for the HotelApp application, responsible for managing hotels, rooms, clients, and reservations. It's built with Node.js, Express, and Prisma ORM.

## Version
1.0.0

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/         # Database migration files
│   └── schema.prisma       # Prisma schema definition
│   └── dev.db              # SQLite database file (local development)
├── src/
│   ├── modules/            # Feature modules (clients, hotels, rooms, reservations)
│   │   ├── clients/
│   │   │   ├── client.controller.js
│   │   │   ├── client.routes.js
│   │   │   └── client.service.js
│   │   ├── hotels/
│   │   │   ├── hotel.controller.js
│   │   │   ├── hotel.routes.js
│   │   │   └── hotel.service.js
│   │   ├── reservations/
│   │   │   ├── reservation.controller.js
│   │   │   ├── reservation.routes.js
│   │   │   └── reservation.service.js
│   │   └── rooms/
│   │       ├── room.controller.js
│   │       ├── room.routes.js
│   │       └── room.service.js
│   ├── utils/              # Utility functions (e.g., Prisma client setup)
│   ├── app.js              # Express application setup (middleware, routes)
│   └── index.js            # Main entry point, starts the server
├── .env                    # Environment variables (DATABASE_URL, PORT, etc.)
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Prerequisites

*   Node.js (version compatible with ES Modules)
*   npm or yarn

## Installation

1.  Clone the repository (if you haven't already):
    ```bash
    git clone <your-repository-url>
    cd HotelApp/backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Database Setup**:
    The project is configured to use a local SQLite database (`dev.db`). The initial migration has been applied.
    *   Ensure your Prisma schema (`prisma/schema.prisma`) is up to date.
    *   Generate the Prisma Client:
        ```bash
        npx prisma generate
        ```
    *   If you need to apply further migrations in the future, use:
        ```bash
        npx prisma migrate dev --name <migration-name>
        ```

## Environment Variables

Create a `.env` file in the `backend` directory. It should at least contain the `DATABASE_URL` for the SQLite database and the `PORT`.

```env
DATABASE_URL="file:./prisma/dev.db" # Path to your SQLite database file
PORT=3000
# Add any other environment variables your application needs
```
*Note: Ensure the `DATABASE_URL` path correctly points to your `dev.db` file, which is typically located within the `prisma` directory after migrations.*

## Running the Application

To run the application in development mode (with auto-reloading on file changes):

```bash
npm run dev
```

The server will typically start on `http://localhost:3000` (or the port specified in your `.env` file).

## Key Technologies & Dependencies

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web application framework for Node.js.
*   **Prisma**: Next-generation ORM for Node.js and TypeScript.
    *   `@prisma/client`: Prisma's query builder.
    *   `prisma`: CLI for migrations, schema management, etc.
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
*   **Morgan**: HTTP request logger middleware.

## API Endpoints

The application exposes RESTful APIs for managing:
*   Clients (`/api/clients`)
*   Hotels (`/api/hotels`)
*   Rooms (`/api/rooms`)
*   Reservations (`/api/reservations`)

Refer to the route definitions in `src/modules/*/routes.js` for detailed endpoint paths and HTTP methods.

---

This README provides a good starting point. You can expand it further with more details about specific API endpoints, authentication, deployment, or any other relevant information.