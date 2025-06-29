"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
	const [showSignUp, setShowSignUp] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="w-full max-w-md mx-auto p-4">
				{/* Toggle Buttons */}
				<div className="flex rounded-lg bg-muted p-1 mb-8">
					<Button
						variant={!showSignUp ? "default" : "ghost"}
						className="flex-1 text-sm"
						onClick={() => setShowSignUp(false)}
					>
						Entrar
					</Button>
					<Button
						variant={showSignUp ? "default" : "ghost"}
						className="flex-1 text-sm"
						onClick={() => setShowSignUp(true)}
					>
						Cadastrar
					</Button>
				</div>

				{/* Auth Components */}
				<div className="w-full">{showSignUp ? <SignUp /> : <SignIn />}</div>
			</div>

			{/* Toast notifications */}
			<Toaster
				richColors
				position="top-center"
				toastOptions={{
					duration: 4000,
				}}
			/>
		</div>
	);
}
