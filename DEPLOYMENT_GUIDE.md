# 🚀 AutoGov+ Deployment Guide (SIH Live Showcase)

AutoGov+ is packaged as a high-performance, single-port full-stack application (React 19 SPA frontend + Express API backend + SQLite/JSON data persistence).

---

## ⚡ Option 1: 1-Click Free Cloud Deployment (Render.com) — *Recommended*

Render provides free hosting with native Node.js support and automatic HTTPS certificates.

1. **Push your code to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "AutoGov+ SIH Production Release"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Log into [Render.com](https://render.com).
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository.
   - Configure the following settings:
     - **Name:** `autogov-plus` (or your preferred team name)
     - **Environment:** `Node`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Plan:** `Free`
   - Under **Environment Variables**, add:
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render will supply this automatically)
     - `GEMINI_API_KEY` = `your_google_ai_studio_key` (Optional, for fallback multimodal AI)
   - Click **Create Web Service**. Your live URL will be ready in ~2 minutes!

*(Note: The pre-configured `render.yaml` in this repository can also be used with Render Blueprints for automatic 1-click deployment).*

---

## ⚡ Option 2: Railway.app / Koyeb

1. Go to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Railway automatically detects `package.json`:
   - It will run `npm run build` and `npm start`.
4. Add environment variable:
   - `NODE_ENV` = `production`
   - `GEMINI_API_KEY` = `your_api_key`
5. Generate a public domain under **Settings → Networking → Generate Domain**.

---

## ⚡ Option 3: Docker Container Deployment

A production-ready multi-stage `Dockerfile` is already configured in the root directory.

1. **Build the container:**
   ```bash
   docker build -t autogov-plus .
   ```
2. **Run the container:**
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production autogov-plus
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🧪 Validating Local Production Build

To verify the production build locally before deploying:
```bash
npm run build
npm start
```
The server will boot in production mode at `http://localhost:3000`.
