import OrderUpdateEmail from "../src/components/emails/order-update-email";

export default function OrderUpdateEmailPreview() {
	return (
		<OrderUpdateEmail
			orderNumber="12345"
			customerName="Maria Santos"
			status="shipped"
			message="Seu pedido foi despachado e está a caminho!"
			trackingUrl="https://tracking.com/12345"
			unsubscribeUrl="http://localhost:3000/unsubscribe?token=sample-token"
		/>
	);
}
