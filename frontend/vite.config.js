import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,

    allowedHosts: true,

    hmr: {
      protocol: 'ws',
      host: 'k8s-dashboar-dashboar-d3ed1467af-640568485.us-east-1.elb.amazonaws.com/',
      clientPort: 80,
    },
  },

  optimizeDeps: {
    force: true,
  },
})