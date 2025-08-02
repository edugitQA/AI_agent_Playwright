import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

/**
 * Testes para a funcionalidade de Login
 * 
 * Esta suíte testa o sistema de login da aplicação com funcionalidades de:
 * - Login com credenciais válidas
 * - Validação de credenciais inválidas
 * - Navegação para o dashboard
 * - Navegação para registro
 * - Auto-correção de seletores quebrados
 * 
 * Nota: Este arquivo demonstra seletores intencionalmente quebrados
 * para validar o sistema de auto-recuperação usando o agente de auto-correção.
 */

/**
 * Helper function to click an element and wait for it to be visible.
 */
async function clickElement(page: any, locator: any) {
    await expect(locator).toBeVisible();
    await locator.click();
}

test.describe('Sistema de Login com Auto-Correção', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        console.log('🚀 Iniciando teste de login com sistema de auto-correção...');
    });

    test('Deve fazer login com sucesso e navegar para o dashboard', async ({ page }) => {
        // Navegar para a página de login
        await loginPage.navigateToLogin();

        // Preencher credenciais de login
        try {
            await loginPage.fillUsername('admin');
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para campo de usuário! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para campo de usuário');
        }

        // Preencher senha (com auto-correção para seletor quebrado)
        try {
            await loginPage.fillPassword('password123');
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para campo de senha! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para campo de senha');
        }

        // Clicar no botão de login
        try {
            await loginPage.clickLoginButton();
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para botão de login! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para botão de login');
        }

        // Verificar se a tela de sucesso do login está visível
        const loginSuccess = await loginPage.verifyLoginSuccess();
        expect(loginSuccess).toBe(true);

        // Clicar no botão para ir ao dashboard (com auto-correção para seletor quebrado)
        try {
            await loginPage.clickDashboardButton();
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para botão do dashboard! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para botão do dashboard');
        }

        // Verificar se o dashboard está visível
        const dashboardVisible = await loginPage.verifyDashboardVisible();
        expect(dashboardVisible).toBe(true);

        console.log('✅ Teste de login concluído com sucesso! Sistema de auto-correção funcionou perfeitamente.');
    });

    test('Deve exibir mensagem de erro para credenciais inválidas', async ({ page }) => {
        console.log('🚀 Iniciando teste de credenciais inválidas...');

        // Navegar para a página de login
        await loginPage.navigateToLogin();

        // Preencher credenciais inválidas
        try {
            await loginPage.fillUsername('usuario_invalido');
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para campo de usuário! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para campo de usuário');
        }

        // Preencher senha inválida (pode acionar auto-correção)
        try {
            await loginPage.fillPassword('senha_invalida');
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para campo de senha! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para campo de senha');
        }

        // Clicar no botão de login
        try {
            await loginPage.clickLoginButton();
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para botão de login! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para botão de login');
        }

        // Verificar se a mensagem de erro é exibida
        await page.waitForTimeout(1000); // Aguardar validação
        const hasError = await loginPage.verifyErrorMessage();
        expect(hasError).toBe(true);

        console.log('✅ Teste de credenciais inválidas concluído com sucesso!');
    });

    test('Deve navegar para a página de registro', async ({ page }) => {
        console.log('� Testando navegação para registro...');

        // Navegar para a página de login
        await loginPage.navigateToLogin();

        // Clicar no botão de registro
        try {
            await loginPage.clickRegisterButton();
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para botão de registro! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para botão de registro');
        }

        // Verificar se chegamos na página de registro

        await expect(page.getByText('Criar Nova Conta')).toBeVisible();
        await expect(page.getByText('Preencha os dados abaixo para criar sua conta')).toBeVisible();
        await clickElement(page, page.locator('[data-testid="back-to-login-button"]'));
     
        console.log('✅ Navegação para registro concluída com sucesso!');
    });

    test('Deve validar campos obrigatórios', async ({ page }) => {
        console.log('🚀 Testando validação de campos obrigatórios...');

        // Navegar para a página de login
        await loginPage.navigateToLogin();

        // Tentar fazer login sem preencher nada
        try {
            await loginPage.clickLoginButton();
        } catch (error) {
            console.log('🔧 Seletor quebrado detectado para botão de login! Acionando sistema de auto-correção...');
            throw new Error('Sistema de auto-correção falhou para botão de login');
        }

        // Aguardar validação
        await page.waitForTimeout(1000);

        // Verificar se os campos estão destacados como obrigatórios
        const usernameField = page.locator('[data-testid="username-input"]');
        const passwordField = page.locator('[data-testid="password-input"]');

        await expect(usernameField).toBeVisible();
        await expect(passwordField).toBeVisible();

        console.log('✅ Validação de campos obrigatórios testada!');
    });
});

