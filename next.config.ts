import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	// Move serverComponentsExternalPackages to the correct location
	serverExternalPackages: ["bcrypt", "drizzle-orm", "@neondatabase/serverless"],
	// Experimental features that help with performance and server/client boundaries
	experimental: {
		// Enable server components HMR cache for better performance
		serverComponentsHmrCache: true,
		// Optimize CSS chunking
		cssChunking: "strict",
	},
	// Turbopack-specific configuration for optimal development experience
	turbopack: {
		// Use named module IDs for better debugging (recommended by docs)
		moduleIds: "named",
		// Set up path aliases for better module resolution
		resolveAlias: {
			// Ensure proper module resolution for our src directory
			"@": "./src",
		},
		// Extend resolve extensions for better TypeScript support
		resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
	},
	// Only add webpack config if not using Turbopack
	...(process.env.TURBOPACK !== "1" && {
		webpack: (config, { isServer }) => {
			// Suppress the webpack cache warning about big strings
			if (!isServer) {
				config.cache = {
					type: "filesystem",
					compression: false,
					// Increase the cache size limit to avoid warnings
					maxMemoryGenerations: 1,
				};
			}
			return config;
		},
	}),
};

export default nextConfig;
