import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	BookOpenIcon,
	CreditCardIcon,
	DollarSignIcon,
	ImageIcon,
	LayersIcon,
	type LucideIcon,
	MapPinIcon,
	PackageIcon,
	ShoppingCartIcon,
	TagIcon,
	TruckIcon,
	UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Timeline,
	TimelineContent,
	TimelineItem,
} from "@/components/ui/timeline";
import {
	getContextualActionText,
	parseActivityType,
} from "@/constants/activities";
import { ROUTES } from "@/constants/routes";

// Mock data - demonstrating real data structure from seed
const mockActivities = [
	{
		id: "act_1",
		type: "customer.created",
		actorId: "cus_vhfb88",
		actorType: "customer",
		actorName: "Maria Santos",
		customerId: "cus_vhfb88",
		customerName: "Maria Santos",
		metadata: {
			content: {
				id: "cus_vhfb88",
				userId: "usr_3ydcuq",
				firstName: "Maria",
				lastName: "Santos",
				email: "mariasantos@example.com",
				createdAt: "2025-08-03T18:15:18.089Z",
				updatedAt: "2025-08-03T18:15:18.089Z",
			},
		},
		createdAt: new Date(Date.now() - 59000), // 59 seconds ago
	},
	{
		id: "act_2",
		type: "order.created",
		actorId: "cus_vhfb88",
		actorType: "customer",
		actorName: "Maria Santos",
		customerId: "cus_vhfb88",
		customerName: "Maria Santos",
		metadata: {
			content: {
				id: "ord_dsbs43",
				customerId: "cus_vhfb88",
				customerAddressId: "adr_4agu8y",
				totalPriceInCents: 40270,
				createdAt: "2025-08-03T18:15:18.447Z",
				updatedAt: "2025-08-03T18:15:18.447Z",
			},
		},
		createdAt: new Date(Date.now() - 120000), // 2 minutes ago
	},
	{
		id: "act_3",
		type: "orderPayment.created",
		actorId: "cus_vhfb88",
		actorType: "customer",
		actorName: "Maria Santos",
		customerId: "cus_vhfb88",
		customerName: "Maria Santos",
		metadata: {
			content: {
				id: "pay_abc123",
				orderId: "ord_dsbs43",
				customerId: "cus_vhfb88",
				amountInCents: 40270,
				status: "completed",
				paymentMethod: "credit_card",
				createdAt: "2025-08-03T18:15:18.500Z",
				updatedAt: "2025-08-03T18:15:18.500Z",
			},
		},
		createdAt: new Date(Date.now() - 180000), // 3 minutes ago
	},
	{
		id: "act_4",
		type: "order.created",
		actorId: "cus_2nf9xy",
		actorType: "customer",
		actorName: "Ana Paula",
		customerId: "cus_2nf9xy",
		customerName: "Ana Paula",
		metadata: {
			content: {
				id: "ord_xyz789",
				customerId: "cus_2nf9xy",
				customerAddressId: "adr_4agu8y",
				totalPriceInCents: 15990,
				createdAt: "2025-08-03T18:15:18.600Z",
				updatedAt: "2025-08-03T18:15:18.600Z",
			},
		},
		createdAt: new Date(Date.now() - 240000), // 4 minutes ago
	},
	{
		id: "act_5",
		type: "product.created",
		actorId: "system",
		actorType: "system",
		actorName: "Sistema",
		customerId: null,
		customerName: null,
		metadata: {
			content: {
				id: "pro_fq7of2",
				name: "Fresh Bamboo Fish",
				description: null,
				stock: 42,
				status: "active",
				createdAt: "2025-08-03T18:15:18.261Z",
				updatedAt: "2025-08-03T18:15:18.261Z",
			},
		},
		createdAt: new Date(Date.now() - 300000), // 5 minutes ago
	},
	{
		id: "act_7",
		type: "orderPayment.created",
		actorId: "cus_2nf9xy",
		actorType: "customer",
		actorName: "Ana Paula",
		customerId: "cus_2nf9xy",
		customerName: "Ana Paula",
		metadata: {
			content: {
				id: "pay_xyz456",
				orderId: "ord_xyz789",
				customerId: "cus_2nf9xy",
				amountInCents: 15990,
				status: "completed",
				paymentMethod: "pix",
				createdAt: "2025-08-03T18:15:18.750Z",
				updatedAt: "2025-08-03T18:15:18.750Z",
			},
		},
		createdAt: new Date(Date.now() - 420000), // 7 minutes ago
	},
	{
		id: "act_8",
		type: "category.created",
		actorId: "system",
		actorType: "system",
		actorName: "Sistema",
		customerId: null,
		customerName: null,
		metadata: {
			content: {
				id: "cat_c7iwtz",
				name: "Rubber",
				slug: null,
				description: null,
				createdAt: "2025-08-03T18:15:18.381Z",
				updatedAt: "2025-08-03T18:15:18.381Z",
			},
		},
		createdAt: new Date(Date.now() - 480000), // 8 minutes ago
	},
	{
		id: "act_9",
		type: "order.created",
		actorId: "cus_def789",
		actorType: "customer",
		actorName: "Carlos Eduardo",
		customerId: "cus_def789",
		customerName: "Carlos Eduardo",
		metadata: {
			content: {
				id: "ord_def456",
				customerId: "cus_def789",
				customerAddressId: "adr_def123",
				totalPriceInCents: 89900,
				createdAt: "2025-08-03T18:15:18.800Z",
				updatedAt: "2025-08-03T18:15:18.800Z",
			},
		},
		createdAt: new Date(Date.now() - 540000), // 9 minutes ago
	},
	{
		id: "act_10",
		type: "orderPayment.created",
		actorId: "cus_def789",
		actorType: "customer",
		actorName: "Carlos Eduardo",
		customerId: "cus_def789",
		customerName: "Carlos Eduardo",
		metadata: {
			content: {
				id: "pay_def123",
				orderId: "ord_def456",
				customerId: "cus_def789",
				amountInCents: 89900,
				status: "completed",
				paymentMethod: "debit_card",
				createdAt: "2025-08-03T18:15:18.850Z",
				updatedAt: "2025-08-03T18:15:18.850Z",
			},
		},
		createdAt: new Date(Date.now() - 600000), // 10 minutes ago
	},
	{
		id: "act_11",
		type: "customerAddress.created",
		actorId: "cus_2nf9xy",
		actorType: "customer",
		actorName: "Ana Paula",
		customerId: "cus_2nf9xy",
		customerName: "Ana Paula",
		metadata: {
			content: {
				id: "adr_4agu8y",
				customerId: "cus_2nf9xy",
				street: "123 Main Street",
				number: "456",
				complement: "Apt 7B",
				neighborhood: "Downtown",
				city: "São Paulo",
				state: "SP",
				zipCode: "01234-567",
				country: "Brazil",
				isDefault: true,
				createdAt: "2025-08-03T18:15:18.137Z",
				updatedAt: "2025-08-03T18:15:18.137Z",
			},
		},
		createdAt: new Date(Date.now() - 720000), // 12 minutes ago
	},
];

// Get icon based on entity type
function getEntityIcon(entity: string): LucideIcon {
	const icons: Record<string, LucideIcon> = {
		customer: UserIcon,
		order: ShoppingCartIcon,
		product: PackageIcon,
		category: TagIcon,
		orderDelivery: TruckIcon,
		orderPayment: CreditCardIcon,
		customerAddress: MapPinIcon,
		productImage: ImageIcon,
		productPrice: DollarSignIcon,
		categorySecondary: LayersIcon,
	};
	return icons[entity] || BookOpenIcon;
}

// Get entity link URL based on entity type and ID
function getEntityLinkUrl(entityType: string, entityId: string): string {
	const linkMap: Record<string, (id: string) => string> = {
		customer: (id) => `${ROUTES.ADMIN_CUSTOMERS}?customerId=${id}`,
		order: (id) => `${ROUTES.ADMIN_ORDERS}?orderId=${id}`,
		product: (id) => `${ROUTES.ADMIN_PRODUCTS}?productId=${id}`,
		category: (id) => `${ROUTES.ADMIN_CATEGORIES}?categoryId=${id}`,
		categorySecondary: (id) => `${ROUTES.ADMIN_CATEGORIES}?categoryId=${id}`,
		orderDelivery: (id) => `${ROUTES.ADMIN_ORDERS}?orderId=${id}`,
		orderPayment: (id) => `${ROUTES.ADMIN_ORDERS}?orderId=${id}`,
		customerAddress: (id) => `${ROUTES.ADMIN_CUSTOMERS}?customerId=${id}`,
		productImage: (id) => `${ROUTES.ADMIN_PRODUCTS}?productId=${id}`,
		productPrice: (id) => `${ROUTES.ADMIN_PRODUCTS}?productId=${id}`,
	};

	const linkGenerator = linkMap[entityType];
	return linkGenerator ? linkGenerator(entityId) : "#";
}

// Get activity text and related entity info
function getActivityInfo(
	type: string,
	_actorType: string,
	_actorId: string,
	metadata?: any,
	_customerName?: string | null,
	_customerId?: string | null,
): {
	text: string;
	relatedEntity?: {
		name: string;
		id: string;
		type: string;
		url: string;
	};
	customerInfo?: {
		name: string;
		id: string;
		url: string;
	};
} {
	const { entity, action } = parseActivityType(type);

	const text = getContextualActionText(entity, action);
	let relatedEntity: any;
	let customerInfo: any;

	// Add specific details from metadata
	if (metadata?.content) {
		const content = metadata.content;

		switch (entity) {
			case "customer":
				// For customer self-registration, show email as part of the action text
				if (content.email) {
					relatedEntity = {
						name: content.email,
						id: content.id,
						type: "customer",
						url: getEntityLinkUrl("customer", content.id),
					};
				}
				break;
			case "category":
				if (content.name) {
					relatedEntity = {
						name: `"${content.name}"`,
						id: content.id,
						type: "category",
						url: getEntityLinkUrl("category", content.id),
					};
				}
				break;
			case "product":
				if (content.name) {
					relatedEntity = {
						name: `"${content.name}"`,
						id: content.id,
						type: "product",
						url: getEntityLinkUrl("product", content.id),
					};
				}
				break;
			case "order":
				if (content.id) {
					relatedEntity = {
						name: `#${content.id}`,
						id: content.id,
						type: "order",
						url: getEntityLinkUrl("order", content.id),
					};
				}
				break;
			case "orderPayment":
				if (content.id && content.amountInCents) {
					const formattedAmount = new Intl.NumberFormat("pt-BR", {
						style: "currency",
						currency: "BRL",
					}).format(content.amountInCents / 100);

					relatedEntity = {
						name: formattedAmount,
						id: content.id,
						type: "orderPayment",
						url: getEntityLinkUrl(
							"orderPayment",
							content.orderId || content.id,
						),
					};
				}
				break;
			case "customerAddress":
				if (content.id && content.street && content.city && content.state) {
					const addressDisplay = `${content.street}${content.number ? `, ${content.number}` : ""} - ${content.city}, ${content.state}`;

					relatedEntity = {
						name: addressDisplay,
						id: content.id,
						type: "customerAddress",
						url: getEntityLinkUrl(
							"customerAddress",
							content.customerId || content.id,
						),
					};
				}
				break;
			case "orderDelivery":
				if (content.id) {
					relatedEntity = {
						name: `#${content.id}`,
						id: content.id,
						type: "orderDelivery",
						url: getEntityLinkUrl(
							"orderDelivery",
							content.orderId || content.id,
						),
					};
				}
				break;
			case "productImage":
				if (content.id && content.imageUrl) {
					const imageName = content.imageUrl.split("/").pop() || content.id;

					relatedEntity = {
						name: imageName,
						id: content.id,
						type: "productImage",
						url: getEntityLinkUrl(
							"productImage",
							content.productId || content.id,
						),
					};
				}
				break;
			case "productPrice":
				if (content.id && content.priceInCents) {
					const formattedPrice = new Intl.NumberFormat("pt-BR", {
						style: "currency",
						currency: "BRL",
					}).format(content.priceInCents / 100);

					relatedEntity = {
						name: formattedPrice,
						id: content.id,
						type: "productPrice",
						url: getEntityLinkUrl(
							"productPrice",
							content.productId || content.id,
						),
					};
				}
				break;
			case "categorySecondary":
				if (content.name) {
					relatedEntity = {
						name: `"${content.name}"`,
						id: content.id,
						type: "categorySecondary",
						url: getEntityLinkUrl(
							"categorySecondary",
							content.categoryId || content.id,
						),
					};
				}
				break;
			case "orderProduct":
				if (content.id && content.quantity) {
					relatedEntity = {
						name: `${content.quantity}x produto`,
						id: content.id,
						type: "orderProduct",
						url: getEntityLinkUrl(
							"orderProduct",
							content.orderId || content.id,
						),
					};
				}
				break;
		}
	}

	// Add customer context for certain entities (if no specific case handled them)
	// Note: Most entities now have specific cases above, this is mainly for fallback

	return { text, relatedEntity, customerInfo };
}

// Get color based on action
function getActivityColor(type: string): string {
	const { action } = parseActivityType(type);

	switch (action) {
		case "created":
			return "bg-vibrant";
		case "updated":
			return "bg-primary";
		case "deleted":
			return "bg-destructive";
		default:
			return "bg-muted";
	}
}

export function ActivitiesHistory() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BookOpenIcon className="h-5 w-5" />
					Atividades recentes
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Timeline>
					{mockActivities.map((activity) => {
						const { entity } = parseActivityType(activity.type);
						const ActivityIcon = getEntityIcon(entity);
						const activityColor = getActivityColor(activity.type);

						return (
							<TimelineItem
								key={activity.id}
								className="m-0! flex-row items-center gap-3 py-2.5!"
							>
								<div
									className={`flex h-8 w-8 items-center justify-center rounded-full ${activityColor}`}
								>
									<ActivityIcon className="h-4 w-4 text-white" />
								</div>

								<TimelineContent className="flex flex-1 items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="flex flex-col">
											<div className="flex items-center gap-2 flex-wrap">
												{(() => {
													const activityInfo = getActivityInfo(
														activity.type,
														activity.actorType,
														activity.actorId,
														activity.metadata,
														activity.customerName,
														activity.customerId,
													);

													const actorUrl = getEntityLinkUrl(
														activity.actorType,
														activity.actorId,
													);

													return (
														<>
															<a
																href={actorUrl}
																className="font-medium text-sm text-primary hover:underline"
															>
																{activity.actorName || "Sistema"}
															</a>
															<span className="text-sm text-muted-foreground">
																{activityInfo.text}
															</span>
															{activityInfo.relatedEntity && (
																<a
																	href={activityInfo.relatedEntity.url}
																	className="font-medium text-sm text-primary hover:underline"
																>
																	{activityInfo.relatedEntity.name}
																</a>
															)}
															{activityInfo.customerInfo && (
																<a
																	href={activityInfo.customerInfo.url}
																	className="font-medium text-sm text-primary hover:underline"
																>
																	{activityInfo.customerInfo.name}
																</a>
															)}
														</>
													);
												})()}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{formatDistanceToNow(activity.createdAt, {
												addSuffix: true,
												locale: ptBR,
											})}
										</Badge>
									</div>
								</TimelineContent>
							</TimelineItem>
						);
					})}
				</Timeline>

				{mockActivities.length === 0 && (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-muted-foreground">
							Nenhuma atividade encontrada
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
