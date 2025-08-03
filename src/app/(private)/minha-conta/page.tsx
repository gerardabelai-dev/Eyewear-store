import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/auth-server";
import { ProfileDisplay } from "./profile-display";

export default async function Dashboard() {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("User not found");
	}

	return (
		<div className="mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			<PageHeader
				title="Minha conta"
				description="Gerencie suas informações de perfil e configurações"
			/>

			<div className="flex flex-col gap-6">
				{/* Main Content */}
				<div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
					{/* Profile Information Display */}
					<ProfileDisplay user={user} />
				</div>
			</div>
		</div>
	);
}
