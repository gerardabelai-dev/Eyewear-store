"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCartQueryOptions } from "./get-cart-query-options";

export function CartItems() {
	const { data } = useSuspenseQuery(getCartQueryOptions);

	return (
		<ul className="flex flex-col gap-4">
			<h1>DEBUG: {data.id}</h1>
			{/* Product 1 */}
			<li className="flex gap-4">
				<Link
					href="/cart"
					className="relative w-48 md:w-96 h-full aspect-video"
				>
					<Image
						src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
						alt="Óculos de grau"
						className="object-cover rounded"
						quality={75}
						fill
					/>
				</Link>

				<div className="flex flex-col justify-between gap-2">
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-bold">Ekko</h2>
						<span className="text-sm text-muted-foreground">
							Gatinho | Metal
						</span>
						<strong className="text-md">R$ 100,00</strong>
					</div>

					<div className="flex md:hidden gap-2">
						<Select defaultValue="1">
							<SelectTrigger id="quantity">
								<SelectValue placeholder="Selecione a quantidade" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">1</SelectItem>
								<SelectItem value="2">2</SelectItem>
								<SelectItem value="3">3</SelectItem>
								<SelectItem value="4">4</SelectItem>
							</SelectContent>
						</Select>

						<Button variant="ghost" size="icon">
							<Trash2 className="size-4" />
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<Check className="size-4 text-emerald-500" />
						<span className="text-sm text-muted-foreground">Em estoque</span>
					</div>
				</div>

				<div className="*:not-first:mt-2 ml-auto hidden md:block">
					<Select defaultValue="1">
						<SelectTrigger id="quantity">
							<SelectValue placeholder="Selecione a quantidade" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button variant="ghost" size="icon" className="hidden md:block">
					<Trash2 className="size-4" />
				</Button>
			</li>

			<Separator className="my-6" />

			{/* Product 2 */}
			<li className="flex gap-4">
				<Link
					href="/cart"
					className="relative w-48 md:w-96 h-full aspect-video"
				>
					<Image
						src="https://iujqf0zpqycuhvmp.public.blob.vercel-storage.com/products/Ekko_19-aMxeQmF3jpz4kB3aadSfsCEDTmCNxj.jpg"
						alt="Óculos de grau"
						className="object-cover rounded"
						quality={75}
						fill
					/>
				</Link>

				<div className="flex flex-col justify-between gap-2">
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-bold">Ekko</h2>
						<span className="text-sm text-muted-foreground">
							Gatinho | Metal
						</span>
						<strong className="text-md">R$ 100,00</strong>
					</div>

					<div className="flex md:hidden gap-2">
						<Select defaultValue="1">
							<SelectTrigger id="quantity">
								<SelectValue placeholder="Selecione a quantidade" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">1</SelectItem>
								<SelectItem value="2">2</SelectItem>
								<SelectItem value="3">3</SelectItem>
								<SelectItem value="4">4</SelectItem>
							</SelectContent>
						</Select>

						<Button variant="ghost" size="icon">
							<Trash2 className="size-4" />
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<Check className="size-4 text-emerald-500" />
						<span className="text-sm text-muted-foreground">Em estoque</span>
					</div>
				</div>

				<div className="*:not-first:mt-2 ml-auto hidden md:block">
					<Select defaultValue="1">
						<SelectTrigger id="quantity">
							<SelectValue placeholder="Selecione a quantidade" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button variant="ghost" size="icon" className="hidden md:block">
					<Trash2 className="size-4" />
				</Button>
			</li>
		</ul>
	);
}
