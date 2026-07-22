# Admin API contract

The admin panel talks to the backend through `src/lib/api`. When
`VITE_API_URL` is not set, a localStorage-backed mock is used so the UI can
be developed without a server. Once the backend is deployed, set
`VITE_API_URL` to its base URL (e.g. `https://api.example.com`) and rebuild —
no code changes required.

## Auth

- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET  /auth/me` (Bearer) → `user`
- `POST /auth/logout` (Bearer) → 204

The client stores only `token` and non-secret user info in `localStorage`.
Passwords and role checks must be enforced on the server.

## Resources (identical shape for cottages, services, prices, gallery)

- `GET    /:resource[?category=&published=]`
- `POST   /:resource`               body: resource without `id`
- `GET    /:resource/:id`
- `PATCH  /:resource/:id`           body: partial resource
- `DELETE /:resource/:id`
- `POST   /:resource/reorder`       body: `{ ids: string[] }`

All resources have `sortOrder: number` (used for reorder) and, where
relevant, `published: boolean` (used for the publish/hide toggle).

## Settings

- `GET   /settings` → `SiteSettings`
- `PATCH /settings` → `SiteSettings`

## Uploads

- `POST   /uploads`  multipart form with `file` → `{ url }`
- `DELETE /uploads`  body `{ url }` → 204

## Deployment

`npm run build` produces static assets in `dist/` that can be served from any
host (nginx, Apache, S3, etc.) with SPA fallback (`try_files $uri /index.html`).
The backend can be implemented in PHP+MySQL or Node+Postgres — the frontend
only cares about the JSON contract above.
