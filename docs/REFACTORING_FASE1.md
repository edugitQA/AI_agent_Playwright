# 🚀 Plano de Refatoração Arquitetural - Fase 1

**Prioridade:** 🔴 CRÍTICA  
**Duração Estimada:** 2-3 dias  
**Impacto:** Altíssimo - Remove bloqueadores principais  

---

## 📌 Objetivo da Fase 1

**Consolidar toda a estrutura de testes em um único local** (`sample-react-app/tests/`) e sincronizar dependências e configurações.

---

## 🎯 Tarefas da Fase 1

### Task 1.1: Mover Testes da Raiz para sample-react-app

**Tempo:** 30 min  
**Risco:** Baixo

```bash
# 1. Copiar todos os testes para sample-react-app
cp -r /tests/* /sample-react-app/tests/

# 2. Atualizar paths nos Page Objects
# Alterar imports de caminhos relativos complexos para usar alias paths

# 3. Deletar /tests da raiz
rm -rf /tests

# 4. Verificar se playwright.config.ts de sample-react-app vê todos os testes
cd sample-react-app && npx playwright test --list
```

**Arquivos afetados:**
```
DELETE:
  /tests/
  /tests/pages/
  /tests/registration.spec.ts

MOVE TO /sample-react-app/tests/:
  Todos os arquivos acima
```

**Validação:**
```bash
npx playwright test          # Deve encontrar TODOS os testes
npx playwright test --list   # Listar todos em uma única estrutura
```

---

### Task 1.2: Sincronizar Versões de Dependências

**Tempo:** 20 min  
**Risco:** Baixo

**Ação 1:** Verificar versão do Playwright
```bash
# Raiz
cat package.json | grep @playwright/test
# "^1.54.1"

# sample-react-app
cat sample-react-app/package.json | grep @playwright/test
# "^1.57.0"  ❌ DIFERENTE!
```

**Ação 2:** Sincronizar para a versão MAIS NOVA
```bash
# Na raiz
npm install @playwright/test@^1.57.0 --save-dev

# Verificar
npm list @playwright/test
# playwright-agent: ^1.57.0
# sample-react-app: ^1.57.0 ✅ Sincronizado!

# Reinstalar navegadores com a nova versão
cd sample-react-app && npx playwright install
```

**Arquivos para atualizar:**
```
/package.json
- "@playwright/test": "^1.54.1" → "@playwright/test": "^1.57.0"

/sample-react-app/package.json
- Já está em "^1.57.0" ✅
```

**Validação:**
```bash
npm list @playwright/test
npx playwright --version
```

---

### Task 1.3: Consolidar ESLint e Prettier

**Tempo:** 30 min  
**Risco:** Médio

**Ação 1:** Criar configuração centralizada na RAIZ
```bash
# Na raiz
touch .eslintrc.json
touch .prettierrc.json
touch .prettierignore
```

**Arquivo: `.eslintrc.json` (RAIZ)**
```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "node": true,
    "es2021": true,
    "browser": true
  },
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  },
  "overrides": [
    {
      "files": ["**/*.tsx", "**/*.ts"],
      "extends": ["plugin:@typescript-eslint/recommended"],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }
  ]
}
```

**Arquivo: `.prettierrc.json` (RAIZ)**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Arquivo: `.prettierignore` (RAIZ)**
```
node_modules/
dist/
build/
*.min.js
.next/
.venv/
venv/
agent/python/
```

**Ação 2:** Atualizar package.json da RAIZ com scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "devDependencies": {
    "eslint": "^9.25.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@babel/eslint-parser": "^7.23.0",
    "prettier": "^3.0.0"
  }
}
```

**Ação 3:** Deletar configurações duplicadas

```bash
# Manter a config da raiz, remover duplicatas
rm -f sample-react-app/eslint.config.js

# sample-react-app pode ter um .eslintrc.json que extends a raiz
cat > sample-react-app/.eslintrc.json << 'EOF'
{
  "extends": "../.eslintrc.json",
  "overrides": [
    {
      "files": ["src/**/*"],
      "rules": {
        "react/prop-types": "off"
      }
    }
  ]
}
EOF
```

**Ação 4:** Instalar novas dependências
```bash
npm install --save-dev \
  eslint@^9.25.0 \
  @typescript-eslint/parser@^6.0.0 \
  @typescript-eslint/eslint-plugin@^6.0.0 \
  @babel/eslint-parser@^7.23.0 \
  prettier@^3.0.0
```

**Validação:**
```bash
npm run lint
npm run format:check
```

---

### Task 1.4: Criar Estrutura de Fixtures e Utils

**Tempo:** 45 min  
**Risco:** Baixo

**Ação 1:** Criar diretórios
```bash
mkdir -p sample-react-app/tests/fixtures
mkdir -p sample-react-app/tests/utils
```

**Arquivo: `sample-react-app/tests/fixtures/users.ts`**
```typescript
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'WrongPassword',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    role: 'admin',
  },
};

export const createTestUser = (overrides = {}) => ({
  ...testUsers.validUser,
  ...overrides,
});
```

**Arquivo: `sample-react-app/tests/fixtures/forms.ts`**
```typescript
export const contactFormData = {
  valid: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message',
  },
  invalid: {
    name: '',
    email: 'invalid-email',
    message: '',
  },
  longMessage: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'A'.repeat(5000), // Teste de limite
  },
};

export const registrationFormData = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
  },
  passwordMismatch: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'DifferentPass456!',
  },
};
```

**Arquivo: `sample-react-app/tests/utils/test-helpers.ts`**
```typescript
import { Page } from '@playwright/test';

export async function waitForUrl(page: Page, pattern: string | RegExp, timeout = 5000) {
  await page.waitForURL(pattern, { timeout });
}

export async function fillForm(
  page: Page,
  formData: Record<string, string>,
  selectorMap: Record<string, string>
) {
  for (const [key, value] of Object.entries(formData)) {
    const selector = selectorMap[key];
    if (selector && value) {
      await page.locator(selector).fill(value);
    }
  }
}

export async function getErrorMessage(page: Page, selector: string) {
  const element = page.locator(selector);
  return await element.textContent();
}

export async function isElementVisible(page: Page, selector: string) {
  return await page.locator(selector).isVisible();
}
```

**Arquivo: `sample-react-app/tests/utils/constants.ts`**
```typescript
export const TEST_TIMEOUT = 30000;
export const NAVIGATION_TIMEOUT = 45000;

export const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

export const SELECTORS = {
  // Auth
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  loginButton: '[data-testid="login-button"]',
  logoutButton: '[data-testid="logout-button"]',

  // Common
  pageTitle: 'h1',
  loadingSpinner: '[data-testid="loading-spinner"]',
  errorMessage: '[data-testid="error-message"]',
  successMessage: '[data-testid="success-message"]',
};
```

**Arquivo: `sample-react-app/tests/fixtures/index.ts`**
```typescript
export * from './users';
export * from './forms';
```

**Validação:**
```bash
# Verificar se os arquivos foram criados
ls -la sample-react-app/tests/fixtures/
ls -la sample-react-app/tests/utils/
```

---

### Task 1.5: Atualizar Imports nos Testes

**Tempo:** 1 hora  
**Risco:** Médio (muitas mudanças)

**Ação 1:** Verificar e corrigir imports em todos os `.spec.ts`

**Antes:**
```typescript
// /tests/login.spec.ts
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../../fixtures/users'; // ❌ Path confuso
```

**Depois:**
```typescript
// /sample-react-app/tests/login.spec.ts
import { LoginPage } from './pages/LoginPage';
import { testUsers } from './fixtures/users'; // ✅ Relativo claro
```

**Ação 2:** Usar auxiliares recém-criados

**Antes:**
```typescript
const email = 'test@example.com';
const password = 'TestPassword123!';
await loginPage.fillEmail(email);
await loginPage.fillPassword(password);
```

**Depois:**
```typescript
import { testUsers } from '@fixtures';
import { waitForUrl } from '@utils/test-helpers';

await loginPage.fillEmail(testUsers.validUser.email);
await loginPage.fillPassword(testUsers.validUser.password);
await waitForUrl(page, '**/dashboard');
```

**Ação 3:** Executar todos os testes
```bash
cd sample-react-app
npx playwright test
```

---

### Task 1.6: Atualizar package.json (Scripts Unificados)

**Tempo:** 15 min  
**Risco:** Baixo

**Arquivo: `/package.json` (RAIZ)**
```json
{
  "name": "playwright-agent",
  "version": "1.0.0",
  "description": "Self-healing E2E tests with Playwright + Python + LangGraph",
  "scripts": {
    "setup": "npm install && cd sample-react-app && npm install",
    "setup:ci": "npm ci && cd sample-react-app && npm ci",
    "dev": "cd sample-react-app && npm run dev",
    "build": "cd sample-react-app && npm run build",
    "test": "cd sample-react-app && npm run test",
    "test:headed": "cd sample-react-app && npm run test:headed",
    "test:ui": "cd sample-react-app && npm run test:ui",
    "test:debug": "cd sample-react-app && npm run test:debug",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "agent:start": "cd agent && python api.py",
    "agent:dev": "cd agent && python -m uvicorn api:app --reload",
    "report": "cd sample-react-app && npx playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "eslint": "^9.25.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0",
    "dotenv": "^17.2.0"
  }
}
```

---

## ✅ Checklist de Validação - Fase 1

Após completar todas as tasks, validar:

- [ ] Todos os testes movidos para `sample-react-app/tests/`
- [ ] `/tests` da raiz deletado
- [ ] `npx playwright test --list` mostra TODOS os testes
- [ ] Versão do Playwright sincronizada em ambos `package.json`
- [ ] `npm run lint` passa sem erros
- [ ] `npm run format:check` passa
- [ ] Fixtures e utils criadas e importadas corretamente
- [ ] Todos os testes passam: `npm run test`
- [ ] Scripts unificados funcionam na raiz
- [ ] Git status limpo (sem arquivos não rastreados incorretos)

---

## 🧪 Teste Rápido da Fase 1

```bash
# 1. Setup completo
npm run setup

# 2. Iniciar app
npm run dev

# 3. Em outro terminal, rodar testes
npm run test

# 4. Verificar linting
npm run lint
npm run format:check

# 5. Gerar relatório
npm run report
```

**Resultado Esperado:**
```
✅ Todos os testes passando
✅ ESLint sem warnings
✅ Prettier sem mudanças
✅ Relatório HTML gerado
```

---

## 📝 Git Commit Template para Fase 1

```bash
git add .
git commit -m "refactor(phase-1): consolidate tests and align dependencies

- Move all tests from /tests to sample-react-app/tests
- Sync Playwright version (^1.57.0) across package.json files
- Centralize ESLint and Prettier config
- Create fixtures and test utils structure
- Update all import paths to use relative paths
- Consolidate npm scripts in root package.json

Closes #<ISSUE_NUMBER>
"
```

---

## 🚨 Possíveis Problemas e Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| Playwright não encontra testes | Import path errado | Verificar `testDir` em `playwright.config.ts` |
| ESLint com warnings | Regras conflitantes | Revisar `.eslintrc.json` |
| Prettier formata incorreto | Config incompatível | Comparar com `.prettierrc.json` |
| Path imports quebrados | Referências antigas | Usar `find` + `sed` para substituição em bulk |
| Módulos não encontrados | Cache stale | `rm -rf node_modules && npm install` |

---

**Próximo:** [Fase 2 - ALTA Prioridade](./REFACTORING_FASE2.md)
