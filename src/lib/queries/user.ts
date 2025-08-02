import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function getUserProfileQuery() {
	const currentUser = await getCurrentUser();
	if (!currentUser) throw new Error("Usuário não autenticado");
	const userData = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			firstName: user.firstName,
			lastName: user.lastName,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})
		.from(user)
		.where(eq(user.id, currentUser.id))
		.limit(1);
	if (!userData.length) throw new Error("Perfil do usuário não encontrado");
	return userData[0];
}
