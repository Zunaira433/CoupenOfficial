# CoupenOfficial

Enterprise-grade international technology affiliate platform with verified coupons, reviews, comparisons, buying guides, affiliate tracking, dynamic SEO, and high performance.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, RSC, ISR) |
| Database | PostgreSQL + Prisma ORM |
| Cache / Rate Limit | Redis (ioredis) |
| Auth | JWT in httpOnly cookies (bcrypt, zod-validated) |
| Styles | TailwindCSS + @tailwindcss/typography |
| Content | Markdown rendered with react-markdown + remark-gfm |
| Tests | Vitest + Testing Library |
| CI | GitHub Actions |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Run database migrations
npx prisma migrate dev --name init

# 4. Seed with sample data
npm run prisma:seed

# 5. Start dev server
npm run dev
```

## Environment Variables

See `.env.example` for all required variables. The app will **refuse to start** in production if `JWT_SECRET` is missing.

## Available Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/categories` | All categories listing |
| `/categories/[slug]` | Category detail with brands |
| `/brand` | All brands listing (paginated) |
| `/brand/[slug]` | Brand detail with coupons, FAQ schema |
| `/coupons/[brand]` | Coupon listing for a brand |
| `/deals` | All active deals (paginated) |
| `/search` | Full-text brand search (paginated) |
| `/review/[brand]` | Brand review |
| `/compare/[slug]` | Brand comparison |
| `/blog` | Blog listing (paginated) |
| `/blog/[slug]` | Blog post (Markdown rendered) |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | User dashboard (favorites) |
| `/admin` | Admin stats dashboard |
| `/admin/brands` | Manage brands (CRUD) |
| `/admin/coupons` | Manage coupons (CRUD) |
| `/admin/reviews` | Manage reviews (CRUD) |
| `/admin/blog` | Manage blog posts (CRUD) |
| `/admin/newsletter` | View newsletter subscribers |

## Security

- JWT in `httpOnly`, `secure`, `sameSite=lax` cookies
- Edge middleware protects all `/admin/*`, `/dashboard/*`, `/api/admin/*` routes
- Rate limiting on `/api/auth/login` (10 req / 15 min per IP) and `/api/auth/register` (5 req / 15 min per IP)
- Origin-based CSRF check on all state-changing endpoints
- Zod validation on every API route — no mass assignment possible
- Full security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy)
- `/go/` affiliate redirects disallowed in robots.txt

## Testing

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

## CI/CD

GitHub Actions runs on every push to `main` / `develop`:
1. Lint (ESLint)
2. Type-check (tsc --noEmit)
3. Unit tests (Vitest)
4. Production build check

## SEO Features

- `generateMetadata` per-page (title, description, canonical, OG, Twitter)
- JSON-LD: Organization, AggregateRating, Article, FAQPage, BreadcrumbList schemas
- Dynamic `sitemap.xml` and `robots.txt`
- ISR (Incremental Static Regeneration) per page type
- Redis caching layer to minimise cold DB reads
- Security headers including HSTS for HTTPS enforcement
