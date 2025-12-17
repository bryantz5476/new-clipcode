# Premium Web Services Landing Page

## Overview

This is a premium landing page built to showcase and sell professional web development services through three distinct pricing tiers: Basic, Professional, and E-commerce (Shopify integration). The application is designed with a corporate aesthetic targeting business owners, emphasizing conversion optimization and professional credibility.

The project is a full-stack TypeScript application with a React frontend and Express backend, featuring modern animations, dynamic user interactions, and optional Shopify e-commerce integration capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 19 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- SPA architecture with single entry point (`client/index.html`)

**UI Component System:**
- Shadcn/ui components with Radix UI primitives
- Tailwind CSS v4 for styling with custom design tokens
- Framer Motion for animations and interactions
- Component library located in `client/src/components/ui/`

**Design System:**
- Strict color palette: Deep Navy Blue (#001a33), Black (#000000), White (#FFFFFF)
- Forbidden colors: Yellow and warm tones
- Typography: Inter for body text, Space Grotesk for display/headings
- Spacing system: 4, 8, 16, 24, 32px increments

**State Management:**
- TanStack Query (React Query) v5 for server state and API calls
- React hooks for local component state
- Custom hooks for Shopify cart management (`use-shopify.ts`)

**Landing Page Structure:**
The main landing page follows a specific section order defined in `design_guidelines.md`:
1. Header with navigation
2. Hero section (static, no slider) with cursor-interactive elements
3. Infinite scrolling banner
4. Services carousel
5. Plans section (3 tiers)
6. Benefits section
7. Portfolio gallery
8. Testimonials
9. Final CTA
10. Contact form
11. Footer

**Animation Strategy:**
- Parallax effects throughout
- Cursor-reactive elements in hero (animated blobs, shapes, flowing lines)
- Smooth transitions using Framer Motion
- Micro-interactions on buttons and cards
- Infinite loop animations for banners

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server creation via Node's built-in `http` module
- Middleware: express.json, express.urlencoded
- Custom request logging middleware

**API Structure:**
- RESTful endpoints under `/api` prefix
- Contact form submission: `POST /api/contact`
- Contact form retrieval: `GET /api/contact`
- Validation using Zod schemas with human-readable error messages

**Static File Serving:**
- Production: Serves built frontend from `dist/public`
- Development: Vite dev server with HMR over `/vite-hmr` path
- SPA fallback routing to `index.html` for client-side routing

**Database Layer:**
- Drizzle ORM for type-safe database operations
- PostgreSQL database (configured via `DATABASE_URL` environment variable)
- Connection pooling via `pg` Pool
- Schema definitions in `shared/schema.ts`

**Database Schema:**
```typescript
- users: id, username, password
- contactSubmissions: id, name, email, phone, message, plan, createdAt
```

**Storage Pattern:**
- Interface-based storage abstraction (`IStorage`)
- `DatabaseStorage` implementation for PostgreSQL operations
- Methods for user management and contact form submissions

### Build & Deployment

**Build Process:**
- Custom build script (`script/build.ts`) using esbuild and Vite
- Client build: Vite builds to `dist/public`
- Server build: esbuild bundles to `dist/index.cjs`
- Dependency bundling strategy: Allowlist for cold-start optimization

**Development Mode:**
- Vite dev server with HMR
- Express server proxies to Vite middleware
- Hot reload for both client and server code
- Custom error overlays via Replit plugins

**Production Mode:**
- Compiled single-file server bundle
- Static assets served from Express
- Environment variable configuration required

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI: Comprehensive set of unstyled, accessible UI primitives
- Framer Motion: Animation library for smooth transitions and interactions
- Embla Carousel: Carousel/slider functionality
- React Hook Form: Form state management with validation
- Lucide React: Icon library
- React Icons: Additional icon sets (Simple Icons for social media)

**Shopify Integration (Optional):**
- `shopify-buy` SDK for Storefront API integration
- Environment variables required:
  - `VITE_SHOPIFY_STORE_DOMAIN`
  - `VITE_SHOPIFY_STOREFRONT_TOKEN`
- Cart management with localStorage persistence
- Product fetching and checkout redirect capabilities
- Graceful degradation when Shopify not configured

**Analytics:**
- Google Analytics 4 integration
- Environment variable: `VITE_GA_MEASUREMENT_ID`
- Event tracking: page views, plan clicks, form submissions, checkout starts
- Custom event parameters for e-commerce tracking

**Database & ORM:**
- PostgreSQL via `pg` driver
- Drizzle ORM for schema management and queries
- Drizzle Kit for migrations (`drizzle.config.ts`)
- Database URL required via environment variable

**Validation & Type Safety:**
- Zod for runtime validation
- Drizzle-Zod for schema-to-validation integration
- TypeScript strict mode enabled
- Shared types between client and server

**Development Tools:**
- Replit-specific plugins: cartographer, dev-banner, runtime-error-modal
- TSX for TypeScript execution in development
- Path aliases configured for clean imports (@, @shared, @assets)

**Deployment Configuration:**
- Designed for Netlify deployment (referenced in requirements)
- Expected `netlify.toml` configuration for SPA routing
- Environment variables must be set in deployment platform