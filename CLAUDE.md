# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dr. Vista e-commerce platform for eyewear (óculos) - Next.js 15 fullstack application with customer-facing storefront, checkout flow, and admin panel.

## Key Commands

### Development
- `pnpm dev` - Start Next.js dev server with Turbopack
- `pnpm build` - Production build
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Auto-fix linting issues with Biome

### Database (Drizzle + Neon PostgreSQL)
- `pnpm db:push` - Push schema changes to database (development)
- `pnpm db:generate` - Generate migrations
- `pnpm db:studio` - Open Drizzle Studio GUI
- `pnpm db:seed` - Seed database with test data
- `pnpm db:reset` - Drop all data, push schema, and re-seed

### External Services
- `pnpm stripe` - Start Stripe CLI webhook listener (forwards to localhost:3000/api/stripe/webhooks)
- `pnpm email` - Preview email templates at localhost:3001 (react-email)

## Architecture

### Route Structure

**Public Routes** (`/app/(public)`)
- `(home)` - Product listing, storefront
- `(customer)` - Cart, checkout flow, orders
- `(auth)` - Sign in, sign up, password reset

**Private Routes** (`/app/(private)`)
- `admin/*` - Admin panel for managing products, orders, customers, categories
- `minha-conta` - Customer account page

**API Routes** (`/app/api`)
- `(customer)/*` - Customer-facing APIs (carts, orders, checkouts, payments)
- `(storefront)/*` - Public product/collection APIs
- `stripe/*` - Stripe payment processing and webhooks
- `auth/[...all]` - Better-auth routes

### Database Schema

**Core Entities:**
- `product` - Base product (glasses/sunglasses)
- `productPrice` - Pricing per product
- `productImage` - Product images
- `cartProduct` - Shopping cart line items
  - `parentProductId` - Links lens options to parent glasses
  - `groupId` - Groups related cart items together (glasses + lens options bundled as one unit)
- `order` - Order header
- `orderPayment` - Payment details, linked to Stripe PaymentIntent
- `orderDelivery` - Shipping information
- `customer` - Customer data
- `customerAddress` - Shipping addresses

**Important: Product Hierarchy & Grouping**
- Glasses are parent products (no `parentProductId`)
- Lens options (e.g., "Com grau", "Grau moderado") are child products linked via `cartProduct.parentProductId`
- Related items share a `groupId` in cart for bundled quantity updates
- When displaying in emails/UI, filter for `!parentProductId` to get main products, then fetch children
- Use `/api/carts/[cartId]/glasses` endpoint to add glasses with multiple lens options in one operation

### Authentication & Authorization

Uses **Better-auth** with:
- Email/password authentication
- Magic link support
- Admin plugin for role-based access
- Localization plugin (Portuguese)
- Sessions stored in PostgreSQL

### Payment Flow (Stripe)

1. Customer adds products to cart (glasses + lens options)
2. Checkout creates Stripe PaymentIntent via `/api/stripe/payment-intents/create`
3. Frontend collects payment method, sends to `/api/stripe/payment-methods/create`
4. Payment confirmed server-side via `/api/stripe/payment-intents/confirm`
5. On success, `handlePaymentSuccess` updates order status and sends email
6. Webhook listener receives events (development only, may not fire consistently)

**Important:** Payment confirmation happens server-side, NOT client-side, to ensure webhooks can fire properly.

### Email System

Uses **Resend** + **react-email**:
- Templates in `/emails/` directory
- `payment-confirmed.tsx` - Sent after successful payment
- `order-created.tsx` - Order confirmation
- `complete-registration.tsx` - Magic link for registration

**Email Data Structure:**
- Products show **unit price** (base + all lens options per unit), NOT total
- Prices are stored in cents, formatted via `@/lib/format-price.ts`
- Sub-items (lens options) displayed nested under parent products

### Shared Utilities

**Price Formatting:**
- Use `formatPrice(priceInCents)` from `@/lib/format-price.ts`
- All prices stored in cents (e.g., R$ 100,00 = 10000)
- Consistent formatting across app and emails

**ID Generation:**
- All entity IDs use prefixed nanoids via `generatePrefixId()`
- Format: `{entity}_xxxxxx` (e.g., `ord_abc123`, `prd_xyz789`)

### State Management

- **Zustand** for cart state (`@/stores/cart-store`)
  - Persists `cartId` to localStorage
- **TanStack Query** for server state
  - All API queries/mutations centralized in `/src/http/`
  - Exported via `/src/http/index.ts` barrel file
  - Pattern: Create `queries.ts` and `mutations.ts` per domain
- **nuqs** for URL search params

### Form Handling

- **react-hook-form** + **Zod** for validation
- Error codes defined in `/src/app/api/contants/error-codes.ts`
- Error messages in Portuguese (`ERROR_MESSAGES`)
- Centralized error handling via `handleApiError()` in `/src/lib/utils/handle-api-error.ts`

## Development Notes

### Stripe Local Testing
- Webhook secret updates each time `pnpm stripe` starts
- Payment intent confirmation must happen server-side for webhooks to work
- Test cards: Use Stripe test card `4242 4242 4242 4242`

### Database Changes
- Modify schema in `src/lib/db/schema.ts`
- Run `pnpm db:push` for development (skips migrations)
- Run `pnpm db:generate` + `pnpm db:migrate` for production migrations

### Code Quality
- Uses Biome (not ESLint/Prettier)
  - Tab indentation (not spaces)
  - Double quotes for strings
  - `noExplicitAny` disabled - but avoid `any` when possible per global instructions
  - Auto-organize imports enabled
- TypeScript strict mode enabled
- Server-only code: Import `"server-only"` at top of file (used in auth, API routes)
- Every time we change the database schema, check the seed script and update it to reflect the latest changes while ensuring it contains existing data for each applicable schema table.