import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ProfileDisplayProps {
	name: string;
	email: string;
}

export function ProfileDisplay({ name, email }: ProfileDisplayProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex justify-between items-start">
					<div className="flex-1 max-w-md">
						<h3 className="text-lg font-semibold mb-2">
							Informações do Perfil
						</h3>
						<p className="text-muted-foreground mb-4">
							Visualize suas informações básicas de perfil.
						</p>
						<div className="space-y-2">
							<div>
								<Label className="text-sm font-medium">Nome Completo</Label>
								<p className="text-sm text-muted-foreground">{name}</p>
							</div>
							<div>
								<Label className="text-sm font-medium">Email</Label>
								<p className="text-sm text-muted-foreground">{email}</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
