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
 
## Design Choices
- Stateless auth via JWT to simplify horizontal scaling and SPA integration.
- Passwords hashed with bcrypt; tokens stored client-side for simplicity.
- Event status machine: BUSY → SWAPPABLE → SWAP_PENDING; swap responses set ACCEPTED/REJECTED and finalize ownership/state.
- Mongoose sessions for atomic swaps to avoid partial updates.
- react-big-calendar with date-fns for locale-friendly calendar rendering.

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
Base URL
- Local: `http://localhost:4000/api`
- Prod: `https://slot-swapper-8rve.onrender.com/api`

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | /auth/signup | No | `{ name, email, password }` | Creates a user |
| POST | /auth/login | No | `{ email, password }` | Returns `{ token, user }` |
| GET | /events | Bearer | — | List my events |
| POST | /events | Bearer | `{ title, startTime, endTime, status }` | Create event (status one of BUSY, SWAPPABLE) |
| PUT | /events/:id | Bearer | `{ ...fields }` | Update my event |
| DELETE | /events/:id | Bearer | — | Delete my event |
| GET | /swappable-slots | Bearer | — | Other users’ events marked SWAPPABLE |
| POST | /swap-request | Bearer | `{ mySlotId, theirSlotId }` | Initiate swap |
| GET | /swap-requests | Bearer | — | Incoming and outgoing requests |
| POST | /swap-response/:id | Bearer | `{ accept: true|false }` | Accept or reject |

## Assumptions
- ISO timestamps (UTC); frontend renders per browser locale.
- No advanced conflict detection (overlaps) beyond basic validation.
- Single-pair swaps only; no multi-party chains.
- Token persisted in localStorage for demo simplicity.

## Challenges
- Production “Unauthorized” issues solved by aligning JWT secrets and clearing stale client tokens.
- Netlify SPA routing fixed via `_redirects` file.
- Network “Failed to fetch” resolved by ensuring `VITE_API_URL` includes `/api` and redeploying.

## Notes
- For production hardening, restrict server CORS to your Netlify domain and add security headers.

