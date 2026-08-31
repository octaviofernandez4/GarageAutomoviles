# El Garage Automóviles

Frontend (React + Vite) de la landing page para una concesionaria de autos usados.

El backend (Node + Express + MongoDB) vive en un repo aparte: [GarageAutomoviles-API](https://github.com/octaviofernandez4/GarageAutomoviles-API).

## Setup

```
cd client
npm install
npm run dev
```

Sin backend, el sitio usa datos de ejemplo locales (`client/src/data/vehicles.js`) como fallback.

Para apuntar a un backend real, setear `VITE_API_URL` con la URL pública de la API antes de buildear/desplegar.
