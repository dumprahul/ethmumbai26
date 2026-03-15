/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_AGE_VERIFIER_ADDRESS:
      process.env.NEXT_PUBLIC_AGE_VERIFIER_ADDRESS || process.env.VITE_AGE_VERIFIER_ADDRESS || process.env.AGE_VERIFIER_ADDRESS || '',
    // BitGo submit: standalone server URL so app doesn't bundle BitGo (fast compile)
    NEXT_PUBLIC_SUBMIT_AGE_PROOF_API: process.env.NEXT_PUBLIC_SUBMIT_AGE_PROOF_API || '',
    // EVM wallet (for EVT_012 Bitgo event only)
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
