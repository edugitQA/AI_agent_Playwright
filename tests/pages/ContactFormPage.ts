        // File: tests/pages/ContactFormPage.ts

import { type Page } from '@playwright/test';
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

export class ContactFormPage {
    private runner: typeof SelfHealingTestRunner.prototype;

    // Mapeamento dos seletores da página de contato
    private selectors = {
        nameInput: '[data-testid="contact-name"]',
        emailInput: '[data-testid="contact-email"]',
        phoneInput: '[data-testid="contact-phone"]',
        subjectSelect: '[data-testid="contact-subject"]',
        departmentSelect: '[data-testid="contact-department"]',
        messageTextarea: '[data-testid="contact-message"]',
        priorityLow: '[data-testid="priority-low"]',
        priorityMedium: '[data-testid="priority-medium"]',
        priorityHigh: '[data-testid="priority-high"]',
        contactMethodEmail: '[data-testid="contact-method-email"]',
        contactMethodPhone: '[data-testid="contact-method-phone"]',
        submitButton: '[data-testid="contact-submit-button"]',
        backToDashboardButton: '[data-testid="back-to-dashboard-button"]',
        successMessage: '[data-testid="contact-success"]',
        nameError: '[data-testid="name-error"]',
        emailError: '[data-testid="email-error"]',
        phoneError: '[data-testid="phone-error"]',
        subjectError: '[data-testid="subject-error"]',
        departmentError: '[data-testid="department-error"]',
        messageError: '[data-testid="message-error"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner(page);
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // Navegar para a página de contato
    async navigateToContact() {
        try {
            // Assumindo que já estamos logados e no dashboard
            await this.page.click('[data-testid="view-reports-button"]');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`❌ Erro ao navegar para contato: ${error}`);
            throw error;
        }
    }

    // Preencher nome
    async fillName(name: string) {
        try {
            await this.page.locator(this.selectors.nameInput).fill(name);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'nameInput',
                this.selectors.nameInput,
                'Campo de texto para nome no formulário de contato com label "Seu nome completo"'
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
                'Campo de texto para email no formulário de contato com label "seu@email.com"'
            );
            if (healedSelector) {
                this.updateSelector('emailInput', healedSelector);
                await this.page.locator(this.selectors.emailInput).fill(email);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo email');
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
                'Campo de texto para telefone no formulário de contato com label "Telefone" e placeholder que aceita formatação (11) 99999-9999'
            );
            if (healedSelector) {
                this.updateSelector('phoneInput', healedSelector);
                await this.page.locator(this.selectors.phoneInput).fill(phone);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo telefone');
            }
        }
    }

    // Selecionar assunto
    async selectSubject(subject: string) {
        try {
            await this.page.locator(this.selectors.subjectSelect).click();
            await this.page.locator(`[data-testid="subject-${subject.toLowerCase().replace(/\s+/g, '-')}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'subjectSelect',
                this.selectors.subjectSelect,
                'Seletor dropdown para escolher assunto da mensagem com opções como Dúvida sobre produto, problema técnico, etc.'
            );
            if (healedSelector) {
                this.updateSelector('subjectSelect', healedSelector);
                await this.page.locator(this.selectors.subjectSelect).click();
                await this.page.locator(`[data-testid="subject-${subject.toLowerCase().replace(/\s+/g, '-')}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para seleção de assunto');
            }
        }
    }

    // Selecionar departamento
    async selectDepartment(department: string) {
        try {
            await this.page.locator(this.selectors.departmentSelect).click();
            await this.page.locator(`[data-testid="department-${department.toLowerCase().replace(/\s+/g, '-')}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'departmentSelect',
                this.selectors.departmentSelect,
                'Dropdown para assunto da mensagem localizado abaixo do campo de telefone, com label "selecione o departamento" e que contém opções como "Suporte Técnico" e "Vendas'
            );
            if (healedSelector) {
                this.updateSelector('departmentSelect', healedSelector);
                await this.page.locator(this.selectors.departmentSelect).click();
                await this.page.locator(`[data-testid="department-${department.toLowerCase().replace(/\s+/g, '-')}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para seleção de departamento');
            }
        }
    }

    // Preencher mensagem
    async fillMessage(message: string) {
        try {
            await this.page.locator(this.selectors.messageTextarea).fill(message);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'messageTextarea',
                this.selectors.messageTextarea,
                'Área de texto para escrever a mensagem de contato com placeholder "Descreva detalhadamente sua solicitação..."'
            );
            if (healedSelector) {
                this.updateSelector('messageTextarea', healedSelector);
                await this.page.locator(this.selectors.messageTextarea).fill(message);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para o campo mensagem');
            }
        }
    }

    // Selecionar prioridade
    async selectPriority(priority: 'low' | 'medium' | 'high') {
        try {
            const prioritySelector = this.selectors[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}` as keyof typeof this.selectors];
            await this.page.locator(prioritySelector).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                `priority${priority.charAt(0).toUpperCase() + priority.slice(1)}` as keyof typeof this.selectors,
                this.selectors[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}` as keyof typeof this.selectors],
                `Radio button para prioridade ${priority} no formulário de contato`
            );
            if (healedSelector) {
                this.updateSelector(`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}` as keyof typeof this.selectors, healedSelector);
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para prioridade ${priority}`);
            }
        }
    }

    // Selecionar método de contato preferido
    async selectContactMethod(method: 'email' | 'phone') {
        try {
            const methodSelector = this.selectors[`contactMethod${method.charAt(0).toUpperCase() + method.slice(1)}` as keyof typeof this.selectors];
            await this.page.locator(methodSelector).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                `contactMethod${method.charAt(0).toUpperCase() + method.slice(1)}` as keyof typeof this.selectors,
                this.selectors[`contactMethod${method.charAt(0).toUpperCase() + method.slice(1)}` as keyof typeof this.selectors],
                `Radio button para método de contato preferido ${method}`
            );
            if (healedSelector) {
                this.updateSelector(`contactMethod${method.charAt(0).toUpperCase() + method.slice(1)}` as keyof typeof this.selectors, healedSelector);
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para método de contato ${method}`);
            }
        }
    }

    // Enviar formulário
    async submitForm() {
        try {
            await this.page.locator(this.selectors.submitButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'submitButton',
                this.selectors.submitButton,
                'Botão principal para enviar o formulário de contato com texto "Enviar Mensagem"'
            );
            if (healedSelector) {
                this.updateSelector('submitButton', healedSelector);
                await this.page.locator(this.selectors.submitButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão de envio');
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

    // Verificar mensagem de sucesso
    async verifySuccessMessage(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.successMessage).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Verificar erro específico do campo
    async verifyFieldError(field: 'name' | 'email' | 'phone' | 'subject' | 'department' | 'message'): Promise<boolean> {
        try {
            const errorSelector = this.selectors[`${field}Error` as keyof typeof this.selectors];
            return await this.page.locator(errorSelector).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Obter texto de mensagem de erro específica
    async getFieldErrorText(field: 'name' | 'email' | 'phone' | 'subject' | 'department' | 'message'): Promise<string | null> {
        try {
            const errorSelector = this.selectors[`${field}Error` as keyof typeof this.selectors];
            return await this.page.locator(errorSelector).textContent();
        } catch (error) {
            console.log(` Erro ao obter texto de erro para o campo ${field}: ${error}`);
            return null;
        }
    }

    // Obter valor atual do campo telefone
    async getPhoneValue(): Promise<string> {
        try {
            return await this.page.locator(this.selectors.phoneInput).inputValue();
        } catch (error) {
            console.log(` Erro ao obter valor do campo telefone: ${error}`);
            return '';
        }
    }

    // Obter seletor atual
    getSelector(selectorName: keyof typeof this.selectors): string {
        return this.selectors[selectorName];
    }
}
