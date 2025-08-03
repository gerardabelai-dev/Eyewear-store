"use client";

import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerControlled } from "@/components/ui/drawer";
import { CustomerForm } from "./customer-form";

export function CustomerCreationSheet() {
	return (
		<DrawerControlled
			trigger={
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Novo Cliente
				</Button>
			}
			title="Novo Cliente"
			description="Preencha as informações para criar um novo cliente."
			icon={<User className="h-5 w-5" />}
		>
			{({ onClose }) => (
				<CustomerForm
					onSuccess={() => {
						// Close the sheet after successful creation
						onClose();
					}}
				/>
			)}
		</DrawerControlled>
	);
}
