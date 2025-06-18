import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' }
                ]
            }
        ]
    },

    eslint: {
        // Отключаем автоматическую проверку ESLint во время сборки
        ignoreDuringBuilds: true,
    },

    images: {
        remotePatterns : [
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    },

    trailingSlash: true,
};

export default nextConfig;
