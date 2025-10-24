import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react()];
  
  // Only add componentTagger in development mode
  if (mode === "development") {
    try {
      const { componentTagger } = require("lovable-tagger");
      plugins.push(componentTagger());
    } catch (error) {
      // lovable-tagger not available, skip it
      console.warn("lovable-tagger not available, skipping...");
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Increase chunk size limit to 1000kb
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
            router: ['react-router-dom'],
            utils: ['axios', 'date-fns', 'clsx', 'tailwind-merge'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            charts: ['recharts'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
          }
        }
      }
    }
  };
});
