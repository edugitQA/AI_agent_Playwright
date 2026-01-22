# 📱 Módulo: Sample React App (Frontend + Testes)

**Status:** 🟡 Consolidação Necessária  
**Prioridade:** 🔴 CRÍTICA  
**Duração Estimada:** 10-12 horas  
**Dificuldade:** 🟠 Média  

---

## 🎯 Objetivo do Módulo

O módulo **Sample React App** é a aplicação de demonstração e o alvo dos testes E2E. Ele:

1. **Fornece** uma aplicação React moderna com múltiplas funcionalidades
2. **Hospeda** componentes testáveis (forms, tables, modals, etc)
3. **Executa** testes Playwright com auto-correção
4. **Consolida** toda a estrutura de testes em um único lugar
5. **Demonstra** as melhores práticas com Page Object Model

---

## 📋 Tarefas do Módulo Sample React App

### ✅ Task 1: Consolidar Toda Estrutura de Testes

**O que fazer:**
- Mover `/tests` da raiz para `/sample-react-app/tests/`
- Deletar `/tests` da raiz completamente
- Reorganizar páginas, fixtures e utilitários
- Atualizar imports e caminhos

**Checklist:**
- [ ] Diretório `/sample-react-app/tests/` contém TODOS os testes
- [ ] `/tests` da raiz deletado
- [ ] `playwright.config.ts` aponta para correto testDir
- [ ] Todos os testes rodam com `npx playwright test`
- [ ] Nenhum teste órfão ou duplicado

**Prompt para IA:**
```
Você é um arquiteto de testes E2E especializado em Playwright.

Preciso consolidar e organizar toda a estrutura de testes de um projeto Playwright.

Contexto atual:
- Testes espalhados em 2 locais:
  /tests/ (raiz) com pages/, registration.spec.ts
  /sample-react-app/tests/ com pages/, login.spec.ts
- playwright.config.ts em /sample-react-app/
- Ambos apuntam para testDir: './tests'

Objetivo:
- ÚNICO local de testes: /sample-react-app/tests/
- Estrutura clara e escalável
- Imports simples e semânticos

Tarefas:
1. Consolidar testes:
   - Mover /tests/* para /sample-react-app/tests/
   - Deletar /tests da raiz
   - Verificar que playwright.config.ts aponta para './tests'

2. Reorganizar estrutura em /sample-react-app/tests/:
   /sample-react-app/tests/
   ├── pages/                      (Page Objects)
   │   ├── LoginPage.ts
   │   ├── RegistrationPage.ts
   │   ├── ContactFormPage.ts
   │   ├── ProductListPage.ts
   │   ├── UserManagementPage.ts
   │   ├── DashboardPage.ts
   │   └── index.ts               (export central)
   │
   ├── fixtures/                   (Dados de teste)
   │   ├── users.ts               (dados de usuários)
   │   ├── products.ts            (dados de produtos)
   │   ├── forms.ts               (dados de formulários)
   │   └── index.ts               (export central)
   │
   ├── utils/                      (Helpers e utilities)
   │   ├── test-helpers.ts        (funções auxiliares)
   │   ├── constants.ts           (constantes)
   │   ├── selectors.ts           (mapa de seletores)
   │   └── index.ts               (export central)
   │
   ├── login.spec.ts
   ├── registration.spec.ts
   ├── contact-form.spec.ts
   ├── product-list.spec.ts
   └── user-management.spec.ts

3. Atualizar todos os imports:
   Antes: import { LoginPage } from '../pages/LoginPage'
   Depois: import { LoginPage } from './pages'

4. Validar:
   - npx playwright test --list (mostra todos os testes)
   - npx playwright test (todos passam)
   - Nenhum arquivo orfão em /tests da raiz

Gere instruções detalhadas de migração com exemplos.
```

---

### ✅ Task 2: Criar Fixtures Reutilizáveis

**O que fazer:**
- Centralizar dados de teste em `/tests/fixtures/`
- Criar geradores de dados reutilizáveis
- Implementar factories para dados complexos
- Documentar como usar fixtures

**Arquivos a criar:**
- `/sample-react-app/tests/fixtures/users.ts` - Dados de usuário
- `/sample-react-app/tests/fixtures/products.ts` - Dados de produtos
- `/sample-react-app/tests/fixtures/forms.ts` - Dados de formulários
- `/sample-react-app/tests/fixtures/index.ts` - Export central

**Checklist:**
- [ ] Fixtures para 5+ tipos de dados
- [ ] Factory functions para dados dinâmicos
- [ ] TypeScript types para todos os dados
- [ ] Documentação em cada fixture
- [ ] Testes importam fixtures corretamente

**Prompt para IA:**
```
Você é um especialista em test data management com TypeScript.

Preciso criar uma arquitetura profissional de fixtures (dados de teste)
que seja reutilizável, tipada e fácil de manter.

Contexto:
- Projeto Playwright + TypeScript
- Aplicação React com:
  - Autenticação (login/registro)
  - Produtos e catálogo
  - Formulários (contato, cadastro, etc)
  - Tabelas de usuários e dados
- Testes em /sample-react-app/tests/

Tarefas:
1. Criar /sample-react-app/tests/fixtures/users.ts:
   - testUsers object com: validUser, invalidUser, adminUser, inactiveUser
   - Cada um com: email, password, name, phone, role (se admin)
   - Factory function: createTestUser(overrides) para dados dinâmicos
   - JSDoc comments explicando cada usuário
   - TypeScript interfaces

2. Criar /sample-react-app/tests/fixtures/products.ts:
   - Dados de produtos variados (5+ exemplo)
   - Preços, descrições, estoque, categorias
   - Factory: generateProduct(), generateProductWithStock()
   - Dados para: search, filtering, sorting tests

3. Criar /sample-react-app/tests/fixtures/forms.ts:
   - contactFormData (valid, invalid, edge cases)
   - registrationFormData (valid, passwordMismatch, etc)
   - multiStepFormData (step by step data)
   - Factory: generateFormData(scenario)

4. Criar /sample-react-app/tests/fixtures/index.ts:
   - Export tudo: users, products, forms
   - Re-export de factories
   - Documentação central de como usar

5. Adicionar type definitions:
   - interfaces em /sample-react-app/tests/types/fixtures.d.ts
   - Types para User, Product, FormData, etc
   - Compatível com rest do projeto

6. Documentar em comments:
   /**
    * Dados de usuário válido para login
    * Email: test@example.com
    * Password: TestPassword123!
    */

Gere código TypeScript profissional, totalmente tipado,
com boas práticas e exemplos de uso.
```

---

### ✅ Task 3: Criar Utilitários de Teste

**O que fazer:**
- Criar funções auxiliares reutilizáveis
- Implementar helpers para ações comuns
- Documentar cada helper
- Adicionar type hints completos

**Arquivos a criar:**
- `/sample-react-app/tests/utils/test-helpers.ts` - Helpers genéricos
- `/sample-react-app/tests/utils/constants.ts` - Constantes
- `/sample-react-app/tests/utils/selectors.ts` - Mapa centralizado de seletores

**Checklist:**
- [ ] 20+ helpers implementados
- [ ] Type hints em 100% dos helpers
- [ ] JSDoc para cada função
- [ ] Examples de uso em comments
- [ ] Testes usam helpers (não chamam locator direto)

**Prompt para IA:**
```
Você é um especialista em test utilities e code organization.

Preciso criar um conjunto completo de utilities/helpers para testes Playwright
que melhore a legibilidade e reutilização de código.

Contexto:
- Playwright 1.57.0
- TypeScript 5.0+
- Page Objects já usam helpers (implícito)
- Objetivo: DRY (Don't Repeat Yourself) nos testes

Tarefas:
1. Criar /sample-react-app/tests/utils/test-helpers.ts:
   Com funções:
   
   // Navegação
   - async navigateTo(page, path)
   - async waitForNavigation(page, url/pattern)
   - async goToLoginPage(page)
   - async goToDashboard(page)
   
   // Aguardando elementos
   - async waitForElement(page, selector, options)
   - async waitForLoadingToFinish(page)
   - async waitForText(page, text, timeout)
   
   // Interações
   - async fillForm(page, formData, selectorMap)
   - async selectOption(page, selectSelector, optionText)
   - async uploadFile(page, inputSelector, filePath)
   - async clickAndWait(page, selector, waitForSelector)
   
   // Validações
   - async isElementVisible(page, selector)
   - async isElementEnabled(page, selector)
   - async getElementText(page, selector)
   - async getErrorMessage(page, errorSelector)
   - async expectSuccessMessage(page)
   
   // API helpers (se necessário)
   - async setAuthToken(page, token)
   - async clearAuthToken(page)
   
   Cada função com:
   - Type hints completos
   - JSDoc com exemplo de uso
   - Error handling
   - Retry logic onde apropriado

2. Criar /sample-react-app/tests/utils/constants.ts:
   - TIMEOUTS (30s, 45s, etc)
   - BASE_URL
   - API_URL
   - ENVIRONMENT
   - Page paths (LOGIN_PATH, DASHBOARD_PATH, etc)
   - Common selectors que aparecem em várias páginas

3. Criar /sample-react-app/tests/utils/selectors.ts:
   - Mapa centralizado de seletores
   - Objeto SELECTORS com categorias:
     {
       auth: { emailInput, passwordInput, loginButton, ... },
       forms: { nameInput, emailInput, submitButton, ... },
       common: { loadingSpinner, errorMessage, successMessage, ... },
       ...
     }
   - Type-safe com TypeScript
   - Facilita manutenção (muda seletor em 1 lugar)

4. Criar /sample-react-app/tests/utils/index.ts:
   - Export tudo: helpers, constants, selectors
   - Facilita imports: import { fillForm, BASE_URL } from '@utils'

5. Gerar examples de uso nos comments:
   /**
    * Preenche um formulário com dados
    * @example
    * await fillForm(page, { email: 'test@example.com', password: '123' }, SELECTORS.forms)
    */

Gere código TypeScript profissional, bem documentado,
com padrões reutilizáveis e exemplos práticos.
```

---

### ✅ Task 4: Refatorar Todos os Page Objects com Self-Healing

**O que fazer:**
- Atualizar todos os Page Objects para usar o padrão de self-healing correto
- Adicionar try/catch em todas as ações
- Implementar descrições semânticas ricas
- Adicionar logging de auto-correção
- Validar que funciona com o agent

**Arquivos a atualizar:**
- `/sample-react-app/tests/pages/LoginPage.ts`
- `/sample-react-app/tests/pages/RegistrationPage.ts`
- `/sample-react-app/tests/pages/ContactFormPage.ts`
- `/sample-react-app/tests/pages/ProductListPage.ts`
- `/sample-react-app/tests/pages/UserManagementPage.ts`
- `/sample-react-app/tests/pages/index.ts`

**Checklist:**
- [ ] Todos os Page Objects usam SelfHealingTestRunner
- [ ] Toda ação tem try/catch com heal logic
- [ ] Descrições de elementos são semânticas e ricas
- [ ] Logging estruturado de auto-correção
- [ ] Testes passam com correções automáticas
- [ ] Cache de seletores funciona

**Prompt para IA:**
```
Você é um especialista em Playwright Page Object Model e auto-healing.

Preciso refatorar todos os Page Objects para implementar o padrão
de self-healing com o agente de IA.

Contexto:
- Framework: Playwright 1.57.0 + TypeScript
- Agent: Roda em localhost:8000
- Padrão: Page Object Model + try/catch + SelfHealingTestRunner
- Goal: Zero testes quebrados por mudanças de seletor

Tarefas:
1. Refatorar /sample-react-app/tests/pages/LoginPage.ts:
   - Use: const { SelfHealingTestRunner } = require('@agent')
   - Constructor: constructor(page: Page) + this.runner = new SelfHealingTestRunner(page)
   - Selectors map: private selectors = { emailInput: '...', ... }
   - Helper: private updateSelector(key, newSelector)
   - Para cada ação (fillEmail, fillPassword, clickLogin, etc):
     try {
       await page.locator(selector).fill(value)
     } catch {
       const healed = await this.runner.healBrokenSelector(
         'emailInput',
         originalSelector,
         'Campo de email com placeholder seu@email.com, acima do campo de senha'
       )
       if (healed) {
         this.updateSelector('emailInput', healed)
         await page.locator(healed).fill(value)
       } else {
         throw new Error('...')
       }
     }

2. Aplicar mesmo padrão em:
   - RegistrationPage.ts
   - ContactFormPage.ts
   - ProductListPage.ts
   - UserManagementPage.ts
   - DashboardPage.ts (criar se não existir)

3. Melhorias em cada Page Object:
   - Method helpers de alto nível (ex: login(email, password))
   - Consolidar try/catch em helpers compartilhados
   - Type-safe returns (Promise<void>, Promise<string>, etc)
   - Logging estruturado

4. Descrições semânticas ricas:
   Ruim: "Campo de email"
   Bom: "Campo de texto para inserir email de login, com placeholder 
         'seu@email.com' e botão de remover ao lado, localizado 
         acima do campo de senha"

5. Validar:
   - Todos os Page Objects rodam sem erros
   - Testes que causam quebra proposital veem agent corrigir
   - Cache é atualizado depois da correção

Gere código Playwright profissional seguindo as 3 Regras de Ouro
de auto-correção (POM, try/catch, descrições ricas).
```

---

### ✅ Task 5: Criar Testes E2E Completos

**O que fazer:**
- Criar suites de testes para cada funcionalidade
- Cobrir happy path e edge cases
- Implementar data-driven tests
- Adicionar assertions robustas

**Arquivos a criar/atualizar:**
- `/sample-react-app/tests/login.spec.ts`
- `/sample-react-app/tests/registration.spec.ts`
- `/sample-react-app/tests/contact-form.spec.ts`
- `/sample-react-app/tests/product-list.spec.ts`
- `/sample-react-app/tests/user-management.spec.ts`

**Checklist:**
- [ ] 30+ testes implementados
- [ ] Happy path + edge cases
- [ ] Data-driven tests (multiple datasets)
- [ ] Assertions claras e descritivas
- [ ] Todos os testes passam
- [ ] Coverage > 80%

**Prompt para IA:**
```
Você é um especialista em testes E2E com Playwright e BDD.

Preciso criar uma suite completa de testes E2E que cubra
todas as funcionalidades da aplicação React.

Contexto:
- App tem: Login, Registro, Contato, Produtos, Gerenciamento de Usuários
- Testes em /sample-react-app/tests/
- Page Objects disponíveis: LoginPage, RegistrationPage, etc
- Fixtures disponíveis: testUsers, testProducts, testForms

Tarefas:
1. Criar /sample-react-app/tests/login.spec.ts:
   
   Suite: "Login Page"
   
   Test 1: "deve fazer login com credenciais válidas"
   - Navegar para login
   - Preencher email e senha válidos
   - Clicar login
   - Esperar redirecionamento para dashboard
   - Validar que usuário está autenticado
   
   Test 2: "deve mostrar erro com credenciais inválidas"
   - Email inválido
   - Validar mensagem de erro
   
   Test 3: "deve validar campos obrigatórios vazios"
   - Tentar fazer login sem preencher nada
   - Validar mensagens de validação
   
   Test 4: "deve fazer logout"
   - Fazer login primeiro
   - Clicar logout
   - Validar redirecionamento para login
   
   Test 5: "deve manter senha oculta"
   - Validar que input[type="password"]
   - Validar toggle de mostrar/ocultar

2. Criar /sample-react-app/tests/registration.spec.ts:
   
   Test 1: "deve registrar novo usuário com dados válidos"
   Test 2: "deve validar senhas não iguais"
   Test 3: "deve validar email duplicado"
   Test 4: "deve validar campos obrigatórios"
   Test 5: "deve fazer login após registro"

3. Criar /sample-react-app/tests/contact-form.spec.ts:
   
   Test 1: "deve enviar formulário com dados válidos"
   Test 2: "deve validar email inválido"
   Test 3: "deve validar message muito longa"
   Test 4: "deve persistir dados em localStorage"
   Test 5: "deve enviar arquivo anexado"

4. Criar /sample-react-app/tests/product-list.spec.ts:
   
   Test 1: "deve listar produtos"
   Test 2: "deve filtrar por categoria"
   Test 3: "deve ordenar por preço"
   Test 4: "deve buscar por nome"
   Test 5: "deve adicionar ao carrinho"
   Test 6: "deve paginar resultados"

5. Criar /sample-react-app/tests/user-management.spec.ts:
   
   Test 1: "deve listar usuários (admin)"
   Test 2: "deve editar usuário"
   Test 3: "deve deletar usuário"
   Test 4: "deve filtrar usuários"
   Test 5: "deve validar permissões de acesso"

Para cada teste:
- Use fixtures quando possível
- Use Page Objects para interações
- Use helpers de utils
- Assertions claras: expect().toHaveText(), etc
- Comentários explicando a lógica
- Tagged com @critical, @smoke, @regression

Gere testes Playwright profissionais, bem estruturados,
com cobertura abrangente e boas práticas.
```

---

### ✅ Task 6: Atualizar Playwright Config

**O que fazer:**
- Reorganizar playwright.config.ts
- Adicionar múltiplos ambientes
- Configurar timeouts apropriados
- Configurar browsers e devices
- Melhorar reporting

**Checklist:**
- [ ] Config aponta para `/tests` correto
- [ ] Timeouts apropriados para auto-correção (3-5min por teste)
- [ ] Navegadores configurados (chromium, firefox, webkit)
- [ ] Reporter HTML/JSON/JUnit
- [ ] Retry logic configurada
- [ ] Base URL parametrizado por ambiente

**Prompt para IA:**
```
Você é um especialista em configuração do Playwright.

Preciso otimizar a configuração do Playwright para um projeto
com auto-correção de testes via agente Python.

Contexto:
- Playwright 1.57.0
- Auto-correção precisa de tempo (timeout maior)
- Múltiplos ambientes: local, staging, ci
- Relatórios importantes para CI/CD
- Testes podem rodar em paralelo OU sequencial

Tarefas:
1. Reorganizar /sample-react-app/playwright.config.ts:
   
   Configurações:
   - testDir: './tests'
   - timeout: 5min (precisa para agent corrigir)
   - expect: { timeout: 20s }
   - fullyParallel: false (sequencial para stability)
   - workers: 1 (só 1 worker)
   - forbidOnly: !!process.env.CI
   - retries: process.env.CI ? 1 : 0
   
   Reporters:
   - ['html', { outputFolder: 'playwright-report' }]
   - ['json', { outputFile: 'test-results/results.json' }]
   - ['junit', { outputFile: 'test-results/junit.xml' }]
   - ['list']
   
   Uso:
   - use: {
       baseURL: process.env.BASE_URL || 'http://localhost:5173',
       actionTimeout: 30000,
       navigationTimeout: 45000,
       screenshot: 'only-on-failure',
       video: 'retain-on-failure',
       trace: 'retain-on-failure',
       headless: !process.env.HEADED,
       viewport: { width: 1280, height: 720 }
     }
   
   Projects:
   - chromium (desktop, mobile)
   - firefox (opcional)
   - webkit (opcional)
   
   webServer:
   - command para iniciar app React
   - reuseExistingServer: true (permite Ctrl+C sem erro)

2. Gerar .env files:
   
   .env.example (commit)
   .env.test (valores padrão para testes)
   .env.ci (GitHub Actions)
   
   Variáveis:
   - BASE_URL
   - API_URL
   - AGENT_URL (http://localhost:8000)
   - PLAYWRIGHT_HEADLESS
   - PLAYWRIGHT_TIMEOUT
   - DEBUG (para modo debug)

3. Adicionar configuração de logging:
   - capture logs do browser
   - capture de network requests
   - salvar em logs/

4. Adicionar configuração de artifacts:
   - screenshots só em falha
   - vídeos em falha
   - traces para debugging

Gere configuração Playwright profissional, escalável,
pronta para local, CI/CD e staging.
```

---

### ✅ Task 7: Atualizar Package.json com Scripts

**O que fazer:**
- Consolidar scripts de teste
- Adicionar scripts para linting
- Adicionar scripts de desenvolvimento
- Documentar cada script

**Checklist:**
- [ ] `npm test` roda testes
- [ ] `npm run test:headed` com interface gráfica
- [ ] `npm run test:ui` com Playwright UI
- [ ] `npm run test:debug` modo debug
- [ ] `npm run lint` verifica ESLint
- [ ] `npm run format` formata com Prettier
- [ ] Scripts bem documentados

**Prompt para IA:**
```
Você é um especialista em scripts npm e automação.

Preciso criar um conjunto profissional de scripts npm
para a aplicação React com testes Playwright.

Contexto:
- package.json em /sample-react-app/
- Scripts devem ser claros e documentados
- Suportar desenvolvimento local, CI/CD, debugging

Tarefas:
1. Atualizar scripts em /sample-react-app/package.json:
   
   "dev": "vite"                            # Iniciar dev server
   "build": "vite build"                    # Build para produção
   "preview": "vite preview"                # Preview de build
   
   "test": "playwright test"                # Todos os testes
   "test:headed": "playwright test --headed" # Com navegador visível
   "test:ui": "playwright test --ui"        # UI interativa
   "test:debug": "playwright test --debug"  # Debugger ativo
   "test:report": "playwright show-report"  # Mostrar relatório HTML
   
   "lint": "eslint src tests"               # Lint code
   "format": "prettier --write ."           # Formatar com Prettier
   "type-check": "tsc --noEmit"            # Verificar tipos TS
   
   "test:smoke": "playwright test --grep @smoke"
   "test:critical": "playwright test --grep @critical"
   "test:regression": "playwright test --grep @regression"

2. Documentação em comments acima de scripts:
   // Run all E2E tests with auto-correction enabled
   "test": "playwright test"

3. Adicionar pré-commit hooks (opcional):
   - husky para validar antes de commit
   - lint-staged para rodar lint em arquivos modificados

Gere scripts npm profissionais e bem organizados.
```

---

## 📊 Dependências do Módulo Sample React App

```
sample-react-app depende de:
├── agent (chama quando teste falha)
└── Nada mais (isolado e self-contained)

sample-react-app é usado por:
├── CI/CD (roda testes)
├── automation-dashboard (pode ler métricas)
└── Demonstração (mostra self-healing em ação)
```

---

## 📝 Arquivos Entregáveis

Após completar este módulo, você deve ter:

```
/sample-react-app/
├── src/
│   ├── App.jsx              (já existe)
│   ├── components/          (já existe)
│   ├── hooks/               (já existe)
│   ├── lib/                 (já existe)
│   └── assets/              (já existe)
│
├── tests/                   ✅ UNIFICADO (antes havia em 2 locais)
│   ├── pages/               ✅ Page Objects refatorados
│   │   ├── LoginPage.ts
│   │   ├── RegistrationPage.ts
│   │   ├── ContactFormPage.ts
│   │   ├── ProductListPage.ts
│   │   ├── UserManagementPage.ts
│   │   ├── DashboardPage.ts
│   │   └── index.ts
│   │
│   ├── fixtures/            ✅ NOVO
│   │   ├── users.ts
│   │   ├── products.ts
│   │   ├── forms.ts
│   │   └── index.ts
│   │
│   ├── utils/               ✅ NOVO
│   │   ├── test-helpers.ts
│   │   ├── constants.ts
│   │   ├── selectors.ts
│   │   └── index.ts
│   │
│   ├── login.spec.ts
│   ├── registration.spec.ts
│   ├── contact-form.spec.ts
│   ├── product-list.spec.ts
│   ├── user-management.spec.ts
│   └── playwright-report/
│
├── playwright.config.ts     ✅ Atualizado
├── vite.config.js           (já existe)
├── tsconfig.json            (já existe)
├── package.json             ✅ Scripts atualizados
├── .eslintrc.json           (ja existe)
└── README.md                (já existe)
```

---

## ✅ Checklist de Conclusão do Módulo

- [ ] Todos os testes consolidados em /sample-react-app/tests/
- [ ] `/tests` da raiz deletado
- [ ] Fixtures criadas e funcionando
- [ ] Utils e helpers criados
- [ ] Page Objects refatorados com self-healing
- [ ] 30+ testes E2E criados
- [ ] playwright.config.ts otimizado
- [ ] package.json com scripts melhorados
- [ ] Todos os testes passam
- [ ] ESLint sem warnings
- [ ] Code review aprovado
- [ ] Pronto para merge na master

---

## 📚 Referências

- Playwright Docs: https://playwright.dev/
- Page Object Model: https://playwright.dev/docs/pom
- Best Practices: https://playwright.dev/docs/best-practices
- Test Data Management: https://testautomationu.applitools.com/

---

**Próximo Módulo:** `MODULO_DASHBOARD.md`

