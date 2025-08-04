import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SignIn from "./sign-in-form";

export default function SignInPage() {
	return (
		<Suspense fallback={<Skeleton className="w-full max-w-md mx-auto h-96" />}>
			<SignIn />
		</Suspense>
	);
}
