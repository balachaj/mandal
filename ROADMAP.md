# Mandal Project Roadmap

## 🌟 Vision
A trust-based, non-profit mutual aid network that leverages "Walled Gardens" to organize local service requests through an asymmetric, low-friction interface.

---

## 🛣️ Development Phases

### Phase 1: Core Foundation (Completed ✅)
- [x] **Project Structure**: Mono-repo with Node.js/Prisma backend and React/Tailwind frontend.
- [x] **Walled Garden Architecture**: Renamed "Circles" to **Mandals** with unique UUID magic links.
- [x] **Database Schema**: Relational models for Mandals, Users, Sponsors, and Requests.
- [x] **Mobile-Responsive UI**: PWA-ready frontend with branded "Mandal" layout and navbar.
- [x] **Request Engine**: Dynamic intake form with "Other" category support and 15-min time steps.
- [x] **Atomic Locking**: Backend logic to ensure deterministic task matching.

### Phase 2: Live Connectivity & Auth (Functional Logic ✅ / Live API 🚧)
- [x] **WhatsApp Cloud API**: Implemented template-based messaging logic and webhooks.
- [x] **Twilio SMS**: Standard SMS notification and matching logic implemented.
- [x] **Zero-Cost Fallback**: `wa.me` deep links integrated for immediate broadcasting.
- [ ] **Production Auth**: Real SMS OTP verification (Requires live Twilio/WhatsApp credentials).
- [x] **Volunteer Dashboard**: Full Coordination Hub with real-time status updates and tabbed views.

### Phase 3: Utility & Logistics (Completed ✅)
- [x] **Calendar Integration**: Google Calendar deep links generated for matched tasks.
- [x] **Maps Integration**: One-tap routing for volunteers using Google Maps deep links.
- [x] **Task Completion Flow**: UI and Backend for marking tasks as `COMPLETED`.
- [x] **International Support**: Phone normalization supporting all country codes.

### Phase 5: Trust, Safety & Stewardship (Completed ✅)
- [x] **Community Reporting**: "Flag" button for requests to hide harmful content.
- [x] **Admin Moderation**: Dashboard view to review flagged items and delete them.
- [x] **Role Hierarchy**: Distinguished between **Member**, **Mandal Admin** (Owner), and **Super Admin**.
- [x] **Mandal Directory**: master list of all Mandals for platform oversight.

### Phase 6: Administration & Scale (Next Focus 🚀)
- [ ] **Fuel Tank UI**: Dashboard for Mandal Admins to track message credits and "Top Up."
- [ ] **Sponsor Management**: UI to update logos, links, and branding for community partners.
- [ ] **Member Vetting**: Admin toggle to "Approve" new members before they can see requests.

### Phase 7: Communal Stewardship (New Idea 🏮)
- [ ] **Event Containers**: Group multiple shifts/tasks under a single event (e.g., "Festival").
- [ ] **Multi-Volunteer Tasks**: Support for requests that need more than 1 person (e.g., "Need 5 people for kitchen").
- [ ] **Recurring Needs**: Support for weekly or monthly standing requests.

### Phase 8: Cloud Readiness (Active ☁️)
- [ ] **Railway Provisioning**: Deploy managed PostgreSQL and Node.js services.
- [ ] **CI/CD Pipeline**: Connect GitHub repo for automated "push-to-deploy" workflow.
- [ ] **Production Security**: Configure CORS policies and SSL for live URLs.
- [ ] **PWA Deployment**: Verify mobile "Add to Home Screen" on real devices.

---

## 🎯 Current Technical Priorities

| Priority | Feature | Status |
| :--- | :--- | :--- |
| **1** | **Member Vetting** | Planned (Phase 6) |
| **2** | **Multi-Volunteer Tasks** | Planned (Phase 7) |
| **3** | **Live API Deployment** | Ongoing (Requires User Input) |
