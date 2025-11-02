import { type NextRequest, NextResponse } from "next/server";

/**
 * Image proxy route to avoid email spam detection
 * Proxies product images through Next.js server with optimization
 *
 * Usage: /api/images/proxy?url=https://example.com/image.jpg&w=200&q=60
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const imageUrl = searchParams.get("url");
		const width = searchParams.get("w") || "200";
		const quality = searchParams.get("q") || "60";

		if (!imageUrl) {
			return NextResponse.json(
				{ error: "Parâmetro 'url' ausente" },
				{ status: 400 },
			);
		}

		// Validate URL to prevent SSRF attacks
		let url: URL;
		try {
			url = new URL(imageUrl);
		} catch {
			return NextResponse.json({ error: "URL inválida" }, { status: 400 });
		}

		// Only allow HTTPS URLs
		if (url.protocol !== "https:") {
			return NextResponse.json(
				{ error: "Apenas URLs HTTPS são permitidas" },
				{ status: 400 },
			);
		}

		// Fetch the image
		const response = await fetch(imageUrl);

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Houve um erro ao buscar a imagem" },
				{ status: response.status },
			);
		}

		const contentType = response.headers.get("content-type");

		// Validate content type
		if (!contentType?.startsWith("image/")) {
			return NextResponse.json(
				{ error: "URL não aponta para uma imagem" },
				{ status: 400 },
			);
		}

		// Get image buffer
		const imageBuffer = await response.arrayBuffer();

		// Return proxied image with cache headers
		return new NextResponse(imageBuffer, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=31536000, immutable",
				"X-Image-Width": width,
				"X-Image-Quality": quality,
			},
		});
	} catch (error) {
		console.error("Error proxying image:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
