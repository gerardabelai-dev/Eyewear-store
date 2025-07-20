"use client";

import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	type RowData,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	Edit,
	ImageOff,
	MoreHorizontal,
	SearchIcon,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Product } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: "text" | "range" | "select";
	}
}

// Extended Product type with category information
type ProductWithCategory = Product & {
	categoryName: string | null;
	categorySlug: string | null;
	subcategoryName: string | null;
	subcategorySlug: string | null;
};

interface ProductsAdvancedTableProps {
	products: ProductWithCategory[];
	onEditProduct?: (product: ProductWithCategory) => void;
	onDeleteProduct?: (product: ProductWithCategory) => void;
}

// Product Images Component
function ProductImages({ images }: { images: string[] }) {
	if (!images || images.length === 0) {
		return (
			<div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
				<ImageOff className="h-6 w-6 text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="relative h-12 w-12 overflow-hidden rounded-md">
			<Image
				src={images[0]}
				alt="Produto"
				className="h-full w-full object-cover"
				width={48}
				height={48}
			/>
			{images.length > 1 && (
				<div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
					{images.length}
				</div>
			)}
		</div>
	);
}

// Helper functions
function getStockStatus(stock: number) {
	if (stock === 0) {
		return { label: "Sem estoque", variant: "destructive" as const };
	}
	if (stock <= 10) {
		return { label: "Estoque baixo", variant: "secondary" as const };
	}
	return { label: "Em estoque", variant: "default" as const };
}

function formatPrice(price: string) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(parseFloat(price));
}

function formatCategory(product: ProductWithCategory) {
	let categoryText = product.categoryName || "Sem categoria";
	if (product.subcategoryName) {
		categoryText += ` > ${product.subcategoryName}`;
	}
	return categoryText;
}

const columns: ColumnDef<ProductWithCategory>[] = [
	{
		header: "Imagem",
		accessorKey: "images",
		cell: ({ row }) => <ProductImages images={row.getValue("images") || []} />,
		enableSorting: false,
	},
	{
		header: "Produto",
		accessorKey: "name",
		cell: ({ row }) => (
			<div className="space-y-1">
				<div className="font-medium max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
					{row.getValue("name")}
				</div>
				{row.original.description && (
					<div className="text-sm text-muted-foreground max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
						{row.original.description}
					</div>
				)}
			</div>
		),
	},
	{
		header: "Categoria",
		accessorKey: "categoryName",
		cell: ({ row }) => formatCategory(row.original),
		meta: {
			filterVariant: "select",
		},
		filterFn: (row, _id, filterValue) => {
			const category = formatCategory(row.original);
			return category.toLowerCase().includes(filterValue.toLowerCase());
		},
	},
	{
		header: "Preço",
		accessorKey: "price",
		cell: ({ row }) => (
			<div className="font-medium">{formatPrice(row.getValue("price"))}</div>
		),
	},
	{
		header: "Estoque",
		accessorKey: "stock",
		cell: ({ row }) => {
			const stock = row.getValue("stock") as number;
			const stockStatus = getStockStatus(stock);
			return (
				<Badge variant={stockStatus.variant} className="text-xs">
					{stockStatus.label}
				</Badge>
			);
		},
	},

	{
		header: "Ações",
		id: "actions",
		cell: ({ row, table }) => {
			const product = row.original;
			const { onEditProduct, onDeleteProduct } = table.options.meta as any;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Abrir menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(product.id);
									toast.success("ID do produto copiado!");
								} catch (error) {
									console.error("Failed to copy product ID:", error);
									toast.error("Erro ao copiar ID do produto");
								}
							}}
						>
							Copiar ID do produto
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onEditProduct?.(product)}>
							<Edit className="mr-2 h-4 w-4" />
							Editar
						</DropdownMenuItem>
						<DeleteConfirmationDialog
							productId={product.id}
							productName={product.name}
							onConfirm={() => onDeleteProduct?.(product)}
							trigger={
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									<Trash2 className="mr-2 h-4 w-4" />
									Excluir
								</DropdownMenuItem>
							}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];

export function ProductsAdvancedTable({
	products,
	onEditProduct,
	onDeleteProduct,
}: ProductsAdvancedTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "name",
			desc: false,
		},
	]);

	const table = useReactTable({
		data: products,
		columns,
		state: {
			sorting,
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		meta: {
			onEditProduct,
			onDeleteProduct,
		},
	});

	if (products.length === 0) {
		return (
			<div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
				<p className="text-muted-foreground">Nenhum produto encontrado</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				{/* Product name search */}
				<Filter column={table.getColumn("name")!} table={table} />
				{/* Category select */}
				<Filter column={table.getColumn("categoryName")!} table={table} />
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-muted/50">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="relative h-10 border-t select-none"
											aria-sort={
												header.column.getIsSorted() === "asc"
													? "ascending"
													: header.column.getIsSorted() === "desc"
														? "descending"
														: "none"
											}
										>
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
												<div
													className={cn(
														header.column.getCanSort() &&
															"flex h-full cursor-pointer items-center justify-between gap-2 select-none",
													)}
													onClick={header.column.getToggleSortingHandler()}
													onKeyDown={(e) => {
														if (
															header.column.getCanSort() &&
															(e.key === "Enter" || e.key === " ")
														) {
															e.preventDefault();
															header.column.getToggleSortingHandler()?.(e);
														}
													}}
													tabIndex={header.column.getCanSort() ? 0 : undefined}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: (
															<ChevronUpIcon
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
														desc: (
															<ChevronDownIcon
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
													}[header.column.getIsSorted() as string] ?? (
														<span className="size-4" aria-hidden="true" />
													)}
												</div>
											) : (
												flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum resultado encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<p className="text-muted-foreground mt-4 text-center text-sm">
				Produtos filtrados: {table.getFilteredRowModel().rows.length} de{" "}
				{products.length}
			</p>
		</div>
	);
}

function Filter({
	column,
	table,
}: {
	column: Column<any, unknown>;
	table: any;
}) {
	const id = useId();
	const columnFilterValue = column.getFilterValue();
	const { filterVariant } = column.columnDef.meta ?? {};
	const columnHeader =
		typeof column.columnDef.header === "string" ? column.columnDef.header : "";

	const sortedUniqueValues = useMemo(() => {
		if (filterVariant === "range") return [];

		const values = Array.from(column.getFacetedUniqueValues().keys());

		// Handle category filtering - get unique formatted categories
		if (column.id === "categoryName") {
			const products = table
				.getCoreRowModel()
				.flatRows.map((row: any) => row.original) as ProductWithCategory[];
			const categories = products.map(formatCategory);
			return Array.from(new Set(categories)).sort();
		}

		const flattenedValues = values.reduce((acc: string[], curr) => {
			if (Array.isArray(curr)) {
				return [...acc, ...curr];
			}
			return [...acc, curr];
		}, []);

		return Array.from(new Set(flattenedValues)).sort();
	}, [column.getFacetedUniqueValues(), filterVariant, column.id]);

	if (filterVariant === "range") {
		return (
			<div className="*:not-first:mt-2">
				<Label>{columnHeader}</Label>
				<div className="flex">
					<Input
						id={`${id}-range-1`}
						className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
						value={(columnFilterValue as [number, number])?.[0] ?? ""}
						onChange={(e) =>
							column.setFilterValue((old: [number, number]) => [
								e.target.value ? Number(e.target.value) : undefined,
								old?.[1],
							])
						}
						placeholder="Min"
						type="number"
						aria-label={`${columnHeader} min`}
					/>
					<Input
						id={`${id}-range-2`}
						className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
						value={(columnFilterValue as [number, number])?.[1] ?? ""}
						onChange={(e) =>
							column.setFilterValue((old: [number, number]) => [
								old?.[0],
								e.target.value ? Number(e.target.value) : undefined,
							])
						}
						placeholder="Max"
						type="number"
						aria-label={`${columnHeader} max`}
					/>
				</div>
			</div>
		);
	}

	if (filterVariant === "select") {
		return (
			<div className="*:not-first:mt-2">
				<Label htmlFor={`${id}-select`}>{columnHeader}</Label>
				<Select
					value={columnFilterValue?.toString() ?? "all"}
					onValueChange={(value) => {
						column.setFilterValue(value === "all" ? undefined : value);
					}}
				>
					<SelectTrigger id={`${id}-select`}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos</SelectItem>
						{sortedUniqueValues.map((value) => (
							<SelectItem key={String(value)} value={String(value)}>
								{String(value)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	}

	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={`${id}-input`}>{columnHeader}</Label>
			<div className="relative">
				<Input
					id={`${id}-input`}
					className="peer ps-9"
					value={(columnFilterValue ?? "") as string}
					onChange={(e) => column.setFilterValue(e.target.value)}
					placeholder={`Buscar ${columnHeader.toLowerCase()}`}
					type="text"
				/>
				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					<SearchIcon size={16} />
				</div>
			</div>
		</div>
	);
}
