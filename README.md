# CavSulit v2 — Frontend

Campus marketplace for CvSU. React + Vite, deployed on Vercel.

## Local run

```powershell
npm install
copy .env.example .env.local
# Fill in Firebase keys in .env.local
npm run dev
```

Open **http://localhost:5173** (backend must run on port 5000).

## Production (Vercel)

Set environment variables from `.env.example`, then:

```
VITE_API_URL=https://cavsulit-v2-api.onrender.com/api
```

Redeploy after any env change.

## v2.0.1 fixes

- White screen after boot loader — auth now shows loading spinner + 10s timeout
- Boot loader always completes within 12s on live site
- Wishlist loading state when logged out
