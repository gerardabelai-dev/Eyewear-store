import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ProfileDisplayProps {
	user: {
		name: string;
		email: string;
		image?: string | null;
		role?: string | null;
	};
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex justify-between items-start">
					<div className="space-y-2 max-w-md">
						<header className="flex justify-between items-center gap-4">
							<h3 className="text-lg font-semibold">Informações do Perfil</h3>
							{user.role && <Badge variant="outline">{user.role}</Badge>}
						</header>
						<p className="text-muted-foreground">
							Visualize suas informações básicas de perfil.
						</p>
						<Separator className="my-4" />
						<div className="space-y-2">
							<div>
								<Label className="text-sm font-medium">Nome Completo</Label>
								<p className="text-sm text-muted-foreground">{user.name}</p>
							</div>
							<div>
								<Label className="text-sm font-medium">Email</Label>
								<p className="text-sm text-muted-foreground">{user.email}</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
