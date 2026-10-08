# Smart University Student Portal

Modern, multilingual university portal starter for Student, Teacher and Admin roles.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma
- Authentication: JWT + bcrypt
- AI: OpenAI-compatible API adapter with demo fallback
- Mobile payments: bKash/Nagad integration-ready adapter (merchant credentials required)

## Requirements
Node.js 20+, npm, PostgreSQL 14+.

## Run locally
1. Install Node.js and PostgreSQL.
2. Open this folder in VS Code.
3. Create `backend/.env` by copying `.env.example` (`Copy-Item .env.example .env` in PowerShell, or `cp .env.example .env` in macOS/Linux), and configure the database connection.
4. In a terminal, install and start the backend:
   ```bash
   cd backend
   npm ci
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```
5. Open a second terminal:
   ```bash
   cd frontend
   npm ci
   npm run dev
   ```
6. Visit http://localhost:5173

Demo login (after seeding):
- Admin: admin@university.test / Admin123!
- Teacher: teacher@university.test / Teacher123!
- Student: student@university.test / Student123!

Change demo passwords and JWT_SECRET before deployment.

## University result PDF import
Administrators can preview and import a university result PDF from the Results page. PDFs are processed in backend memory and are not made public or retained. The same PDF is rejected on repeat import by its SHA-256 hash; a different release is stored as a new historical import, and students see records from the latest imported release only.

The current parser is deliberately conservative: it supports text-based PDFs with a single-row table header containing Student ID, course code or course name, credit, and grade or marks columns, with the Student ID present on each course row. It rejects unknown layouts instead of guessing. Scanned/image-only PDFs require an OCR service and are currently rejected with an explicit message. The actual Metropolitan University result PDF layout has not been supplied for parser validation, so administrators should test a representative PDF before relying on imports.

Student results are fetched using the Student ID attached to the authenticated backend account; the endpoint does not accept a student ID from the browser. Admin upload and import routes enforce the ADMIN role server-side. Run backend tests with `npm test` from `backend`.

## External integrations
- AI: Set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in backend/.env. Without a key, EduAI returns clearly labelled demo responses.
- bKash/Nagad: Set merchant credentials and implement/enable the relevant official merchant API credentials and callback URLs. The included payment route creates a PENDING transaction only; it never marks a payment successful without verified gateway confirmation. Never collect or store a user's mobile wallet PIN/OTP.
- Live transport: Add GPS tracker/device feed credentials and configure `TRANSPORT_PROVIDER_URL` / `TRANSPORT_API_KEY`. Until configured, the UI shows sample DEMO vehicle locations, not live tracking.
- Email/SMS/push notifications: configure a provider before production.

## Included modules
Dashboard, teacher directory, courses/registration, results/CGPA, class & exam routine, assignments with individual/group cover-page preview and print-to-PDF, attendance, academic calendar, notices, transcript, EduAI, PDF upload/summary/Q&A scaffolding, study hub, question bank, AI question generation, study planner, progress, notifications, transport, hostel/library information, digital student ID, fee/payment history, student helpdesk, teacher workspace and admin management.

## Production checklist
Configure HTTPS, strong secrets, database backups, rate limiting, CORS allowlist, email verification/password reset, audit logs, gateway signature verification, privacy/retention policy, and real GPS/AI/payment providers. Review authorization rules and institutional requirements before handling real student records.
