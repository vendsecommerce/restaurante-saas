/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'public',
  // Configurações específicas para o Netlify
  assetPrefix: '.',
  // Desabilitar otimizações que podem causar problemas
  swcMinify: false,
  // Configuração para SPA
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/cardapio': { page: '/cardapio' },
      '/mesas': { page: '/mesas' },
      '/pedidos': { page: '/pedidos' },
    }
  },
  // Configurações adicionais para resolver problemas
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
