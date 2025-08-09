import { NextResponse } from "next/server";

export async function GET() {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return NextResponse.json({
		id: "1",
		items: [
			{
				id: "product-1",
			},
		],
	});
}
