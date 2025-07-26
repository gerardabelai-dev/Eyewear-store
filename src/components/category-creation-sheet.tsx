"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "@/components/forms/category-form";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface CategoryCreationSheetProps {
	onSuccess?: () => void;
}

export function CategoryCreationSheet({
	onSuccess,
}: CategoryCreationSheetProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		setOpen(false);
		onSuccess?.();
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Nova Categoria
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Criar Nova Categoria</SheetTitle>
					<SheetDescription>
						Adicione uma nova categoria para organizar seus produtos.
					</SheetDescription>
				</SheetHeader>
				<div className="mt-6">
					<CategoryForm onSuccess={handleSuccess} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
