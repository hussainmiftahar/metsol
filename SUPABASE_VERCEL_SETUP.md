# Supabase + Vercel setup

The portal runs as two Vercel projects from this one repo (`backend/` and `frontend/`), with Supabase for the database and login.

## 1. Create the Supabase project

1. Create a project at supabase.com and save the database password.
2. **Project Settings → API**: copy the **Project URL** and the **anon public key**.
3. **Project Settings → Database → Connection string**:
   - **Transaction pooler** (port 6543) is `DATABASE_URL`. Append `?pgbouncer=true&connection_limit=1`.
   - **Session pooler** (port 5432) or the direct connection is `DIRECT_URL`. Prisma migrations use it.
4. **Authentication → Providers → Email**: keep it enabled. Keep **Confirm email** on. The backend only accepts confirmed emails.
5. **Authentication → URL Configuration**: set the **Site URL** to your frontend URL (e.g. `https://metsol.vercel.app`).

## 2. Create the tables (run once, from your computer)

```bash
cd backend
cp .env.example .env        # fill in DATABASE_URL, DIRECT_URL, SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET
npm install
npx prisma migrate deploy   # creates every table, including the new authId column
npm run seed                # optional demo data
```

Use `migrate deploy`, not `migrate dev`, against Supabase.

## 3. How login works now

- The browser signs in or signs up with Supabase Auth, which stores passwords and issues the session.
- Every API call sends the Supabase access token. The backend verifies it with Supabase.
- On the first request, the backend creates or links a row in the `User` table. **Roles (STUDENT / TEACHER / ADMIN) still live in that table.**
- New accounts are STUDENT. To make someone an admin or teacher, change `role` in the `User` table (Supabase **Table Editor**).
- Seeded demo users (e.g. `admin@university.test`) link to Supabase the first time that email signs up and confirms. Their seed passwords no longer work.

## 4. Deploy the backend on Vercel

1. **Add New → Project**, import this repo, **Root Directory = `backend`**.
2. Under Settings → General, keep **Include source files outside of the Root Directory** enabled. The backend imports `../shared/grading.js`.
3. Environment variables (Production):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | pooled URL (port 6543) |
   | `DIRECT_URL` | direct/session URL (port 5432) |
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_ANON_KEY` | anon key |
   | `JWT_SECRET` | random string, 32+ characters |
   | `FRONTEND_URL` | the frontend's Vercel URL, no trailing slash |
   | `GROQ_API_KEY`, bKash/Nagad, Google keys | as needed |

4. Deploy. The Express app is detected through `src/server.js`. `prisma generate` runs automatically through `postinstall`.
5. Check `https://<backend>.vercel.app/api/me`: it should return 401 without a login.

## 5. Deploy the frontend on Vercel

1. **Add New → Project**, same repo, **Root Directory = `frontend`**, framework **Vite**.
2. Environment variables:
   - `VITE_API_URL` = the backend's Vercel URL (no trailing slash)
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon key
3. Deploy, then put the frontend URL into the backend's `FRONTEND_URL` and redeploy the backend.

## Known limits on Vercel

- Vercel functions accept request bodies up to about 4.5 MB, so large result PDFs and AI documents may fail.
- The in-memory rate limiter is per function instance. It is only a soft limit on Vercel.
- If you use Google Classroom, set `GOOGLE_REDIRECT_URI` to `https://<backend>.vercel.app/api/google/classroom/callback` and add it in Google Cloud Console.
- Use a separate Supabase project (or a Preview-only `DATABASE_URL`) for Vercel preview deployments, so a preview can't touch production data.
