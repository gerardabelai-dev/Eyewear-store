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
	Calendar,
	CheckCircle,
	ChevronDownIcon,
	ChevronUpIcon,
	Clock,
	Copy,
	Edit,
	MoreHorizontal,
	Package,
	SearchIcon,
	ShoppingCart,
	XCircle,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import type { Order, OrderStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: "text" | "range" | "select";
	}
}

// Customer type for search
type Customer = {
	name: string;
	email: string;
};

interface OrdersAdvancedTableProps {
	orders: Order[];
	orderStatuses: OrderStatus[];
	onEditOrder?: (order: Order) => void;
}

// Helper functions
function getStatusBadge(statusId: string, orderStatuses: OrderStatus[]) {
	const status = orderStatuses.find((s) => s.id === statusId);

	if (!status) {
		return (
			<Badge variant="secondary" className="flex items-center gap-1">
				<Clock className="h-3 w-3" />
				Status desconhecido
			</Badge>
		);
	}

	// Map status icons to Lucide components
	const iconMap: Record<string, React.ComponentType<any>> = {
		Clock,
		Package,
		CheckCircle,
		XCircle,
	};

	const Icon = iconMap[status.icon || "Clock"] || Clock;

	// Determine variant based on status slug
	let variant: "default" | "secondary" | "destructive" | "outline" =
		"secondary";
	if (status.slug === "completed") variant = "default";
	else if (status.slug === "cancelled") variant = "destructive";
	else if (status.slug === "processing") variant = "outline";

	return (
		<Badge variant={variant} className="flex items-center gap-1">
			<Icon className="h-3 w-3" />
			{status.name}
		</Badge>
	);
}

function formatDate(date: Date | string) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

function formatCurrency(value: string) {
	return `R$ ${parseFloat(value).toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

const columns: ColumnDef<Order>[] = [
	{
		header: "Pedido",
		accessorKey: "orderNumber",
		cell: ({ row }) => (
			<div className="space-y-1">
				<div className="font-medium">{row.getValue("orderNumber")}</div>
				<div className="text-sm text-muted-foreground">
					ID: {row.original.id.slice(-8)}
				</div>
			</div>
		),
	},
	{
		header: "Cliente",
		accessorKey: "customerName",
		cell: ({ row }) => (
			<div className="space-y-1">
				<div className="font-medium max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
					{row.getValue("customerName")}
				</div>
				<div className="text-sm text-muted-foreground max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
					{row.original.customerEmail}
				</div>
			</div>
		),
		filterFn: (row, _id, filterValue) => {
			if (!filterValue) return true;
			const customerName = row.getValue("customerName") as string;
			const customerEmail = row.original.customerEmail;
			return (
				customerName.toLowerCase().includes(filterValue.toLowerCase()) ||
				customerEmail.toLowerCase().includes(filterValue.toLowerCase())
			);
		},
	},

	{
		header: "Data",
		accessorKey: "createdAt",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Calendar className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm">{formatDate(row.getValue("createdAt"))}</span>
			</div>
		),
	},
	{
		header: "Status",
		accessorKey: "statusId",
		cell: ({ row, table }) => {
			const { orderStatuses } = table.options.meta as any;
			return getStatusBadge(row.getValue("statusId"), orderStatuses);
		},
		meta: {
			filterVariant: "select",
		},
	},
	{
		header: "Total",
		accessorKey: "totalAmount",
		cell: ({ row }) => (
			<div className="font-medium">
				{formatCurrency(row.getValue("totalAmount"))}
			</div>
		),
	},
	{
		id: "actions",
		header: "Ações",
		cell: ({ row, table }) => {
			const order = row.original;
			const { onEditOrder } = table.options.meta as any;

			const handleCopyOrderId = async () => {
				try {
					await navigator.clipboard.writeText(order.id);
					toast.success("ID do pedido copiado!");
				} catch (error) {
					console.error("Failed to copy order ID:", error);
					toast.error("Erro ao copiar ID do pedido");
				}
			};

			const handleEditOrder = () => {
				if (onEditOrder) {
					onEditOrder(order);
				}
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0"
							aria-label="Abrir menu de ações"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								handleEditOrder();
							}}
							className="cursor-pointer"
						>
							<Edit className="mr-2 h-4 w-4" />
							Editar Pedido
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								handleCopyOrderId();
							}}
							className="cursor-pointer"
						>
							<Copy className="mr-2 h-4 w-4" />
							Copiar ID
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
		enableColumnFilter: false,
	},
];

export function OrdersAdvancedTable({
	orders,
	orderStatuses,
	onEditOrder,
}: OrdersAdvancedTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "createdAt",
			desc: true,
		},
	]);

	// Get unique customers from orders
	const customers = useMemo(() => {
		const uniqueCustomers = new Map<string, Customer>();
		orders.forEach((order) => {
			const key = `${order.customerName}-${order.customerEmail}`;
			if (!uniqueCustomers.has(key)) {
				uniqueCustomers.set(key, {
					name: order.customerName,
					email: order.customerEmail,
				});
			}
		});
		return Array.from(uniqueCustomers.values());
	}, [orders]);

	const table = useReactTable({
		data: orders,
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
			onEditOrder,
			orderStatuses,
		},
	});

	if (orders.length === 0) {
		return (
			<div className="text-center py-8">
				<Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
				<p className="text-muted-foreground">
					Quando você criar seu primeiro pedido, ele aparecerá aqui.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-wrap items-end gap-1.5">
				{/* Order number search */}
				<Filter column={table.getColumn("orderNumber")!} table={table} />
				{/* Customer search */}
				<CustomerFilter
					customers={customers}
					onFilterChange={(customerName) => {
						table.getColumn("customerName")?.setFilterValue(customerName);
					}}
				/>
				{/* Status select */}
				<Filter column={table.getColumn("statusId")!} table={table} />
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
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => onEditOrder?.(row.original)}
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
				Pedidos filtrados: {table.getFilteredRowModel().rows.length} de{" "}
				{orders.length}
			</p>
		</div>
	);
}

// Customer Filter Component
function CustomerFilter({
	customers,
	onFilterChange,
}: {
	customers: Customer[];
	onFilterChange: (customerName: string | undefined) => void;
}) {
	const id = useId();
	const [selectedCustomer, setSelectedCustomer] = useState<string>("all");

	// Sort customers by email first (prioritize email), then by name
	const sortedCustomers = useMemo(() => {
		return [...customers].sort((a, b) => {
			// Prioritize email results
			const emailCompare = a.email.localeCompare(b.email);
			if (emailCompare !== 0) return emailCompare;
			return a.name.localeCompare(b.name);
		});
	}, [customers]);

	const handleSelectionChange = (value: string) => {
		setSelectedCustomer(value);
		if (value === "all") {
			onFilterChange(undefined);
		} else {
			// Find the customer and use their name for filtering
			const customer = customers.find((c) => `${c.name}-${c.email}` === value);
			onFilterChange(customer?.name);
		}
	};

	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>Cliente</Label>
			<Select value={selectedCustomer} onValueChange={handleSelectionChange}>
				<SelectTrigger id={id} className="**:data-desc:hidden">
					<SelectValue placeholder="Selecionar cliente" />
				</SelectTrigger>
				<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
					<SelectItem value="all">Todos os clientes</SelectItem>
					{sortedCustomers.map((customer) => (
						<SelectItem
							key={`${customer.name}-${customer.email}`}
							value={`${customer.name}-${customer.email}`}
						>
							{customer.name}
							<span
								className="text-muted-foreground mt-1 block text-xs"
								data-desc
							>
								{customer.email}
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
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

		// Handle status filtering
		if (column.id === "statusId") {
			const { orderStatuses } = table.options.meta as any;
			return values
				.map((statusId) => {
					const status = orderStatuses?.find(
						(s: OrderStatus) => s.id === statusId,
					);
					return status?.name || statusId;
				})
				.sort();
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
		// Special handling for date range
		if (column.id === "createdAt") {
			return (
				<div className="*:not-first:mt-2">
					<Label>{columnHeader}</Label>
					<div className="flex flex-col gap-2">
						<Input
							id={`${id}-date-1`}
							value={(columnFilterValue as [string, string])?.[0] ?? ""}
							onChange={(e) =>
								column.setFilterValue((old: [string, string]) => [
									e.target.value,
									old?.[1],
								])
							}
							placeholder="Data inicial"
							type="date"
							aria-label={`${columnHeader} data inicial`}
						/>
						<Input
							id={`${id}-date-2`}
							value={(columnFilterValue as [string, string])?.[1] ?? ""}
							onChange={(e) =>
								column.setFilterValue((old: [string, string]) => [
									old?.[0],
									e.target.value,
								])
							}
							placeholder="Data final"
							type="date"
							aria-label={`${columnHeader} data final`}
						/>
					</div>
				</div>
			);
		}

		// Regular number range
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
