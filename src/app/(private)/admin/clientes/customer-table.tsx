"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericDeleteDialog } from "@/components/ui/generic-delete-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Customer } from "@/lib/db/schema";
import { CustomerForm } from "./customer-form";

// Mock customers data - in a real app this would come from props or server action
const getMockCustomers = (): Customer[] => [
	{
		id: "1",
		userId: "user_1",
		firstName: "John",
		lastName: "Doe",
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-15"),
	},
	{
		id: "2",
		userId: "user_2",
		firstName: "Jane",
		lastName: "Smith",
		createdAt: new Date("2024-01-10"),
		updatedAt: new Date("2024-01-10"),
	},
];

interface CustomersTableProps {
	customers?: Customer[];
}

export function CustomersTable({
	customers: customersProp,
}: CustomersTableProps) {
	const customers = customersProp || getMockCustomers();
	const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
	const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
		null,
	);
	const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleEditCustomer = (customer: Customer) => {
		setEditingCustomer(customer);
		setIsEditDrawerOpen(true);
	};

	const handleDeleteCustomer = (customer: Customer) => {
		setDeletingCustomer(customer);
	};

	const confirmDeleteCustomer = async () => {
		if (!deletingCustomer) return;

		setIsDeleting(true);

		// Mock loading delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock success (you can simulate error by uncommenting the line below)
		// throw new Error("Simulated API error");

		toast.success("Cliente excluído com sucesso!");
		setDeletingCustomer(null);
		setIsDeleting(false);
	};

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead className="w-[100px]">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{customers.map((customer) => (
							<TableRow
								key={customer.id}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => handleEditCustomer(customer)}
							>
								<TableCell className="font-medium">
									{customer.firstName} {customer.lastName}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0"
												onClick={(e) => e.stopPropagation()}
											>
												<span className="sr-only">Abrir menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Ações</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													handleEditCustomer(customer);
												}}
												className="cursor-pointer"
											>
												<Edit className="mr-2 h-4 w-4" />
												Editar
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteCustomer(customer);
												}}
												className="cursor-pointer"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Deletar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Edit Product Drawer */}
			<Drawer
				open={isEditDrawerOpen}
				onOpenChange={(open: boolean) => {
					if (!open) {
						setIsEditDrawerOpen(false);
						setEditingCustomer(null);
					}
				}}
				trigger={<div style={{ display: "none" }} />}
				title="Editar Cliente"
				description="Atualize as informações do cliente"
				icon={<Edit className="h-5 w-5" />}
			>
				<CustomerForm
					customer={editingCustomer || undefined}
					onSuccess={() => {
						setIsEditDrawerOpen(false);
						setEditingCustomer(null);
						// Removed duplicate toast - the form already shows its own success toast
					}}
				/>
			</Drawer>

			{/* Delete Product Dialog */}
			<GenericDeleteDialog
				open={!!deletingCustomer}
				onOpenChange={(open) => {
					if (!open) setDeletingCustomer(null);
				}}
				itemId={deletingCustomer?.id || ""}
				itemName={deletingCustomer?.firstName || ""}
				itemType="cliente"
				onConfirm={confirmDeleteCustomer}
				isLoading={isDeleting}
			/>
		</>
	);
}
