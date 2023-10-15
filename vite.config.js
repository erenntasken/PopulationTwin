import { defineConfig } from 'vite';

export default defineConfig({
  base: "/PopulationTwin/",
  build: {
    assetsDir: 'assets',
    outDir: "docs",
  },
});
