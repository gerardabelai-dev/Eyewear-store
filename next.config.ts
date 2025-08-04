import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		// Configure resolve aliases for better module resolution
		resolveAlias: {
			"@": "./src",
		},
		// Extend resolve extensions to match your project structure
		resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s.ygstatic.com",
			},
			{
				protocol: "https",
				hostname: "iujqf0zpqycuhvmp.public.blob.vercel-storage.com",
			},
		],
	},
	// Optimize build performance by excluding private routes from static generation
	trailingSlash: false,
	// Exclude private routes from build processing and indexing
	async headers() {
		return [
			{
				// Apply to all private routes - prevent caching and indexing
				source: "/(admin|minha-conta)/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "no-store, must-revalidate",
					},
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow, noarchive, nosnippet",
					},
				],
			},
		];
	},
	// Skip build optimization for private routes
	experimental: {
		optimizePackageImports: ["@/components/ui"],
	},
};

export default nextConfig;
