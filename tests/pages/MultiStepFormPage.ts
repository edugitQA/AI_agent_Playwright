// File: tests/pages/MultiStepFormPage.ts

import { type Page } from '@playwright/test';
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

export class MultiStepFormPage {
    private runner: typeof SelfHealingTestRunner.prototype;

    // Mapeamento dos seletores da página de formulário multi-step
    private selectors = {
        // Navegação dos steps
        step1Tab: '[data-testid="step-1-tab"]',
        step2Tab: '[data-testid="step-2-tab"]',
        step3Tab: '[data-testid="step-3-tab"]',
        step4Tab: '[data-testid="step-4-tab"]',
        nextButton: '[data-testid="next-step"]',
        prevButton: '[data-testid="prev-step"]',
        submitButton: '[data-testid="submit-form"]',
        progressBar: '[data-testid="progress-bar"]',
        
        // Step 1 - Informações Pessoais
        personalName: '[data-testid="personal-name"]',
        personalEmail: '[data-testid="personal-email"]',
        personalPhone: '[data-testid="personal-phone"]',
        personalAge: '[data-testid="personal-age"]',
        
        // Step 2 - Endereço
        addressStreet: '[data-testid="address-street"]',
        addressNumber: '[data-testid="address-number"]',
        addressCity: '[data-testid="address-city"]',
        addressState: '[data-testid="address-state"]',
        addressZipcode: '[data-testid="address-zipcode"]',
        
        // Step 3 - Preferências
        notificationsEmail: '[data-testid="notifications-email"]',
        notificationsSms: '[data-testid="notifications-sms"]',
        notificationsPush: '[data-testid="notifications-push"]',
        languageSelect: '[data-testid="language-select"]',
        themeSelect: '[data-testid="theme-select"]',
        
        // Step 4 - Revisão
        reviewSection: '[data-testid="review-section"]',
        editPersonalButton: '[data-testid="edit-personal"]',
        editAddressButton: '[data-testid="edit-address"]',
        editPreferencesButton: '[data-testid="edit-preferences"]',
        
        // Mensagens e controles gerais
        backToDashboardButton: '[data-testid="back-to-dashboard"]',
        successMessage: '[data-testid="form-success"]',
        errorMessage: '[data-testid="form-error"]',
        fieldError: '[data-testid$="-error"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner(page);
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // Navegar para a página de formulário multi-step
    async navigateToMultiStepForm() {
        try {
            // Assumindo que já estamos logados e no dashboard
            await this.page.click('[data-testid="settings-button"]');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`❌ Erro ao navegar para formulário multi-step: ${error}`);
            throw error;
        }
    }

    // Navegar para um step específico
    async goToStep(stepNumber: 1 | 2 | 3 | 4) {
        try {
            await this.page.locator(this.selectors[`step${stepNumber}Tab` as keyof typeof this.selectors]).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                `step${stepNumber}Tab` as keyof typeof this.selectors,
                this.selectors[`step${stepNumber}Tab` as keyof typeof this.selectors],
                `Tab para navegar para o step ${stepNumber} do formulário multi-step`
            );
            if (healedSelector) {
                this.updateSelector(`step${stepNumber}Tab` as keyof typeof this.selectors, healedSelector);
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para step ${stepNumber}`);
            }
        }
    }

    // Clicar no botão próximo
    async clickNext() {
        try {
            await this.page.locator(this.selectors.nextButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'nextButton',
                this.selectors.nextButton,
                'Botão para avançar para próximo step com texto "Próximo"'
            );
            if (healedSelector) {
                this.updateSelector('nextButton', healedSelector);
                await this.page.locator(this.selectors.nextButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão próximo');
            }
        }
    }

    // Clicar no botão anterior
    async clickPrevious() {
        try {
            await this.page.locator(this.selectors.prevButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'prevButton',
                this.selectors.prevButton,
                'Botão para voltar para step anterior com texto "Anterior"'
            );
            if (healedSelector) {
                this.updateSelector('prevButton', healedSelector);
                await this.page.locator(this.selectors.prevButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão anterior');
            }
        }
    }

    // STEP 1 - Preencher informações pessoais
    async fillPersonalInfo(name: string, email: string, phone: string, age: string) {
        // Preencher nome
        try {
            await this.page.locator(this.selectors.personalName).fill(name);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'personalName',
                this.selectors.personalName,
                'Campo de texto para nome completo no step 1 - Informações Pessoais'
            );
            if (healedSelector) {
                this.updateSelector('personalName', healedSelector);
                await this.page.locator(this.selectors.personalName).fill(name);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo nome pessoal');
            }
        }

        // Preencher email
        try {
            await this.page.locator(this.selectors.personalEmail).fill(email);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'personalEmail',
                this.selectors.personalEmail,
                'Campo de texto para email no step 1 - Informações Pessoais'
            );
            if (healedSelector) {
                this.updateSelector('personalEmail', healedSelector);
                await this.page.locator(this.selectors.personalEmail).fill(email);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo email pessoal');
            }
        }

        // Preencher telefone
        try {
            await this.page.locator(this.selectors.personalPhone).fill(phone);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'personalPhone',
                this.selectors.personalPhone,
                'Campo de texto para telefone no step 1 - Informações Pessoais'
            );
            if (healedSelector) {
                this.updateSelector('personalPhone', healedSelector);
                await this.page.locator(this.selectors.personalPhone).fill(phone);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo telefone pessoal');
            }
        }

        // Preencher idade
        try {
            await this.page.locator(this.selectors.personalAge).fill(age);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'personalAge',
                this.selectors.personalAge,
                'Campo numérico para idade no step 1 - Informações Pessoais'
            );
            if (healedSelector) {
                this.updateSelector('personalAge', healedSelector);
                await this.page.locator(this.selectors.personalAge).fill(age);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo idade');
            }
        }
    }

    // STEP 2 - Preencher endereço
    async fillAddressInfo(street: string, number: string, city: string, state: string, zipcode: string) {
        // Preencher rua
        try {
            await this.page.locator(this.selectors.addressStreet).fill(street);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addressStreet',
                this.selectors.addressStreet,
                'Campo de texto para nome da rua no step 2 - Endereço'
            );
            if (healedSelector) {
                this.updateSelector('addressStreet', healedSelector);
                await this.page.locator(this.selectors.addressStreet).fill(street);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo rua');
            }
        }

        // Preencher número
        try {
            await this.page.locator(this.selectors.addressNumber).fill(number);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addressNumber',
                this.selectors.addressNumber,
                'Campo de texto para número da residência no step 2 - Endereço'
            );
            if (healedSelector) {
                this.updateSelector('addressNumber', healedSelector);
                await this.page.locator(this.selectors.addressNumber).fill(number);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo número');
            }
        }

        // Preencher cidade
        try {
            await this.page.locator(this.selectors.addressCity).fill(city);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addressCity',
                this.selectors.addressCity,
                'Campo de texto para cidade no step 2 - Endereço'
            );
            if (healedSelector) {
                this.updateSelector('addressCity', healedSelector);
                await this.page.locator(this.selectors.addressCity).fill(city);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo cidade');
            }
        }

        // Selecionar estado
        try {
            await this.page.locator(this.selectors.addressState).click();
            await this.page.locator(`[data-testid="state-${state.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addressState',
                this.selectors.addressState,
                'Seletor dropdown para escolher estado no step 2 - Endereço'
            );
            if (healedSelector) {
                this.updateSelector('addressState', healedSelector);
                await this.page.locator(this.selectors.addressState).click();
                await this.page.locator(`[data-testid="state-${state.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo estado');
            }
        }

        // Preencher CEP
        try {
            await this.page.locator(this.selectors.addressZipcode).fill(zipcode);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addressZipcode',
                this.selectors.addressZipcode,
                'Campo de texto para CEP no step 2 - Endereço'
            );
            if (healedSelector) {
                this.updateSelector('addressZipcode', healedSelector);
                await this.page.locator(this.selectors.addressZipcode).fill(zipcode);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo CEP');
            }
        }
    }

    // STEP 3 - Configurar preferências
    async configurePreferences(notifications: { email: boolean, sms: boolean, push: boolean }, language: string, theme: string) {
        // Configurar notificações por email
        try {
            if (notifications.email) {
                await this.page.locator(this.selectors.notificationsEmail).check();
            } else {
                await this.page.locator(this.selectors.notificationsEmail).uncheck();
            }
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'notificationsEmail',
                this.selectors.notificationsEmail,
                'Checkbox para ativar notificações por email no step 3 - Preferências'
            );
            if (healedSelector) {
                this.updateSelector('notificationsEmail', healedSelector);
                if (notifications.email) {
                    await this.page.locator(healedSelector).check();
                } else {
                    await this.page.locator(healedSelector).uncheck();
                }
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para notificações email');
            }
        }

        // Configurar notificações por SMS
        try {
            if (notifications.sms) {
                await this.page.locator(this.selectors.notificationsSms).check();
            } else {
                await this.page.locator(this.selectors.notificationsSms).uncheck();
            }
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'notificationsSms',
                this.selectors.notificationsSms,
                'Checkbox para ativar notificações por SMS no step 3 - Preferências'
            );
            if (healedSelector) {
                this.updateSelector('notificationsSms', healedSelector);
                if (notifications.sms) {
                    await this.page.locator(healedSelector).check();
                } else {
                    await this.page.locator(healedSelector).uncheck();
                }
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para notificações SMS');
            }
        }

        // Configurar notificações push
        try {
            if (notifications.push) {
                await this.page.locator(this.selectors.notificationsPush).check();
            } else {
                await this.page.locator(this.selectors.notificationsPush).uncheck();
            }
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'notificationsPush',
                this.selectors.notificationsPush,
                'Checkbox para ativar notificações push no step 3 - Preferências'
            );
            if (healedSelector) {
                this.updateSelector('notificationsPush', healedSelector);
                if (notifications.push) {
                    await this.page.locator(healedSelector).check();
                } else {
                    await this.page.locator(healedSelector).uncheck();
                }
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para notificações push');
            }
        }

        // Selecionar idioma
        try {
            await this.page.locator(this.selectors.languageSelect).click();
            await this.page.locator(`[data-testid="language-${language.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'languageSelect',
                this.selectors.languageSelect,
                'Seletor dropdown para escolher idioma preferido no step 3 - Preferências'
            );
            if (healedSelector) {
                this.updateSelector('languageSelect', healedSelector);
                await this.page.locator(healedSelector).click();
                await this.page.locator(`[data-testid="language-${language.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para seleção de idioma');
            }
        }

        // Selecionar tema
        try {
            await this.page.locator(this.selectors.themeSelect).click();
            await this.page.locator(`[data-testid="theme-${theme.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'themeSelect',
                this.selectors.themeSelect,
                'Seletor dropdown para escolher tema (claro/escuro) no step 3 - Preferências'
            );
            if (healedSelector) {
                this.updateSelector('themeSelect', healedSelector);
                await this.page.locator(healedSelector).click();
                await this.page.locator(`[data-testid="theme-${theme.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para seleção de tema');
            }
        }
    }

    // STEP 4 - Editar seção específica
    async editSection(section: 'personal' | 'address' | 'preferences') {
        try {
            const buttonSelector = this.selectors[`edit${section.charAt(0).toUpperCase() + section.slice(1)}Button` as keyof typeof this.selectors];
            await this.page.locator(buttonSelector).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                `edit${section.charAt(0).toUpperCase() + section.slice(1)}Button` as keyof typeof this.selectors,
                this.selectors[`edit${section.charAt(0).toUpperCase() + section.slice(1)}Button` as keyof typeof this.selectors],
                `Botão para editar seção ${section} no step 4 - Revisão`
            );
            if (healedSelector) {
                this.updateSelector(`edit${section.charAt(0).toUpperCase() + section.slice(1)}Button` as keyof typeof this.selectors, healedSelector);
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para editar seção ${section}`);
            }
        }
    }

    // Submeter formulário final
    async submitForm() {
        try {
            await this.page.locator(this.selectors.submitButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'submitButton',
                this.selectors.submitButton,
                'Botão final para submeter todo o formulário multi-step com texto "Enviar Formulário"'
            );
            if (healedSelector) {
                this.updateSelector('submitButton', healedSelector);
                await this.page.locator(this.selectors.submitButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão de submissão');
            }
        }
    }

    // Voltar ao dashboard
    async backToDashboard() {
        try {
            await this.page.locator(this.selectors.backToDashboardButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'backToDashboardButton',
                this.selectors.backToDashboardButton,
                'Botão para voltar ao dashboard com texto "Voltar ao Dashboard"'
            );
            if (healedSelector) {
                this.updateSelector('backToDashboardButton', healedSelector);
                await this.page.locator(this.selectors.backToDashboardButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para voltar ao dashboard');
            }
        }
    }

    // Verificar progresso do formulário
    async getProgressPercentage(): Promise<string> {
        try {
            const progressBar = this.page.locator(this.selectors.progressBar);
            return await progressBar.getAttribute('aria-valuenow') || '0';
        } catch (error) {
            return '0';
        }
    }

    // Verificar mensagem de sucesso
    async verifySuccessMessage(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.successMessage).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Verificar se seção de revisão está visível
    async isReviewSectionVisible(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.reviewSection).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Obter seletor atual
    getSelector(selectorName: keyof typeof this.selectors): string {
        return this.selectors[selectorName];
    }
}
