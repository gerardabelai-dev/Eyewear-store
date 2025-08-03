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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Timeline,
	TimelineContent,
	TimelineItem,
} from "@/components/ui/timeline";
import { ROUTES } from "@/constants/routes";

// Mock data - replace with real database queries
const mockActivities = [
	{
		id: "act_1",
		type: "customer.created",
		actorId: "user_123",
		actorType: "user",
		actorName: "João Silva",
		actorImage: "/avatar-40-02.jpg",
		customerId: "customer_456",
		customerName: "Maria Santos",
		metadata: {
			content: {
				id: "customer_456",
				firstName: "Maria",
				lastName: "Santos",
			},
		},
		createdAt: new Date(Date.now() - 59000), // 59 seconds ago
	},
	{
		id: "act_2",
		type: "order.created",
		actorId: "user_123",
		actorType: "user",
		actorName: "João Silva",
		actorImage: "/avatar-40-02.jpg",
		customerId: "customer_789",
		customerName: "Pedro Costa",
		metadata: {
			content: {
				id: "order_123",
				totalPriceInCents: 15000,
			},
		},
		createdAt: new Date(Date.now() - 180000), // 3 minutes ago
	},
	{
		id: "act_3",
		type: "product.created",
		actorId: "user_123",
		actorType: "user",
		actorName: "João Silva",
		actorImage: "/avatar-40-02.jpg",
		customerId: null,
		customerName: null,
		metadata: {
			content: {
				id: "product_456",
				name: "Tênis Nike Air Max",
			},
		},
		createdAt: new Date(Date.now() - 300000), // 5 minutes ago
	},
	{
		id: "act_4",
		type: "category.created",
		actorId: "user_123",
		actorType: "user",
		actorName: "João Silva",
		actorImage: "/avatar-40-02.jpg",
		customerId: null,
		customerName: null,
		metadata: {
			content: {
				id: "category_789",
				name: "Sapatos Masculinos",
			},
		},
		createdAt: new Date(Date.now() - 600000), // 10 minutes ago
	},
];

// Parse entity and action from activity type
function parseActivityType(type: string): { entity: string; action: string } {
	const [entity, action] = type.split(".");
	return { entity: entity || "unknown", action: action || "unknown" };
}

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
		user: (id) => `${ROUTES.ADMIN_CUSTOMERS}?userId=${id}`, // Users don't have dedicated page, redirect to customers
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
	customerName?: string | null,
	customerId?: string | null,
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

	// Map entity names to Portuguese
	const entityNames: Record<string, string> = {
		customer: "cliente",
		order: "pedido",
		product: "produto",
		category: "categoria",
		orderDelivery: "entrega",
		orderPayment: "pagamento",
		customerAddress: "endereço",
		productImage: "imagem de produto",
		productPrice: "preço",
		categorySecondary: "subcategoria",
	};

	// Map actions to Portuguese
	const actionTexts: Record<string, string> = {
		created: "criou",
		updated: "atualizou",
		deleted: "removeu",
	};

	const entityName = entityNames[entity] || entity;
	const actionText = actionTexts[action] || action;

	let text = `${actionText} ${entityName === "cliente" ? "um novo" : "uma nova"} ${entityName}`;
	let relatedEntity: any;
	let customerInfo: any;

	// Add specific details from metadata
	if (metadata?.content) {
		const content = metadata.content;

		switch (entity) {
			case "customer":
				if (content.firstName && content.lastName) {
					text = `${actionText} o cliente`;
					relatedEntity = {
						name: `${content.firstName} ${content.lastName}`,
						id: content.id,
						type: "customer",
						url: getEntityLinkUrl("customer", content.id),
					};
				}
				break;
			case "category":
				if (content.name) {
					text = `${actionText} a categoria`;
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
					text = `${actionText} o produto`;
					relatedEntity = {
						name: `"${content.name}"`,
						id: content.id,
						type: "product",
						url: getEntityLinkUrl("product", content.id),
					};
				}
				break;
			case "order":
				if (customerName && customerId) {
					text = `${actionText} um pedido para`;
					customerInfo = {
						name: customerName,
						id: customerId,
						url: getEntityLinkUrl("customer", customerId),
					};
				}
				break;
		}
	}

	// Add customer context for certain entities
	if (
		customerName &&
		customerId &&
		["orderDelivery", "orderPayment", "customerAddress"].includes(entity) &&
		!customerInfo
	) {
		text += " para";
		customerInfo = {
			name: customerName,
			id: customerId,
			url: getEntityLinkUrl("customer", customerId),
		};
	}

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
					Atividades Recentes
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
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={activity.actorImage}
												alt={activity.actorName}
											/>
											<AvatarFallback className="text-xs">
												{activity.actorName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>

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
																{activity.actorName}
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
