import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Ensure fast refresh is enabled in development
	reactStrictMode: true,

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
};

export default nextConfig;
