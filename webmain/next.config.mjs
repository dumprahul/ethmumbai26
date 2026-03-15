/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Expose only contract address to client (BitGo credentials stay server-side)
  env: {
    NEXT_PUBLIC_AGE_VERIFIER_ADDRESS:
      process.env.NEXT_PUBLIC_AGE_VERIFIER_ADDRESS || process.env.VITE_AGE_VERIFIER_ADDRESS || process.env.AGE_VERIFIER_ADDRESS || '',
  },
  // BitGo SDK pulls in native/wasm deps (@wasmer/wasi) that break when bundled. Run it in Node only.
  serverExternalPackages: ['bitgo'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('@aztec/bb.js')
    }
    return config
  },
}

export default nextConfig
