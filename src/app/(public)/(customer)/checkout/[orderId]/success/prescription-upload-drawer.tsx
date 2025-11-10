"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerControlled } from "@/components/ui/drawer";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { QUERY_KEYS } from "@/http/query-keys";
import { PrescriptionItemUpload } from "./prescription-item-upload";

type PrescriptionUploadDrawerProps = {
	productName: string;
	cartProductId: string;
	orderId: string;
	cartId: string;
	hasUpload: boolean;
	prescriptionFileName?: string | null;
};

export function PrescriptionUploadDrawer({
	productName,
	cartProductId,
	orderId,
	cartId,
	hasUpload,
	prescriptionFileName,
}: PrescriptionUploadDrawerProps) {
	const [refreshKey, setRefreshKey] = useState(0);
	const queryClient = useQueryClient();

	const handleUploadSuccess = async () => {
		setRefreshKey((prev) => prev + 1);
		// Refetch the order query to immediately update the timeline
		await queryClient.refetchQueries({ queryKey: QUERY_KEYS.order(orderId) });
	};

	return (
		<TooltipProvider>
			<DrawerControlled
				trigger={
					<div className="flex items-center gap-2 ml-2">
						<Tooltip>
							<TooltipTrigger asChild>
								{hasUpload ? (
									<CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
								) : (
									<AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 animate-pulse" />
								)}
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{hasUpload
										? "Receita médica enviada"
										: "Receita médica pendente - envio obrigatório"}
								</p>
							</TooltipContent>
						</Tooltip>
						<Button
							size="sm"
							className="gap-2"
							variant={hasUpload ? "outline" : "default"}
						>
							<Upload className="h-4 w-4" />
							{hasUpload ? "Alterar receita" : "Enviar receita"}
						</Button>
					</div>
				}
				title={hasUpload ? "Alterar receita médica" : "Enviar receita médica"}
				description={
					hasUpload
						? `Faça o upload de uma nova receita para ${productName}`
						: `Faça o upload da receita para ${productName}`
				}
				icon={<FileText className="h-5 w-5" />}
			>
				{({ onClose }) => (
					<div className="space-y-4">
						{hasUpload && prescriptionFileName && (
							<div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
								<div className="flex items-center gap-2 text-green-700 dark:text-green-400">
									<CheckCircle className="h-5 w-5" />
									<div>
										<h4 className="font-medium text-sm">Receita enviada</h4>
										<p className="text-xs mt-1">{prescriptionFileName}</p>
									</div>
								</div>
							</div>
						)}

						<div className="bg-muted p-4 rounded-lg">
							<h4 className="font-medium text-sm mb-2">Formatos aceitos:</h4>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• PDF (recomendado)</li>
								<li>• JPG ou PNG</li>
								<li>• HEIC (iPhone)</li>
								<li>• Tamanho máximo: 5MB</li>
							</ul>
						</div>

						<PrescriptionItemUpload
							key={refreshKey}
							productName={productName}
							cartProductId={cartProductId}
							orderId={orderId}
							cartId={cartId}
							hasUpload={hasUpload}
							prescriptionFileName={prescriptionFileName}
							onUploadSuccess={() => {
								handleUploadSuccess();
								setTimeout(() => {
									onClose();
								}, 1000);
							}}
						/>
					</div>
				)}
			</DrawerControlled>
		</TooltipProvider>
	);
}
