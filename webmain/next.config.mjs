/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Expose env to client (NEXT_PUBLIC_* and VITE_* fallbacks for ZK age verification)
  env: {
    NEXT_PUBLIC_AGE_VERIFIER_ADDRESS:
      process.env.NEXT_PUBLIC_AGE_VERIFIER_ADDRESS || process.env.VITE_AGE_VERIFIER_ADDRESS || '',
    NEXT_PUBLIC_BASE_SEPOLIA_RPC:
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || process.env.VITE_BASE_SEPOLIA_RPC || '',
    NEXT_PUBLIC_PRIVATE_KEY:
      process.env.NEXT_PUBLIC_PRIVATE_KEY || process.env.VITE_PRIVATE_KEY || '',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('@aztec/bb.js')
    }
    return config
  },
}

export default nextConfig
