"use client";

import { Package, Plus } from "lucide-react";
import { useState } from "react";
import { ProductForm } from "@/components/forms/product-form";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function ProductCreationSheet() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Novo Produto
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
				<div className="p-6">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2">
							<Package className="h-5 w-5" />
							Novo Produto
						</SheetTitle>
						<SheetDescription>
							Preencha as informações para criar um novo produto. Adicione
							imagens para tornar seu produto mais atrativo.
						</SheetDescription>
					</SheetHeader>

					<div className="mt-6">
						<ProductForm
							onSuccess={() => {
								// Close the sheet after successful creation
								setIsOpen(false);
							}}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
