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
};

export default nextConfig;
