import { test, expect, Page } from '@playwright/test';
import { time } from 'console';
const { SelfHealingTestRunner } = require('../agent/self_healing_runner.js');

/**
 * PoC: Sistema de Automação de Testes com Auto-Correção de Seletores
 * 
 * Este arquivo demonstra um teste Playwright que inclui intencionalmente
 * um seletor quebrado para validar o sistema de auto-recuperação usando
 * LangGraph e agentes autônomos.
 * 
 * Fluxo do teste:
 * 1. Navegar para a aplicação React
 * 2. Tentar fazer login usando seletores que podem estar quebrados
 * 3. Se um seletor falhar, acionar o agente LangGraph
 * 4. O agente analisa o DOM e sugere novos seletores
 * 5. O teste é reexecutado com os seletores corrigidos
 */ 

class LoginTestPage {
  constructor(private page: Page) {}

  // Seletores originais (alguns intencionalmente quebrados para demonstrar a auto-correção)
  private selectors = {
    // Seletor correto para o campo de usuário
    usernameInput: '[data-testid="username-input"]',
    
    // Seletor intencionalmente quebrado para o campo de senha
    // (simulando uma mudança no DOM que quebrou o teste)
    passwordInput: '[data-testid="password-field-old"]', // Este seletor não existe!
    
    // Seletor correto para o botão de login
    loginButton: '[data-testid="login-button"]',
    
    // Seletor intencionalmente quebrado para o botão do dashboard
    // (simulando uma mudança de nomenclatura)
    dashboardButton: '[data-testid="go-to-dashboard"]', // Este seletor não existe!
    
    // Seletor correto para mensagem de erro
    errorMessage: '[data-testid="error-message"]'
  };

  /**
   * Navega para a página de login
   */
  async navigateToLogin() {
    await this.page.goto('http://localhost:5173');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Preenche o campo de usuário
   * @param username - Nome do usuário
   */
  async fillUsername(username: string) {
    try {
      await this.page.fill(this.selectors.usernameInput, username);
      console.log(`✅ Campo de usuário preenchido com: ${username}`);
    } catch (error) {
      console.error(`❌ Erro ao preencher campo de usuário: ${error}`);
      throw error;
    }
  }

  /**
   * Preenche o campo de senha (com seletor intencionalmente quebrado)
   * @param password - Senha do usuário
   */
  async fillPassword(password: string) {
    try {
      // Este seletor está intencionalmente quebrado para demonstrar a auto-correção
      await this.page.fill(this.selectors.passwordInput, password);
      console.log(`✅ Campo de senha preenchido`);
    } catch (error) {
      console.error(`❌ Erro ao preencher campo de senha: ${error}`);
      throw error;
    }
  }

  /**
   * Clica no botão de login
   */
  async clickLoginButton() {
    try {
      await this.page.click(this.selectors.loginButton);
      console.log(`✅ Botão de login clicado`);
    } catch (error) {
      console.error(`❌ Erro ao clicar no botão de login: ${error}`);
      throw error;
    }
  }

  /**
   * Clica no botão para ir ao dashboard (com seletor intencionalmente quebrado)
   */
  async clickDashboardButton() {
    try {
      // Este seletor está intencionalmente quebrado para demonstrar a auto-correção
      await this.page.click(this.selectors.dashboardButton, {timeout: 5000});
      console.log(`✅ Botão do dashboard clicado`);
    } catch (error) {
      console.error(`❌ Erro ao clicar no botão do dashboard: ${error}`);
      throw error;
    }
  }

  /**
   * Verifica se o login foi bem-sucedido
   */
  async verifyLoginSuccess() {
    try {
      await expect(this.page.locator('text=Login Realizado com Sucesso!')).toBeVisible();
      console.log(`✅ Login realizado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro na verificação do login: ${error}`);
      throw error;
    }
  }

  /**
   * Verifica se o dashboard está visível
   */
  async verifyDashboardVisible() {
    try {
      await expect(this.page.locator('text=Dashboard do Usuário')).toBeVisible();
      console.log(`✅ Dashboard está visível`);
    } catch (error) {
      console.error(`❌ Erro na verificação do dashboard: ${error}`);
      throw error;
    }
  }

  /**
   * Atualiza um seletor específico (usado pelo sistema de auto-correção)
   * @param selectorName - Nome do seletor a ser atualizado
   * @param newSelector - Novo seletor a ser usado
   */
  updateSelector(selectorName: keyof typeof this.selectors, newSelector: string) {
    const oldSelector = this.selectors[selectorName];
    this.selectors[selectorName] = newSelector;
    console.log(`🔧 Seletor atualizado: ${selectorName}`);
    console.log(`   Antigo: ${oldSelector}`);
    console.log(`   Novo: ${newSelector}`);
  }

  /**
   * Obtém o seletor atual para um elemento específico
   * @param selectorName - Nome do seletor
   * @returns O seletor atual
   */
  getSelector(selectorName: keyof typeof this.selectors): string {
    return this.selectors[selectorName];
  }
}

test.describe('Sistema de Login com Auto-Correção', () => {
  let loginPage: LoginTestPage;
  let selfHealingRunner: typeof SelfHealingTestRunner.prototype;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginTestPage(page);
    selfHealingRunner = new SelfHealingTestRunner(page);
  });

 // No arquivo tests/login.spec.ts

test('Deve fazer login com sucesso e navegar para o dashboard', async ({ page }) => {
    console.log('🚀 Iniciando teste de login com sistema de auto-correção...');
    
    // Passo 1: Navegar para a página de login
    await loginPage.navigateToLogin();
    
    // Passo 2: Preencher credenciais de login
    await loginPage.fillUsername('admin');
    
    // Passo 3: Tentar preencher a senha (com auto-correção)
    try {
      await loginPage.fillPassword('password123');
    } catch (error) {
      console.log('🔧 Seletor quebrado detectado! Acionando sistema de auto-correção...');
      const correctedSelector = await selfHealingRunner.healBrokenSelector(
        'passwordInput',
        loginPage.getSelector('passwordInput'),
        'input field for password with placeholder "Digite sua senha"'
      );
      if (correctedSelector) {
        loginPage.updateSelector('passwordInput', correctedSelector);
        await loginPage.fillPassword('password123');
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo de senha');
      }
    }
    
    // Passo 4: Clicar no botão de login
    await loginPage.clickLoginButton();
    
    // Passo 5: Verificar se a tela de sucesso do login está visível
    await loginPage.verifyLoginSuccess();
    
    // Passo 6: Tentar clicar no botão PARA IR AO DASHBOARD (com seletor quebrado e auto-correção)
    try {
      // Esta chamada já tem o timeout curto que adicionamos antes, o que é ótimo.
      await loginPage.clickDashboardButton(); 
    } catch (error) {
      console.log('🔧 Seletor quebrado detectado! Acionando sistema de auto-correção...');
      
      const correctedSelector = await selfHealingRunner.healBrokenSelector(
        'dashboardButton',
        loginPage.getSelector('dashboardButton'),
        'button with text "Ir para o Dashboard"'
      );
      
      if (correctedSelector) {
        loginPage.updateSelector('dashboardButton', correctedSelector);
        await loginPage.clickDashboardButton(); // Tenta novamente com o seletor corrigido
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o botão do dashboard');
      }
    }

    // Passo 7: com a navegação feita, verificar se o dashboard está visível
    await loginPage.verifyDashboardVisible();
    
    console.log('✅ Teste concluído com sucesso! Sistema de auto-correção funcionou perfeitamente.');
  });
  
  test('Deve exibir mensagem de erro para credenciais inválidas', async ({ page }) => {
    console.log('🚀 Iniciando teste de credenciais inválidas...');
    
    // Navegar para a página de login
    await loginPage.navigateToLogin();
    
    // Preencher credenciais inválidas
    await loginPage.fillUsername('usuario_invalido');
    
    // Tentar preencher a senha (pode acionar auto-correção se o seletor estiver quebrado)
    try {
      await loginPage.fillPassword('senha_invalida');
    } catch (error) {
      console.log('🔧 Seletor quebrado detectado! Acionando sistema de auto-correção...');
      
      const correctedSelector = await selfHealingRunner.healBrokenSelector(
        'passwordInput',
        loginPage.getSelector('passwordInput'),
        'input field for password with placeholder "Digite sua senha"'
      );
      
      if (correctedSelector) {
        loginPage.updateSelector('passwordInput', correctedSelector);
        await loginPage.fillPassword('senha_invalida');
      }
    }
    
    // Clicar no botão de login
    await loginPage.clickLoginButton();
    
    // Verificar se a mensagem de erro é exibida
    await expect(page.locator(loginPage.getSelector('errorMessage'))).toBeVisible();
    
    console.log('✅ Teste de credenciais inválidas concluído com sucesso!');
  });
});

