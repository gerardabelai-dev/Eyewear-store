"use client";

import { Package, Plus } from "lucide-react";
import { ProductFormSimple } from "@/components/forms/product-form-simple";
import { Button } from "@/components/ui/button";
import { DrawerControlled } from "@/components/ui/drawer";

export function ProductCreationSheet() {
	return (
		<DrawerControlled
			trigger={
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Novo Produto
				</Button>
			}
			title="Novo Produto"
			description="Preencha as informações para criar um novo produto. Adicione imagens para tornar seu produto mais atrativo."
			icon={<Package className="h-5 w-5" />}
		>
			{({ onClose }) => (
				<ProductFormSimple
					onSuccess={() => {
						// Close the sheet after successful creation
						onClose();
					}}
				/>
			)}
		</DrawerControlled>
	);
}
