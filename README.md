# El Garage Automóviles

Landing page para una concesionaria de autos usados. Monorepo con `/client` (React + Vite) y `/server` (Node + Express + MongoDB).

## Requisitos

- Node.js 18+
- MongoDB corriendo localmente (o una URI remota)

## Server

```bash
cd server
npm install
cp .env.example .env   # ajustar MONGODB_URI si hace falta
npm run seed            # carga los 3 vehículos de ejemplo
npm run dev              # http://localhost:5000
```

## Client

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

En desarrollo, Vite proxea `/api` hacia `http://localhost:5000`, así que no hace falta configurar `VITE_API_URL` salvo que el server corra en otro host/puerto.
# GarageAutomoviles
