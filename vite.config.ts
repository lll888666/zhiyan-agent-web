import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/zhiyan-agent-web/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        report: 'report.html',
        revisionViewer: 'revision-viewer.html',
        riskRadar: 'risk-radar.html',
        academicTrainingLab: 'academic-training-lab.html',
      },
    },
  },
})
