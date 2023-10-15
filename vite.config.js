import { defineConfig } from 'vite';

export default defineConfig({
  base: "/PopulationTwin/",
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Include the ./data directory in a chunk named 'data'
          if (id.includes('/data/')) {
            return 'data';
          }
        },
      },
    },
    assetsDir: 'assets', // Specify a directory for assets
  },
});
