import { type Page } from '@playwright/test';
// SelfHealingTestRunner é exportado em CommonJS; usar require para manter compatibilidade
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

/**
 * Page Object para a tela de cadastro.
 * Segue as 3 Regras de Ouro: Page Object, try/catch em ações e descrições ricas para heal.
 */
export class RegistrationPage {
  private runner: typeof SelfHealingTestRunner.prototype;

  // Seletores iniciais — prefira data-testid quando disponível
  private selectors = {
    firstName: '[data-testid="register-first-name"]',
    lastName: '[data-testid="register-last-name"]',
    email: '[data-testid="register-email"]',
    password: '[data-testid="register-password"]',
    confirmPassword: '[data-testid="register-confirm-password"]',
    dob: '[data-testid="register-dob"]',
    country: '[data-testid="register-country"]',
    acceptTerms: '[data-testid="register-accept"]',
    submitButton: '[data-testid="submit-registration-button"]',
    backToLogin: '[data-testid="back-to-login"]',
  } as const;

  constructor(private page: Page) {
    // passar a instância de page para o runner — mesmo padrão utilizado em LoginPage
    this.runner = new SelfHealingTestRunner(page);
  }

  private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
    // Atualiza o mapa local com o novo seletor sugerido pelo agente
    // eslint-disable-next-line no-console
    console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
    // @ts-expect-error atualização dinâmica intencional
    this.selectors[key] = newSelector;
  }

  async fillFirstName(name: string) {
    try {
      await this.page.locator(this.selectors.firstName).fill(name);
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'firstName',
        this.selectors.firstName,
        "Campo de texto para inserir o primeiro nome do usuário, com placeholder 'Seu nome' e label 'Nome *'"
      );
      if (healed) {
        this.updateSelector('firstName', healed);
        await this.page.locator(this.selectors.firstName).fill(name);
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para primeiro nome');
      }
    }
  }

  async fillLastName(lastName: string) {
    try {
      await this.page.locator(this.selectors.lastName).fill(lastName);
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'lastName',
        this.selectors.lastName,
        "Campo de texto para inserir o sobrenome, com placeholder 'Seu sobrenome' e label 'Sobrenome *'"
      );
      if (healed) {
        this.updateSelector('lastName', healed);
        await this.page.locator(this.selectors.lastName).fill(lastName);
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para sobrenome');
      }
    }
  }

  async fillEmail(email: string) {
    try {
      await this.page.locator(this.selectors.email).fill(email);
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'email',
        this.selectors.email,
        "Campo de texto para inserir o email, com placeholder 'seu@email.com' e label 'Email *'"
      );
      if (healed) {
        this.updateSelector('email', healed);
        await this.page.locator(this.selectors.email).fill(email);
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para email');
      }
    }
  }

  async fillPassword(password: string) {
    try {
      await this.page.locator(this.selectors.password).fill(password);
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'password',
        this.selectors.password,
        "Campo de senha para criar a senha do usuário, com label 'Senha *' e placeholder 'Crie uma senha'"
      );
      if (healed) {
        this.updateSelector('password', healed);
        await this.page.locator(this.selectors.password).fill(password);
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para senha');
      }
    }
  }

  async fillConfirmPassword(password: string) {
    try {
      await this.page.locator(this.selectors.confirmPassword).fill(password);
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'confirmPassword',
        this.selectors.confirmPassword,
        "Campo de confirmação de senha, com placeholder 'Confirme sua senha' e label 'Confirmar Senha *'"
      );
      if (healed) {
        this.updateSelector('confirmPassword', healed);
        await this.page.locator(this.selectors.confirmPassword).fill(password);
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para confirmação de senha');
      }
    }
  }

  async fillDob(dob: string) {
    try {
      await this.page.locator(this.selectors.dob).fill(dob);
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'dob',
        this.selectors.dob,
        "Campo de data de nascimento, com label 'Data de Nascimento *'"
      );
      if (healed) {
        this.updateSelector('dob', healed);
        await this.page.locator(this.selectors.dob).fill(dob);
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para data de nascimento');
      }
    }
  }

  async selectCountry(countryName: string) {
    try {
      await this.page.locator(this.selectors.country).selectOption({ label: countryName });
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'country',
        this.selectors.country,
        "Combobox para selecionar o país do usuário, com texto de opção 'Selecione seu país'"
      );
      if (healed) {
        this.updateSelector('country', healed);
        await this.page.locator(this.selectors.country).selectOption({ label: countryName });
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para país');
      }
    }
  }

  async toggleAcceptTerms(accept = true) {
    try {
      const checked = await this.page.locator(this.selectors.acceptTerms).isChecked();
      if (checked !== accept) await this.page.locator(this.selectors.acceptTerms).click();
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'acceptTerms',
        this.selectors.acceptTerms,
        "Checkbox para aceitar os termos de uso, label 'Aceito os termos de uso *'"
      );
      if (healed) {
        this.updateSelector('acceptTerms', healed);
        await this.page.locator(this.selectors.acceptTerms).click();
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para aceitar termos');
      }
    }
  }

  async clickSubmit() {
    try {
      await this.page.locator(this.selectors.submitButton).click();
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'submitButton',
        this.selectors.submitButton,
        "Botão para enviar o formulário de cadastro, com texto 'Criar Conta'"
      );
      if (healed) {
        this.updateSelector('submitButton', healed);
        await this.page.locator(this.selectors.submitButton).click();
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para enviar cadastro');
      }
    }
  }

  async backToLogin() {
    try {
      await this.page.locator(this.selectors.backToLogin).click();
    } catch (err) {
      const healed = await this.runner.healBrokenSelector(
        'backToLogin',
        this.selectors.backToLogin,
        "Botão para voltar à tela de login, com texto 'Voltar ao Login'"
      );
      if (healed) {
        this.updateSelector('backToLogin', healed);
        await this.page.locator(this.selectors.backToLogin).click();
      } else {
        throw new Error('Sistema de auto-correção falhou ao encontrar seletor para voltar ao login');
      }
    }
  }
}
