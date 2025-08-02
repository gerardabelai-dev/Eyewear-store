import { ProfileDisplay } from "@/components/forms/profile-display";

export default function Dashboard() {
	// Mock user data
	const userProfile = {
		name: "João Silva",
		email: "joao.silva@example.com",
		image: null,
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const _userInitials = getInitials(userProfile.name || "User");

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
					<ProfileDisplay
						firstName={userProfile.name.split(" ")[0]}
						lastName={userProfile.name.split(" ").slice(1).join(" ")}
						email={userProfile.email}
					/>

					{/* Personal Information Form */}
					{/* <PersonalInfoForm
						firstName={userProfile.firstName}
						lastName={userProfile.lastName}
					/> */}

					{/* Email Form */}
					{/* <EmailForm email={userProfile.email} /> */}

					{/* Password Form */}
					{/* <PasswordForm hasPassword={userProfile.hasPassword} /> */}
				</div>
			</div>
		</div>
	);
}
