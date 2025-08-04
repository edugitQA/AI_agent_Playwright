import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Configuração do Playwright para a PoC de Auto-Correção de Testes
 * * Esta configuração é otimizada para ser executada em ambientes de CI/CD,
 * permitindo que o agente de IA tenha tempo suficiente para atuar.
 */
export default defineConfig({
  // Diretório onde os testes estão localizados
  testDir: './tests',

  // --- Configurações de Timeout ---
  // Timeout global para toda a suíte de testes (10 minutos)
  globalTimeout: 10 * 60 * 1000,
  // Timeout para cada teste individual (3 minutos).
  // Este valor é crucial para dar tempo ao agente de IA para fazer as correções.
  timeout: 3 * 60 * 1000,
  // Timeout para as asserções `expect()`
  expect: {
    timeout: 15000, // Aumentado para 15s para dar mais margem em CI
  },

  // --- Configurações de Execução e Paralelismo ---
  // Executar testes sequencialmente para garantir a estabilidade do agente em CI
  fullyParallel: false,
  workers: 1,

  // Não permite que testes com `.only` sejam commitados em CI
  forbidOnly: !!process.env.CI,

  // Número de tentativas para testes que falham em CI
  retries: process.env.CI ? 2 : 0,

  // --- Configuração de Relatórios ---
  reporter: [
    ['html', { outputFolder: 'playwright-report' }], // Relatório HTML padrão
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'] // Relatório no console
  ],

  // --- Configurações Globais (use) ---
  // Aplicadas a todos os projetos e testes
  use: {
    // URL base da aplicação
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Timeouts para ações e navegação
    actionTimeout: 30 * 1000, // 30 segundos por ação (ex: click)
    navigationTimeout: 45 * 1000, // 45 segundos por navegação

    // --- Configurações de Artefatos ---
    // Captura screenshots, vídeos e traces apenas na primeira tentativa de um teste que falha
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // --- Configurações do Navegador ---
    // Executa em modo headless (sem interface gráfica), ideal para CI
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  // --- Configuração de Projetos (Navegadores) ---
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Argumentos para garantir a execução em ambientes de container (como no GitHub Actions)
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox'
          ]
        }
      },
    },
    // Outros navegadores estão comentados para focar na PoC
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // --- Servidor de Desenvolvimento ---
  // O Playwright irá iniciar este comando antes de rodar os testes
  webServer: {
    command: 'pnpm --prefix sample-react-app dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 2 * 60 * 1000, // 2 minutos para o servidor iniciar
  },

  // Diretório de saída para artefatos como screenshots e vídeos
  outputDir: 'test-results/artifacts',
});
