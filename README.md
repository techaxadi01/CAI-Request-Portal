# Centre for Artificial Intelligence — Requests Office Portal
### Christ University Central Campus

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Tailwind-blue?style=flat&logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20Node.js-lightgrey?style=flat&logo=node.js)](https://nodejs.org)
[![Security](https://img.shields.io/badge/Security-bcrypt%20Encrypted-success?style=flat&logo=shield)](https://github.com/dcodeIO/bcrypt.js)
[![Institution](https://img.shields.io/badge/Christ%20University-Bengaluru-1b3b57?style=flat)](https://christuniversity.in)
[![Release](https://img.shields.io/badge/Release-FINAL%20VERSION-blueviolet?style=flat)](https://github.com/techaxadi01/CAI-Request-Portal)
[![Documentation](https://img.shields.io/badge/Documentation-Project%20Explanation-blue?style=flat&logo=markdown)](./PROJECT_EXPLANATION.md)

> 📘 **Detailed Architecture Guide**: For an in-depth breakdown of schemas, workflow states, security models, and compliance matrices, see [PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md) (also available in [Word .docx](./docs/PROJECT_EXPLANATION.docx) and [Plain Text](./docs/PROJECT_EXPLANATION.txt)).

---

## 🔑 Demo Evaluator Login Credentials

For fast review and evaluation, 1-click demo login buttons are provided directly on the **Home Page** in the dedicated **Fast Evaluator Sandbox** section. All demo accounts share the password: `password123`.

| Role | Name | Institutional Email | 1-Click Home Button | Password | Campus | Purpose / Assigned Workflow State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Requester 1 (Faculty)** | Dr. Anita Sharma | `anita.sharma@christuniversity.in` | `Log in as Requester 1 (Faculty)` | `password123` | Central Campus | AI deep learning GPU workstation request (under specialist review) |
| **Requester 2 (Student)** | Priya Sundaram | `priya.s@mca.christuniversity.in` | `Log in as Requester 2 (Student)` | `password123` | BGR Campus | IEEE conference travel grant (corrections requested) |
| **Coordinator** | Prof. Rajesh Nair | `coordinator@christuniversity.in` | `Log in as Coordinator Demo` | `password123` | Central Office | Full intake pipeline, campus filter tabs, specialist routing & decision sanctioning |
| **Specialist** | Dr. K. S. Ramanathan | `specialist@christuniversity.in` | `Log in as Specialist Demo` | `password123` | Advisory Panel | WhatsApp-clean review desk, technical assessments & feedback |

---

## 🏛️ Project Overview & Problem Statement

An automated, full-stack request management platform built for the **Centre for Artificial Intelligence (CAI) Requests Office** at **Christ University**.

Prior to this application, the office operated on a disjointed combination of campus-specific Excel workbooks, informal emails, and WhatsApp threads:
- **Files Lost or Overwritten**: Attachments were misplaced without audit versioning.
- **Ambiguous Status**: Requesters had no visibility on where their requests stood.
- **Wrong Campus Filing**: Requests were routinely filed under the incorrect campus.
- **Coordinator Burden**: Staff spent critical time acting as manual file and message couriers.
- **Specialist Usability**: The external specialist (accustomed to WhatsApp-clean simplicity) received mixed replies in single chat threads.

### The Solution
This portal replaces the chaos with an enterprise-grade web application featuring strict role boundaries, institutional email validation, automated 2-day and 7-day SLA tracking, and audit-logged lifecycles.

---

## 📊 All 6 Workflow States — Demonstration Matrix

The database is pre-seeded with at least one realistic task in **every single workflow state** across all **6 official Christ University campuses**:

| Tracking ID | Workflow State | Campus | Category | Requester | Description Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CAI-2026-004`** | **`Submitted`** | Yeshwanthpur Campus | Hardware & Equipment | Priya Sundaram | Fresh intake waiting for initial 2-day compliance check |
| **`CAI-2026-002`** | **`Changes Requested`** | Bannerghatta Road Campus (BGR) | Travel & Conference Grant | Priya Sundaram | Coordinator requested missing flight quotation & acceptance letter |
| **`CAI-2026-001`** | **`Under Specialist Review`** | Christ University Central Campus | Hardware & Equipment | Dr. Anita Sharma | Forwarded to Dr. Ramanathan for 7-day technical evaluation |
| **`CAI-2026-006`** | **`Specialist Feedback Received`** | Pune Lavasa Campus | Hardware & Equipment | Priya Sundaram | Specialist endorsed approval; awaiting Coordinator sanction |
| **`CAI-2026-003`** | **`Decision Made`** | Kengeri Campus | Software & Licenses | Dr. Anita Sharma | Approved by Coordinator; awaiting applicant's closure confirmation |
| **`CAI-2026-005`** | **`Completed`** | Delhi NCR Campus | Research Grant & Subscriptions | Dr. Anita Sharma | Applicant confirmed outcome; fully closed & archival locked |

---

## 📜 Full Assignment Specification Compliance Matrix

| Requirement in Official Assignment Document | Implemented System Feature & Compliance Details |
| :--- | :--- |
| **Three Separate Roles with Login** | Dedicated dashboards and workflow boundaries for **Requester**, **Coordinator**, and **Specialist**. |
| **Request Travel Lifecycle** | Full travel loop: `Requester` &rarr; `Coordinator` &rarr; `Specialist` &rarr; `Coordinator` &rarr; `Requester` (Confirmation) &rarr; `Completed`. |
| **Data Boundary Isolation** | Strict role-based views. Specialist evaluates technical files without seeing requester personal email or contacts. |
| **Demo Accounts Required** | Pre-configured accounts for Coordinator, Specialist, and 2 Requesters from different campuses. |
| **Sample Requests** | 6 complete realistic requests covering all 6 workflow states and all 6 Christ University campuses. |
| **Home Page Mandatory Text** | Verbatim quote box + 6 structured key fact cards published on the public visitor page. |
| **Mandatory Document Attachments** | Signed Covering Letter, Description Brief, and Quotations/Invoices enforced with `< 10 MB` readable file validation. |
| **Intake Turnaround (2 Days)** | Enforced on timeline and Coordinator queue within 2 working days turnaround window. |
| **Expert Review (7 Days)** | Tracked on Specialist desk with 7-day turnaround badges. |
| **No Direct Expert Contact** | Coordinator mediates all questions and corrections. Requester never deals with expert directly. |
| **Mandatory Closure Confirmation** | `Decision Made` state requires formal requester confirmation before request is marked `Completed`. |
| **Helpline & Office Hours** | Monday–Friday 9:30 AM – 4:30 PM & Helpline `080 0000 0000` displayed across footer and home guide. |

---

## 🔒 Security & Password Encryption Architecture

1. **Bcryptjs Hashing with Salting**:
   - All passwords are encrypted using `bcryptjs` with dynamic 10-round salting before storage in MongoDB Atlas.
   - Mongoose `pre('save')` hooks ensure any new registration is securely hashed before persistence.
   - Idempotence protection prevents double-hashing of existing hashes.
2. **Plaintext Protection**:
   - Plaintext passwords are never stored in the database or exposed via API query projections.
3. **Tamper-Proof Authentication**:
   - `user.comparePassword()` utilizes `bcrypt.compare` to validate login credentials, returning `401 Unauthorized` for mismatched passwords.

---

## 🚀 Key Features & Workflow Implementation

### 1. Unified 3-Role Workflow & Data Isolation
- **Requesters (Faculty & Students)**: Submit applications with details, upload attachments (<10 MB readable files), monitor real-time progress, respond to coordinator corrections, and formally confirm decisions before request closure. Includes dedicated 1-click home page demo buttons for both Faculty (`Dr. Anita Sharma`) and Student (`Priya Sundaram`) personas.
- **Coordinator (Prof. Rajesh Nair)**: Central office intake check within 2 working days, campus-wise filtering tabs (preventing cross-campus spreadsheet mix-ups), request deficiency correction routing, specialist dispatch, and final sanctioning.
- **Specialist (Dr. K. S. Ramanathan)**: Designed with extreme WhatsApp-clean simplicity, large accessible cards, and privacy protection (never communicates with applicant directly; all reviews are mediated by the Coordinator).

### 2. Christ University Institutional Email Enforcement
- **Faculty Format**: `user@christuniversity.in` (Verified with light blue faculty badge)
- **Student Format**: `user@<course>.christuniversity.in` (Verified with blue student badge, e.g. `priya.s@mca.christuniversity.in`)
- **Non-Christ Domains**: Immediate real-time amber warning alert banner for external domains (e.g. Gmail/Yahoo).

### 3. Dual Theme (Dark & Light Mode)
- One-click toggle in navigation bar, persisted across sessions in `localStorage`.
- Light theme uses a light bluish diagonal gradient (`#b9daf9` &rarr; `#f2f7fe`).
- Dark theme features a dark bluish slate palette (`#020617` / `#0d1e36`).
- Zero horizontal overflow on all viewports from 375px mobile to 4K desktop.

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

1. Push this folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CAI Request Portal"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In Vercel, click **Add New Project** and select this repository.
3. Vercel automatically detects `vercel.json` (`"framework": null`, `buildCommand: "npm run build"`, `outputDirectory: "client/dist"`).
4. Under **Settings > Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.dmuag96.mongodb.net/CAI_Request_Portal?retryWrites=true&w=majority`
   - `PORT`: `5000`
   - `JWT_SECRET`: `christ_university_cai_portal_jwt_secret_key_2026`
5. Click **Deploy**. Vercel will host both your frontend SPA and serverless API under the same domain.

---

*Centre for Artificial Intelligence — Requests Office Portal (FINAL VERSION)*

