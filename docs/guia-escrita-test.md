Guia para Criação de Testes com Auto-Correção (Self-Healing)
1. Introdução
Este documento é um guia prático para a equipe de QA e desenvolvimento sobre como escrever testes automatizados que se beneficiam do nosso agente de IA para auto-correção. O objetivo é criar testes mais resilientes que não quebrem com pequenas mudanças na interface do usuário (UI), reduzindo o tempo de manutenção e aumentando a confiança na nossa suíte de automação.

Para que a "mágica" da auto-correção funcione, o teste precisa ser escrito seguindo um padrão específico. Este guia detalha esse padrão através de regras claras e um exemplo prático.

2. As Regras de Ouro para Testes Auto-Corretivos
Para que o agente de IA seja acionado corretamente, você precisa seguir três regras de ouro ao construir seus testes.

Regra #1: Organize sua Página com "Page Objects"
Toda a lógica de interação e os seletores de uma página devem ser centralizados em uma única classe, conhecida como Page Object.

O Quê? Crie um arquivo de classe (ex: LoginPage.ts) para cada página ou componente principal da sua aplicação.

Por Quê? Isso nos dá um "mapa" centralizado da página. Quando o agente de IA corrige um seletor quebrado, ele atualiza esse mapa em um único lugar. O resto do teste, que usa o mapa, passa a funcionar com o novo seletor sem precisar de nenhuma alteração.

Regra #2: Proteja Cada Ação com um "Guarda-Costas" (try...catch)
Cada interação crítica com um elemento da página (clicar, preencher, etc.) deve ser "protegida" para que possamos lidar com falhas de forma inteligente.

O Quê? Dentro do seu Page Object, crie métodos para cada ação (ex: `fillEmail()`, `clickLoginButton()`). Envolva a lógica do Playwright dentro de um bloco `try...catch`.

Por Quê? O bloco `try` tenta executar a ação. Se ele falhar porque o seletor não foi encontrado, o bloco `catch` é acionado. É dentro do `catch` que nós chamamos o nosso agente de IA para fazer a correção.

**Nota importante:** Após a tentativa de correção, é crucial verificar se o agente de IA obteve sucesso. Se a correção falhar, o teste deve ser interrompido com uma mensagem de erro clara. Isso evita que o teste continue em um estado inconsistente.

Regra #3: Descreva os Elementos como se Fosse para um Humano
Esta é a regra mais importante para o sucesso do agente. A qualidade da correção depende diretamente da qualidade da descrição que você fornece.

O Quê? Ao chamar a função de correção (healBrokenSelector), passe uma descrição em linguagem natural, clara e rica em contexto sobre o elemento que você está tentando encontrar.

Por Quê? O agente de IA não conhece a aplicação. Ele usa sua descrição para encontrar o elemento correto no meio de todo o código HTML. Quanto melhor a descrição, maior a chance de sucesso.

Qualidade

Exemplo de Descrição

Análise

Ruim

"o campo de email"

Muito vago. E se houver outros campos de email na tela?

Bom

"campo de email com a label 'Email'"

Melhor. Usa a label associada, que é um bom identificador.

Excelente

"Campo de texto para inserir o email de login, com o placeholder 'seu@email.com' e que fica acima do campo de senha."

Perfeito. Fornece o tipo, a função, o texto do placeholder e a localização relativa, dando ao agente o máximo de contexto para uma decisão precisa.

3. Exemplo Prático: Formulário de Cadastro
Vamos aplicar essas regras a um formulário de cadastro simples com os campos: Nome, Email, Senha e um botão "Cadastrar".

Passo 1: Criar o Page Object (O "Mapa" da Página)
Primeiro, criamos o arquivo tests/pages/RegistrationPage.ts.

// File: tests/pages/RegistrationPage.ts

import { type Page } from '@playwright/test';
import { SelfHealingTestRunner } from '../../agent/self_healing_runner.js';

export class RegistrationPage {
    private runner: SelfHealingTestRunner;

    // 1. Mapeamos todos os seletores da página aqui.
    // Note que alguns estão "quebrados" de propósito para o exemplo.
    private selectors = {
        nameInput: '[data-testid="register-name"]',
        emailInput: '[data-testid="register-email-old"]', // Quebrado!
        passwordInput: '[data-testid="register-password-input-old"]', // Quebrado!
        submitButton: '[data-testid="submit-registration-button"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner();
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // 2. Criamos uma ação "protegida" para cada interação.

    async fillName(name: string) {
        try {
            await this.page.locator(this.selectors.nameInput).fill(name);
        } catch (error) {
            // 3. Se falhar, descrevemos o elemento para o agente.
            const healedSelector = await this.runner.healBrokenSelector(
                this.page,
                this.selectors.nameInput,
                "Campo de texto para o nome completo do usuário, com a label 'Nome Completo'"
            );
            this.updateSelector('nameInput', healedSelector);
            await this.page.locator(this.selectors.nameInput).fill(name); // Tenta de novo
        }
    }

    async fillEmail(email: string) {
        try {
            await this.page.locator(this.selectors.emailInput).fill(email);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                this.page,
                this.selectors.emailInput,
                "Campo de texto para o email, com o placeholder 'Digite seu melhor email'"
            );
            this.updateSelector('emailInput', healedSelector);
            await this.page.locator(this.selectors.emailInput).fill(email);
        }
    }

    async fillPassword(password: string) {
        try {
            await this.page.locator(this.selectors.passwordInput).fill(password);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                this.page,
                this.selectors.passwordInput,
                "Campo de senha para criar a senha do usuário, com a label 'Crie uma senha'"
            );
            this.updateSelector('passwordInput', healedSelector);
            await this.page.locator(this.selectors.passwordInput).fill(password);
        }
    }

    async clickSubmit() {
        try {
            await this.page.locator(this.selectors.submitButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                this.page,
                this.selectors.submitButton,
                "Botão principal para finalizar o cadastro, com o texto 'Cadastrar'"
            );
            this.updateSelector('submitButton', healedSelector);
            await this.page.locator(this.selectors.submitButton).click();
        }
    }
}

Passo 2: Escrever o Teste de Forma Limpa
Com o Page Object pronto, o arquivo de teste fica extremamente simples e focado no fluxo do usuário, não nos detalhes técnicos.

// File: tests/registration.spec.ts

import { test, expect } from '@playwright/test';
import { RegistrationPage } from './pages/RegistrationPage';

test.describe('Formulário de Cadastro com Auto-Correção', () => {

    test('deve preencher o formulário e cadastrar um usuário com sucesso', async ({ page }) => {
        // Instancia nosso "mapa" da página
        const registrationPage = new RegistrationPage(page);

        await page.goto('/register'); // Navega para a página de cadastro

        // As ações do teste são limpas e legíveis.
        // Toda a complexidade da auto-correção está escondida no Page Object.
        await registrationPage.fillName('Usuário Teste');
        await registrationPage.fillEmail('teste@exemplo.com');
        await registrationPage.fillPassword('senhaForte123');
        await registrationPage.clickSubmit();

        // Verificação final do fluxo
        const successMessage = page.locator('text=Cadastro realizado com sucesso!');
        await expect(successMessage).toBeVisible();
    });
});

4. Resumo para a Equipe
Para fazer os testes se curarem sozinhos, o processo é:

Crie a Classe da Página (Page Object): Mapeie os seletores e crie métodos para cada ação (clicar, preencher).

Proteja as Ações: Dentro de cada método, use try...catch. A chamada para o agente de IA vai no bloco catch.

Capriche na Descrição: Ao chamar o agente, dê a ele a melhor descrição possível do elemento. Pense em como você o descreveria para uma pessoa.

O arquivo de teste deve apenas usar os métodos do Page Object, mantendo-se limpo e focado na jornada do usuário.