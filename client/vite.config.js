import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode ('development', 'production', etc.)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASEURL, // Use the loaded env variable
          changeOrigin: true,
          secure: false, // If you're working with self-signed certificates in development
          rewrite: (path) => path.replace(/^\/api/, '/api'), // Rewrites the URL path
        },
      },
    },
    css: {
      preprocessorOptions: {
        css: {
          additionalData: `@import "./src/styles/global.css";`, // Automatically include your global styles
        },
      },
    },
  };
});
