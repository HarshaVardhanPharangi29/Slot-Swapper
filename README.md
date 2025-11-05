# SlotSwapper

Minimal full-stack implementation (Node/Express/MongoDB + React/Vite) demonstrating authentication, event CRUD, and swap logic.

## Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string

## Backend (server)
1. Copy env:
```bash
cp server/.env.example server/.env
```
2. Edit `server/.env` as needed (MONGO_URI, JWT_SECRET, PORT).
3. Install and run:
```bash
npm install --prefix server
npm run dev --prefix server
```
Server runs at `http://localhost:4000`.

## Frontend (client)
1. Copy env:
```bash
cp client/.env.example client/.env
```
2. Install and run:
```bash
npm install --prefix client
npm run dev --prefix client
```
App runs at `http://localhost:5173`.

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

## Notes
- Simple state refresh after actions keeps UI updated without manual reloads.
- JWT stored in localStorage for demo purposes.
