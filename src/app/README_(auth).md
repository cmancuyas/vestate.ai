# 🔒 Protected Routes – Vestate.ai

This project uses **Next.js Route Groups** to organize authenticated pages under:

```
src/app/(auth)/
```

This keeps routing secure and maintainable, while keeping `/auth/` out of the URL path.

---

## ✅ Folder Breakdown

| Folder             | Purpose                              |
|--------------------|---------------------------------------|
| `dashboard/`        | Main user dashboard after login       |
| `profile/`          | Edit user profile (`full_name`, etc.) |
| `onboarding/`       | First-time setup page for new users   |
| `check-new-user/`   | Redirect logic for Facebook login     |
| `layout.tsx`        | Navbar + Supabase session guard       |

---

## 🔁 Example Auth Flow

1. User logs in via Facebook
2. Redirects to `/auth/check-new-user`
3. If new → `/auth/onboarding`
4. If returning → `/auth/dashboard`

---

## 🔐 Notes

- This setup uses Supabase Auth + RLS-secured `profiles` table.
- Layout-level session validation happens inside `(auth)/layout.tsx`
- Folder structure is case-sensitive for deployment (especially on Vercel/Linux)
