import { CheckIcon } from "lucide-react";
import { useMemo } from "react";
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
import { formatDateShort } from "@/lib/format-date";

interface OrderTimelineProps {
	order: GetOrderResponse["order"];
}

export function OrderTimeline({ order }: OrderTimelineProps) {
	const orderStatus = order.orderStatus;
	const deliveryStatus = order.delivery?.orderDeliveryStatus;
	const paymentStatus = order.payment?.orderPaymentStatus;

	// Check if order requires prescription upload
	const prescriptionInfo = useMemo(() => {
		if (!order.cart?.cartProducts) {
			return { requiresPrescription: false, allUploaded: false };
		}

		// Get all parent products (glasses)
		const parentProducts = order.cart.cartProducts.filter(
			(cp) => !cp.parentProductId,
		);

		// Filter parent products that have child lens options requiring prescription
		const productsRequiringPrescription = parentProducts.filter(
			(parentProduct) => {
				const childLensOptions = order.cart?.cartProducts.filter(
					(cp) =>
						cp.parentProductId === parentProduct.productId &&
						cp.product.requiresPrescription,
				);
				return (childLensOptions?.length || 0) > 0;
			},
		);

		if (productsRequiringPrescription.length === 0) {
			return { requiresPrescription: false, allUploaded: false };
		}

		// Check if all prescriptions are uploaded
		const allUploaded = productsRequiringPrescription.every(
			(cp) => cp.prescriptionStatus === "uploaded",
		);

		// Get the latest prescription upload date
		const uploadDates = productsRequiringPrescription.flatMap((cp) =>
			cp.prescriptionUploadedAt ? [new Date(cp.prescriptionUploadedAt)] : [],
		);

		const latestUploadDate =
			uploadDates.length > 0
				? new Date(Math.max(...uploadDates.map((d) => d.getTime())))
				: null;

		return {
			requiresPrescription: true,
			allUploaded,
			uploadDate: latestUploadDate,
		};
	}, [order.cart?.cartProducts]);

	// Determine current step based on order and delivery status
	// Account for prescription step if required
	const stepOffset = prescriptionInfo.requiresPrescription ? 1 : 0;
	let currentStep = 1;

	// Step 1: Order confirmed (payment approved)
	if (paymentStatus === "paid" || orderStatus === "paid") {
		currentStep = 2;
	}

	// Step 2 (or 3 if prescription): Prescription uploaded
	if (prescriptionInfo.requiresPrescription && prescriptionInfo.allUploaded) {
		currentStep = 3;
	}

	// Step 3 (or 4 if prescription): In preparation (processing started)
	if (deliveryStatus === "processing") {
		currentStep = 3 + stepOffset;
	}

	// Step 4 (or 5 if prescription): Shipped (package dispatched)
	if (deliveryStatus === "shipped") {
		currentStep = 4 + stepOffset;
	}

	// Step 5 (or 6 if prescription): Delivered (package received)
	if (deliveryStatus === "delivered") {
		currentStep = 5 + stepOffset;
	}

	// Handle cancelled/returned orders
	if (
		deliveryStatus === "cancelled" ||
		deliveryStatus === "returned" ||
		orderStatus === "cancelled"
	) {
		// Keep current step but mark as cancelled
	}

	// Helper function to get appropriate date for each step
	const getStepDate = (stepNumber: number) => {
		// Step 1: Order creation date
		if (stepNumber === 1) {
			return order.createdAt ? formatDateShort(order.createdAt) : "Pendente";
		}

		// Step 2: Prescription upload (only if prescription required)
		if (prescriptionInfo.requiresPrescription && stepNumber === 2) {
			if (prescriptionInfo.allUploaded && prescriptionInfo.uploadDate) {
				return formatDateShort(prescriptionInfo.uploadDate);
			}
			return "Pendente";
		}

		// Step 2 or 3: In preparation
		const preparationStep = prescriptionInfo.requiresPrescription ? 3 : 2;
		if (stepNumber === preparationStep) {
			if (
				deliveryStatus === "processing" ||
				deliveryStatus === "shipped" ||
				deliveryStatus === "delivered"
			) {
				if (order.delivery?.updatedAt) {
					return formatDateShort(order.delivery.updatedAt);
				}
				if (paymentStatus === "paid" && order.payment?.updatedAt) {
					return formatDateShort(order.payment.updatedAt);
				}
				return order.createdAt ? formatDateShort(order.createdAt) : "Pendente";
			}
			return "Pendente";
		}

		// Step 3 or 4: Shipped
		const shippedStep = prescriptionInfo.requiresPrescription ? 4 : 3;
		if (stepNumber === shippedStep) {
			if (deliveryStatus === "shipped" || deliveryStatus === "delivered") {
				return order.delivery?.updatedAt
					? formatDateShort(order.delivery.updatedAt)
					: "Enviado";
			}
			return "Pendente";
		}

		// Step 4 or 5: Delivered
		const deliveredStep = prescriptionInfo.requiresPrescription ? 5 : 4;
		if (stepNumber === deliveredStep) {
			if (deliveryStatus === "delivered") {
				return order.delivery?.updatedAt
					? formatDateShort(order.delivery.updatedAt)
					: "Entregue";
			}
			return "Previsão: Em breve";
		}

		return "Pendente";
	};

	// Check if order/delivery is cancelled
	const isCancelled =
		deliveryStatus === "cancelled" ||
		deliveryStatus === "returned" ||
		orderStatus === "cancelled";
	const isPaymentFailed = paymentStatus === "failed";

	// Build timeline steps dynamically based on prescription requirement
	const timelineSteps = [];

	// Step 1: Order confirmed
	timelineSteps.push({
		step: 1,
		date: getStepDate(1),
		title: isPaymentFailed ? "Pagamento falhou" : "Pedido confirmado",
		content: isPaymentFailed
			? "Houve um problema com o pagamento. Entre em contato conosco para resolver."
			: "Pagamento aprovado e pedido confirmado com sucesso. Iniciamos o processo de preparação dos seus óculos.",
		completed: paymentStatus === "paid" || orderStatus === "paid",
		cancelled: isPaymentFailed,
	});

	// Step 2: Prescription upload (conditional)
	if (prescriptionInfo.requiresPrescription) {
		timelineSteps.push({
			step: 2,
			date: getStepDate(2),
			title: "Envio de receita médica",
			content: prescriptionInfo.allUploaded
				? "Receita médica recebida com sucesso. Seu pedido será encaminhado para preparação."
				: "Aguardando envio da receita médica. Por favor, faça o upload da sua receita para darmos continuidade ao pedido.",
			completed: prescriptionInfo.allUploaded,
			cancelled: false,
		});
	}

	// Step 3/4: In preparation
	timelineSteps.push({
		step: prescriptionInfo.requiresPrescription ? 3 : 2,
		date: getStepDate(prescriptionInfo.requiresPrescription ? 3 : 2),
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
	});

	// Step 4/5: Shipped
	timelineSteps.push({
		step: prescriptionInfo.requiresPrescription ? 4 : 3,
		date: getStepDate(prescriptionInfo.requiresPrescription ? 4 : 3),
		title: deliveryStatus === "returned" ? "Devolvido" : "Enviado",
		content:
			deliveryStatus === "returned"
				? "Pedido foi devolvido. Entre em contato conosco para mais informações."
				: "Pedido despachado para entrega. Seu pacote foi entregue à transportadora e está a caminho do endereço de entrega.",
		completed:
			!isCancelled &&
			(deliveryStatus === "shipped" || deliveryStatus === "delivered"),
		cancelled: deliveryStatus === "returned",
	});

	// Step 5/6: Delivered
	timelineSteps.push({
		step: prescriptionInfo.requiresPrescription ? 5 : 4,
		date: getStepDate(prescriptionInfo.requiresPrescription ? 5 : 4),
		title: "Entregue",
		content:
			deliveryStatus === "delivered"
				? "Pedido entregue com sucesso no endereço de destino."
				: "Aguardando entrega no endereço de destino. Você receberá uma notificação assim que o pedido for entregue.",
		completed: deliveryStatus === "delivered",
		cancelled: false,
	});

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
