import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,

    allowedHosts: [
      'k8s-dodashbo-dodashbo-fe6bf9bf0e-1830682628.eu-north-1.elb.amazonaws.com'
    ],

    hmr: {
      protocol: 'ws',
      host: 'k8s-dodashbo-dodashbo-fe6bf9bf0e-1830682628.eu-north-1.elb.amazonaws.com',
      port: 80,
    },
  },
})