# Mandal: Trust-Based Mutual Aid Network

## Objective
Build a mobile-responsive PWA for "Walled Garden" communities to coordinate high-stakes local service requests (e.g., medical rides, elderly assistance) with a deterministic "Reliable Coordinator" engine.

## Core Philosophy: The Reliable Coordinator
Unlike social media polls or group chats where requests can be "lost in the noise," Mandal acts as a formal coordinator:
1.  **Deterministic Matching**: Atomic locking ensures every request has exactly one or zero matches—never double-booked, never ignored without a trace.
2.  **Asymmetric UI**: Requesters use structured forms for clarity; Volunteers use high-speed SMS/WhatsApp for responsiveness.
3.  **High-Stakes Focus**: Designed for tasks where reliability is non-negotiable (e.g., a ride to a doctor's appointment).

## Tech Stack
- **Frontend**: React (Vite), TypeScript, **Tailwind CSS** (for responsive, mobile-first design), **Vite PWA Plugin**.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL with Prisma ORM.
- **Messaging**: Twilio (SMS), WhatsApp Cloud API.
- **Authentication**: JWT, SMS OTP, Google OAuth.

## Database Schema (Prisma)
- `Mandal`: Independent communities. Unique UUID for magic links.
- `Sponsor`: Branding and logo link for specific mandals.
- `User`: Members and Volunteers (role-based).
- `Request`: Service requests (Ride, Grocery, etc.) with status (Open, Matched, Completed).
- `MandalStats`: Fuel tank (message tracking and thresholds).

## Core Modules

### 1. Walled Garden & Onboarding
- **Magic Links**: Unique, shareable links optimized for WhatsApp/Social Media (e.g., `mandal.app/j/gilbert-neighbors-uuid`).
- **PWA Setup**: Manifest and service worker for "Add to Home Screen" functionality.
- **Onboarding**: One-tap join via Google or SMS OTP. Instant Mandal binding.

### 2. Request Intake Form
- Mobile-optimized, single-column Tailwind form.
- Form validation and direct write to PostgreSQL.

### 3. Asymmetric Response Engine
- **Twilio/WhatsApp Integration**: Full boilerplate for outbound blasts and inbound webhooks.
- **Atomic Locking**: Ensure only the first volunteer can accept a task.

### 4. Utility Integration
- `.ics` and Google Calendar deep links.
- Map routing for volunteers.

## Implementation Phases
1. **Setup**: Mono-repo, Tailwind, PWA plugin, Prisma.
2. **Auth & Mandals**: Magic link generation and Mandal-bound auth.
3. **Requests**: Intake form with mobile-first UI.
4. **Messaging Engine**: Webhook listeners and template blast logic.
5. **Polishing**: "Fuel Tank" alerts and Calendar/Maps integration.

## Verification Plan
- **Unit Tests**: Test Mandal invite logic and request status transitions.
- **Integration Tests**: Mock Twilio webhooks to verify task locking.
- **UI/UX**: Responsive test on mobile viewports for the intake form.
