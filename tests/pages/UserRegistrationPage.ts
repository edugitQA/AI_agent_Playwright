// File: tests/pages/UserRegistrationPage.ts

import { type Page } from '@playwright/test';
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

export class UserRegistrationPage {
    private runner: typeof SelfHealingTestRunner.prototype;

    // Mapeamento dos seletores da página de registro
    private selectors = {
        nameInput: '[data-testid="user-name"]',
        emailInput: '[data-testid="user-email"]',
        passwordInput: '[data-testid="user-password"]',
        confirmPasswordInput: '[data-testid="confirm-password"]',
        phoneInput: '[data-testid="user-phone"]',
        countrySelect: '[data-testid="user-country"]',
        dateOfBirthInput: '[data-testid="date-of-birth"]',
        genderSelect: '[data-testid="user-gender"]',
        termsCheckbox: '[data-testid="terms-checkbox"]',
        newsletterCheckbox: '[data-testid="newsletter-checkbox"]',
        submitButton: '[data-testid="register-submit"]',
        backToLoginButton: '[data-testid="back-to-login"]',
        successMessage: '[data-testid="registration-success"]',
        errorMessage: '[data-testid="registration-error"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner(page);
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // Navegar para a página de registro
    async navigateToRegistration() {
        try {
            await this.page.goto('http://localhost:5173');
            await this.page.click('[data-testid="register-button"]');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`❌ Erro ao navegar para registro: ${error}`);
            throw error;
        }
    }

    // Preencher nome do usuário
    async fillName(name: string) {
        try {
            await this.page.locator(this.selectors.nameInput).fill(name);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'nameInput',
                this.selectors.nameInput,
                'Campo de texto para o nome completo do usuário, com label "Nome Completo" e placeholder "Digite seu nome completo"'
            );
            if (healedSelector) {
                this.updateSelector('nameInput', healedSelector);
                await this.page.locator(this.selectors.nameInput).fill(name);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo nome');
            }
        }
    }

    // Preencher email
    async fillEmail(email: string) {
        try {
            await this.page.locator(this.selectors.emailInput).fill(email);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'emailInput',
                this.selectors.emailInput,
                'Campo de texto para email com label "Email" e placeholder "Digite seu email"'
            );
            if (healedSelector) {
                this.updateSelector('emailInput', healedSelector);
                await this.page.locator(this.selectors.emailInput).fill(email);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo email');
            }
        }
    }

    // Preencher senha
    async fillPassword(password: string) {
        try {
            await this.page.locator(this.selectors.passwordInput).fill(password);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'passwordInput',
                this.selectors.passwordInput,
                'Campo de senha com label "Senha" e placeholder "Digite uma senha forte"'
            );
            if (healedSelector) {
                this.updateSelector('passwordInput', healedSelector);
                await this.page.locator(this.selectors.passwordInput).fill(password);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo senha');
            }
        }
    }

    // Confirmar senha
    async fillConfirmPassword(password: string) {
        try {
            await this.page.locator(this.selectors.confirmPasswordInput).fill(password);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'confirmPasswordInput',
                this.selectors.confirmPasswordInput,
                'Campo de confirmação de senha com label "Confirmar Senha" e placeholder "Digite a senha novamente"'
            );
            if (healedSelector) {
                this.updateSelector('confirmPasswordInput', healedSelector);
                await this.page.locator(this.selectors.confirmPasswordInput).fill(password);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para confirmação de senha');
            }
        }
    }

    // Preencher telefone
    async fillPhone(phone: string) {
        try {
            await this.page.locator(this.selectors.phoneInput).fill(phone);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'phoneInput',
                this.selectors.phoneInput,
                'Campo de telefone com label "Telefone" e placeholder "Digite seu telefone"'
            );
            if (healedSelector) {
                this.updateSelector('phoneInput', healedSelector);
                await this.page.locator(this.selectors.phoneInput).fill(phone);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo telefone');
            }
        }
    }

    // Selecionar país
    async selectCountry(country: string) {
        try {
            await this.page.locator(this.selectors.countrySelect).click();
            await this.page.locator(`[data-testid="country-${country.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'countrySelect',
                this.selectors.countrySelect,
                'Seletor dropdown para escolher país com label "País"'
            );
            if (healedSelector) {
                this.updateSelector('countrySelect', healedSelector);
                await this.page.locator(this.selectors.countrySelect).click();
                await this.page.locator(`[data-testid="country-${country.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para seleção de país');
            }
        }
    }

    // Preencher data de nascimento
    async fillDateOfBirth(date: string) {
        try {
            await this.page.locator(this.selectors.dateOfBirthInput).fill(date);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'dateOfBirthInput',
                this.selectors.dateOfBirthInput,
                'Campo de data para data de nascimento com label "Data de Nascimento"'
            );
            if (healedSelector) {
                this.updateSelector('dateOfBirthInput', healedSelector);
                await this.page.locator(this.selectors.dateOfBirthInput).fill(date);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para data de nascimento');
            }
        }
    }

    // Selecionar gênero
    async selectGender(gender: string) {
        try {
            await this.page.locator(this.selectors.genderSelect).click();
            await this.page.locator(`[data-testid="gender-${gender.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'genderSelect',
                this.selectors.genderSelect,
                'Seletor dropdown para escolher gênero com label "Gênero"'
            );
            if (healedSelector) {
                this.updateSelector('genderSelect', healedSelector);
                await this.page.locator(this.selectors.genderSelect).click();
                await this.page.locator(`[data-testid="gender-${gender.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para seleção de gênero');
            }
        }
    }

    // Aceitar termos de uso
    async acceptTerms() {
        try {
            await this.page.locator(this.selectors.termsCheckbox).check();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'termsCheckbox',
                this.selectors.termsCheckbox,
                'Checkbox para aceitar termos de uso com label "Aceito os termos de uso"'
            );
            if (healedSelector) {
                this.updateSelector('termsCheckbox', healedSelector);
                await this.page.locator(this.selectors.termsCheckbox).check();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para checkbox de termos');
            }
        }
    }

    // Aceitar newsletter (opcional)
    async acceptNewsletter() {
        try {
            await this.page.locator(this.selectors.newsletterCheckbox).check();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'newsletterCheckbox',
                this.selectors.newsletterCheckbox,
                'Checkbox opcional para aceitar newsletter com label "Quero receber newsletter"'
            );
            if (healedSelector) {
                this.updateSelector('newsletterCheckbox', healedSelector);
                await this.page.locator(this.selectors.newsletterCheckbox).check();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para checkbox de newsletter');
            }
        }
    }

    // Clicar no botão de submissão
    async clickSubmit() {
        try {
            await this.page.locator(this.selectors.submitButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'submitButton',
                this.selectors.submitButton,
                'Botão principal para finalizar registro com texto "Cadastrar"'
            );
            if (healedSelector) {
                this.updateSelector('submitButton', healedSelector);
                await this.page.locator(this.selectors.submitButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão de submit');
            }
        }
    }

    // Voltar para o login
    async clickBackToLogin() {
        try {
            await this.page.locator(this.selectors.backToLoginButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'backToLoginButton',
                this.selectors.backToLoginButton,
                'Botão para voltar ao login com texto "Voltar ao Login"'
            );
            if (healedSelector) {
                this.updateSelector('backToLoginButton', healedSelector);
                await this.page.locator(this.selectors.backToLoginButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão voltar');
            }
        }
    }

    // Verificar se mensagem de sucesso está visível
    async verifySuccessMessage() {
        return this.page.locator(this.selectors.successMessage).isVisible();
    }

    // Verificar se mensagem de erro está visível
    async verifyErrorMessage() {
        return this.page.locator(this.selectors.errorMessage).isVisible();
    }

    // Obter seletor atual
    getSelector(selectorName: keyof typeof this.selectors): string {
        return this.selectors[selectorName];
    }
}
