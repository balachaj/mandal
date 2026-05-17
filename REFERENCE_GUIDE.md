# Mandal: Testing & Reference Guide

This document synthesizes our entire conversation and the features built for the **Mandal** platform. Use this as your master manual for testing and future development.

---

## 🌟 1. Project Vision
Mandal (मण्डल) is a "Reliable Coordinator" for high-stakes mutual aid. Unlike social media group chats, it uses deterministic workflows to ensure that service requests (like medical rides) are matched, tracked, and completed without being lost in the "noise."

---

## 🛠️ 2. Setup & Execution
### **How to Start the Platform**
Navigate to the `mandal` directory and run:
```bash
docker-compose down
docker-compose up --build
```
*This starts the PostgreSQL database, applies migrations, and runs the Express server with live-reloading.*

### **How to Start the Frontend**
```bash
cd mandal/client
npm install
npm run dev
```

---

## 🚦 3. Core User Flows (How to Test)

### **A. The "Mandal Lifecycle" (Creator Flow)**
1.  **Create**: Go to `/create`. Enter a name and optional sponsor (logo URL/link).
2.  **Magic Link**: On success, copy the generated **Magic Link**.
3.  **Share**: This is the link you would share in WhatsApp/Signal groups.

### **B. The "Asymmetric Request" (Requester Flow)**
1.  **Request**: Go to `/request`. Select a category (or "Other" to see the custom text field).
2.  **Submit**: On success, use the **"Share to WhatsApp"** button to see the zero-cost broadcast link (`wa.me`).
3.  **Monitor**: Once a volunteer accepts, the requester will eventually see the task move to `MATCHED` status.

### **C. The "Coordination Hub" (Volunteer Flow)**
1.  **Discover**: Go to `/feed`. Browse the **Available** tab.
2.  **Accept**: Click "Accept Task." The task moves to the **My Tasks** tab.
3.  **Logistics**: In **My Tasks**, use the **"Get Directions"** (Google Maps) and **"Add to Calendar"** buttons.
4.  **Complete**: After fulfilling the need, click **"Mark Completed"** to archive the task.

### **D. The "Walled Garden" Security (Admin Flow)**
1.  **Settings**: Go to `/admin > Settings`. Toggle **"Require Admin Approval."**
2.  **Vetting**: Have a new user join. They will see an "Application Under Review" screen.
3.  **Approve**: As the Admin, go to `/admin > Members` and click the **ShieldCheck** icon to unlock their account.

---

## 🛡️ 4. Safety & Trust Features
- **Deterministic Locking**: The first volunteer to click "Accept" locks the task; others receive a "Task Taken" notice.
- **Reporting**: Any user can "Flag" a request in the feed. 3 flags = automatic hide.
- **Normalization**: Phone numbers are automatically sanitized (keeping the `+` for international support) to prevent duplicate accounts.
- **Super Admin**: Access the **Mandal Directory** in the Admin Console to see all community health stats globally.

---

## 🗺️ 5. The Road Ahead (Remaining Phases)
- **Phase 2**: Plug in real `WA_ACCESS_TOKEN` and `TWILIO_SID` to move from logs to real texts.
- **Phase 6**: Build the "Fuel Tank" top-up billing loop.
- **Phase 7**: Institutional Support (Multi-volunteer events and recurring temple/church needs).

---

## 📁 6. Key File Map
- `server/src/index.ts`: The Brain (API Routes & Routing Logic).
- `server/src/messaging.ts`: The Messenger (WhatsApp/Twilio logic).
- `client/src/components/VolunteerFeed.tsx`: The Coordination Hub UI.
- `client/src/components/AdminDashboard.tsx`: The Command Center UI.
- `ROADMAP.md`: Long-term strategy.
- `MESSAGING_SETUP.md`: Instructions for Meta/Twilio credentials.
