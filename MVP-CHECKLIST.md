# Dr. Vista MVP Implementation Checklist

> **Goal**: Launch-ready e-commerce platform where customers can purchase prescription eyewear and admins can manage orders.

**Current Status**: 60% Complete
**Target Launch**: 2-3 weeks

---

## 🚨 Priority 1: Critical Launch Blockers (Week 1)

### 1.1 Fix Email Recipients ⏱️ 5 minutes
**Status**: ❌ Not Started
**Complexity**: Trivial
**Blocks**: Customer communication

**Current Problem**:
```typescript
// src/app/api/stripe/services/handle-payment-success.ts:74-75
to: ["delivered@resend.dev"],  // ❌ Hardcoded test email
```

**Solution**:
```typescript
to: [orderPaymentFound.order.customer.user.email],  // ✅ Use customer email
```

**Files to Change**:
- [ ] `src/app/api/stripe/services/handle-payment-success.ts:75`
- [ ] Verify customer email is available in query (line 16-51)
- [ ] Test with Stripe test payment

**Testing**:
1. Complete a test checkout
2. Verify email sent to customer's email address
3. Check Resend dashboard for delivery status

---

### 1.2 Add Checkout Authorization ⏱️ 1-2 hours
**Status**: ❌ Not Started
**Complexity**: Medium
**Blocks**: Security vulnerability

**Current Problem**:
- Anyone with order ID can access `/checkout/[orderId]`
- Exposes customer PII, payment details, addresses

**Solution Option A**: Session-based (simpler for guest checkout)
```typescript
// Create checkout cookie when order is created
import { cookies } from 'next/headers';

// In create order API:
cookies().set(`order_${orderId}`, 'authorized', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // 24 hours
  sameSite: 'lax'
});

// In checkout page:
export default async function CheckoutPage({ params }) {
  const cookieStore = cookies();
  const authorized = cookieStore.get(`order_${params.orderId}`);

  if (!authorized) {
    return notFound();
  }
  // ... rest of code
}
```

**Solution Option B**: Database token (more secure)
```typescript
// Add to schema.ts:
export const orderAccessToken = pgTable("orderAccessToken", {
  id: text("id").primaryKey().$defaultFn(() => generatePrefixId("token")),
  orderId: text("orderId").notNull().references(() => order.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  ...timestamps,
});

// Usage:
// 1. Create token when order created, redirect to /checkout/[orderId]?token=xxx
// 2. Verify token in checkout page
// 3. Set cookie after verification
```

**Files to Change**:
- [ ] `src/app/(public)/(customer)/checkout/[orderId]/page.tsx`
- [ ] `src/app/api/(customer)/orders/route.ts` (create order endpoint)
- [ ] Optional: `src/lib/db/schema.ts` (if using DB tokens)

**Testing**:
1. Create order, get checkout URL
2. Try accessing in incognito (should fail)
3. Access with valid token/cookie (should work)
4. Test token expiry

---

### 1.3 Implement Stock Validation ⏱️ 2-3 hours
**Status**: ❌ Not Started
**Complexity**: Medium
**Blocks**: Overselling products

#### 1.3.1 Validate Stock on Add to Cart

**File**: `src/app/api/(customer)/carts/[cartId]/products/route.ts`

**Changes**:
```typescript
// After line 86, before adding to cart:
const defaultPrice = productFound.productPrice[0];

// ✅ ADD THIS:
if (productFound.stock < quantity) {
  return Response.json(
    mapErrorCodes(ERROR_CODES.INSUFFICIENT_STOCK),
    { status: HTTP_CODES.BAD_REQUEST }
  );
}

// Also check existing quantity:
if (existingCartProduct) {
  const totalQuantity = existingCartProduct.quantity + quantity;
  if (productFound.stock < totalQuantity) {
    return Response.json(
      mapErrorCodes(ERROR_CODES.INSUFFICIENT_STOCK),
      { status: HTTP_CODES.BAD_REQUEST }
    );
  }
}
```

**Files to Change**:
- [ ] `src/app/api/(customer)/carts/[cartId]/products/route.ts:86` (POST)
- [ ] `src/app/api/(customer)/carts/[cartId]/glasses/route.ts:90` (glasses endpoint)
- [ ] `src/app/api/(customer)/carts/[cartId]/quantity/route.ts` (quantity updates)

#### 1.3.2 Deduct Stock After Payment

**File**: `src/app/api/stripe/services/handle-payment-success.ts`

**Changes**:
```typescript
// After line 72 (order status update), add:
await db.update(order)
  .set({ orderStatus: "paid" })
  .where(eq(order.id, orderPaymentFound.orderId));

// ✅ ADD THIS:
// Deduct stock for all products in cart
const cartProducts = orderPaymentFound.order.cart?.cartProducts || [];
for (const item of cartProducts) {
  await db.update(product)
    .set({
      stock: sql`${product.stock} - ${item.quantity}`,
      updatedAt: new Date()
    })
    .where(eq(product.id, item.productId));
}
```

**Files to Change**:
- [ ] `src/app/api/stripe/services/handle-payment-success.ts:72`
- [ ] Import `sql` from `drizzle-orm` for atomic updates

**Testing**:
1. Check product stock before purchase
2. Complete payment
3. Verify stock decreased by purchase quantity
4. Try adding more than available stock (should fail)

---

### 1.4 Add Out-of-Stock UI State ⏱️ 1 hour
**Status**: ❌ Not Started
**Complexity**: Low
**Depends On**: 1.3 (stock validation)

**Changes**:

```typescript
// src/app/(public)/(home)/products/[productSlug]/desktop-product-page.tsx:188
<Button size="lg" className="w-full" variant="default" disabled={product.stock === 0}>
  {product.stock === 0 ? "Fora de estoque" : "Escolher lentes e comprar"}
</Button>

// Add stock indicator:
{product.stock < 10 && product.stock > 0 && (
  <p className="text-sm text-orange-600">
    Apenas {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'} disponível
  </p>
)}
{product.stock === 0 && (
  <p className="text-sm text-red-600">Produto esgotado</p>
)}
```

**Files to Change**:
- [ ] `src/app/(public)/(home)/products/[productSlug]/desktop-product-page.tsx:188`
- [ ] `src/app/(public)/(home)/products/[productSlug]/mobile-product-page.tsx:115`
- [ ] `src/app/(public)/(home)/page.tsx` (product cards - disable if stock = 0)

**Testing**:
1. Set product stock to 0 in database
2. Verify "Fora de estoque" shows
3. Verify button is disabled
4. Set stock to 3, verify "Apenas 3 unidades disponível"

---

### 1.5 Guest-to-Auth Middleware ⏱️ 1-2 hours
**Status**: ❌ Not Started
**Complexity**: Medium
**Improves**: User experience

**Current Problem**:
- Guest creates account in checkout
- Not automatically logged in
- Has to sign in manually to view order

**Solution**:
```typescript
// src/app/(public)/(customer)/checkout/[orderId]/checkout-customer-form.tsx:71
const createCustomerMutation = useCreateCustomerMutation({
  onSuccess: async (data) => {
    // Update order with customer id
    updateOrderCustomerIdMutation.mutate({
      orderId,
      customerId: data.customer.id,
    });

    // ✅ ADD THIS: Auto-sign in the user
    try {
      await signIn.email({
        email: data.customer.user.email,
        password: data.tempPassword, // Need to return this from API
      }, {
        onSuccess: () => {
          console.log("Auto-signed in after account creation");
        }
      });
    } catch (error) {
      console.error("Auto sign-in failed:", error);
      // Non-blocking - user can still continue checkout
    }
  },
  // ...
});
```

**Alternative**: Use magic link instead of password
```typescript
// Send magic link immediately after account creation
await signIn.magicLink({
  email: data.customer.user.email,
  callbackURL: `/checkout/${orderId}`
});
```

**Files to Change**:
- [ ] `src/app/(public)/(customer)/checkout/[orderId]/checkout-customer-form.tsx:71`
- [ ] `src/app/api/(customer)/customers/route.ts` (return temp password or session token)
- [ ] Consider using Better-auth's `linkAccount` feature

**Testing**:
1. Complete checkout as guest
2. Verify automatically signed in
3. Navigate to `/minha-conta` (should show order)

---

### 1.6 Basic SEO Implementation ⏱️ 2-3 hours
**Status**: ❌ Not Started
**Complexity**: Low
**Blocks**: Search discoverability

#### 1.6.1 Add sitemap.xml

**Create**: `src/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { product } from '@/lib/db/schema'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.select({ slug: product.slug, updatedAt: product.updatedAt })
    .from(product)
    .where(eq(product.status, 'active'));

  const productUrls = products.map(p => ({
    url: `https://drvista.com.br/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://drvista.com.br',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://drvista.com.br/produtos',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ]
}
```

**Files to Create**:
- [ ] `src/app/sitemap.ts`

#### 1.6.2 Add robots.txt

**Create**: `public/robots.txt`
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /cart
Disallow: /api

Sitemap: https://drvista.com.br/sitemap.xml
```

**Files to Create**:
- [ ] `public/robots.txt`

#### 1.6.3 Add Meta Tags to Product Pages

**File**: `src/app/(public)/(home)/products/[productSlug]/page.tsx`

**Add**:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await db.query.product.findFirst({
    where: eq(product.slug, params.productSlug),
    with: { images: true, productPrice: true }
  });

  if (!product) return {};

  const defaultImage = product.images[0]?.imageUrl || '/og-image.jpg';
  const price = product.productPrice?.[0]?.priceInCents || 0;

  return {
    title: `${product.name} - Dr. Vista`,
    description: product.description || `Compre ${product.name} na Dr. Vista com qualidade e entrega garantida.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: defaultImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [defaultImage],
    },
    // Structured data
    other: {
      'product:price:amount': (price / 100).toString(),
      'product:price:currency': 'BRL',
    }
  }
}
```

**Files to Change**:
- [ ] `src/app/(public)/(home)/products/[productSlug]/page.tsx`
- [ ] `src/app/(public)/(home)/page.tsx` (home page meta)
- [ ] `src/app/layout.tsx` (update default metadata)

#### 1.6.4 Add Product Structured Data (JSON-LD)

**File**: `src/app/(public)/(home)/products/[productSlug]/page.tsx`

**Add to page component**:
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images.map(img => img.imageUrl),
  offers: {
    '@type': 'Offer',
    price: (product.productPrice[0].priceInCents / 100).toFixed(2),
    priceCurrency: 'BRL',
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  },
  brand: {
    '@type': 'Brand',
    name: 'Dr. Vista'
  }
};

// In JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

**Files to Change**:
- [ ] `src/app/(public)/(home)/products/[productSlug]/page.tsx`

**Testing**:
1. Build project: `pnpm build`
2. Check sitemap: `http://localhost:3000/sitemap.xml`
3. Validate structured data: https://validator.schema.org/
4. Test Open Graph: https://www.opengraph.xyz/

---

## ⚠️ Priority 2: Important Features (Week 2-3)

### 2.1 Prescription Upload System ⏱️ 4-6 hours
**Status**: ❌ Not Started
**Complexity**: High
**Blocks**: Fulfillment

**Architecture**:
1. After payment success, redirect to prescription upload page
2. Store prescription files in cloud storage (Cloudflare R2 / AWS S3 / Vercel Blob)
3. Save file URLs in database
4. Send prescription to fulfillment team

**Database Schema**:
```typescript
// Add to src/lib/db/schema.ts
export const orderPrescription = pgTable("orderPrescription", {
  id: text("id").primaryKey().$defaultFn(() => generatePrefixId("prescription")),
  orderId: text("orderId").notNull().references(() => order.id, { onDelete: "cascade" }),
  fileUrl: text("fileUrl").notNull(),
  fileName: text("fileName").notNull(),
  fileType: text("fileType").notNull(), // "pdf", "jpg", "png"
  uploadedAt: timestamp("uploadedAt").notNull().defaultNow(),
  notes: text("notes"), // Customer notes about prescription
  ...timestamps,
});
```

**Implementation Steps**:
- [ ] Add `orderPrescription` table to schema
- [ ] Create prescription upload page: `app/(public)/(customer)/orders/[orderId]/prescription/page.tsx`
- [ ] Integrate file upload (Vercel Blob or Uploadthing)
- [ ] Create API route: `app/api/(customer)/orders/[orderId]/prescription/route.ts`
- [ ] Redirect to upload page after payment success
- [ ] Update email template to show prescription status
- [ ] Admin view to see uploaded prescriptions

**Files to Create**:
- [ ] `src/lib/db/schema.ts` (add table)
- [ ] `src/app/(public)/(customer)/orders/[orderId]/prescription/page.tsx`
- [ ] `src/app/api/(customer)/orders/[orderId]/prescription/route.ts`
- [ ] `src/components/prescription-upload-form.tsx`

**Testing**:
1. Complete checkout
2. Upload PDF prescription
3. Verify file stored and URL in database
4. Admin can view prescription

---

### 2.2 Melhor Envio Shipping Integration ⏱️ 6-8 hours
**Status**: ❌ Not Started
**Complexity**: High
**Improves**: Accurate shipping costs, multiple carrier options

**Current**: Manual shipping costs in `orderDeliveryMethod` table

**Goal**: Real-time shipping quotes from Correios, Jadlog, Azul Cargo, and more

**Service**: **Melhor Envio** ✅ Selected
- Website: https://melhorenvio.com.br
- Integrates with: Correios (PAC, SEDEX), Jadlog, Azul Cargo, Loggi, etc.
- Single API for all carriers
- Competitive negotiated rates
- Free sandbox for testing

**Setup**:
1. Create account at https://melhorenvio.com.br
2. Get API token from dashboard
3. Configure company address (origin for all shipments)
4. Add credit for production shipping labels

**Implementation**:

#### Step 1: Create Melhor Envio Client
```typescript
// src/lib/melhor-envio/client.ts
import { env } from '@/lib/env';

const MELHOR_ENVIO_API = 'https://melhorenvio.com.br/api/v2';

export interface ShippingCalculateParams {
	from: {
		postalCode: string; // CEP origem (sua loja)
	};
	to: {
		postalCode: string; // CEP destino (cliente)
	};
	package: {
		weight: number; // kg
		width: number; // cm
		height: number; // cm
		length: number; // cm
	};
	options?: {
		insurance_value?: number; // Valor seguro
		receipt?: boolean; // Aviso de recebimento
		own_hand?: boolean; // Mão própria
	};
}

export interface ShippingQuote {
	id: number;
	name: string; // "PAC", "SEDEX", etc.
	company: {
		id: number;
		name: string; // "Correios", "Jadlog"
		picture: string;
	};
	price: number; // Preço em reais
	discount: number;
	delivery_time: number; // Dias úteis
	delivery_range: {
		min: number;
		max: number;
	};
	custom_price: number;
	currency: string;
	error?: string;
}

export async function calculateShipping(
	params: ShippingCalculateParams
): Promise<ShippingQuote[]> {
	const response = await fetch(`${MELHOR_ENVIO_API}/me/shipment/calculate`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.MELHOR_ENVIO_API_KEY}`,
			'User-Agent': 'Dr. Vista (contato@drvista.com.br)',
		},
		body: JSON.stringify({
			from: {
				postal_code: params.from.postalCode,
			},
			to: {
				postal_code: params.to.postalCode,
			},
			package: {
				weight: params.package.weight,
				width: params.package.width,
				height: params.package.height,
				length: params.package.length,
			},
			options: {
				insurance_value: params.options?.insurance_value || 0,
				receipt: params.options?.receipt || false,
				own_hand: params.options?.own_hand || false,
			},
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`Melhor Envio API error: ${JSON.stringify(error)}`);
	}

	const quotes: ShippingQuote[] = await response.json();

	// Filter out quotes with errors
	return quotes.filter(quote => !quote.error);
}
```

#### Step 2: Create API Route for Shipping Calculation
```typescript
// src/app/api/(customer)/shipping/calculate/route.ts
import { calculateShipping } from '@/lib/melhor-envio/client';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const shippingSchema = z.object({
	destinationZipCode: z.string().regex(/^\d{5}-?\d{3}$/),
	orderValue: z.number().positive(), // For insurance
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { destinationZipCode, orderValue } = shippingSchema.parse(body);

		// Default package dimensions for eyeglasses
		// TODO: Get from product data or make configurable
		const packageDimensions = {
			weight: 0.2, // 200g (typical for glasses case)
			width: 20,   // 20cm
			height: 10,  // 10cm
			length: 15,  // 15cm
		};

		const quotes = await calculateShipping({
			from: {
				postalCode: process.env.COMPANY_ZIP_CODE || '01310-100', // Your store address
			},
			to: {
				postalCode: destinationZipCode.replace('-', ''),
			},
			package: packageDimensions,
			options: {
				insurance_value: orderValue / 100, // Convert cents to reais
				receipt: false,
				own_hand: false,
			},
		});

		// Format response for frontend
		const formattedQuotes = quotes.map(quote => ({
			id: quote.id.toString(),
			name: `${quote.company.name} - ${quote.name}`,
			carrier: quote.company.name,
			service: quote.name,
			priceInCents: Math.round(quote.price * 100), // Convert to cents
			deliveryDays: quote.delivery_time,
			deliveryRange: quote.delivery_range,
		}));

		return Response.json({ quotes: formattedQuotes });
	} catch (error) {
		console.error('Shipping calculation error:', error);
		return Response.json(
			{ error: 'Failed to calculate shipping' },
			{ status: 500 }
		);
	}
}
```

#### Step 3: Update Checkout to Use Real Shipping Quotes
```typescript
// src/app/(public)/(customer)/checkout/[orderId]/checkout-shipping-form.tsx

const [shippingQuotes, setShippingQuotes] = useState<ShippingQuote[]>([]);
const [loadingShipping, setLoadingShipping] = useState(false);

// Calculate shipping when ZIP code is entered
const handleZipCodeChange = async (zipCode: string) => {
	if (zipCode.length === 9) { // Format: 12345-678
		setLoadingShipping(true);
		try {
			const response = await fetch('/api/shipping/calculate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					destinationZipCode: zipCode,
					orderValue: orderTotal, // From order context
				}),
			});

			const { quotes } = await response.json();
			setShippingQuotes(quotes);
		} catch (error) {
			console.error('Failed to fetch shipping quotes:', error);
			toast.error('Erro ao calcular frete. Tente novamente.');
		} finally {
			setLoadingShipping(false);
		}
	}
};

// Render shipping options
{loadingShipping ? (
	<div className="space-y-2">
		<Skeleton className="h-16 w-full" />
		<Skeleton className="h-16 w-full" />
	</div>
) : (
	<RadioGroup onValueChange={(value) => form.setValue('shippingMethodId', value)}>
		{shippingQuotes.map((quote) => (
			<div key={quote.id} className="flex items-center space-x-2 border p-4 rounded">
				<RadioGroupItem value={quote.id} id={quote.id} />
				<Label htmlFor={quote.id} className="flex-1 cursor-pointer">
					<div className="flex justify-between">
						<div>
							<p className="font-medium">{quote.name}</p>
							<p className="text-sm text-muted-foreground">
								Entrega em {quote.deliveryDays} dias úteis
							</p>
						</div>
						<p className="font-semibold">
							{formatPrice(quote.priceInCents)}
						</p>
					</div>
				</Label>
			</div>
		))}
	</RadioGroup>
)}
```

#### Step 4: Save Shipping Choice to Database
```typescript
// Update orderDelivery table to store Melhor Envio quote ID
// src/lib/db/schema.ts
export const orderDelivery = pgTable("orderDelivery", {
	// ... existing fields
	melhorEnvioQuoteId: text("melhorEnvioQuoteId"), // Store for later purchase
	shippingCarrier: text("shippingCarrier"), // "Correios", "Jadlog"
	shippingService: text("shippingService"), // "PAC", "SEDEX"
	estimatedDeliveryDays: integer("estimatedDeliveryDays"),
	// ... rest of fields
});
```

**Environment Variables**:
```env
# .env
MELHOR_ENVIO_API_KEY=your_api_key_here
COMPANY_ZIP_CODE=01310-100  # Your store's CEP
```

**Files to Create**:
- [ ] `src/lib/melhor-envio/client.ts`
- [ ] `src/app/api/(customer)/shipping/calculate/route.ts`
- [ ] Update `src/lib/db/schema.ts` (add Melhor Envio fields to orderDelivery)
- [ ] Update `src/app/(public)/(customer)/checkout/[orderId]/checkout-shipping-form.tsx`
- [ ] Add `MELHOR_ENVIO_API_KEY` to env.ts validation

**Testing**:
1. Create Melhor Envio sandbox account
2. Get test API token
3. Enter shipping address in checkout with valid CEP
4. Verify multiple carrier options display (Correios PAC, SEDEX, etc.)
5. Verify prices match Melhor Envio calculator
6. Test with different CEPs (urban, rural, etc.)
7. Test error handling (invalid CEP, API down)

**Production Setup**:
- [ ] Create production Melhor Envio account
- [ ] Verify company address in Melhor Envio dashboard
- [ ] Add production API key to Vercel environment variables
- [ ] Test with real orders
- [ ] Monitor API usage and costs

**Optional: Purchase Shipping Label via API** (Future enhancement)
```typescript
// After payment success, purchase shipping label
// This generates the tracking code automatically
export async function purchaseShippingLabel(melhorEnvioQuoteId: string) {
	// Add quote to cart
	await fetch(`${MELHOR_ENVIO_API}/me/cart`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${env.MELHOR_ENVIO_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			service: melhorEnvioQuoteId,
			// ... order details
		}),
	});

	// Purchase (checkout cart)
	// Returns tracking code
}
```

---

### 2.3 eNotas NF-e Integration ⏱️ 6-8 hours
**Status**: ❌ Not Started
**Complexity**: High
**Blocks**: Legal compliance (Nota Fiscal required in Brazil)

**Current**: No invoice generation

**Goal**: Automatic NF-e (Nota Fiscal Eletrônica) generation after payment

**Service**: **eNotas.com.br** ✅ Selected
- Website: https://enotas.com.br
- Pay-per-invoice model (R$0.25-0.40 per NF-e)
- No monthly fees (good for startup)
- Simple REST API
- Handles all tax calculations (ICMS, PIS, COFINS, etc.)
- Automatic SEFAZ submission
- Email delivery to customers

**Why eNotas over Tiny/Bling**:
- Pay-per-use (no monthly commitment)
- Focused product (only NF-e, not full ERP)
- Lower cost at low volumes
- Simpler API

**Setup**:
1. Create account at https://app.enotas.com.br
2. Configure company tax data (CNPJ, IE, regime tributário)
3. Get API credentials
4. Configure tax rules per product NCM code

**Implementation**:

#### Step 1: Add CPF/CNPJ to Customer Schema
```typescript
// src/lib/db/schema.ts

export const customer = pgTable("customer", {
	// ... existing fields
	cpfCnpj: text("cpfCnpj").notNull(), // Required for NF-e
	// ... rest of fields
});

export const orderNotaFiscal = pgTable("orderNotaFiscal", {
	id: text("id").primaryKey().$defaultFn(() => generatePrefixId("nfe")),
	orderId: text("orderId").notNull().references(() => order.id, { onDelete: "cascade" }),
	nfeNumber: text("nfeNumber"), // Número da NF-e
	nfeKey: text("nfeKey"), // Chave de acesso (44 digits)
	nfeSeries: text("nfeSeries"), // Série
	nfeXmlUrl: text("nfeXmlUrl"), // URL do XML
	nfePdfUrl: text("nfePdfUrl"), // URL do PDF
	nfeStatus: text("nfeStatus").notNull(), // "pending", "emitida", "cancelada", "erro"
	errorMessage: text("errorMessage"),
	enotasId: text("enotasId"), // ID no eNotas
	emittedAt: timestamp("emittedAt"),
	...timestamps,
});
```

#### Step 2: Create eNotas Client
```typescript
// src/lib/enotas/client.ts
import { env } from '@/lib/env';

const ENOTAS_API = 'https://api.enotasgw.com.br/v2';

export interface NotaFiscalParams {
	orderId: string;
	customer: {
		cpfCnpj: string;
		name: string;
		email: string;
		phone: string;
		address: {
			street: string;
			number: string;
			complement?: string;
			neighborhood: string;
			city: string;
			state: string;
			zipCode: string;
		};
	};
	items: Array<{
		productId: string;
		name: string;
		quantity: number;
		unitPriceInCents: number;
		ncmCode?: string; // Nomenclatura Comum do Mercosul
	}>;
	totalInCents: number;
}

export interface NotaFiscalResponse {
	id: string;
	numero: string;
	serie: string;
	chaveAcesso: string; // 44-digit key
	linkPdf: string;
	linkXml: string;
	status: 'Autorizada' | 'Rejeitada' | 'Cancelada';
	motivoRejeicao?: string;
}

export async function generateNotaFiscal(
	params: NotaFiscalParams
): Promise<NotaFiscalResponse> {
	const empresaId = env.ENOTAS_EMPRESA_ID; // Your company ID in eNotas

	const response = await fetch(
		`${ENOTAS_API}/empresas/${empresaId}/nfes`,
		{
			method: 'POST',
			headers: {
				'Authorization': `Basic ${Buffer.from(`${env.ENOTAS_API_KEY}:`).toString('base64')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tipo: 'NF-e', // Nota Fiscal Eletrônica
				idExterno: params.orderId, // Your order ID for reference
				ambienteEmissao: env.NODE_ENV === 'production' ? 'Producao' : 'Homologacao',
				cliente: {
					tipoPessoa: params.customer.cpfCnpj.length === 11 ? 'F' : 'J', // F=Física, J=Jurídica
					nome: params.customer.name,
					email: params.customer.email,
					cpfCnpj: params.customer.cpfCnpj.replace(/\D/g, ''), // Remove formatting
					telefone: params.customer.phone.replace(/\D/g, ''),
					endereco: {
						uf: params.customer.address.state,
						cidade: params.customer.address.city,
						logradouro: params.customer.address.street,
						numero: params.customer.address.number,
						complemento: params.customer.address.complement || '',
						bairro: params.customer.address.neighborhood,
						cep: params.customer.address.zipCode.replace(/\D/g, ''),
					},
				},
				produtos: params.items.map(item => ({
					codigo: item.productId,
					descricao: item.name,
					ncm: item.ncmCode || '9003.19.00', // Default NCM for eyeglass frames
					cfop: '5102', // Venda de mercadoria adquirida/recebida de terceiros
					unidadeMedida: 'UN',
					quantidade: item.quantity,
					valorUnitario: item.unitPriceInCents / 100, // Convert cents to reais
				})),
				valorTotal: params.totalInCents / 100,
				informacoesComplementares: `Pedido #${params.orderId}`,
			}),
		}
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`eNotas API error: ${JSON.stringify(error)}`);
	}

	const data: NotaFiscalResponse = await response.json();
	return data;
}

export async function cancelNotaFiscal(enotasId: string, motivo: string) {
	const empresaId = env.ENOTAS_EMPRESA_ID;

	const response = await fetch(
		`${ENOTAS_API}/empresas/${empresaId}/nfes/${enotasId}/cancelar`,
		{
			method: 'POST',
			headers: {
				'Authorization': `Basic ${Buffer.from(`${env.ENOTAS_API_KEY}:`).toString('base64')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ motivo }),
		}
	);

	if (!response.ok) {
		throw new Error('Failed to cancel NF-e');
	}

	return response.json();
}
```

#### Step 3: Generate NF-e After Payment Success
```typescript
// src/app/api/stripe/services/handle-payment-success.ts

import { generateNotaFiscal } from '@/lib/enotas/client';
import { orderNotaFiscal } from '@/lib/db/schema';

export async function handlePaymentSuccess(paymentIntentId: string) {
	// ... existing code (update order status, deduct stock, etc.)

	// Generate Nota Fiscal
	try {
		const nfe = await generateNotaFiscal({
			orderId: orderPaymentFound.orderId,
			customer: {
				cpfCnpj: orderPaymentFound.order.customer.cpfCnpj,
				name: orderPaymentFound.order.customer.user.name,
				email: orderPaymentFound.order.customer.user.email,
				phone: orderPaymentFound.order.customer.phoneNumber,
				address: {
					street: orderPaymentFound.order.orderDelivery.address.street,
					number: orderPaymentFound.order.orderDelivery.address.number,
					complement: orderPaymentFound.order.orderDelivery.address.complement,
					neighborhood: orderPaymentFound.order.orderDelivery.address.neighborhood,
					city: orderPaymentFound.order.orderDelivery.address.city,
					state: orderPaymentFound.order.orderDelivery.address.state,
					zipCode: orderPaymentFound.order.orderDelivery.address.zipCode,
				},
			},
			items: orderPaymentFound.order.cart.cartProducts
				.filter(item => !item.parentProductId) // Only main products, not lens options
				.map(item => ({
					productId: item.productId,
					name: item.product.name,
					quantity: item.quantity,
					unitPriceInCents: item.unitPriceInCents,
					ncmCode: item.product.ncmCode, // Add this field to product schema
				})),
			totalInCents: orderPaymentFound.totalInCents,
		});

		// Save NF-e to database
		await db.insert(orderNotaFiscal).values({
			orderId: orderPaymentFound.orderId,
			nfeNumber: nfe.numero,
			nfeKey: nfe.chaveAcesso,
			nfeSeries: nfe.serie,
			nfeXmlUrl: nfe.linkXml,
			nfePdfUrl: nfe.linkPdf,
			nfeStatus: nfe.status === 'Autorizada' ? 'emitida' : 'erro',
			enotasId: nfe.id,
			emittedAt: new Date(),
			errorMessage: nfe.motivoRejeicao,
		});

		// Send NF-e email to customer (eNotas does this automatically, but you can also)
		if (nfe.status === 'Autorizada') {
			await sendNFeEmail({
				to: orderPaymentFound.order.customer.user.email,
				customerName: orderPaymentFound.order.customer.user.name,
				orderNumber: orderPaymentFound.orderId,
				nfeNumber: nfe.numero,
				nfePdfUrl: nfe.linkPdf,
			});
		}

	} catch (error) {
		console.error('Failed to generate NF-e:', error);

		// Save error to database for admin review
		await db.insert(orderNotaFiscal).values({
			orderId: orderPaymentFound.orderId,
			nfeStatus: 'erro',
			errorMessage: error instanceof Error ? error.message : 'Unknown error',
		});

		// Don't block payment success if NF-e fails
		// Admin can regenerate manually later
	}

	// ... rest of the code (send payment confirmation email, etc.)
}
```

#### Step 4: Update Checkout to Collect CPF/CNPJ
```typescript
// src/app/(public)/(customer)/checkout/[orderId]/checkout-customer-form.tsx

import { formatCpfCnpj, validateCpfCnpj } from '@/lib/utils/cpf-cnpj';

const customerFormSchema = z.object({
	// ... existing fields
	cpfCnpj: z.string()
		.min(11, 'CPF/CNPJ é obrigatório')
		.refine(validateCpfCnpj, 'CPF/CNPJ inválido'),
	// ... rest of fields
});

// In the form JSX:
<FormField
	control={form.control}
	name="cpfCnpj"
	render={({ field }) => (
		<FormItem>
			<FormLabel>CPF ou CNPJ *</FormLabel>
			<FormControl>
				<Input
					placeholder="000.000.000-00 ou 00.000.000/0000-00"
					maxLength={18}
					{...field}
					onChange={(e) => {
						const formatted = formatCpfCnpj(e.target.value);
						field.onChange(formatted);
					}}
				/>
			</FormControl>
			<FormDescription>
				Necessário para emissão da Nota Fiscal
			</FormDescription>
			<FormMessage />
		</FormItem>
	)}
/>
```

#### Step 5: Create CPF/CNPJ Utility Functions
```typescript
// src/lib/utils/cpf-cnpj.ts

export function formatCpfCnpj(value: string): string {
	const numbers = value.replace(/\D/g, '');

	if (numbers.length <= 11) {
		// CPF: 000.000.000-00
		return numbers
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
	}

	// CNPJ: 00.000.000/0000-00
	return numbers
		.replace(/(\d{2})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1/$2')
		.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function validateCpfCnpj(value: string): boolean {
	const numbers = value.replace(/\D/g, '');

	if (numbers.length === 11) {
		return validateCpf(numbers);
	}

	if (numbers.length === 14) {
		return validateCnpj(numbers);
	}

	return false;
}

function validateCpf(cpf: string): boolean {
	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(cpf.charAt(i)) * (10 - i);
	}
	let digit = 11 - (sum % 11);
	if (digit >= 10) digit = 0;
	if (digit !== parseInt(cpf.charAt(9))) return false;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(cpf.charAt(i)) * (11 - i);
	}
	digit = 11 - (sum % 11);
	if (digit >= 10) digit = 0;
	if (digit !== parseInt(cpf.charAt(10))) return false;

	return true;
}

function validateCnpj(cnpj: string): boolean {
	if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

	let length = cnpj.length - 2;
	let numbers = cnpj.substring(0, length);
	const digits = cnpj.substring(length);
	let sum = 0;
	let pos = length - 7;

	for (let i = length; i >= 1; i--) {
		sum += parseInt(numbers.charAt(length - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	if (result !== parseInt(digits.charAt(0))) return false;

	length += 1;
	numbers = cnpj.substring(0, length);
	sum = 0;
	pos = length - 7;

	for (let i = length; i >= 1; i--) {
		sum += parseInt(numbers.charAt(length - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	if (result !== parseInt(digits.charAt(1))) return false;

	return true;
}
```

#### Step 6: Create NF-e Email Template
```tsx
// emails/nota-fiscal-emitted.tsx

import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Text,
} from '@react-email/components';

interface NotaFiscalEmailProps {
	customerName: string;
	orderNumber: string;
	nfeNumber: string;
	nfePdfUrl: string;
}

export default function NotaFiscalEmail({
	customerName,
	orderNumber,
	nfeNumber,
	nfePdfUrl,
}: NotaFiscalEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
				<Container style={{ margin: '0 auto', padding: '20px' }}>
					<Heading>Nota Fiscal Eletrônica Emitida 📄</Heading>
					<Text>Olá {customerName},</Text>
					<Text>
						A Nota Fiscal Eletrônica do seu pedido #{orderNumber} foi emitida com sucesso!
					</Text>
					<Section style={{ marginTop: '32px', marginBottom: '32px' }}>
						<Text><strong>Número da NF-e:</strong> {nfeNumber}</Text>
						<Button
							href={nfePdfUrl}
							style={{
								backgroundColor: '#000',
								color: '#fff',
								padding: '12px 24px',
								borderRadius: '4px',
								textDecoration: 'none',
								marginTop: '16px',
							}}
						>
							Baixar Nota Fiscal (PDF)
						</Button>
					</Section>
					<Text style={{ fontSize: '14px', color: '#666' }}>
						A Nota Fiscal também foi enviada automaticamente para a Secretaria da Fazenda (SEFAZ)
						e está disponível para consulta no portal nacional da NF-e.
					</Text>
					<Text style={{ fontSize: '14px', color: '#666' }}>
						Guarde este documento para possíveis trocas ou devoluções.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}
```

#### Step 7: Admin View for NF-e
```typescript
// src/app/(private)/admin/pedidos/orders-table.tsx

// Add column for NF-e status
{
	accessorKey: "notaFiscal",
	header: "NF-e",
	cell: ({ row }) => {
		const nfe = row.original.notaFiscal;
		if (!nfe) return <span className="text-muted-foreground">Pendente</span>;

		if (nfe.nfeStatus === 'emitida') {
			return (
				<a href={nfe.nfePdfUrl} target="_blank" rel="noopener" className="text-blue-600 hover:underline">
					{nfe.nfeNumber}
				</a>
			);
		}

		if (nfe.nfeStatus === 'erro') {
			return (
				<Tooltip>
					<TooltipTrigger>
						<span className="text-red-600">Erro</span>
					</TooltipTrigger>
					<TooltipContent>{nfe.errorMessage}</TooltipContent>
				</Tooltip>
			);
		}

		return <span>{nfe.nfeStatus}</span>;
	},
}
```

**Environment Variables**:
```env
# .env
ENOTAS_API_KEY=your_api_key_here
ENOTAS_EMPRESA_ID=your_empresa_id_here
```

**Files to Create**:
- [ ] `src/lib/enotas/client.ts`
- [ ] `src/lib/utils/cpf-cnpj.ts`
- [ ] `emails/nota-fiscal-emitted.tsx`
- [ ] Update `src/lib/db/schema.ts` (add `cpfCnpj`, `ncmCode`, `orderNotaFiscal` table)
- [ ] Update `src/app/(public)/(customer)/checkout/[orderId]/checkout-customer-form.tsx`
- [ ] Update `src/app/api/stripe/services/handle-payment-success.ts`
- [ ] Update `src/app/(private)/admin/pedidos/orders-table.tsx`
- [ ] Add eNotas env vars to env.ts validation

**Testing**:
1. Create eNotas sandbox account (homologação)
2. Configure test company data
3. Add test API credentials
4. Complete checkout with CPF/CNPJ
5. Verify NF-e generated in eNotas dashboard
6. Verify PDF emailed to customer
7. Test with both CPF and CNPJ
8. Test error handling (invalid CPF, API down)

**Production Setup**:
- [ ] Create production eNotas account
- [ ] Configure production company tax data (CNPJ, IE, regime tributário)
- [ ] Get production certificate (A1 or A3) from Receita Federal
- [ ] Upload certificate to eNotas
- [ ] Configure NCM codes for all products
- [ ] Add production API credentials to Vercel
- [ ] Test first NF-e manually before going live

**Important Tax Notes**:
- **NCM Code for Eyewear**: `9003.19.00` (other frames for spectacles)
- **CFOP**: `5102` for in-state sales, `6102` for out-of-state
- **ICMS**: Varies by state, eNotas calculates automatically
- **Regime Tributário**: Check with your accountant (Simples Nacional vs Lucro Presumido)

**Cost**:
- R$0.25-0.40 per NF-e emitted
- No monthly fees
- ~R$10-15 for first 50 orders/month

---

### 2.4 Admin Order Management ⏱️ 3-4 hours
**Status**: ❌ Not Started
**Complexity**: Medium
**Improves**: Operations

#### 2.3.1 Order Status Updates

**File**: `src/app/(private)/admin/pedidos/orders-table.tsx`

**Current**: Read-only mock data

**Add**:
- [ ] Status dropdown for each order
- [ ] API route to update order status
- [ ] Optimistic UI updates
- [ ] Send email on status change

```typescript
// src/app/api/(admin)/orders/[orderId]/status/route.ts
export async function PATCH(request: Request, { params }: { params: { orderId: string }}) {
  const { status } = await request.json(); // "processing" | "shipped" | "delivered"

  await db.update(order)
    .set({ orderStatus: status, updatedAt: new Date() })
    .where(eq(order.id, params.orderId));

  // Send email based on status
  if (status === 'shipped') {
    await sendOrderShippedEmail(orderId);
  }

  return Response.json({ success: true });
}
```

**Files to Change**:
- [ ] `src/app/(private)/admin/pedidos/orders-table.tsx`
- [ ] `src/app/api/(admin)/orders/[orderId]/status/route.ts` (create)
- [ ] `emails/order-shipped.tsx` (create template)

#### 2.3.2 Tracking Code Management

**Add field to update tracking code**:
```typescript
// In orders table, add "Add Tracking" button
// Opens dialog with input field
<Dialog>
  <DialogContent>
    <Input placeholder="AA123456789BR" />
    <Button>Save Tracking Code</Button>
  </DialogContent>
</Dialog>
```

**API**:
```typescript
// src/app/api/(admin)/orders/[orderId]/tracking/route.ts
export async function PATCH(request: Request, { params }: { params: { orderId: string }}) {
  const { trackingCode } = await request.json();

  const delivery = await db.query.orderDelivery.findFirst({
    where: eq(orderDelivery.orderId, params.orderId)
  });

  await db.update(orderDelivery)
    .set({
      trackingCode,
      orderDeliveryStatus: 'shipped',
      updatedAt: new Date()
    })
    .where(eq(orderDelivery.id, delivery.id));

  await sendOrderShippedEmail(params.orderId, trackingCode);

  return Response.json({ success: true });
}
```

**Files to Create**:
- [ ] `src/app/api/(admin)/orders/[orderId]/tracking/route.ts`
- [ ] Update `emails/order-shipped.tsx` to include tracking

**Testing**:
1. Open admin orders page
2. Update order status to "shipped"
3. Add tracking code
4. Verify email sent with tracking link

---

### 2.4 Email Notification Enhancements ⏱️ 2-3 hours
**Status**: ❌ Not Started
**Complexity**: Low
**Improves**: Customer communication

#### 2.4.1 Notifications Table

**File**: `src/lib/db/schema.ts`

```typescript
export const notificationStatus = pgEnum("notificationStatus", ["pending", "sent", "failed"]);

export const notification = pgTable("notification", {
  id: text("id").primaryKey().$defaultFn(() => generatePrefixId("notification")),
  type: text("type").notNull(), // "order_created", "payment_confirmed", "order_shipped", etc.
  recipientEmail: text("recipientEmail").notNull(),
  subject: text("subject").notNull(),
  status: notificationStatus("status").notNull().default("pending"),
  sentAt: timestamp("sentAt"),
  errorMessage: text("errorMessage"),
  orderId: text("orderId").references(() => order.id, { onDelete: "set null" }),
  customerId: text("customerId").references(() => customer.id, { onDelete: "set null" }),
  ...timestamps,
});
```

**Update email sending**:
```typescript
// src/lib/resend/client.ts
export async function sendEmail(params: {
  to: string;
  subject: string;
  react: ReactElement;
  type: string;
  orderId?: string;
  customerId?: string;
}) {
  // Create notification record
  const [notif] = await db.insert(notification)
    .values({
      type: params.type,
      recipientEmail: params.to,
      subject: params.subject,
      status: "pending",
      orderId: params.orderId,
      customerId: params.customerId,
    })
    .returning();

  try {
    const { data, error } = await resend.emails.send({
      from: "Dr. Vista <pedidos@drvista.com.br>",
      to: [params.to],
      subject: params.subject,
      react: params.react,
    });

    if (error) throw error;

    // Update as sent
    await db.update(notification)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(notification.id, notif.id));

    return { success: true, data };
  } catch (error) {
    // Update as failed
    await db.update(notification)
      .set({
        status: "failed",
        errorMessage: error.message
      })
      .where(eq(notification.id, notif.id));

    throw error;
  }
}
```

**Files to Change**:
- [ ] `src/lib/db/schema.ts` (add table)
- [ ] `src/lib/resend/client.ts` (wrap send function)
- [ ] Update all email sending calls to use new function

#### 2.4.2 Order Shipped Email Template

**Create**: `emails/order-shipped.tsx`

```tsx
export default function OrderShippedEmail({
  customerName,
  orderNumber,
  trackingCode,
  trackingUrl,
  estimatedDelivery,
}: OrderShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>Seu pedido foi enviado! 📦</Heading>
          <Text>Olá {customerName},</Text>
          <Text>
            Seu pedido #{orderNumber} foi enviado e está a caminho!
          </Text>
          <Section>
            <Row>
              <Column>
                <Text><strong>Código de rastreamento:</strong></Text>
                <Text>{trackingCode}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Button href={trackingUrl}>
                  Rastrear pedido
                </Button>
              </Column>
            </Row>
          </Section>
          <Text>
            Previsão de entrega: {estimatedDelivery}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

**Files to Create**:
- [ ] `emails/order-shipped.tsx`

---

### 2.5 Product Management (Admin) ⏱️ 4-6 hours
**Status**: ❌ Not Started
**Complexity**: High
**Improves**: Operations

**Current**: Products managed via seed script only

**Need**:
- [ ] Create product form (name, description, price, stock, images)
- [ ] Edit product form
- [ ] Delete product (soft delete - set status to "inactive")
- [ ] Image upload for products
- [ ] Product categories assignment

**Files to Create**:
- [ ] `src/app/(private)/admin/produtos/create/page.tsx`
- [ ] `src/app/(private)/admin/produtos/[productId]/edit/page.tsx`
- [ ] `src/app/api/(admin)/products/route.ts` (POST, GET)
- [ ] `src/app/api/(admin)/products/[productId]/route.ts` (PATCH, DELETE)
- [ ] `src/components/admin/product-form.tsx`

**Testing**:
1. Create new product via admin
2. Verify shows on storefront
3. Edit product details
4. Delete product (verify soft delete)

---

## 🌟 Priority 3: Nice-to-Have (Week 4+)

### 3.1 Performance Optimizations ⏱️ 2-4 hours
- [ ] Image optimization audit (verify all images use correct `sizes`)
- [ ] Code splitting for heavy components (Stripe, admin)
- [ ] Database query optimization (add indexes)
- [ ] Enable Next.js production optimizations
- [ ] Lighthouse audit and fixes

### 3.2 Signed-In User Experience ⏱️ 4-6 hours
- [ ] Pre-fill checkout with user data
- [ ] Order history page
- [ ] Saved addresses
- [ ] Order tracking page (customer-facing)

### 3.3 Brazilian Payment Methods ⏱️ 8-12 hours
**Status**: ❌ Not Started
**Complexity**: High
**Improves**: Conversion rate, customer choice

**Current**: Credit card only via Stripe

**Goal**: Support PIX, Boleto, and Debit Card (common Brazilian payment methods)

**Recommended Approach**: Integrate with Brazilian payment gateway

#### Option A: Stripe + PIX/Boleto Plugin
- Stripe supports PIX and boleto in Brazil
- Same codebase, just enable additional payment methods
- **Pros**: Unified dashboard, existing integration
- **Cons**: Higher fees, may not support all boleto variations

#### Option B: ASAAS Integration (Recommended for Brazil)
- Brazilian payment gateway with better local rates
- Supports: PIX, Boleto, Credit Card, Debit Card
- **Pros**: Lower fees, better boleto support, Brazilian company
- **Cons**: Dual payment provider complexity

**Implementation with Stripe PIX/Boleto**:
```typescript
// src/app/api/stripe/payment-intents/create/route.ts
const paymentIntent = await stripe.paymentIntents.create({
	amount: totalInCents,
	currency: "brl",
	payment_method_types: [
		"card",           // Credit/Debit cards
		"pix",            // PIX instant payment
		"boleto",         // Boleto bancário
	],
	metadata: {
		orderId: order.id,
	},
});
```

**Update Checkout UI**:
```tsx
// src/app/(public)/(customer)/checkout/[orderId]/checkout-payment-form.tsx
<Tabs defaultValue="card">
	<TabsList>
		<TabsTrigger value="card">Cartão de Crédito/Débito</TabsTrigger>
		<TabsTrigger value="pix">PIX</TabsTrigger>
		<TabsTrigger value="boleto">Boleto</TabsTrigger>
	</TabsList>

	<TabsContent value="card">
		{/* Existing card form */}
	</TabsContent>

	<TabsContent value="pix">
		<div className="space-y-4">
			<p>Você receberá um QR Code PIX após confirmar o pedido.</p>
			<p className="text-sm text-muted-foreground">
				Pagamento aprovado instantaneamente após confirmação.
			</p>
		</div>
	</TabsContent>

	<TabsContent value="boleto">
		<div className="space-y-4">
			<p>O boleto será enviado por email após a confirmação.</p>
			<p className="text-sm text-muted-foreground">
				Prazo de vencimento: 3 dias úteis
			</p>
		</div>
	</TabsContent>
</Tabs>
```

**Handle PIX/Boleto Success**:
```typescript
// PIX generates QR code, boleto generates PDF
// Both require polling or webhook to confirm payment

// After creating PaymentIntent:
if (paymentMethod === 'pix') {
	// Show QR code to customer
	const pixQrCode = paymentIntent.next_action?.pix_display_qr_code;
	// Customer scans and pays
	// Webhook confirms payment
}

if (paymentMethod === 'boleto') {
	// Email boleto PDF to customer
	const boletoUrl = paymentIntent.next_action?.boleto_display_details?.pdf;
	await sendBoletoEmail(customer.email, boletoUrl);
	// Customer pays at bank/lottery/app
	// Webhook confirms payment (can take days)
}
```

**Alternative: ASAAS Integration**:
```typescript
// src/lib/asaas/client.ts
import axios from 'axios';

export const asaas = axios.create({
	baseURL: 'https://www.asaas.com/api/v3',
	headers: {
		'access_token': process.env.ASAAS_API_KEY,
	},
});

// Create payment (supports PIX, boleto, credit card)
export async function createAsaasPayment({
	customerId,
	amount,
	paymentMethod,
}: {
	customerId: string;
	amount: number;
	paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
}) {
	const { data } = await asaas.post('/payments', {
		customer: customerId,
		billingType: paymentMethod,
		value: amount / 100, // ASAAS uses reais, not cents
		dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
	});

	return data;
}
```

**Implementation Steps**:
- [ ] Choose payment provider (Stripe vs ASAAS)
- [ ] Enable PIX/Boleto in Stripe dashboard OR create ASAAS account
- [ ] Update payment intent creation to support multiple methods
- [ ] Create payment method selector UI (tabs/radio buttons)
- [ ] Handle PIX QR code display
- [ ] Handle boleto PDF generation and email
- [ ] Update webhook handler for PIX/boleto payment confirmations
- [ ] Add payment method type to order records
- [ ] Test each payment method thoroughly

**Files to Change**:
- [ ] `src/app/api/stripe/payment-intents/create/route.ts`
- [ ] `src/app/(public)/(customer)/checkout/[orderId]/checkout-payment-form.tsx`
- [ ] `src/app/api/stripe/webhooks/route.ts` (handle new event types)
- [ ] `emails/boleto-generated.tsx` (create template)
- [ ] `emails/pix-payment-pending.tsx` (create template)

**Testing**:
- [ ] Test PIX payment with Stripe test mode
- [ ] Test boleto generation and email delivery
- [ ] Test debit card payment
- [ ] Verify webhook confirms payment for all methods
- [ ] Test payment expiry (boleto after 3 days, PIX after timeout)

**Notes**:
- PIX is instant but requires customer to scan QR code
- Boleto can take 1-3 business days to confirm
- Debit card works like credit card but with immediate debit
- Consider payment method fees when pricing products

### 3.4 Advanced Admin Features ⏱️ 8-12 hours
- [ ] Sales dashboard with charts
- [ ] Export orders to CSV
- [ ] Inventory alerts (low stock notifications)
- [ ] Slack webhook for new orders
- [ ] Customer notes/management

### 3.5 Enhanced Shopping Features ⏱️ 8-12 hours
- [ ] Product search
- [ ] Product filtering
- [ ] Product reviews
- [ ] Wishlist
- [ ] Product recommendations

### 3.6 Advanced SEO ⏱️ 4-6 hours
- [ ] Blog section for content marketing
- [ ] Breadcrumb navigation with schema
- [ ] Canonical URLs
- [ ] AMP pages

### 3.7 Marketing Features ⏱️ 6-8 hours
- [ ] Discount codes system
- [ ] Abandoned cart emails
- [ ] Welcome email sequence
- [ ] Promotional campaigns

---

## 📋 Testing Checklist

### Before Launch:
- [ ] Complete a full guest checkout (cart → payment → email received)
- [ ] Verify stock decreases after purchase
- [ ] Test with various Brazilian addresses
- [ ] Test checkout authorization (incognito mode)
- [ ] Verify all emails sent to correct recipients
- [ ] Test out-of-stock products can't be added
- [ ] Test prescription upload flow
- [ ] Admin can update order status
- [ ] Admin can add tracking codes
- [ ] Lighthouse score > 90 on homepage
- [ ] Mobile responsive on all pages
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Test Stripe webhooks (use Stripe CLI)

### Security Testing:
- [ ] Test checkout URL authorization
- [ ] Test API rate limiting
- [ ] Verify no sensitive data in client-side code
- [ ] Test CSRF protection on forms
- [ ] Verify environment variables not exposed

---

## 🚀 Deployment Checklist

### Environment Variables:
- [ ] `DATABASE_URL` (production database)
- [ ] `RESEND_API_KEY` (production key)
- [ ] `STRIPE_SECRET_KEY` (production key)
- [ ] `STRIPE_WEBHOOK_SECRET` (production webhook secret)
- [ ] `BETTER_AUTH_SECRET` (generate new for prod)
- [ ] `WEB_URL` (https://drvista.com.br)

### Pre-Deploy:
- [ ] Run `pnpm build` successfully
- [ ] Run `pnpm lint` with no errors
- [ ] Run TypeScript check with no errors
- [ ] Test production build locally
- [ ] Backup production database

### Post-Deploy:
- [ ] Configure Stripe webhook endpoint (production URL)
- [ ] Test checkout flow in production
- [ ] Monitor error logs (Sentry/LogRocket)
- [ ] Submit sitemap to Google Search Console
- [ ] Enable analytics (Google Analytics/Plausible)

---

## 📊 Time Estimates

| Priority | Total Time | Description |
|----------|-----------|-------------|
| **Priority 1** | 8-12 hours | Critical blockers |
| **Priority 2** | 20-30 hours | Important features |
| **Priority 3** | 40-60 hours | Nice-to-have |

**Minimum viable launch**: Priority 1 only (8-12 hours / 2-3 days)
**Recommended launch**: Priority 1 + 2 (28-42 hours / 1-2 weeks)
**Full-featured**: All priorities (68-102 hours / 3-4 weeks)

---

## 🎯 Sprint Planning

### Sprint 1 (Week 1): Security & Core
- Day 1: Email recipients + checkout auth (1.1, 1.2)
- Day 2-3: Stock management (1.3, 1.4)
- Day 4: Guest auth + SEO basics (1.5, 1.6)
- Day 5: Testing & bug fixes

### Sprint 2 (Week 2): Operations
- Day 1-2: Prescription upload (2.1)
- Day 3-4: Admin order management (2.3)
- Day 5: Email enhancements (2.4)

### Sprint 3 (Week 3): Enhancement
- Day 1-3: Shipping API integration (2.2)
- Day 4-5: Product management (2.5)

### Sprint 4 (Week 4): Polish & Launch
- Day 1-2: Performance optimization (3.1)
- Day 3: Testing
- Day 4: Bug fixes
- Day 5: **Launch** 🚀

---

**Need help prioritizing or estimating? Ask me about any specific feature!**
