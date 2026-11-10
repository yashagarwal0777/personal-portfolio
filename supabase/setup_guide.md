# Complete Supabase Free Plan ($0/month) Setup Guide

This guide connects your personal portfolio to the official **Supabase Free Plan** for database persistence, authentication, and file storage.

---

## 1. Create Your Free Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (or sign in with your GitHub account).
2. Click **New Project**.
3. Choose the **Free Plan** ($0/month):
   - **Name:** `personal-portfolio`
   - **Database Password:** (Choose a secure password and save it)
   - **Region:** Choose a region close to you (e.g. `South Asia (Mumbai)` or `Southeast Asia (Singapore)`).
4. Click **Create new project** and wait ~1 minute for it to finish provisioning.

---

## 2. Run the Schema Script (1 Click)

1. In your Supabase project dashboard, click on **SQL Editor** in the left sidebar (icon with `>_`).
2. Click **New query**.
3. Copy the entire contents of [`supabase/schema.sql`](file:///c:/xampp/htdocs/portfolio/supabase/schema.sql) and paste it into the editor.
4. Click **Run** (or press `Ctrl` + `Enter`).
5. You should see:
   ```text
   Success. No rows returned.
   ```
   *This automatically sets up all 9 tables, Row Level Security (RLS) policies, the `portfolio-assets` storage bucket, and seeds all your initial resume data!*

---

## 3. Create Your Administrator User

1. In the Supabase dashboard, click **Authentication** in the left sidebar (users icon).
2. Click **Users** -> **Add user** -> **Create user**.
3. Fill in:
   - **User Email:** `Yash.Agrawal0220@gmail.com`
   - **User Password:** (Enter your desired admin password, e.g. minimum 6 characters)
   - **Auto Confirm User?** -> **Turn this ON (Checked)** so you don't need email confirmation.
4. Click **Create user**.

*(Note: You can now log in using either your email `Yash.Agrawal0220@gmail.com` OR your ID `yash` with this password!)*

---

## 4. Get Your API Credentials

1. In the Supabase dashboard, click the gear icon **Project Settings** at the bottom of the left sidebar.
2. Click **API** under the Configuration menu.
3. Find:
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Project API keys -> anon (public):** `eyJhbGciOi...`

---

## 5. Add Environment Variables to Your Project

Create or update `.env.local` in `c:\xampp\htdocs\portfolio\`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_EMAIL=Yash.Agrawal0220@gmail.com
VITE_ADMIN_USERNAME=yash
```

---

## 6. Add Environment Variables to Vercel (For Production)

To enable the backend on your live Vercel deployment:

1. Run the Vercel CLI command:
   ```bash
   npx vercel env add VITE_SUPABASE_URL production
   npx vercel env add VITE_SUPABASE_ANON_KEY production
   npx vercel env add VITE_ADMIN_EMAIL production
   npx vercel env add VITE_ADMIN_USERNAME production
   ```
   *(Or open your Vercel Project Dashboard -> Settings -> Environment Variables and paste them there).*

2. Re-deploy to production:
   ```bash
   npx vercel deploy --prod
   ```

---

## 7. How to Use Your Admin Dashboard

1. **Via Public Portfolio Incognito Mode:**
   - Open your portfolio: `http://localhost:5173/` (or live Vercel URL).
   - Click the sunglasses switch in the top-right corner (or press key `i`).
   - Enter your ID: `yash` and your password.
   - Click **SIGN IN TO DASHBOARD**.

2. **Via Direct Route:**
   - Navigate to `/admin/login`.
   - Sign in with your ID or Email and password.
   - You will be redirected to `/admin/dashboard`.

3. **Updating Content:**
   - Any edits you make to Projects, Experience, Education, Skills, Certifications, or Personal Info in the dashboard are saved directly to PostgreSQL.
   - Clicking "Save" automatically notifies the public website, updating the live view without requiring code changes!
