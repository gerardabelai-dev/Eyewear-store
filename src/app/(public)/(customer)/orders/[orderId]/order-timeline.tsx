import { CheckIcon } from "lucide-react";
import {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
} from "@/components/ui/timeline";
import type { GetOrderResponse } from "@/http/types";

interface OrderTimelineProps {
	order: GetOrderResponse["order"];
}

export function OrderTimeline({ order }: OrderTimelineProps) {
	const orderStatus = order.orderStatus;
	const deliveryStatus = order.delivery?.orderDeliveryStatus;
	const paymentStatus = order.payment?.orderPaymentStatus;

	// Determine current step based on order and delivery status
	let currentStep = 1;

	// Step 1: Order confirmed (payment approved)
	if (paymentStatus === "paid" || orderStatus === "paid") {
		currentStep = 2;
	}

	// Step 2: In preparation (processing started)
	if (deliveryStatus === "processing") {
		currentStep = 2;
	}

	// Step 3: Shipped (package dispatched)
	if (deliveryStatus === "shipped") {
		currentStep = 3;
	}

	// Step 4: Delivered (package received)
	if (deliveryStatus === "delivered") {
		currentStep = 4;
	}

	// Handle cancelled/returned orders
	if (
		deliveryStatus === "cancelled" ||
		deliveryStatus === "returned" ||
		orderStatus === "cancelled"
	) {
		// Keep current step but mark as cancelled
	}

	const formatDate = (date: string | Date) => {
		const dateObj = typeof date === "string" ? new Date(date) : date;
		return dateObj.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
		});
	};

	// Helper function to get appropriate date for each step
	const getStepDate = (stepNumber: number) => {
		switch (stepNumber) {
			case 1:
				// Step 1: Order creation date
				return order.createdAt ? formatDate(order.createdAt) : "Pendente";
			case 2:
				// Step 2: Only show date if processing has actually started
				if (
					deliveryStatus === "processing" ||
					deliveryStatus === "shipped" ||
					deliveryStatus === "delivered"
				) {
					// Use delivery update date when processing started, or payment date if available
					if (order.delivery?.updatedAt) {
						return formatDate(order.delivery.updatedAt);
					}
					if (paymentStatus === "paid" && order.payment?.updatedAt) {
						return formatDate(order.payment.updatedAt);
					}
					return order.createdAt ? formatDate(order.createdAt) : "Pendente";
				}
				return "Pendente";
			case 3:
				// Step 3: Only show date when shipped
				if (deliveryStatus === "shipped" || deliveryStatus === "delivered") {
					return order.delivery?.updatedAt
						? formatDate(order.delivery.updatedAt)
						: "Enviado";
				}
				return "Pendente";
			case 4:
				// Step 4: Only show date when delivered
				if (deliveryStatus === "delivered") {
					return order.delivery?.updatedAt
						? formatDate(order.delivery.updatedAt)
						: "Entregue";
				}
				return "Previsão: Em breve";
			default:
				return "Pendente";
		}
	};

	// Check if order/delivery is cancelled
	const isCancelled =
		deliveryStatus === "cancelled" ||
		deliveryStatus === "returned" ||
		orderStatus === "cancelled";
	const isPaymentFailed = paymentStatus === "failed";

	const timelineSteps = [
		{
			step: 1,
			date: getStepDate(1),
			title: isPaymentFailed ? "Pagamento falhou" : "Pedido confirmado",
			content: isPaymentFailed
				? "Houve um problema com o pagamento. Entre em contato conosco para resolver."
				: "Pagamento aprovado e pedido confirmado com sucesso. Iniciamos o processo de preparação dos seus óculos.",
			completed: paymentStatus === "paid" || orderStatus === "paid",
			cancelled: isPaymentFailed,
		},
		{
			step: 2,
			date: getStepDate(2),
			title: isCancelled ? "Pedido cancelado" : "Em preparação",
			content: isCancelled
				? "Pedido foi cancelado. Se você não solicitou o cancelamento, entre em contato conosco."
				: "Seu pedido está sendo preparado em nosso laboratório. As lentes estão sendo cortadas e montadas na armação selecionada.",
			completed:
				!isCancelled &&
				(deliveryStatus === "processing" ||
					deliveryStatus === "shipped" ||
					deliveryStatus === "delivered"),
			cancelled: isCancelled,
		},
		{
			step: 3,
			date: getStepDate(3),
			title: deliveryStatus === "returned" ? "Devolvido" : "Enviado",
			content:
				deliveryStatus === "returned"
					? "Pedido foi devolvido. Entre em contato conosco para mais informações."
					: "Pedido despachado para entrega. Seu pacote foi entregue à transportadora e está a caminho do endereço de entrega.",
			completed:
				!isCancelled &&
				(deliveryStatus === "shipped" || deliveryStatus === "delivered"),
			cancelled: deliveryStatus === "returned",
		},
		{
			step: 4,
			date: getStepDate(4),
			title: "Entregue",
			content:
				deliveryStatus === "delivered"
					? "Pedido entregue com sucesso no endereço de destino."
					: "Aguardando entrega no endereço de destino. Você receberá uma notificação assim que o pedido for entregue.",
			completed: deliveryStatus === "delivered",
			cancelled: false,
		},
	];

	return (
		<div className="flex flex-col gap-2">
			<Timeline defaultValue={currentStep}>
				{timelineSteps.map((timelineStep) => (
					<TimelineItem
						key={timelineStep.step}
						step={timelineStep.step}
						className={timelineStep.cancelled ? "opacity-75" : ""}
					>
						<TimelineHeader>
							<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
							<TimelineDate
								className={`text-xs ${timelineStep.cancelled ? "text-destructive" : "text-muted-foreground"}`}
							>
								{timelineStep.date}
							</TimelineDate>
							<TimelineTitle
								className={`text-sm font-medium ${timelineStep.cancelled ? "text-destructive" : ""}`}
							>
								{timelineStep.title}
							</TimelineTitle>
							<TimelineIndicator
								className={`flex size-6 items-center justify-center group-data-[orientation=vertical]/timeline:-left-7 ${
									timelineStep.cancelled
										? "bg-destructive text-destructive-foreground border-none"
										: "group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground group-data-completed/timeline-item:border-none"
								}`}
							>
								{timelineStep.cancelled ? (
									<span className="text-xs font-bold">✕</span>
								) : (
									<CheckIcon
										className="group-not-data-completed/timeline-item:hidden"
										size={16}
									/>
								)}
							</TimelineIndicator>
						</TimelineHeader>
						<TimelineContent
							className={timelineStep.cancelled ? "text-muted-foreground" : ""}
						>
							{timelineStep.content}
						</TimelineContent>
					</TimelineItem>
				))}
			</Timeline>
		</div>
	);
}
