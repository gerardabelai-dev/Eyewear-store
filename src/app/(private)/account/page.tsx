import { ProfileDisplay } from "./profile-display";

export default function Dashboard() {
	// Mock user data
	const userProfile = {
		name: "João Silva",
		email: "joao.silva@example.com",
		image: null,
	};

	return (
		<div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold">
					Configurações da Conta
				</h1>
			</div>

			<div className="flex flex-col gap-6">
				{/* Main Content */}
				<div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
					{/* Profile Information Display */}
					<ProfileDisplay name={userProfile.name} email={userProfile.email} />
				</div>
			</div>
		</div>
	);
}
