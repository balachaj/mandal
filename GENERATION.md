# Mandal Generation Report

## Architectural Decisions
1.  **Walled Gardens**: Implemented using unique UUIDs for `Mandals`. This allows for cryptographically secure "Magic Links" that can be shared in private groups (WhatsApp, Signal, etc.) to onboard users into a specific trust circle.
2.  **Asymmetric UI**: 
    *   **Requester Side**: Mobile-responsive web form (PWA) for structured data entry.
    *   **Volunteer Side**: SMS/WhatsApp interface. This reduces friction for volunteers who don't need to install an app or log into a website to help.
3.  **Atomic Task Locking**: The backend uses Prisma's atomic updates to ensure that when a volunteer replies to an SMS, the task is locked to them only if it is still in the `OPEN` state, preventing double-booking.
4.  **Fuel Tank**: A `MandalStats` table tracks `messages_sent`. When the threshold (500) hit, a system log/alert is generated to prompt the admin for a top-up.
5.  **Tech Stack**:
    *   **Frontend**: React (Vite) + Tailwind CSS for a modern, fast, and responsive mobile experience.
    *   **Backend**: Node.js (Express) + TypeScript + Prisma ORM for type safety and maintainability.
    *   **Database**: PostgreSQL for robust relational data management.

## Key Files Created
- `server/src/index.ts`: The core engine handling Magic Links, Request Intake, and Messaging Webhooks.
- `server/prisma/schema.prisma`: The relational model for Mandals, Users, and Requests.
- `client/src/components/RequestForm.tsx`: The mobile-optimized intake form.
- `client/src/components/JoinMandal.tsx`: The Magic Link onboarding interface.
- `docker-compose.yml`: Orchestration for the database and server.
