import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";
import { ResetPasswordSkeleton } from "./reset-password-skeleton";

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<ResetPasswordSkeleton />}>
			<ResetPasswordForm />
		</Suspense>
	);
}
