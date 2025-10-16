### Volunteer Matching App

A full-stack web app that connects volunteers with events based on preferences and availability. Volunteers can create and manage profiles; organizers can discover volunteers by skills, location, and schedule.


### Setup

#### 1) Frontend (client)

```bash
cd client
npm install
npm run dev
```

#### 2) Backend (server)

```bash
cd server
npm install
npm run dev
```

#### 3) Backend tests

```bash
cd server
npm test
```


### Project Layout

- `client/` – React app (Vite)
  - `src/`
    - `main.jsx` – App bootstrap
    - `AppRoutes.jsx` – React Router routes
    - `pages/` – Views (`LandingPage.jsx`, `UserProfileManagement.jsx`, `VolunteerHistory.jsx`, etc.)
    - `styles/` – SCSS (`base.scss`, `colors.scss`, `components.scss`, `layout.scss`, `pages/…`)
    - `services/` – API utilities (`profilesApi.js`)
    - `assets/` – Images/static
  - `vite.config.js` – Vite config
  - `package.json` – Frontend scripts/deps

- `server/` – Node/Express API
  - `index.js` – Entrypoint (loads app, starts server)
  - `package.json` – Backend scripts/deps
  - `profiles.data.json` – File-based persistence (created at runtime)
  - `test/` – Mocha tests (`UserProfileManagment.test.js`)
  - `src/`
    - `index.js` – Express app (middleware, routes)
    - `routes/` – Route definitions (`profiles.routes.js`)
    - `controllers/` – Request handlers (`profiles.controller.js`)
    - `services/` – Business logic (`profiles.service.js`)
    - `middlewares/` – Common middleware (`auth.js`, `validate.js`)
    - `validations/` – Zod schemas (`profiles.schemas.js`)
    - `store/` – In-memory storage (`memoryStore.js`)
    - `utils/` – Helpers (`cache.js`, `persist.js`)

### API Overview (Profiles)

Base path: `/api/profiles`

- `GET /api/profiles` – List with filters: `city`, `skill`, `availableOn`, `q`, `limit`, `offset`
- `GET /api/profiles/:id` – Get by ID
- `POST /api/profiles` – Create (requires `x-api-key` if `API_KEY` is set)
- `PATCH /api/profiles/:id` – Partial update (requires `x-api-key` if `API_KEY` is set)
- `DELETE /api/profiles/:id` – Delete (requires `x-api-key` if `API_KEY` is set)