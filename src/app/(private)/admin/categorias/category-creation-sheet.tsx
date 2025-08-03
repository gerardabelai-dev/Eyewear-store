"use client";

import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerControlled } from "@/components/ui/drawer";
import { CategoryForm } from "./category-form";

export function CategoryCreationSheet() {
	return (
		<DrawerControlled
			trigger={
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Nova Categoria
				</Button>
			}
			title="Nova Categoria"
			description="Adicione uma nova categoria para organizar seus produtos"
			icon={<FolderOpen className="h-5 w-5" />}
		>
			{({ onClose }) => (
				<CategoryForm
					onSuccess={() => {
						// Close the sheet after successful creation
						console.log("Category form success, closing drawer");
						onClose();
					}}
				/>
			)}
		</DrawerControlled>
	);
}
