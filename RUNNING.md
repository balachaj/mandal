# Running Mandal

## Prerequisites
- **Docker** and **Docker Compose** installed.
- **Node.js** (v18+) and **npm** installed (for local development).

## Option 1: Quick Start with Docker (Recommended)
This will spin up the PostgreSQL database and the backend server.

1.  **Environment Setup**:
    Copy `mandal/server/.env.example` (or create it) with:
    ```env
    DATABASE_URL="postgresql://postgres:password@db:5432/mandal?schema=public"
    FRONTEND_URL="http://localhost:5173"
    PORT=3001
    ```
2.  **Start Services**:
    ```bash
    cd mandal
    docker-compose up --build
    ```
    *Note: The server is configured to automatically run `npx prisma db push` on startup. This ensures the database schema stays in sync with your models without manual intervention.*
3.  **Run Client**:
    ```bash
    cd mandal/client
    npm install
    npm run dev
    ```

## Option 2: Local Development
1.  **Database**: Ensure a PostgreSQL instance is running.
2.  **Server**:
    ```bash
    cd mandal/server
    npm install
    # Update .env with your local DB URL
    npx prisma migrate dev
    npm run dev
    ```
3.  **Client**:
    ```bash
    cd mandal/client
    npm install
    npm run dev
    ```

## Connecting Messaging (Twilio/WhatsApp)
To enable live messaging, update the `sendSMS` function in `server/src/index.ts` with your Twilio credentials and set up a Twilio webhook pointing to:
`https://<your-domain>/api/webhooks/messaging`
