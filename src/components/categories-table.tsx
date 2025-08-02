"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Category type with counts
export type CategoryWithCounts = {
	id: string;
	name: string;
	slug: string;
	description: string | undefined;
	createdAt: Date;
	updatedAt: Date;
	productsCount: number;
	subcategoriesCount: number;
};

interface CategoriesTableProps {
	categories: CategoryWithCounts[];
	onEditCategory: (category: CategoryWithCounts) => void;
	onDeleteCategory: (category: CategoryWithCounts) => void;
}

export function CategoriesTable({
	categories,
	onEditCategory,
	onDeleteCategory,
}: CategoriesTableProps) {
	if (categories.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-sm text-muted-foreground">
					Nenhuma categoria encontrada
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Descrição</TableHead>
						<TableHead className="text-center">Produtos</TableHead>
						<TableHead className="text-center">Subcategorias</TableHead>
						<TableHead>Criada em</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories.map((category) => (
						<TableRow
							key={category.id}
							className="cursor-pointer hover:bg-muted/50"
							onClick={() => onEditCategory(category)}
						>
							<TableCell className="font-medium">{category.name}</TableCell>
							<TableCell>
								{category.description || (
									<span className="text-muted-foreground">Sem descrição</span>
								)}
							</TableCell>
							<TableCell className="text-center">
								<Badge variant="secondary" className="font-mono">
									{category.productsCount}
								</Badge>
							</TableCell>
							<TableCell className="text-center">
								<Badge variant="secondary" className="font-mono">
									{category.subcategoriesCount}
								</Badge>
							</TableCell>
							<TableCell>
								{new Date(category.createdAt).toLocaleDateString("pt-BR")}
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
												onEditCategory(category);
											}}
											className="cursor-pointer"
										>
											<Edit className="mr-2 h-4 w-4" />
											Editar
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												onDeleteCategory(category);
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
	);
}
