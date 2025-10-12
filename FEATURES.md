# Dr. Vista E-commerce - Feature Status

> **Project**: Brazilian eyewear e-commerce platform built from scratch with Next.js 15, Drizzle ORM, Stripe, and Better-auth

Last Updated: 2025-01-11

---

## 🎯 MVP Definition

**Core Capability**: Allow customers to purchase eyeglasses with prescription lenses, receive email confirmations, and enable admins to manage orders.

### Success Criteria:
1. ✅ Guest customers can complete purchase flow
2. ❌ Email notifications sent to actual customer emails (not test)
3. ❌ Stock management prevents overselling
4. ❌ Admins can update order status and tracking
5. ❌ Basic SEO for product discoverability

---

## ✅ Completed Features

### 🛒 Shopping & Cart
- [x] Product browsing with image carousels
- [x] Product detail pages (desktop + mobile responsive)
- [x] Add to cart with glasses + lens options
- [x] Cart grouping system (glasses + lenses bundled with `groupId`)
- [x] Cart quantity updates
- [x] Remove from cart (handles grouped items)
- [x] Persistent cart storage (localStorage via Zustand)
- [x] Price calculation (base + lens options)

**Files**:
- `src/app/(public)/(home)/products/[productSlug]/*`
- `src/app/(public)/(customer)/cart/[cartId]/*`
- `src/app/api/(customer)/carts/[cartId]/*`

### 💳 Checkout Flow (Guest)
- [x] Step-by-step accordion UI (customer → address → shipping → payment)
- [x] Customer information form (name, email, phone)
- [x] Shipping address form with validation
- [x] Shipping method selection (manual options)
- [x] Payment method form (credit card via Stripe)
- [x] Order summary with live totals
- [x] Payment processing with Stripe PaymentIntent
- [x] Server-side payment confirmation
- [x] Success page after payment

**Files**:
- `src/app/(public)/(customer)/checkout/[orderId]/*`
- `src/app/api/stripe/payment-intents/*`
- `src/app/api/stripe/payment-methods/*`

### 💰 Payment Integration
- [x] Stripe payment gateway integration
- [x] PaymentIntent creation with order totals
- [x] PaymentMethod creation with test card support
- [x] Server-side payment confirmation
- [x] Webhook handler for `payment_intent.succeeded`
- [x] Webhook handler for `payment_intent.payment_failed`
- [x] Payment status updates in database

**Files**:
- `src/app/api/stripe/*`
- `src/app/api/stripe/services/handle-payment-success.ts`
- `src/app/api/stripe/services/handle-payment-failure.ts`

### 📧 Email System
- [x] Resend API integration
- [x] Payment confirmation email template
- [x] Order created email template
- [x] Magic link registration email template
- [x] React Email component library
- [x] Email preview server (`pnpm email`)
- [x] Product images in emails
- [x] Order details with pricing breakdown

**Files**:
- `emails/payment-confirmed.tsx`
- `emails/order-created.tsx`
- `emails/complete-registration.tsx`
- `src/lib/resend/*`

**⚠️ Current Limitation**: Emails hardcoded to test address `delivered@resend.dev`

### 🔐 Authentication
- [x] Better-auth setup with PostgreSQL adapter
- [x] Email/password authentication
- [x] Google OAuth integration
- [x] Magic link authentication
- [x] Admin role plugin
- [x] Bearer token support
- [x] Portuguese localization
- [x] Session management (7-day expiry)
- [x] Password reset flow (console only)

**Files**:
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/app/(public)/(auth)/*`

### 🗄️ Database Schema
- [x] User & session tables (Better-auth)
- [x] Customer & customer address tables
- [x] Product, product price, product image tables
- [x] Category & sub-category tables
- [x] Collection & collection-product tables
- [x] Cart & cart product tables (with groupId support)
- [x] Order, order payment, order delivery tables
- [x] Order delivery method & payment method tables
- [x] Activity tracking table
- [x] All tables use prefixed nanoid IDs
- [x] Timestamps on all entities
- [x] Proper foreign key relationships with cascade rules

**Files**:
- `src/lib/db/schema.ts`

### 🎨 UI Components
- [x] Responsive header with cart icon
- [x] Footer with links
- [x] Product cards
- [x] Image carousels
- [x] Forms with validation (react-hook-form + Zod)
- [x] Toast notifications (Sonner)
- [x] Loading states (some components)
- [x] Skeleton screens (some pages)
- [x] Theme provider (dark mode ready)
- [x] Radix UI primitives (accordion, dialog, dropdown, etc.)

### 🔧 Admin Panel (Basic Structure)
- [x] Admin layout with sidebar navigation
- [x] Orders page (table view with mock data)
- [x] Products page (table view with mock data)
- [x] Customers page (table view with mock data)
- [x] Categories page
- [x] Activities page
- [x] Admin authentication guard

**Files**:
- `src/app/(private)/admin/*`

**⚠️ Limitation**: Mock data only, no CRUD operations yet

### 🛠️ Developer Experience
- [x] TypeScript strict mode
- [x] Biome for linting (not ESLint)
- [x] Drizzle ORM with type-safe queries
- [x] TanStack Query for server state
- [x] Centralized API error codes with Portuguese messages
- [x] Environment variable validation (Zod)
- [x] Database migrations via Drizzle Kit
- [x] Database seeding script
- [x] Stripe CLI integration for webhooks

---

## ❌ Critical MVP Gaps (Priority 1)

> **These block production launch and must be completed first**

### 🚨 Security & Data Protection
- [ ] **Checkout URL authorization** - Anyone with an order ID can access checkout
  - **Impact**: HIGH - Exposes customer PII, payment info, addresses
  - **Files**: `src/app/(public)/(customer)/checkout/[orderId]/page.tsx`
  - **Fix**: Add session/cookie validation or order ownership check

- [ ] **Email recipients hardcoded** - All emails go to `delivered@resend.dev`
  - **Impact**: HIGH - Customers won't receive order confirmations
  - **Files**: `src/app/api/stripe/services/handle-payment-success.ts:74-75`
  - **Fix**: Change `to: [orderPaymentFound.order.customer.user.email]`

### 📦 Inventory Management
- [ ] **No stock validation on cart add**
  - **Impact**: HIGH - Customers can add unavailable products
  - **Files**: `src/app/api/(customer)/carts/[cartId]/products/route.ts`
  - **Fix**: Check `productFound.stock >= quantity` before insert

- [ ] **No stock deduction after purchase**
  - **Impact**: HIGH - Overselling products
  - **Files**: `src/app/api/stripe/services/handle-payment-success.ts`
  - **Fix**: Update product stock in `handlePaymentSuccess()`

- [ ] **No out-of-stock UI state**
  - **Impact**: MEDIUM - Poor UX, users see unavailable products
  - **Files**: Product pages, cart pages
  - **Fix**: Disable "Add to Cart" button when stock = 0

### 🔐 Authentication Flow
- [ ] **Missing guest-to-authenticated middleware**
  - **Impact**: MEDIUM - Guest users aren't auto-logged in after account creation
  - **Files**: After customer creation in checkout
  - **Fix**: Call Better-auth `signIn()` after `createCustomer` mutation

### 📋 Prescription Management
- [ ] **Prescription upload system** - Hardcoded mock data
  - **Impact**: HIGH - Can't fulfill prescription orders
  - **Files**: `src/app/api/stripe/services/handle-payment-success.ts:105`
  - **Current**: `prescription: "OD: -2.00 | OE: -1.75" // TODO`
  - **Fix**:
    1. Add prescription file upload page (post-payment)
    2. Store file URLs in new `orderPrescription` table
    3. Update email template to reflect actual data

### 🔍 SEO Basics
- [ ] **No sitemap.xml**
  - **Impact**: MEDIUM - Poor search engine indexing
  - **Fix**: Create `app/sitemap.ts` with Next.js sitemap API

- [ ] **No robots.txt**
  - **Impact**: LOW - No crawler directives
  - **Fix**: Create `public/robots.txt`

- [ ] **Missing per-page meta tags**
  - **Impact**: MEDIUM - Poor social sharing, search results
  - **Files**: All page.tsx files
  - **Fix**: Add `generateMetadata()` exports with Open Graph tags

- [ ] **No structured data (Schema.org)**
  - **Impact**: MEDIUM - Missing rich snippets in search
  - **Fix**: Add JSON-LD for Product, BreadcrumbList, Organization

---

## ⚠️ Important Missing Features (Priority 2)

> **Should be completed before or shortly after MVP launch**

### 🚚 Shipping Integration
- [ ] **Melhor Envio API integration** ✅ Selected
  - **Current**: Manual shipping costs in database
  - **Need**: Real-time quotes from Correios, Jadlog, Azul Cargo
  - **Service**: Melhor Envio (https://melhorenvio.com.br)
  - **Features**: Multi-carrier, competitive rates, sandbox testing
  - **Files**: `src/lib/melhor-envio/*`, `src/app/api/(customer)/shipping/calculate/*`

### 📄 Nota Fiscal (NF-e)
- [ ] **eNotas integration for automated NF-e** ✅ Selected
  - **Current**: No invoice generation (legal requirement)
  - **Service**: eNotas.com.br (R$0.25-0.40 per NF-e, no monthly fee)
  - **Need**: Auto-generate NF-e after payment, CPF/CNPJ validation
  - **Features**: SEFAZ submission, PDF email delivery, tax calculations
  - **Files**: `src/lib/enotas/*`, `orderNotaFiscal` table

### 👨‍💼 Admin Features
- [ ] **Update order status from admin panel**
  - **Current**: Orders table is read-only mock data
  - **Need**: Status dropdown (pending → processing → shipped → delivered)
  - **Files**: `src/app/(private)/admin/pedidos/orders-table.tsx`

- [ ] **Update delivery tracking from admin**
  - **Current**: No tracking code input
  - **Need**: Tracking code field, auto-send email on update
  - **Files**: Create new admin order detail page

- [ ] **Send status update emails**
  - **Need**: "Order shipped" email template
  - **Need**: Trigger on tracking code update

### 📊 Product Management
- [ ] **Product CRUD from admin panel**
  - **Current**: Products table uses seed data
  - **Need**: Add/edit/delete products, manage images, pricing
  - **Files**: `src/app/(private)/admin/produtos/*`

### 📧 Email Enhancements
- [ ] **Notifications database table**
  - **Purpose**: Track all sent emails (audit log)
  - **Schema**: `id, type, recipientEmail, status, sentAt, errorMessage`
  - **File**: `src/lib/db/schema.ts` (TODO comment exists)

- [ ] **Order status change emails**
  - **Need**: "Order shipped" template with tracking
  - **Need**: "Order delivered" template

- [ ] **Order cancellation flow**
  - **Need**: Email template with support contact info
  - **Requirement**: Customer → support email (manual cancellation)

### 🎨 UX Improvements
- [ ] **More skeleton screens**
  - **Missing**: Order history, product listing
  - **Exists**: Checkout order summary, product info

- [ ] **Better loading states**
  - **Need**: Button loading states during mutations
  - **Need**: Page transitions

### ⚡ Performance
- [ ] **Image optimization**
  - **Current**: Next.js Image component used, but sizes not optimized
  - **Fix**: Verify `sizes` prop on all images

- [ ] **Code splitting**
  - **Current**: Default Next.js behavior
  - **Fix**: Use dynamic imports for heavy components (Stripe, admin panels)

### 🔒 Security Enhancements
- [ ] **Rate limiting on API routes**
  - **Risk**: Payment endpoint spam, cart manipulation
  - **Fix**: Add rate limiting middleware (Upstash Redis)

- [ ] **CSRF protection**
  - **Current**: Better-auth handles auth endpoints
  - **Need**: Verify all POST routes have proper validation

---

## 🌟 Nice-to-Have Features (Priority 3)

> **Post-MVP, enhance user experience and business capabilities**

### 🔐 Authenticated User Experience
- [ ] Signed-in user checkout (pre-filled data)
- [ ] Order history page for logged-in customers
- [ ] Saved addresses for repeat customers
- [ ] Order tracking page (customer-facing)

### 💰 Payment Enhancements
- [ ] Brazilian payment methods: PIX, Boleto, Debit Card
  - **Current**: Credit card only via Stripe
  - **Options**: Enable Stripe PIX/Boleto OR integrate ASAAS
  - **Impact**: Higher conversion, local payment preferences
- [ ] Multiple payment providers (ASAAS for better Brazilian rates)
- [ ] Stripe tax calculation integration
- [ ] Discount codes/coupons system
- [ ] Save payment methods for repeat customers

### 📊 Admin Enhancements
- [ ] Sales analytics dashboard
- [ ] Customer management (view orders, notes)
- [ ] Inventory alerts (low stock notifications)
- [ ] Export orders to CSV
- [ ] Slack integration for order notifications

### 🛍️ Shopping Enhancements
- [ ] Product reviews and ratings
- [ ] Product recommendations
- [ ] Wishlist functionality
- [ ] Search functionality
- [ ] Filter products by category, price, etc.

### 🔍 Advanced SEO
- [ ] Blog/content marketing section
- [ ] JSON-LD structured data for all entities
- [ ] Breadcrumb navigation with schema
- [ ] Canonical URLs
- [ ] hreflang tags (if multi-language)
- [ ] AMP pages for mobile

### 📧 Advanced Email Features
- [ ] Welcome email sequence
- [ ] Abandoned cart recovery emails
- [ ] Promotional email campaigns
- [ ] SMS notifications (Twilio)

---

## 📁 Key File Locations

### Core Business Logic
- **Cart**: `src/app/api/(customer)/carts/[cartId]/*`
- **Checkout**: `src/app/(public)/(customer)/checkout/[orderId]/*`
- **Orders**: `src/app/api/(customer)/orders/*`
- **Payments**: `src/app/api/stripe/*`
- **Email Templates**: `emails/*.tsx`

### Data Layer
- **Database Schema**: `src/lib/db/schema.ts`
- **Database Client**: `src/lib/db/index.ts`
- **Migrations**: `drizzle/*`

### Frontend
- **Product Pages**: `src/app/(public)/(home)/products/[productSlug]/*`
- **Cart Page**: `src/app/(public)/(customer)/cart/[cartId]/*`
- **Admin Panel**: `src/app/(private)/admin/*`

### Configuration
- **Environment**: `src/lib/env.ts`
- **Auth**: `src/lib/auth.ts`
- **Stripe**: `src/app/api/stripe/stripe-client.ts`
- **Resend**: `src/lib/resend/client.ts`

---

## 🚀 Development Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm lint             # Run Biome linter
pnpm lint:fix         # Auto-fix linting issues

# Database
pnpm db:push          # Push schema changes (dev)
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:seed          # Seed test data
pnpm db:reset         # Drop, push, and re-seed

# External Services
pnpm stripe           # Start Stripe webhook listener
pnpm email            # Preview email templates (http://localhost:3001)
```

---

## 📊 Completion Status

### By Category:
- **Shopping & Cart**: 90% ✅ (Missing: stock validation)
- **Checkout Flow**: 85% ✅ (Missing: auth middleware, ownership validation)
- **Payment**: 90% ✅ (Missing: stock deduction)
- **Email**: 70% ⚠️ (Missing: real recipients, tracking emails, notifications table)
- **Authentication**: 80% ✅ (Missing: guest-to-auth flow)
- **Admin Panel**: 30% ⚠️ (Structure only, no CRUD)
- **SEO**: 10% ❌ (Missing: most features)
- **Performance**: 60% ⚠️ (Basic optimization, room for improvement)

### Overall MVP Readiness: **60%**

**Critical blockers**:
1. Email recipients (5 min fix)
2. Stock management (2-4 hours)
3. Checkout authorization (1-2 hours)
4. Prescription upload (4-6 hours)
5. Basic SEO (2-3 hours)

**Estimated time to MVP**: 2-3 days of focused work

---

## 🎯 Recommended Next Steps

1. **Week 1: Security & Core Functionality**
   - Fix email recipients (immediate)
   - Add checkout authorization
   - Implement stock validation & deduction
   - Add guest-to-auth middleware

2. **Week 2: Prescription & SEO**
   - Build prescription upload flow
   - Add sitemap.xml and robots.txt
   - Add meta tags to all pages
   - Add product structured data

3. **Week 3: Admin & Shipping**
   - Implement order status updates in admin
   - Add tracking code management
   - Integrate shipping API (Correios)
   - Add order shipped email

4. **Week 4: Polish & Launch**
   - Performance audit
   - Security audit
   - User testing
   - Soft launch with limited inventory

---

**Notes**:
- All currency is BRL (R$) stored in cents
- All user-facing text is in Portuguese
- Using Biome (not ESLint) for linting
- Tab indentation (not spaces)
- Strict TypeScript enabled
