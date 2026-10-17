# Centre for Artificial Intelligence — Requests Office Portal
### Christ University Central Campus

[![Live on Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Tailwind-blue?style=flat&logo=react)](https://react.dev)
[![Institution](https://img.shields.io/badge/Christ%20University-Bengaluru-1b3b57?style=flat)](https://christuniversity.in)

---

## 🔑 Demo Evaluator Login Credentials

For fast review and evaluation, use these pre-configured accounts on the **Sign In** page. All demo accounts share the password: `password123`.

| Role | Name | Institutional Email | Password | Campus | Purpose / Assigned Workflow State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Coordinator** | Prof. Rajesh Nair | `coordinator@christuniversity.in` | `password123` | Central Office | Full intake pipeline, campus filter tabs, specialist routing & decision sanctioning |
| **Specialist** | Dr. K. S. Ramanathan | `specialist@christuniversity.in` | `password123` | Advisory Panel | WhatsApp-clean review desk (~50 yrs old), technical assessments & feedback |
| **Requester 1 (Faculty)** | Dr. Anita Sharma | `anita.sharma@christuniversity.in` | `password123` | Central Campus | AI deep learning GPU workstation request (currently under specialist review) |
| **Requester 2 (Student)** | Priya Sundaram | `priya.s@mca.christuniversity.in` | `password123` | BGR Campus | IEEE conference travel grant (currently has corrections requested) |

---

## 🏛️ Project Overview

An automated, full-stack request management platform built for the **Centre for Artificial Intelligence (CAI) Requests Office** at **Christ University**. 

This system completely replaces legacy, messy workflows previously handled across campus-wise Excel sheets, informal email threads, and mixed WhatsApp chats. It establishes strict role-based data boundaries, institutional email validation, automated 2-day and 7-day SLA tracking, and audit-logged request lifecycles.

---

## 🚀 Key Features & Workflow Implementation

### 1. Unified 3-Role Workflow & Data Isolation
- **Requesters (Faculty & Students)**: Submit applications with details, upload attachments (<10 MB readable files), monitor real-time progress, respond to coordinator corrections, and formally confirm decisions before request closure.
- **Coordinator (Prof. Rajesh Nair)**: Central office intake check within 2 working days, campus-wise filtering tabs (preventing cross-campus spreadsheet mix-ups), request deficiency correction routing, specialist dispatch, and final sanctioning.
- **Specialist (Dr. K. S. Ramanathan, ~50 yrs old)**: Designed with extreme WhatsApp-clean simplicity, large accessible cards, and privacy protection (never communicates with applicant directly; all reviews are mediated by the Coordinator).

### 2. Christ University Institutional Email Enforcement
- **Faculty Format**: `xxx@christuniversity.in` (Verified with light blue faculty badge)
- **Student Format**: `xxx@<course>.christuniversity.in` (Verified with blue student badge, e.g. `priya.s@mca.christuniversity.in`)
- **Non-Christ Domains**: Immediate real-time amber warning alert banner for external domains (e.g. Gmail/Yahoo).

### 3. Vercel Single-Host Monorepo Architecture
- Identical to the [EduFlow](https://github.com/techaxadi01/EduFlow) monorepo architecture:
  - `client/`: React 18, Vite, Tailwind CSS (built to `client/dist`).
  - `server/`: Express backend API with Mongoose and DNS resolution fix.
  - `api/index.js` + `vercel.json`: Vercel serverless function rewrites `/api/*` seamlessly to the Express server, eliminating the need to host the backend separately.

### 4. Dual Theme (Dark & Light Mode)
- One-click toggle in navigation bar, persisted across sessions in `localStorage`.
- High-contrast, university-grade aesthetic avoiding distraction-heavy over-animation.
- Light theme uses an EduFlow-inspired light bluish palette; dark theme features a dark bluish slate palette.

### 5. Secure Credential Storage & Password Encryption
- Industry-standard `bcryptjs` password hashing with dynamic salting (10 rounds) before persisting any user account to MongoDB Atlas.
- Plaintext passwords are never stored in the database or returned via public API responses.
- Automatic password verification using `bcrypt.compare` for secure, tamper-proof user authentication.

---

## 🛠️ Local Development & Running

### Prerequisites
- Node.js (v18+ or v24+)
- MongoDB Atlas connection URI

### 1. Install Dependencies
```bash
# In the project root
npm run install:all
```

### 2. Configure Environment (`server/.env` and `.env`)
Copy `.env.example` to `.env` or set your MongoDB Atlas credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.dmuag96.mongodb.net/CAI_Request_Portal?retryWrites=true&w=majority
JWT_SECRET=christ_university_cai_portal_jwt_secret_key_2026
```

### 3. Start Development Servers
```bash
# Runs Express API and Vite React client concurrently
npm run dev
```
- Client runs on `http://localhost:3000` (with `/api` proxy configured).
- Server runs on `http://localhost:5000`.

---

## ☁️ Vercel Deployment Instructions

1. Push this subfolder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CAI Request Portal"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In Vercel, click **Add New Project** and select this repository.
3. Vercel automatically detects `vercel.json` and `package.json`:
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
4. Under **Settings > Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.dmuag96.mongodb.net/CAI_Request_Portal?retryWrites=true&w=majority`
   - `PORT`: `5000`
   - `JWT_SECRET`: `christ_university_cai_portal_jwt_secret_key_2026`
5. Click **Deploy**. Vercel will host both your frontend SPA and serverless API under the same domain.
