# Vestate.ai – Real Estate Intelligence Platform

Modern, full-stack real estate dashboard built with:
- **Next.js App Router**
- **Supabase** (auth, storage, realtime)
- **Stripe** (billing)
- **Tailwind CSS**
- **Zod, React Hook Form, Lucide Icons**

---

## 🚀 Features

- 🔐 Auth & RBAC (`admin`, `agent`, `pro`)
- 🏠 Listings CRUD with images & location
- 📡 Supabase Realtime (live updates)
- 📸 QR Code & Shareable Links
- 🎨 Responsive Dashboard (dark/light)
- 🧼 Soft-delete with media cleanup
- 🔍 Public Listing Pages with SEO
- 📦 Stripe-based Freemium Support
- 🧠 Listing Limit for Free Users
- 📈 Admin Panel with Restore/Delete
- 🌍 Sitemap, robots.txt, JSON-LD, OG Tags

---

## ⚙️ Setup

### 1. Clone this repo

```bash
git clone https://github.com/your-org/vestate.ai.git
cd vestate.ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local` from the example

```bash
cp .env.example .env.local
```

> 🔐 Fill in real keys from Supabase, Stripe, Google, reCAPTCHA

---

## 🧪 Development

```bash
npm run dev
```

---

## 🏗️ Production

```bash
npm run build
npm start
```

---

## 👥 Team Onboarding

- Access shared Supabase project at [supabase.io](https://supabase.io)
- Join Slack for dev discussions
- Branch from `main` and use PRs for feature work
- All team members must configure `.env.local` from the example

---

## 📄 License

MIT – © Vestate.ai 2025