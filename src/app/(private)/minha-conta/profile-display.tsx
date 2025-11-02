import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ProfileDisplayProps {
	email: string;
	role: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
}

export function ProfileDisplay({
	email,
	role,
	firstName,
	lastName,
	phoneNumber,
}: ProfileDisplayProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex justify-between items-start">
					<div className="space-y-2 max-w-md">
						<header className="flex justify-between items-center gap-4">
							<h3 className="text-lg font-semibold">Informações do Perfil</h3>
							{role && <Badge variant="outline">{role}</Badge>}
						</header>
						<p className="text-muted-foreground">
							Visualize suas informações básicas de perfil.
						</p>
						<Separator className="my-4" />
						<div className="space-y-2">
							<div>
								<Label className="text-sm font-medium">Nome Completo</Label>
								<p className="text-sm text-muted-foreground">
									{firstName} {lastName}
								</p>
							</div>
							<div>
								<Label className="text-sm font-medium">Email</Label>
								<p className="text-sm text-muted-foreground">{email}</p>
							</div>
							<div>
								<Label className="text-sm font-medium">WhatsApp</Label>
								<p className="text-sm text-muted-foreground">{phoneNumber}</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
