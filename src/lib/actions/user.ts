"use server";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { account, user } from "@/lib/db/schema";

// Schemas for validation
const updateProfileSchema = z.object({
	firstName: z.string().min(1).max(50).optional(),
	lastName: z.string().min(1).max(50).optional(),
});

const updateEmailSchema = z.object({
	email: z.string().email(),
});

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Senha atual é obrigatória"),
		newPassword: z
			.string()
			.min(8, "Nova senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Senhas não coincidem",
		path: ["confirmPassword"],
	});

const _setPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Nova senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Senhas não coincidem",
		path: ["confirmPassword"],
	});

const updateAvatarSchema = z.object({
	image: z.string(),
});

// Get current user profile data
export async function getUserProfile() {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const userData = await db
			.select({
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.image,
				emailVerified: user.emailVerified,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			})
			.from(user)
			.where(eq(user.id, currentUser.id))
			.limit(1);

		if (!userData.length) {
			return { error: "Usuário não encontrado" };
		}

		// Check if user has a password set (for OAuth users)
		const userAccount = await db
			.select({ password: account.password })
			.from(account)
			.where(eq(account.userId, currentUser.id))
			.limit(1);

		const hasPassword =
			userAccount.length > 0 && userAccount[0].password !== null;

		return {
			data: {
				...userData[0],
				hasPassword,
			},
		};
	} catch (error) {
		console.error("Erro ao buscar perfil do usuário:", error);
		return { error: "Erro interno do servidor" };
	}
}

// Update user profile
export async function updateUserProfile(
	data: z.infer<typeof updateProfileSchema>,
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateProfileSchema.parse(data);

		const updatedUser = await db
			.update(user)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(user.id, currentUser.id))
			.returning({
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.image,
			});

		revalidatePath("/account");
		return { data: updatedUser[0], success: "Perfil atualizado com sucesso" };
	} catch (error) {
		console.error("Erro ao atualizar perfil:", error);
		if (error instanceof z.ZodError) {
			return { error: "Dados inválidos fornecidos" };
		}
		return { error: "Erro interno do servidor" };
	}
}

// Update user email
export async function updateUserEmail(data: z.infer<typeof updateEmailSchema>) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateEmailSchema.parse(data);

		// Check if email is already taken
		const existingUser = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, validatedData.email))
			.limit(1);

		if (existingUser.length > 0 && existingUser[0].id !== currentUser.id) {
			return { error: "Email já está em uso" };
		}

		await db
			.update(user)
			.set({
				email: validatedData.email,
				emailVerified: false, // Reset verification when email changes
				updatedAt: new Date(),
			})
			.where(eq(user.id, currentUser.id));

		revalidatePath("/account");
		return {
			success: "Email atualizado com sucesso. Verifique seu novo email.",
		};
	} catch (error) {
		console.error("Erro ao atualizar email:", error);
		if (error instanceof z.ZodError) {
			return { error: "Email inválido" };
		}
		return { error: "Erro interno do servidor" };
	}
}

// Change user password using better-auth
export async function changeUserPassword(
	data: z.infer<typeof changePasswordSchema>,
) {
	try {
		const validatedData = changePasswordSchema.parse(data);

		// Use better-auth's built-in changePassword method
		const result = await auth.api.changePassword({
			body: {
				currentPassword: validatedData.currentPassword,
				newPassword: validatedData.newPassword,
			},
		});

		if (!result) {
			return { error: "Erro ao alterar senha" };
		}

		return { success: "Senha alterada com sucesso" };
	} catch (error) {
		console.error("Erro ao alterar senha:", error);
		if (error instanceof z.ZodError) {
			const errorMessage =
				error.issues[0]?.message || "Dados inválidos fornecidos";
			return { error: errorMessage };
		}
		return { error: "Senha atual incorreta ou erro interno do servidor" };
	}
}

// Update user avatar
export async function updateUserAvatar(
	data: z.infer<typeof updateAvatarSchema>,
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const validatedData = updateAvatarSchema.parse(data);

		const updatedUser = await db
			.update(user)
			.set({
				image: validatedData.image,
				updatedAt: new Date(),
			})
			.where(eq(user.id, currentUser.id))
			.returning({
				id: user.id,
				image: user.image,
			});

		revalidatePath("/account");
		return { data: updatedUser[0], success: "Avatar atualizado com sucesso" };
	} catch (error) {
		console.error("Erro ao atualizar avatar:", error);
		if (error instanceof z.ZodError) {
			return { error: "Dados inválidos fornecidos" };
		}
		return { error: "Erro interno do servidor" };
	}
}

// Set password for OAuth users
export async function setUserPassword(formData: FormData) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return { error: "Usuário não autenticado" };
		}

		const data = {
			newPassword: formData.get("newPassword") as string,
			confirmPassword: formData.get("confirmPassword") as string,
		};

		const validatedData = _setPasswordSchema.parse(data);

		// Check if user already has a password
		const existingAccount = await db
			.select({ password: account.password })
			.from(account)
			.where(eq(account.userId, currentUser.id))
			.limit(1);

		if (existingAccount.length > 0 && existingAccount[0].password !== null) {
			return { error: "Usuário já possui uma senha definida" };
		}

		// Hash the new password using bcrypt
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(
			validatedData.newPassword,
			saltRounds,
		);

		// Update or create account record with password
		if (existingAccount.length > 0) {
			await db
				.update(account)
				.set({
					password: hashedPassword,
					updatedAt: new Date(),
				})
				.where(eq(account.userId, currentUser.id));
		} else {
			// Create new account record for password auth
			await db.insert(account).values({
				id: crypto.randomUUID(),
				accountId: currentUser.id,
				providerId: "credential",
				userId: currentUser.id,
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		revalidatePath("/account");
		return { success: "Senha definida com sucesso!" };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Erro ao definir senha:", error);
		return { error: "Erro interno do servidor" };
	}
}
