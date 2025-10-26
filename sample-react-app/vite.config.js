// automation-dashboard/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Adicione esta linha:
  base: '/AI_agent_Playwright/', // Substitua 'AI_agent_Playwright' pelo nome EXATO do seu repositório

  // Inclui o plugin oficial do Tailwind CSS v4 para processar @import "tailwindcss"
  // e recursos como @theme, @utility e variantes.
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})