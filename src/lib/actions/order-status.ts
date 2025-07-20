"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { orderStatus } from "@/lib/db/schema";

// Validation schemas
const orderStatusSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, "Cor deve ser um código hexadecimal válido")
		.default("#6b7280"),
	icon: z
		.string()
		.max(50, "Ícone deve ter no máximo 50 caracteres")
		.default("Package"),
	isDefault: z.boolean().default(false),
	isActive: z.boolean().default(true),
	sortOrder: z.number().int().min(0).default(0),
});

type OrderStatusFormData = z.infer<typeof orderStatusSchema>;

// Get all active order statuses
export async function getOrderStatuses() {
	try {
		const statuses = await db
			.select()
			.from(orderStatus)
			.where(eq(orderStatus.isActive, true))
			.orderBy(orderStatus.sortOrder, orderStatus.name);

		return { data: statuses };
	} catch (error) {
		console.error("Erro ao buscar status de pedidos:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Get all order statuses (including inactive)
export async function getAllOrderStatuses() {
	try {
		const statuses = await db
			.select()
			.from(orderStatus)
			.orderBy(orderStatus.sortOrder, orderStatus.name);

		return { data: statuses };
	} catch (error) {
		console.error("Erro ao buscar todos os status de pedidos:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Get default order status
export async function getDefaultOrderStatus() {
	try {
		const defaultStatus = await db
			.select()
			.from(orderStatus)
			.where(eq(orderStatus.isDefault, true))
			.limit(1);

		return { data: defaultStatus[0] || null };
	} catch (error) {
		console.error("Erro ao buscar status padrão:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Create a new order status
export async function createOrderStatus(data: OrderStatusFormData) {
	try {
		const validatedData = orderStatusSchema.parse(data);

		// Generate slug from name
		const slug = validatedData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim();

		// If this is set as default, remove default from others
		if (validatedData.isDefault) {
			await db
				.update(orderStatus)
				.set({ isDefault: false })
				.where(eq(orderStatus.isDefault, true));
		}

		const newStatus = await db
			.insert(orderStatus)
			.values({
				id: crypto.randomUUID(),
				...validatedData,
				slug,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return { data: newStatus[0], success: "Status criado com sucesso!" };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao criar status:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Update an order status
export async function updateOrderStatus(
	data: OrderStatusFormData & { id: string },
) {
	try {
		const { id, ...updateData } = data;
		const validatedData = orderStatusSchema.parse(updateData);

		// Generate slug from name
		const slug = validatedData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim();

		// If this is set as default, remove default from others
		if (validatedData.isDefault) {
			await db
				.update(orderStatus)
				.set({ isDefault: false })
				.where(eq(orderStatus.isDefault, true));
		}

		const updatedStatus = await db
			.update(orderStatus)
			.set({
				...validatedData,
				slug,
			})
			.where(eq(orderStatus.id, id))
			.returning();

		if (updatedStatus.length === 0) {
			return { error: "Status não encontrado" };
		}

		return {
			data: updatedStatus[0],
			success: "Status atualizado com sucesso!",
		};
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao atualizar status:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Delete an order status (soft delete by setting isActive to false)
export async function deleteOrderStatus(id: string) {
	try {
		// Check if this is the default status
		const status = await db
			.select()
			.from(orderStatus)
			.where(eq(orderStatus.id, id))
			.limit(1);

		if (status.length === 0) {
			return { error: "Status não encontrado" };
		}

		if (status[0].isDefault) {
			return { error: "Não é possível excluir o status padrão" };
		}

		// Soft delete by setting isActive to false
		const deletedStatus = await db
			.update(orderStatus)
			.set({ isActive: false })
			.where(eq(orderStatus.id, id))
			.returning();

		if (deletedStatus.length === 0) {
			return { error: "Status não encontrado" };
		}

		return { success: "Status desativado com sucesso!" };
	} catch (error: unknown) {
		console.error("Erro ao desativar status:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Seed default order statuses
export async function seedOrderStatuses() {
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

		return { success: "Status padrão criados com sucesso" };
	} catch (error: unknown) {
		console.error("Erro ao criar status padrão:", error);
		return { error: "Erro interno do servidor" };
	}
}
