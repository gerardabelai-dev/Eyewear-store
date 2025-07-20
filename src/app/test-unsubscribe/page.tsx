"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TestUnsubscribePage() {
	const [userId, setUserId] = useState("test-user-123");
	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");
	const [unsubscribeUrl, setUnsubscribeUrl] = useState("");

	const generateToken = () => {
		const tokenData = {
			userId,
			notificationId: `test-notification-${Date.now()}`,
			email,
			iat: Date.now(),
		};

		const generatedToken = Buffer.from(JSON.stringify(tokenData)).toString(
			"base64url",
		);
		setToken(generatedToken);
		setUnsubscribeUrl(
			`http://localhost:3000/unsubscribe?token=${generatedToken}`,
		);
	};

	const testUnsubscribe = () => {
		window.open(unsubscribeUrl, "_blank");
	};

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-2xl mx-auto p-4">
				<Card>
					<CardHeader>
						<CardTitle>Test Unsubscribe Functionality</CardTitle>
						<CardDescription>
							Generate test unsubscribe tokens and URLs to test the preference
							center
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								User ID
							</label>
							<Input
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								placeholder="test-user-123"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="test@example.com"
								type="email"
							/>
						</div>

						<Button onClick={generateToken} className="w-full">
							Generate Unsubscribe Token
						</Button>

						{token && (
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-foreground mb-1">
										Generated Token
									</label>
									<div className="bg-muted p-3 rounded text-xs break-all font-mono">
										{token}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-foreground mb-1">
										Unsubscribe URL
									</label>
									<div className="bg-muted p-3 rounded text-xs break-all">
										{unsubscribeUrl}
									</div>
								</div>

								<Button
									onClick={testUnsubscribe}
									variant="outline"
									className="w-full"
								>
									Open Unsubscribe Page
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Test Email Sending</CardTitle>
						<CardDescription>
							Use the buttons below to send test emails
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Your Email (to receive test emails)
							</label>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your-email@example.com"
								type="email"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Button
								onClick={() => sendTestEmail("welcome")}
								disabled={!email}
								variant="outline"
							>
								Welcome Email
							</Button>
							<Button
								onClick={() => sendTestEmail("order-confirmation")}
								disabled={!email}
								variant="outline"
							>
								Order Confirmation
							</Button>
							<Button
								onClick={() => sendTestEmail("password-reset")}
								disabled={!email}
								variant="outline"
							>
								Password Reset
							</Button>
							<Button
								onClick={() => sendTestEmail("order-update")}
								disabled={!email}
								variant="outline"
							>
								Order Update
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);

	async function sendTestEmail(type: string) {
		try {
			const response = await fetch("/api/test-emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type,
					email,
				}),
			});

			const result = await response.json();

			if (result.success) {
				alert(
					`${type} email enviado com sucesso! Message ID: ${result.messageId}`,
				);
			} else {
				alert(`Erro ao enviar email: ${result.error}`);
			}
		} catch (error) {
			alert(`Erro ao enviar email: ${error}`);
		}
	}
}
