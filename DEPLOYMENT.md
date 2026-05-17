# Mandal Deployment Guide (Railway + GitHub)

This guide outlines how to move Mandal from your local machine to the cloud using **Railway** and **GitHub** for an automated CI/CD pipeline.

---

## 🏗️ 1. Prepare for Cloud (One-Time Setup)

### **A. Git Push**
1.  Create a **Private** repository on GitHub named `mandal`.
2.  Initialize and push your local code:
    ```bash
    cd mandal
    git init
    git add .
    git commit -m "Initial Mandal cloud-ready build"
    git remote add origin https://github.com/YOUR_USERNAME/mandal.git
    git push -u origin main
    ```

### **B. Railway Infrastructure**
1.  Go to [Railway.app](https://railway.app/) and create a **New Project**.
2.  Select **Provision PostgreSQL**. Railway will give you a internal `DATABASE_URL`.
3.  Select **GitHub Repo** and connect your `mandal` repository.

---

## 🚀 2. Configuring Services

### **The Backend (Server)**
1.  In Railway, add a new **Service** and point it to the `/server` directory of your repo.
2.  **Environment Variables**: Copy your local `.env` values to the Railway dashboard:
    - `DATABASE_URL`: (Railway will auto-fill this if you link the DB).
    - `FRONTEND_URL`: (The URL of your Railway frontend, e.g., `mandal.up.railway.app`).
    - `WA_ACCESS_TOKEN`, `TWILIO_SID`, etc.
3.  **Nixpacks Build**: Railway will automatically detect the `Dockerfile`. It will run `npx prisma db push` and `npm start` just like in your docker-compose.

### **The Frontend (Client)**
1.  Add another **Service** in the same project and point it to the `/client` directory.
2.  Railway will detect it as a **Vite** app.
3.  Set the **Build Command**: `npm run build`.
4.  Set the **Start Command**: `npm run preview` or use a static host provider.

---

## 🔄 3. Automated CI/CD (The "Magic" Part)

Once connected, your pipeline is fully automated:
1.  **Code Change**: You make a change to the code (e.g., in a component).
2.  **Git Commit**: You run `git commit -m "update UI"` and `git push`.
3.  **Auto-Deploy**: Railway sees the push to GitHub, triggers a build, and replaces your live site with the new version in ~2 minutes.

---

## 📱 4. Running on your Phone
1.  Once Railway gives you a public URL (e.g., `mandal-production.up.railway.app`), open it in **Safari (iOS)** or **Chrome (Android)**.
2.  Tap the "Share" or "Menu" icon and select **"Add to Home Screen."**
3.  Mandal will now appear as an app icon on your phone!

---

## ⚠️ Important for Prisma
In Railway, ensure you set the **`PRISMA_SKIP_POSTINSTALL_GENERATE=1`** environment variable if you run into build errors, but typically Railway's Nixpacks handles this perfectly.
