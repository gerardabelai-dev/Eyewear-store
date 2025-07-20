"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppLogo } from "@/components/shared/brand";
import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";
import { Button } from "@/components/ui/button";

function AuthPageContent() {
	const [showSignUp, setShowSignUp] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="w-full max-w-md mx-auto p-4">
				{/* Logo */}
				<div className="flex justify-center mb-8">
					<Link href="/" className="hover:opacity-80 transition-opacity">
						<AppLogo size="lg" showText={true} />
					</Link>
				</div>

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
		</div>
	);
}

export default function AuthPage() {
	return <AuthPageContent />;
}
