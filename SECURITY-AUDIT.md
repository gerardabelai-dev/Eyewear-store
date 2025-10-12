# Dr. Vista E-commerce - Security Audit

> **Project**: Brazilian eyewear e-commerce platform - Security assessment and remediation guide

Last Updated: 2025-01-11

---

## 🔴 Critical Security Issues (Fix Before Launch)

### 1. **Checkout URL Authorization Bypass** 🚨

**Severity**: CRITICAL
**Impact**: Data breach, PII exposure, payment information access
**CVSS Score**: 8.1 (High)

**Issue**:
Anyone with an order ID can access any customer's checkout page without authentication or ownership validation.

**Affected File**: `src/app/(public)/(customer)/checkout/[orderId]/page.tsx:11-48`

**Proof of Concept**:
```bash
# Attacker can enumerate order IDs and access any checkout
curl https://drvista.com/checkout/ord_abc123
curl https://drvista.com/checkout/ord_abc124
curl https://drvista.com/checkout/ord_abc125
```

**Data Exposed**:
- Customer name, email, phone number
- Full shipping address
- Order details and pricing
- Payment method type
- Order status

**Recommended Fix**: Implement cookie-based authorization

```typescript
// src/app/(public)/(customer)/checkout/[orderId]/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
	params,
}: {
	params: Promise<{ orderId?: string }>;
}) {
	const { orderId } = await params;

	if (!orderId) {
		notFound();
	}

	// Check for order authorization cookie
	const cookieStore = await cookies();
	const orderAuthCookie = cookieStore.get(`order_${orderId}`);

	if (!orderAuthCookie || orderAuthCookie.value !== "authorized") {
		// Redirect to home or show error
		redirect("/");
	}

	// Rest of the code...
}
```

**Set Cookie When Order is Created**:
```typescript
// src/app/api/(customer)/orders/route.ts (or wherever order is created)
import { cookies } from "next/headers";

// After creating order
cookies().set(`order_${newOrder.id}`, "authorized", {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24, // 24 hours
	sameSite: "lax",
	path: "/",
});
```

**Alternative Fix**: Database-based token system (more robust)

```typescript
// Add to schema.ts
export const orderAccessToken = pgTable("order_access_token", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generatePrefixId("oat")),
	orderId: text("order_id")
		.notNull()
		.references(() => order.id, { onDelete: "cascade" }),
	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Validation in checkout page
const tokenFromQuery = searchParams.get("token");
const tokenRecord = await db.query.orderAccessToken.findFirst({
	where: and(
		eq(orderAccessToken.orderId, orderId),
		eq(orderAccessToken.token, tokenFromQuery),
		gt(orderAccessToken.expiresAt, new Date())
	),
});

if (!tokenRecord) {
	redirect("/");
}
```

**Testing**:
- [ ] Try accessing checkout URL without cookie/token → should redirect
- [ ] Try accessing checkout with expired token → should redirect
- [ ] Try accessing checkout for different order ID with valid token for another order → should fail
- [ ] Verify cookie is httpOnly and secure in production

---

### 2. **Email Recipients Hardcoded to Test Addresses** 🚨

**Severity**: CRITICAL
**Impact**: Customers don't receive order confirmations, business reputation damage

**Affected File**: `src/app/api/stripe/services/handle-payment-success.ts:74-75`

**Current Code**:
```typescript
const { error } = await resend.emails.send({
	from: "Dr. Vista <noreply@drvista.com.br>",
	to: ["delivered@resend.dev"], // ❌ HARDCODED TEST EMAIL
	subject: "Pagamento confirmado - Dr. Vista",
	react: PaymentConfirmedEmail({ orderPayment: orderPaymentData }),
});
```

**Fix** (5 minutes):
```typescript
const { error } = await resend.emails.send({
	from: "Dr. Vista <noreply@drvista.com.br>",
	to: [orderPaymentFound.order.customer.user.email], // ✅ Use actual customer email
	subject: "Pagamento confirmado - Dr. Vista",
	react: PaymentConfirmedEmail({ orderPayment: orderPaymentData }),
});
```

**Files to Check**:
- `src/app/api/stripe/services/handle-payment-success.ts:74` - Payment confirmation email
- Search for `delivered@resend.dev` across entire codebase
- Search for `onboarding@resend.dev` across entire codebase

**Testing**:
- [ ] Complete test purchase with real email
- [ ] Verify email arrives at customer's inbox
- [ ] Check spam folder if not in inbox
- [ ] Test with multiple email providers (Gmail, Outlook, Yahoo)

---

### 3. **No Stock Validation - Overselling Products** 🚨

**Severity**: CRITICAL
**Impact**: Business loss, customer dissatisfaction, fulfillment issues

**Issue**:
- No stock check when adding products to cart
- No stock deduction after successful payment

**Affected Files**:
- `src/app/api/(customer)/carts/[cartId]/products/route.ts` - Add to cart (no validation)
- `src/app/api/stripe/services/handle-payment-success.ts` - Payment success (no stock update)

**Fix 1: Stock Validation on Add to Cart**

```typescript
// src/app/api/(customer)/carts/[cartId]/products/route.ts
import { ERROR_CODES, HTTP_CODES } from "@/app/api/contants/error-codes";

// After fetching product (around line 60)
const productFound = await db.query.product.findFirst({
	where: eq(product.id, productId),
});

if (!productFound) {
	return Response.json(
		mapErrorCodes(ERROR_CODES.PRODUCT_NOT_FOUND),
		{ status: HTTP_CODES.NOT_FOUND }
	);
}

// ✅ ADD STOCK VALIDATION
if (productFound.stock < quantity) {
	return Response.json(
		{
			code: ERROR_CODES.INSUFFICIENT_STOCK,
			message: `Estoque insuficiente. Disponível: ${productFound.stock}`,
		},
		{ status: HTTP_CODES.BAD_REQUEST }
	);
}
```

**Fix 2: Stock Deduction After Payment**

```typescript
// src/app/api/stripe/services/handle-payment-success.ts
import { product } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

// After order creation, before sending email (around line 120)
// Deduct stock for all products in the order
for (const orderProduct of orderPaymentFound.order.orderProducts) {
	await tx
		.update(product)
		.set({
			stock: sql`${product.stock} - ${orderProduct.quantity}`,
		})
		.where(eq(product.id, orderProduct.productId));
}

// Optional: Add out-of-stock check here as well
const updatedProduct = await tx.query.product.findFirst({
	where: eq(product.id, orderProduct.productId),
});

if (updatedProduct && updatedProduct.stock < 0) {
	// Log error - this shouldn't happen if validation worked
	console.error(`Product ${orderProduct.productId} oversold!`);
	// Consider sending admin notification
}
```

**Fix 3: Out-of-Stock UI State**

```typescript
// src/app/(public)/(home)/products/[productSlug]/desktop-product-page.tsx
<LensSelectionDrawer
	glassesProduct={{
		id: product.id,
		name: product.name,
		slug: product.slug || "",
	}}
	trigger={
		<Button
			size="lg"
			className="w-full"
			variant="default"
			disabled={product.stock === 0} // ✅ Disable when out of stock
		>
			{product.stock === 0
				? "Produto esgotado"
				: "Escolher lentes e comprar"}
		</Button>
	}
	// ... rest of props
/>

{/* Show stock indicator */}
{product.stock > 0 && product.stock <= 5 && (
	<p className="text-sm text-amber-600">
		Apenas {product.stock} unidades restantes
	</p>
)}
```

**Add Error Code**:
```typescript
// src/app/api/contants/error-codes.ts
export const ERROR_CODES = {
	// ... existing codes
	INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
} as const;

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
	// ... existing messages
	[ERROR_CODES.INSUFFICIENT_STOCK]: "Estoque insuficiente para esta quantidade",
};
```

**Testing**:
- [ ] Try adding more items than available stock → should fail
- [ ] Complete purchase → verify stock decreases
- [ ] Try purchasing product with 0 stock → button should be disabled
- [ ] Verify concurrent purchases don't cause negative stock (use database transactions)

---

## 🟠 High Priority Security Issues

### 4. **Prescription Data Hardcoded**

**Severity**: HIGH
**Impact**: Cannot fulfill prescription orders, legal compliance issues

**Affected File**: `src/app/api/stripe/services/handle-payment-success.ts:105`

**Current Code**:
```typescript
prescription: "OD: -2.00 | OE: -1.75", // TODO: Get from actual prescription upload
```

**Issue**:
- Prescription is hardcoded mock data
- No way for customers to upload prescription files
- Cannot fulfill prescription lens orders
- Potential medical/legal liability

**Recommended Solution**: Post-payment prescription upload flow

See **MVP-CHECKLIST.md Priority 2** for full implementation details.

**Security Considerations**:
- Prescription files contain PHI (Protected Health Information)
- Must be stored securely (encrypted at rest)
- Access control: only customer + admin can view
- LGPD compliance required (Brazilian data protection law)
- Consider using Cloudflare R2 or AWS S3 with encryption

**Compliance**:
- LGPD (Lei Geral de Proteção de Dados) compliance required
- Medical device regulations may apply
- Consult legal team before launch

---

### 5. **No Rate Limiting on API Routes**

**Severity**: HIGH
**Impact**: DDoS attacks, brute force, cart spam, payment endpoint abuse

**Affected Routes**:
- `/api/stripe/payment-intents/create` - Payment creation
- `/api/(customer)/carts/[cartId]/products` - Cart manipulation
- `/api/(customer)/orders` - Order creation
- `/api/auth/*` - Authentication endpoints

**Recommended Fix**: Implement rate limiting with Upstash Redis

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL!,
	token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create different rate limiters for different endpoints
export const paymentRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
	analytics: true,
});

export const cartRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 requests per minute
	analytics: true,
});

export const authRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "5 m"), // 10 requests per 5 minutes
	analytics: true,
});
```

**Usage in API Route**:
```typescript
// src/app/api/stripe/payment-intents/create/route.ts
import { paymentRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(request: Request) {
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";

	const { success, limit, reset, remaining } = await paymentRateLimit.limit(ip);

	if (!success) {
		return Response.json(
			{ error: "Rate limit exceeded. Please try again later." },
			{
				status: 429,
				headers: {
					"X-RateLimit-Limit": limit.toString(),
					"X-RateLimit-Remaining": remaining.toString(),
					"X-RateLimit-Reset": reset.toString(),
				},
			}
		);
	}

	// Rest of the handler...
}
```

**Alternative**: Use Vercel's built-in rate limiting (if on Pro plan)

**Testing**:
- [ ] Make rapid requests to payment endpoint → should return 429 after limit
- [ ] Verify rate limit resets after time window
- [ ] Test from different IPs → should have separate limits

---

### 6. **Environment Variable Exposure**

**Severity**: MEDIUM-HIGH
**Impact**: API key leakage, unauthorized access

**Current State**: Environment variables validated in `src/lib/env.ts` using Zod

**Good Practices Already Implemented**:
- ✅ Server-only environment variables not exposed to client
- ✅ Zod validation ensures required vars are present
- ✅ TypeScript types generated from Zod schema

**Potential Issues**:
```typescript
// ❌ DON'T DO THIS - exposes secret to client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ DO THIS - only use in server components/API routes
import "server-only";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

**Verification Checklist**:
- [ ] Search codebase for `process.env` in client components
- [ ] Verify all secret keys have `NEXT_PUBLIC_` prefix ONLY if meant for client
- [ ] Check `.env.example` doesn't contain real values
- [ ] Verify `.env` is in `.gitignore`
- [ ] Audit Vercel environment variables → ensure production secrets are separate

**Files to Audit**:
```bash
# Find all client-side env usage
grep -r "process.env" src/app/(public) --include="*.tsx" --include="*.ts"
grep -r "'use client'" src --include="*.tsx" -A 20 | grep "process.env"
```

---

## 🟡 Medium Priority Security Issues

### 7. **CSRF Protection**

**Severity**: MEDIUM
**Impact**: Cross-site request forgery attacks

**Current State**:
- Better-auth handles CSRF for auth endpoints automatically
- Custom API routes may be vulnerable

**Affected Routes**:
- `/api/(customer)/carts/[cartId]/products` - POST/PATCH/DELETE
- `/api/(customer)/orders` - POST
- `/api/stripe/payment-intents/create` - POST

**Recommended Fix**: Implement CSRF tokens

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// Check for CSRF token on state-changing requests
	if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
		const csrfToken = request.headers.get("x-csrf-token");
		const csrfCookie = request.cookies.get("csrf-token")?.value;

		if (!csrfToken || csrfToken !== csrfCookie) {
			return NextResponse.json(
				{ error: "Invalid CSRF token" },
				{ status: 403 }
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/api/(customer|stripe)/:path*",
};
```

**Alternative**: Use `next-safe-action` library for type-safe server actions with CSRF protection

**Note**: Better-auth already handles CSRF for `/api/auth/*` routes

---

### 8. **Input Validation Gaps**

**Severity**: MEDIUM
**Impact**: SQL injection (mitigated by Drizzle ORM), XSS, data corruption

**Current State**:
- ✅ Drizzle ORM prevents SQL injection with parameterized queries
- ✅ Zod validation on most forms
- ⚠️ Some API routes may lack validation

**Potential Gaps**:

**File Upload Validation** (when prescription upload is implemented):
```typescript
// Validate file type, size, and content
const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

if (!allowedMimeTypes.includes(file.type)) {
	return Response.json(
		{ error: "Invalid file type. Only PDF and images allowed." },
		{ status: 400 }
	);
}

if (file.size > maxFileSize) {
	return Response.json(
		{ error: "File too large. Maximum 5MB." },
		{ status: 400 }
	);
}

// Validate file content (not just extension)
const fileBuffer = await file.arrayBuffer();
const fileType = await FileType.fromBuffer(fileBuffer);
if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
	return Response.json(
		{ error: "File content does not match extension." },
		{ status: 400 }
	);
}
```

**API Route Validation**:
```typescript
// Always validate with Zod before database operations
import { z } from "zod";

const addToCartSchema = z.object({
	productId: z.string().startsWith("prd_"),
	quantity: z.number().int().min(1).max(99),
	parentProductId: z.string().startsWith("prd_").optional(),
});

const body = await request.json();
const validation = addToCartSchema.safeParse(body);

if (!validation.success) {
	return Response.json(
		{ error: "Invalid input", details: validation.error.errors },
		{ status: 400 }
	);
}
```

**XSS Prevention**:
- ✅ React escapes JSX by default
- ⚠️ Verify no use of `dangerouslySetInnerHTML` without sanitization
- ⚠️ Sanitize user input before storing in database

---

### 9. **Webhook Signature Verification**

**Severity**: MEDIUM
**Impact**: Fake payment confirmations, unauthorized order status updates

**Current State**: ✅ Already implemented correctly

**File**: `src/app/api/stripe/webhooks/route.ts:19-30`

**Implementation**:
```typescript
const signature = headers.get("stripe-signature");
if (!signature) {
	return Response.json({ error: "No signature" }, { status: 400 });
}

try {
	event = stripe.webhooks.constructEvent(
		body,
		signature,
		env.STRIPE_WEBHOOK_SECRET
	);
} catch (err) {
	console.error("Webhook signature verification failed:", err);
	return Response.json({ error: "Invalid signature" }, { status: 400 });
}
```

**Status**: ✅ SECURE - No changes needed

**Testing**:
- [ ] Verify webhook endpoint rejects requests without signature
- [ ] Verify webhook endpoint rejects requests with invalid signature
- [ ] Test with Stripe CLI: `pnpm stripe`

---

### 10. **Session Security**

**Severity**: MEDIUM
**Impact**: Session hijacking, unauthorized access

**Current State**: Better-auth configuration in `src/lib/auth.ts`

**Configuration**:
```typescript
session: {
	expiresIn: 60 * 60 * 24 * 7, // 7 days
	updateAge: 60 * 60 * 24, // 1 day
	cookieCache: {
		enabled: true,
		maxAge: 5 * 60, // 5 minutes
	},
},
```

**Recommendations**:
1. ✅ Sessions expire after 7 days (reasonable)
2. ✅ Cookie cache enabled (performance + security)
3. ⚠️ Consider adding `secure` and `sameSite` flags

**Enhanced Configuration**:
```typescript
session: {
	expiresIn: 60 * 60 * 24 * 7, // 7 days
	updateAge: 60 * 60 * 24, // 1 day
	cookieCache: {
		enabled: true,
		maxAge: 5 * 60, // 5 minutes
	},
},
advanced: {
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	},
},
```

**Additional Security Measures**:
- [ ] Implement session timeout on inactivity (30 minutes)
- [ ] Add "Remember me" option with longer expiry
- [ ] Log session creation/destruction for audit trail
- [ ] Implement concurrent session detection

---

## 🟢 Low Priority Security Issues

### 11. **Content Security Policy (CSP)**

**Severity**: LOW
**Impact**: XSS mitigation, clickjacking prevention

**Current State**: No CSP headers configured

**Recommended Implementation**:
```typescript
// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.stripe.com https://api.resend.com;
  frame-src https://js.stripe.com;
`;

export default {
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
	},
};
```

---

### 12. **Dependency Vulnerabilities**

**Severity**: LOW-MEDIUM
**Impact**: Supply chain attacks, known vulnerabilities

**Current State**: Unknown - needs audit

**Recommended Actions**:
```bash
# Run npm audit
pnpm audit

# Fix vulnerabilities
pnpm audit --fix

# Check for outdated packages
pnpm outdated

# Use Snyk or Dependabot for continuous monitoring
```

**Verification**:
- [ ] Run `pnpm audit` and fix all high/critical vulnerabilities
- [ ] Enable Dependabot alerts on GitHub
- [ ] Set up automated dependency updates
- [ ] Review security advisories for Next.js, Drizzle, Stripe SDK

---

## 📋 Security Checklist for Launch

### Pre-Launch (Must Complete)
- [ ] Fix checkout URL authorization (Priority 1)
- [ ] Fix email recipients to use customer emails (Priority 1)
- [ ] Implement stock validation on add to cart (Priority 1)
- [ ] Implement stock deduction after payment (Priority 1)
- [ ] Add out-of-stock UI state (Priority 1)
- [ ] Implement rate limiting on payment endpoints (Priority 2)
- [ ] Audit environment variable usage in client components (Priority 2)
- [ ] Run `pnpm audit` and fix critical vulnerabilities (Priority 2)

### Post-Launch (Within 1 Week)
- [ ] Implement prescription upload with secure storage (Priority 2)
- [ ] Add CSRF protection to all state-changing endpoints (Priority 2)
- [ ] Configure Content Security Policy headers (Priority 3)
- [ ] Set up Dependabot for automated security updates (Priority 3)
- [ ] Implement session timeout on inactivity (Priority 3)

### Ongoing
- [ ] Weekly security dependency audits
- [ ] Monthly penetration testing
- [ ] Quarterly security code reviews
- [ ] Monitor rate limit analytics for abuse patterns
- [ ] Review Stripe webhook logs for anomalies

---

## 🔍 Testing & Verification

### Security Testing Tools

**OWASP ZAP** (Web Application Security Scanner):
```bash
# Install OWASP ZAP
brew install --cask owasp-zap

# Run automated scan
zap-cli quick-scan https://localhost:3000
```

**Burp Suite** (Manual penetration testing):
- Test checkout authorization bypass
- Test CSRF vulnerabilities
- Test rate limiting
- Test input validation

**npm audit**:
```bash
pnpm audit
pnpm audit --fix
```

**TypeScript Strict Mode** (already enabled):
```json
// tsconfig.json
{
	"compilerOptions": {
		"strict": true
	}
}
```

---

## 📊 Security Metrics

### Current Security Score: **4.5/10** ⚠️

**Breakdown**:
- Authentication: 7/10 (Better-auth is solid, missing guest-to-auth flow)
- Authorization: 2/10 (Critical: no checkout ownership validation)
- Data Protection: 3/10 (Critical: email recipients, prescription data)
- Input Validation: 6/10 (Zod validation good, some gaps)
- Rate Limiting: 0/10 (Not implemented)
- CSRF Protection: 5/10 (Better-auth handles auth routes, API routes vulnerable)
- Session Security: 7/10 (Good config, could improve)
- Dependency Security: Unknown (needs audit)

### Post-Fix Security Score Target: **8.5/10** ✅

After implementing Priority 1 and 2 fixes:
- Authentication: 8/10
- Authorization: 9/10
- Data Protection: 8/10
- Input Validation: 8/10
- Rate Limiting: 9/10
- CSRF Protection: 9/10
- Session Security: 8/10
- Dependency Security: 8/10

---

## 📚 References

- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [Better-auth Security Best Practices](https://better-auth.com/docs/concepts/security)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [LGPD (Brazilian Data Protection Law)](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)

---

## ✅ Summary

**Critical Issues to Fix Before Launch** (8-12 hours):
1. Checkout URL authorization (1-2 hours)
2. Email recipients hardcoding (5 minutes)
3. Stock validation and deduction (2-3 hours)
4. Rate limiting on critical endpoints (2-3 hours)
5. Environment variable audit (1 hour)
6. Dependency security audit (1 hour)

**Estimated Time to Secure MVP**: 1-2 days of focused work

**First Action**: Fix email recipients (5-minute change) and checkout authorization (1-2 hours)
