import OrderConfirmationEmail from "../src/components/emails/order-confirmation-email";

export default function OrderConfirmationEmailPreview() {
	return (
		<OrderConfirmationEmail
			orderNumber="12345"
			customerName="Maria Santos"
			total={299.99}
			items={[
				{ name: "Produto A", quantity: 2, price: 99.99 },
				{ name: "Produto B", quantity: 1, price: 100.01 },
			]}
			unsubscribeUrl="http://localhost:3000/unsubscribe?token=sample-token"
		/>
	);
}
