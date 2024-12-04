/** @type {import('next').NextConfig} */
const nextConfig = {
	// Static export configuration
	output: process.env.NODE_ENV === "production" ? "export" : undefined,
	distDir: "build",
	images: {
		unoptimized: true,
	}
};

export default nextConfig;
