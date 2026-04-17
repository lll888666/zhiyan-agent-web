import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base is safer for static hosts (including GitHub Pages project sites).
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: decodeURIComponent(new URL('./index.html', import.meta.url).pathname),
        report: decodeURIComponent(new URL('./report.html', import.meta.url).pathname),
        revisionViewer: decodeURIComponent(new URL('./revision-viewer.html', import.meta.url).pathname),
        riskRadar: decodeURIComponent(new URL('./risk-radar.html', import.meta.url).pathname),
        academicTrainingLab: decodeURIComponent(new URL('./academic-training-lab.html', import.meta.url).pathname),
      },
    },
  },
});
