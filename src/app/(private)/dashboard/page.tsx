import { Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { AvatarForm } from "@/components/forms/avatar-form";
import { EmailForm } from "@/components/forms/email-form";
import { PasswordForm } from "@/components/forms/password-form";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { ProfileDisplay } from "@/components/forms/profile-display";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/actions/user";
import { getSession } from "@/lib/auth-server";

export default async function Dashboard() {
	const session = await getSession();

	if (!session) {
		redirect("/auth");
	}

	// Load user profile
	const result = await getUserProfile();

	if (result.error || !result.data) {
		redirect("/auth");
	}

	const userProfile = result.data;

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(
		`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
			"User",
	);

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
					{/* Avatar Section */}
					<AvatarForm
						userImage={userProfile.image}
						userInitials={userInitials}
					/>

					{/* Profile Information Display */}
					<ProfileDisplay
						firstName={userProfile.firstName}
						lastName={userProfile.lastName}
						email={userProfile.email}
					/>

					{/* Personal Information Form */}
					<PersonalInfoForm
						firstName={userProfile.firstName}
						lastName={userProfile.lastName}
					/>

					{/* Email Form */}
					<EmailForm email={userProfile.email} />

					{/* Password Form */}
					<PasswordForm hasPassword={userProfile.hasPassword} />
				</div>
			</div>
		</div>
	);
}
