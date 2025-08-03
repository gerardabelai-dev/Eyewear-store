import { Package, Package2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomersStatistics() {
	// Mock statistics
	const totalCustomers = 45;
	const activeCustomers = 38;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total de Clientes
					</CardTitle>
					<Package className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalCustomers}</div>
					<p className="text-xs text-muted-foreground">clientes cadastrados</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
					<Package2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{activeCustomers}</div>
					<p className="text-xs text-muted-foreground">
						disponíveis para compra
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
