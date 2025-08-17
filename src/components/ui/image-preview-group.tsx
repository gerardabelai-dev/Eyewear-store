import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePreviewGroupProps {
	images: string[];
	maxVisible?: number;
	size?: number;
	className?: string;
	onViewAll?: () => void;
}

export function ImagePreviewGroup({
	images,
	maxVisible = 3,
	size = 40,
	className,
}: ImagePreviewGroupProps) {
	if (!images || images.length === 0) {
		return (
			<div
				className={cn(
					"flex items-center justify-center text-muted-foreground text-sm",
					className,
				)}
			>
				Sem imagens
			</div>
		);
	}

	const visibleImages = images.slice(0, maxVisible);
	const remainingCount = Math.max(0, images.length - maxVisible);

	return (
		<div className={cn("flex items-center", className)}>
			<div className="bg-muted flex items-center rounded-full p-0.5">
				<div className="flex -space-x-3">
					{visibleImages.map((image) => (
						<div
							key={image}
							className="ring-muted relative rounded-full ring-2 overflow-hidden"
							style={{ width: size, height: size }}
						>
							<Image
								src={image}
								alt="Produto imagem"
								width={size}
								height={size}
								className="object-cover w-full h-full"
							/>
						</div>
					))}
				</div>
				{remainingCount > 0 && (
					<div className="text-muted-foreground ml-1 flex items-center justify-center rounded-full bg-transparent px-2 text-xs font-medium">
						+{remainingCount}
					</div>
				)}
			</div>
		</div>
	);
}
