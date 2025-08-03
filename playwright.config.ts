import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Configuração do Playwright para a PoC de Auto-Correção de Testes
 * 
 * Esta configuração é otimizada para demonstrar o sistema de auto-correção
 * de seletores quebrados usando LangGraph e agentes autônomos.
 */
export default defineConfig({
  // Diretório onde estão localizados os testes
  testDir: './tests',
  
  // Executar testes em paralelo
  fullyParallel: false, // Desabilitado para melhor debugging da PoC
  
  // Falhar o build se houver testes sem retry
  forbidOnly: !!process.env.CI,
  
  // Número de tentativas em caso de falha
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers (processos paralelos)
  workers: process.env.CI ? 1 : 1, // Apenas 1 worker para melhor debugging
  
  // Configuração de relatórios
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'] // Relatório em linha de comando
  ],
  
  // Configurações globais para todos os testes
  use: {
    // URL base da aplicação
    baseURL: 'http://localhost:5173',
    
    // Timeout para ações individuais (30 segundos)
    actionTimeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000'),
    
    // Timeout para navegação
    navigationTimeout: 30000,
    
    // Capturar screenshots em caso de falha
    screenshot: 'only-on-failure',
    
    // Capturar vídeo em caso de falha
    video: 'retain-on-failure',
    
    // Capturar trace em caso de falha (útil para debugging)
    trace: 'retain-on-failure',
    
    // Modo headless (forçado para true no ambiente sandbox)
    headless: true, // Alterado para permitir visualização em tempo real

    // Viewport padrão
    viewport: { width: 1280, height: 720 },
    
    // Ignorar erros de HTTPS
    ignoreHTTPSErrors: true,
  },

  // Configuração de projetos (diferentes navegadores/dispositivos)
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Configurações específicas para o Chrome
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox'
          ]
        }
      },
    },
    
    // Descomentei os outros navegadores para focar na PoC
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Configuração do servidor de desenvolvimento
  webServer: {
    command: 'cd sample-react-app && pnpm run dev --host',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutos para iniciar o servidor
  },

  // Diretório de saída para artifacts
  outputDir: 'test-results/artifacts',
  
  // Configurações globais de timeout
  globalTimeout: 300000, // 5 minutos para toda a suíte de testes
  timeout: 60000, // 1 minuto por teste individual
  
  // Configurações de expect
  expect: {
    // Timeout para assertions
    timeout: 10000,
    // Para threshold de screenshots, configure em cada chamada de expect(page).toHaveScreenshot({ threshold: ... })
  },
});

