# Dr. Vista - TODO List

> Quick reference for all pending tasks. See [MVP-CHECKLIST.md](./MVP-CHECKLIST.md) for detailed implementation guides.

Last Updated: 2025-01-11

---

## 🚨 Priority 1: Critical (Must Fix Before Launch)

### Security & Data
- [x] **Setup drvista.com.br domain at resend and vercel** - (10 min)
- [x] **Fix email recipients** (5 min) - Change line 74 in `handle-payment-success.ts` from `delivered@resend.dev` to actual customer email
- [ ] **Add checkout authorization** (1-2h) - Prevent unauthorized access to checkout URLs with cookies/tokens
- [ ] **Add stock validation on cart** (2-3h) - Check available stock before adding products to cart
- [ ] **Deduct stock after payment** (1h) - Update product stock after successful payment
- [ ] **Add out-of-stock UI** (1h) - Disable "Add to Cart" button when stock = 0

### Payment confirmed email
- [ ] needs to format `Data do Pedido` 2025-10-13T00:15:41.308Z
- [ ] needs to use low quality product images instead of original ones
- [ ] needs to proxy product images through new route to avoid email being targeted as spam https://github.com/vercel/next.js/discussions/71421#discussioncomment-14396412
- [ ] needs to handle better subproducts when same product ID was added in cart with different subproducts, its mixing the subproducts and duplicating them 


### User Experience
- [ ] **Guest-to-auth middleware** (1-2h) - Auto-login users after account creation in checkout
- [ ] **Add sitemap.xml** (30 min) - Create `src/app/sitemap.ts` for SEO
- [ ] **Add robots.txt** (15 min) - Create `public/robots.txt`
- [ ] **Add meta tags** (1-2h) - Add `generateMetadata()` to all pages with Open Graph
- [ ] **Add product structured data** (1h) - JSON-LD schema for products

**Time Estimate**: 8-12 hours

---

## ⚠️ Priority 2: Important (Complete Before/After Launch)

### Fulfillment
- [ ] **Prescription upload system** (4-6h)
  - Create upload page post-payment
  - Add `orderPrescription` table to schema
  - Integrate file storage (Vercel Blob/Uploadthing)
  - Update email templates

### Admin Features
- [ ] **Order status updates** (2h) - Add status dropdown in admin orders table
- [ ] **Tracking code management** (2h) - Add tracking input, send "Order shipped" email
- [ ] **Product CRUD** (4-6h) - Create/edit/delete products from admin panel

### Operations
- [ ] **Melhor Envio shipping integration** (6-8h) ✅ Selected
  - Integrate Melhor Envio API for real-time shipping quotes
  - Support multiple carriers (Correios, Jadlog, Azul Cargo)
  - Replace manual shipping costs with dynamic calculation
  - Add shipping fields to database
- [ ] **eNotas NF-e integration** (6-8h) ✅ Selected
  - Auto-generate Nota Fiscal after payment
  - Add CPF/CNPJ field to customer form
  - Create `orderNotaFiscal` table
  - Email PDF to customers
  - Admin view for NF-e status
- [ ] **Notifications table** (2h) - Track all sent emails for audit log
- [ ] **Order shipped email template** (1h) - Create template with tracking info

**Time Estimate**: 32-46 hours

---

## 🌟 Priority 3: Nice-to-Have (Post-MVP)

### Payment
- [ ] **Brazilian payment methods** (8-12h)
  - Add PIX, Boleto, Debit Card support
  - Options: Enable in Stripe OR integrate ASAAS
  - Update checkout UI with payment method tabs

### User Experience
- [ ] Signed-in user checkout with pre-filled data (3-4h)
- [ ] Order history page for customers (2-3h)
- [ ] Saved addresses (2h)
- [ ] Order tracking page (customer-facing) (3-4h)

### Admin
- [ ] Sales dashboard with charts (4-6h)
- [ ] Export orders to CSV (2h)
- [ ] Low stock alerts (2-3h)
- [ ] Slack integration for new orders (2h)
- [ ] Customer management (3-4h)

### Shopping
- [ ] Product search (3-4h)
- [ ] Product filtering (2-3h)
- [ ] Product reviews (4-6h)
- [ ] Wishlist (3-4h)
- [ ] Product recommendations (4-6h)

### Performance
- [ ] Image optimization audit (2h)
- [ ] Code splitting for Stripe/admin (2h)
- [ ] Database query optimization (2-3h)
- [ ] Lighthouse audit (1-2h)

### Marketing
- [ ] Discount codes system (4-6h)
- [ ] Abandoned cart emails (3-4h)
- [ ] Welcome email sequence (2-3h)

**Time Estimate**: 60-100 hours

---

## 🔒 Security Audit Items

- [ ] Run `pnpm audit` and fix vulnerabilities
- [ ] Add rate limiting (Upstash Redis) on payment/cart endpoints
- [ ] Add CSRF protection to all POST routes
- [ ] Audit environment variables (no secrets in client code)
- [ ] Configure Content Security Policy headers
- [ ] Test checkout authorization bypass (incognito mode)
- [ ] Verify webhook signature validation

---

## ✅ Pre-Launch Testing Checklist

- [ ] Complete full guest checkout (cart → payment → email)
- [ ] Verify stock decreases after purchase
- [ ] Test with various BR addresses
- [ ] Test checkout authorization
- [ ] Verify emails sent to correct recipients
- [ ] Test out-of-stock products
- [ ] Admin can update order status
- [ ] Admin can add tracking codes
- [ ] Mobile responsive on all pages
- [ ] Cross-browser testing
- [ ] Lighthouse score > 90

---

## 📊 Summary

**Current Status**: 60% Complete

**Minimum Viable Launch**: Priority 1 (8-12 hours / 2-3 days)
**Recommended Launch**: Priority 1 + 2 (40-58 hours / 1-2 weeks)
**Full Featured**: All priorities (100-168 hours / 3-6 weeks)

**Immediate Next Steps**:
1. Fix email recipients (5 min) ← **START HERE**
2. Add checkout authorization (1-2h)
3. Implement stock management (3-4h)
4. Basic SEO (2-3h)
5. Prescription upload (4-6h)

---

For detailed implementation instructions, code examples, and architecture decisions, see:
- **[MVP-CHECKLIST.md](./MVP-CHECKLIST.md)** - Detailed implementation guide
- **[FEATURES.md](./FEATURES.md)** - Complete feature status
- **[SECURITY-AUDIT.md](./SECURITY-AUDIT.md)** - Security review and fixes
