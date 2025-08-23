// File: tests/pages/LoginPage.ts

import { type Page } from '@playwright/test';
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

export class LoginPage {
    private runner: typeof SelfHealingTestRunner.prototype;

    // Mapeamento dos seletores da página de login
    // Alguns seletores estão intencionalmente quebrados para demonstrar auto-correção
    private selectors = {
        usernameInput: '[data-testid="username-input"]', // Seletor quebrado implementado posteriormente!
        passwordInput: '[data-testid="password-input"]', // Seletor quebrado!
        loginButton: '[data-testid="login-button"]',
        dashboardButton: '[data-testid="dashboard-button"]',
        errorMessage: '[data-testid="error-message"]',
        registerButton: '[data-testid="register-button"]',
        successMessage: 'text=Login Realizado com Sucesso!',
        dashboardTitle: 'text=Dashboard do Usuário',
        backButtonLogin: '[data-testid="back-to-login-button"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner(page);
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // Navegar para a página de login
    async navigateToLogin() {
        try {
            await this.page.goto('http://localhost:5173');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`❌ Erro ao navegar para login: ${error}`);
            throw error;
        }
    }

    // Preencher campo de usuário
    async fillUsername(username: string) {
        try {
            await this.page.locator(this.selectors.usernameInput).fill(username);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'usernameInput',
                this.selectors.usernameInput,
                'Campo de texto para nome de usuário com placeholder "Digite seu usuário" e ícone de usuário na lateral esquerda'
            );
            if (healedSelector) {
                this.updateSelector('usernameInput', healedSelector);
                await this.page.locator(this.selectors.usernameInput).fill(username);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo de usuário');
            }
        }
    }

    // Preencher campo de senha (com seletor intencionalmente quebrado)
    async fillPassword(password: string) {
        try {
            await this.page.locator(this.selectors.passwordInput).fill(password);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'passwordInput',
                this.selectors.passwordInput,
                'Campo de senha com placeholder "Digite sua senha" e ícone de cadeado na lateral esquerda, tipo input password'
            );
            if (healedSelector) {
                this.updateSelector('passwordInput', healedSelector);
                await this.page.locator(this.selectors.passwordInput).fill(password);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo de senha');
            }
        }
    }

    // Clicar no botão de login
    async clickLoginButton() {
        try {
            await this.page.locator(this.selectors.loginButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'loginButton',
                this.selectors.loginButton,
                'Botão principal de login com texto "Entrar" que fica abaixo dos campos de usuário e senha'
            );
            if (healedSelector) {
                this.updateSelector('loginButton', healedSelector);
                await this.page.locator(this.selectors.loginButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão de login');
            }
        }
    }

    // Clicar no botão de registro
    async clickRegisterButton() {
        try {
            await this.page.locator(this.selectors.registerButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'registerButton',
                this.selectors.registerButton,
                'Botão secundário para criar nova conta com texto "Criar Nova Conta" e ícone de usuário plus'
            );
            if (healedSelector) {
                this.updateSelector('registerButton', healedSelector);
                await this.page.locator(this.selectors.registerButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão de registro');
            }
        }
    }

    // Verificar se login foi bem-sucedido
    async verifyLoginSuccess() {
        // Este método agora espera explicitamente pela mensagem de sucesso.
        const successLocator = this.page.locator(this.selectors.successMessage);
        try {
            await successLocator.waitFor({ state: 'visible', timeout: 15000 });
            return true;
        } catch (error) {
            console.error(`❌ Mensagem de sucesso do login não encontrada: ${error}`);
            return false;
        }
    }

    // Clicar no botão do dashboard (com seletor intencionalmente quebrado)
    async clickDashboardButton() {
        try {
            await this.verifyLoginSuccess();
            await this.page.locator(this.selectors.dashboardButton).click();
        } catch (error) {
            console.log('🔧 Seletor do botão do dashboard quebrou. Acionando agente...');
            const healedSelector = await this.runner.healBrokenSelector(
                'dashboardButton',
                this.selectors.dashboardButton,
                'Botão para ir ao dashboard com texto "Ir para o Dashboard" que aparece na tela de sucesso do login'
            );
            if (healedSelector) {
                this.updateSelector('dashboardButton', healedSelector);
                await this.page.locator(this.selectors.dashboardButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar o botão do dashboard.');
            }
        }
    }

    // Verificar se dashboard está visível
    async verifyDashboardVisible() {
        const dashboardLocator = this.page.locator(this.selectors.dashboardTitle);
        try {
            // Aumentamos o timeout aqui para dar tempo para a navegação ocorrer.
            await dashboardLocator.waitFor({ state: 'visible', timeout: 30000 });
            return true;
        } catch (error) {
            console.error(`❌ Título do dashboard não encontrado: ${error}`);
            return false;
        }
    }

    // Verificar se mensagem de erro está visível
    async verifyErrorMessage() {
        try {
            return await this.page.locator(this.selectors.errorMessage).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Obter seletor atual
    getSelector(selectorName: keyof typeof this.selectors): string {
        return this.selectors[selectorName];
    }
}
