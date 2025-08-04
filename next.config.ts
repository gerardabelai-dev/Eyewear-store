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
};

export default nextConfig;
