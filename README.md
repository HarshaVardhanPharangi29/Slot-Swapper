# SlotSwapper

Peer-to-peer time-slot scheduling app. Users mark events as SWAPPABLE, browse others’ swappable slots, and request swaps. Accepting swaps atomically exchanges event ownership.

## Live URLs
- Backend (Render): https://slot-swapper-8rve.onrender.com
  - Health: https://slot-swapper-8rve.onrender.com/api/health → {"ok": true}
  - Root: returns "Slot Swapper API is running 🚀"
- Frontend (Netlify): https://slot-swapperr.netlify.app

## Features
- Auth: Email/password, JWT sessions.
- Events: Create, list, update status (BUSY, SWAPPABLE, SWAP_PENDING), delete.
- Swap logic: swappable marketplace, create/accept/reject swap requests with transactional owner swap.
- UI: Dashboard (List/Calendar), Marketplace, Requests. Tailwind styling.

## Tech Stack
- Frontend: React + Vite, React Router, Tailwind CSS, react-big-calendar, date-fns
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- DB: MongoDB Atlas

## Local Development
1) Backend env
```
Copy server/.env.example server/.env
# Edit server/.env
MONGO_URI=mongodb://127.0.0.1:27017/slotswapper
JWT_SECRET=change_me
PORT=4000
```
2) Frontend env
```
Copy client/.env.example client/.env
VITE_API_URL=http://localhost:4000/api
```
3) Install & run
```
npm install --prefix server && npm run dev --prefix server
npm install --prefix client && npm run dev --prefix client
```

## Deployment
Backend (Render)
- Root directory: server
- Build: npm install
- Start: npm start
- Env vars: MONGO_URI, JWT_SECRET (strong secret). Render provides PORT.

Frontend (Netlify)
- Base: client
- Build: npm run build
- Publish: dist
- Env vars: VITE_API_URL=https://slot-swapper-8rve.onrender.com/api
- SPA redirects: client/public/_redirects → `/* /index.html 200`

## API Summary
- POST /api/auth/signup {name,email,password}
- POST /api/auth/login {email,password}
- GET  /api/events
- POST /api/events
- PUT  /api/events/:id
- DELETE /api/events/:id
- GET  /api/swappable-slots
- POST /api/swap-request {mySlotId,theirSlotId}
- GET  /api/swap-requests
- POST /api/swap-response/:id {accept:true|false}

## Quick verification (deployed backend)
PowerShell:
```
$BASE='https://slot-swapper-8rve.onrender.com/api'
# signup/login
$login = Invoke-RestMethod -Method Post -Uri "$BASE/auth/login" -ContentType 'application/json' -Body (@{email='test@example.com';password='pass123'} | ConvertTo-Json); $tok=$login.token; $H=@{Authorization="Bearer $tok"}
# events
Invoke-RestMethod -Headers $H -Uri "$BASE/events"
```

## Notes
- Frontend stores JWT in localStorage (demo purposes).
- For production hardening, restrict server CORS to your Netlify domain and add security headers.

