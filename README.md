# Uncle Westiee Studios CMS

Next.js 15 full-stack CMS for Uncle Westiee Studios — photography and videography portfolio with an admin dashboard, MySQL database, and JWT authentication.

## Quick start

```bash
npm install
cp .env.example .env   # configure database and admin credentials
npm run db:deploy
npm run db:seed
npm run dev
```

- **Website:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin/login  

## Environment variables

| Variable | Description |
|----------|-------------|
| `DB_CONNECTION` | Database driver (`mysql`) |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for signing admin JWT tokens |
| `ADMIN_USERNAME` | Admin login username (seeded) |
| `ADMIN_PASSWORD` | Admin login password (seeded) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (SEO, sitemap, OG) |
| `TRUST_PROXY` | Set `true` behind nginx/Apache |
| `REDIS_URL` | Optional — shared rate limiting / token revocation |

## Database commands

```bash
npm run db:deploy   # apply migrations
npm run db:seed     # seed admin, hero, gallery, videos
npm run db:studio   # Prisma Studio GUI
```

## API documentation

Interactive Swagger UI (requires admin login):

- **UI:** `/api/docs` (open in browser while signed in)
- **OpenAPI JSON:** `GET /api/docs` with `Accept: application/json`

### Authentication

Protected routes use:

- **Cookie:** `admin_token` (httpOnly JWT, 8h expiry)
- **Header:** `X-CSRF-Token` (must match `csrf_token` cookie on POST/PUT/PATCH/DELETE)

Login first via `POST /api/auth/login`, then include the CSRF header on mutating requests.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | Admin login. Body: `{ "username", "password" }` |
| `POST` | `/api/auth/logout` | CSRF | Log out and revoke session |
| `GET` | `/api/auth/me` | Cookie | Current session info |

### Hero

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/hero` | Public / Admin | Published hero. `?preview=true` returns draft (admin only) |
| `PUT` | `/api/hero` | Admin + CSRF | Update draft hero fields |
| `POST` | `/api/hero/publish` | Admin + CSRF | Publish draft hero and slides |
| `GET` | `/api/hero/slides` | Public / Admin | List slides. `?preview=true` includes drafts (admin) |
| `POST` | `/api/hero/slides` | Admin + CSRF | Create slide |
| `PUT` | `/api/hero/slides` | Admin + CSRF | Reorder slides. Body: `[{ "id", "sortOrder" }]` |
| `GET` | `/api/hero/slides/[id]` | Public | Get single published slide |
| `PUT` | `/api/hero/slides/[id]` | Admin + CSRF | Update slide |
| `DELETE` | `/api/hero/slides/[id]` | Admin + CSRF | Delete slide |

### Gallery

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/gallery` | Public | List images. Query: `category`, `featured` |
| `POST` | `/api/gallery` | Admin + CSRF | Create image |
| `GET` | `/api/gallery/[id]` | Admin | Get image by ID |
| `PUT` | `/api/gallery/[id]` | Admin + CSRF | Update image |
| `DELETE` | `/api/gallery/[id]` | Admin + CSRF | Delete image |

### Videos

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/videos` | Public | List videos. Query: `category` |
| `POST` | `/api/videos` | Admin + CSRF | Add YouTube video |
| `GET` | `/api/videos/[id]` | Admin | Get video by ID |
| `PUT` | `/api/videos/[id]` | Admin + CSRF | Update video |
| `DELETE` | `/api/videos/[id]` | Admin + CSRF | Delete video |

### Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/upload` | Admin + CSRF | Upload image (`multipart/form-data`: `file`, `type` = `hero` \| `gallery`) |

Uploaded files are stored under `public/uploads/{hero|gallery}/`.

### Example: login + authenticated request

```bash
# Login (sets cookies)
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"unclewestieestudios","password":"YOUR_PASSWORD"}'

# Read CSRF token from cookies.txt, then:
curl -b cookies.txt -X GET http://localhost:3000/api/auth/me \
  -H "X-CSRF-Token: YOUR_CSRF_TOKEN"
```

## Production

```bash
npm run build
npm run start
```

Ensure MySQL is running, migrations are deployed, and `NEXT_PUBLIC_SITE_URL` points to your live domain.
