// automation-dashboard/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Adicione esta linha:
  base: '/AI_agent_Playwright/', // Substitua 'AI_agent_Playwright' pelo nome EXATO do seu repositório

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})