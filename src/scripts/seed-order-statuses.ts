import { db } from "@/lib/db";
import { orderStatus } from "@/lib/db/schema";

async function seedOrderStatuses() {
	try {
		const defaultStatuses = [
			{
				id: "pending",
				name: "Pendente",
				slug: "pending",
				description: "Pedido recebido e aguardando processamento",
				color: "#6b7280", // gray
				icon: "Clock",
				isDefault: true,
				isActive: true,
				sortOrder: 1,
			},
			{
				id: "processing",
				name: "Em Processamento",
				slug: "processing",
				description: "Pedido sendo preparado",
				color: "#3b82f6", // blue
				icon: "Package",
				isDefault: false,
				isActive: true,
				sortOrder: 2,
			},
			{
				id: "completed",
				name: "Concluído",
				slug: "completed",
				description: "Pedido entregue com sucesso",
				color: "#10b981", // green
				icon: "CheckCircle",
				isDefault: false,
				isActive: true,
				sortOrder: 3,
			},
			{
				id: "cancelled",
				name: "Cancelado",
				slug: "cancelled",
				description: "Pedido cancelado",
				color: "#ef4444", // red
				icon: "XCircle",
				isDefault: false,
				isActive: true,
				sortOrder: 4,
			},
		];

		await db.insert(orderStatus).values(defaultStatuses).onConflictDoNothing();

		console.log("✅ Default order statuses seeded successfully");
	} catch (error) {
		console.error("❌ Error seeding order statuses:", error);
	}
}

// Run if called directly
if (require.main === module) {
	seedOrderStatuses().then(() => process.exit(0));
}

export { seedOrderStatuses };
