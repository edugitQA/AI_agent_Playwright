# 📋 Análise Arquitetural - Playwright Agent

**Data:** 17 de Janeiro de 2026  
**Revisor:** GitHub Copilot  
**Status:** 🔴 Requer Refatoração

---

## 📊 Sumário Executivo

O projeto **Playwright Agent** tem uma PoC bem estruturada, mas apresenta **problemas de organização** que devem ser resolvidos para atingir um padrão enterprise. Os principais issues identificados são:

| Problema | Severidade | Impacto | Solução |
|----------|-----------|---------|---------|
| ❌ Testes duplicados (raiz + sample-react-app) | 🔴 CRÍTICA | Confusão, manutenção difícil | Mover todos para sample-react-app |
| ❌ Package.json duplicado (raiz + sample-react-app) | 🟡 ALTA | Dependências desalinhadas | Consolidar scripts na raiz |
| ❌ Agent não é um pacote npm próprio | 🟡 ALTA | Sem versionamento/publicação | Criar estrutura de monorepo |
| ❌ Falta tsconfig na raiz | 🟡 ALTA | IDE warnings, alias paths confusos | Adicionar config centralizada |
| ❌ ESLint/Prettier não padronizados | 🟡 ALTA | Inconsistência de código | Configurar na raiz com override nos projetos |
| ✅ Agent Python bem estruturado | 🟢 BAIXA | - | Manter, apenas padronizar imports |
| ✅ sample-react-app limpo | 🟢 BAIXA | - | Manter, integrar testes completamente |

---

## 🏗️ Problemas Identificados

### 1. **❌ Testes Fragmentados em Múltiplas Localizações**

**Situação Atual:**
```
/tests/                               # RAIZ - Pasta de testes órfã
├── pages/
│   ├── ContactFormPage.ts           # ❌ Desorganizado
│   ├── MultiStepFormPage.ts
│   └── UserManagementPage.ts
└── registration.spec.ts

/sample-react-app/tests/             # App - Pasta de testes principal
├── pages/
│   └── LoginPage.ts
└── login.spec.ts
```

**Problema:**
- Testes fragmentados em 2 locais causam confusão
- `/tests` na raiz é órfo e sem contexto
- `playwright.config.ts` de `sample-react-app` não vê testes da raiz
- Manutenção duplicada e risco de inconsistência

**Solução Recomendada:**
```
/sample-react-app/tests/             # ✅ Tudo aqui
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── RegistrationPage.ts
│   ├── ContactFormPage.ts
│   ├── MultiStepFormPage.ts
│   └── UserManagementPage.ts
├── fixtures/                        # Dados de teste compartilhados
│   ├── users.ts
│   ├── products.ts
│   └── forms.ts
├── utils/                           # Helpers de teste
│   ├── test-helpers.ts
│   └── selectors.ts
├── login.spec.ts
├── registration.spec.ts
├── contact-form.spec.ts
├── product-list.spec.ts
└── user-management.spec.ts
```

---

### 2. **❌ Package.json Duplicado sem Sincronização**

**Situação Atual:**
```json
// /package.json (RAIZ)
{
  "scripts": {
    "test": "playwright test",
    "start:app": "cd sample-react-app && npm run dev",
    "install:app": "cd sample-react-app && npm install"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.1"
  }
}

// /sample-react-app/package.json (APP)
{
  "scripts": {
    "test": "playwright test",
    "dev": "vite"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0"  // ❌ VERSÃO DIFERENTE!
  }
}
```

**Problemas:**
- Playwright versões desalinhadas (^1.54.1 vs ^1.57.0)
- Duplicação de dependências
- Confusão sobre onde rodar comandos

**Solução - Estrutura Monorepo:**
```
/package.json (RAIZ - orquestrador)
├── "test": "cd sample-react-app && npm test"
├── "dev": "cd sample-react-app && npm run dev"
├── "setup": "npm install && cd sample-react-app && npm install"
└── devDependencies: (apenas tools comuns)

/sample-react-app/package.json (APP - self-contained)
├── "test": "playwright test"
├── "dev": "vite"
├── "test:headed": "playwright test --headed"
├── "test:debug": "playwright test --debug"
├── "test:ui": "playwright test --ui"
└── devDependencies: (todas as dependências de teste/build)

/agent/package.json (NOVO - Bridge JS)
├── "start": "node api-bridge.js"
├── "dev": "node --watch api-bridge.js"
└── devDependencies: (axios, express, etc)
```

---

### 3. **❌ Agent Python não é Pacote npm Independente**

**Situação Atual:**
```
/agent/
├── api.py
├── langgraph_handler.py
├── self_healing_runner.js           # ❌ JS solto no Python
├── requirements.txt                 # Apenas Python
└── logs/
```

**Problemas:**
- `self_healing_runner.js` fica em `/agent` mas é consumido em `/sample-react-app/tests`
- Sem package.json próprio do agent
- Sem versionamento semântico
- Difícil de publicar como módulo

**Solução:**
```
/agent/
├── package.json                     # ✅ NOVO - Agente como módulo Node
├── src/
│   ├── bridge.js                    # Cliente JS do agente
│   ├── runner.js                    # SelfHealingTestRunner
│   └── types.ts                     # Tipos TypeScript compartilhados
├── python/
│   ├── api.py
│   ├── langgraph_handler.py
│   ├── requirements.txt
│   └── logs/
├── tests/                           # Testes do próprio agent
│   └── agent.test.js
├── .env.example
├── README.md
└── tsconfig.json

// agent/package.json
{
  "name": "@playwright-agent/self-healing",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/runner.js",
    "./bridge": "./src/bridge.js",
    "./types": "./src/types.ts"
  },
  "scripts": {
    "start:python": "python python/api.py",
    "test": "node tests/agent.test.js"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "axios": "^1.13.2",
    "dotenv": "^17.2.0"
  }
}
```

---

### 4. **❌ Falta Configuração TypeScript Centralizada**

**Situação Atual:**
```
/sample-react-app/
├── tsconfig.json        # Apenas aqui
├── jsconfig.json        # Duplicação?
└── tests/
    └── pages/
        └── LoginPage.ts # Sem alias paths globais
```

**Problemas:**
- Sem alias paths (`@/*`, `@tests/*`, `@pages/*`)
- Sem referência a project files
- IDE warnings sobre paths

**Solução:**
```
/tsconfig.json (RAIZ - centralizado)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "@app/*": ["./sample-react-app/src/*"],
      "@tests/*": ["./sample-react-app/tests/*"],
      "@pages/*": ["./sample-react-app/tests/pages/*"],
      "@fixtures/*": ["./sample-react-app/tests/fixtures/*"],
      "@utils/*": ["./sample-react-app/tests/utils/*"],
      "@agent/*": ["./agent/src/*"]
    },
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "include": ["sample-react-app/**/*", "agent/src/**/*"]
}

/sample-react-app/tsconfig.json (referencia)
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

---

### 5. **❌ ESLint/Prettier Não Padronizados**

**Situação Atual:**
```
/eslint.config.js               # ❌ Fora de lugar (raiz)
/sample-react-app/
├── eslint.config.js            # ❌ Duplicação
├── package.json                # lint script aqui
└── vite.config.js
```

**Problemas:**
- Múltiplas configurações confundem
- Sem .prettierrc unificado
- Sem script lint na raiz

**Solução:**
```
/ (RAIZ)
├── .eslintrc.json              # Config centralizada
├── .prettierrc.json            # Formatter centralizado
├── .prettierignore
└── package.json
    {
      "scripts": {
        "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
        "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
        "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
        "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
      }
    }

/sample-react-app/
├── .eslintrc.json              # Override (extends root)
└── eslint.config.js            # DELETAR (consolidar na raiz)
```

---

### 6. **❌ Falta Camada de Testes do Agent Python**

**Situação Atual:**
```
/agent/
├── api.py                       # Sem testes unitários
├── langgraph_handler.py         # Sem testes unitários
└── requirements.txt
```

**Problemas:**
- Nenhum teste do agente Python
- Mudanças no LangGraph quebram tudo sem aviso
- Sem cobertura de código

**Solução:**
```
/agent/
├── python/
│   ├── api.py
│   ├── langgraph_handler.py
│   ├── tests/                    # ✅ NOVO
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   ├── test_langgraph_handler.py
│   │   └── fixtures/
│   │       └── sample_doms.py
│   └── pytest.ini
└── requirements-dev.txt
    pytest==8.0.0
    pytest-cov==4.1.0
    pytest-asyncio==0.23.0
```

---

### 7. **❌ Falta Estrutura de Fixtures de Teste**

**Situação Atual:**
```
/sample-react-app/tests/
├── pages/
├── login.spec.ts               # Dados hardcoded?
└── registration.spec.ts
```

**Problemas:**
- Dados de teste espalhados
- Sem reutilização
- Difícil manter múltiplos cenários

**Solução:**
```
/sample-react-app/tests/
├── fixtures/                    # ✅ NOVO
│   ├── users.ts                 # Dados de usuário
│   ├── products.ts              # Dados de produto
│   ├── forms.ts                 # Dados de formulário
│   └── index.ts                 # Export central
├── pages/
├── utils/                       # ✅ NOVO
│   ├── test-helpers.ts
│   ├── constants.ts
│   └── errors.ts
└── *.spec.ts
```

---

### 8. **❌ Falta Configuração de Ambiente Unificada**

**Situação Atual:**
```
/.env.example                       # Na raiz, mas app está em subpasta
/sample-react-app/
├── playwright.config.ts            # Busca de .env confuso
└── tests/
```

**Problemas:**
- `.env` da raiz vs `.env` do app
- Playwright config busca em lugares diferentes
- Sem .env.local separado de .env.example

**Solução:**
```
/ (RAIZ)
├── .env                         # NUNCA commitar
├── .env.example                 # Template
├── .env.test                    # Ambiente de teste (valores padrão)
├── .env.development             # Desenvolvimento local
├── .env.ci                      # GitHub Actions
└── .env.docker                  # Docker/compose

# Cada ambiente carrega de cima pra baixo
# (com override)

/sample-react-app/playwright.config.ts
import * as dotenv from 'dotenv-flow';

// Carrega .env, .env.local, .env.{NODE_ENV}, .env.{NODE_ENV}.local
dotenv.config({
  path: path.resolve(__dirname, '../'),
  node_env: process.env.NODE_ENV || 'test'
});
```

---

## 🎯 Roadmap de Refatoração (Priorizado)

### **Fase 1: CRÍTICA (Semana 1)**
- [ ] Mover `/tests` para `/sample-react-app/tests` completamente
- [ ] Sincronizar Playwright version em ambos package.json
- [ ] Criar `/sample-react-app/tests/fixtures/` e `/utils/`
- [ ] Consolidar `.eslintrc` e `.prettierrc` na raiz

### **Fase 2: ALTA (Semana 2)**
- [ ] Criar `/agent/package.json` e organizar estrutura
- [ ] Criar `/tsconfig.json` na raiz com alias paths
- [ ] Criar `/agent/python/tests/` para unit tests do agent
- [ ] Centralizar `.env` com suporte a múltiplos ambientes

### **Fase 3: MÉDIA (Semana 3)**
- [ ] Criar `/agent/README.md` específico
- [ ] Criar `/sample-react-app/README.md` específico
- [ ] Setup CI/CD com GitHub Actions
- [ ] Adicionar script `setup.sh` unificado

### **Fase 4: APRIMORAMENTOS (Semana 4)**
- [ ] Docker compose para dev local
- [ ] Testes integrados agent + app
- [ ] Performance benchmarks
- [ ] Documentação OpenAPI para agent

---

## 📁 Estrutura Alvo (Final)

```
playwright-agent/                              # MONOREPO
├── .eslintrc.json                             # Config centralizada
├── .prettierrc.json
├── tsconfig.json                              # Alias paths globais
├── .env.example
├── .env.test
├── .env.ci
├── package.json                               # Orquestrador
├── package-lock.json
├── README.md
│
├── agent/                                     # Serviço Python + Bridge JS
│   ├── package.json                           # ✅ NOVO
│   ├── tsconfig.json                          # ✅ NOVO
│   ├── README.md
│   │
│   ├── src/                                   # ✅ NOVO - Bridge Node
│   │   ├── runner.ts                          # SelfHealingTestRunner
│   │   ├── bridge.ts                          # Cliente HTTP do agent
│   │   ├── types.ts                           # Tipos compartilhados
│   │   └── index.ts
│   │
│   ├── python/                                # ✅ NOVO - Agent Python
│   │   ├── api.py
│   │   ├── langgraph_handler.py
│   │   ├── requirements.txt
│   │   ├── requirements-dev.txt               # ✅ NOVO
│   │   ├── tests/                             # ✅ NOVO
│   │   │   ├── __init__.py
│   │   │   ├── test_api.py
│   │   │   ├── test_langgraph_handler.py
│   │   │   ├── fixtures/
│   │   │   └── pytest.ini
│   │   └── logs/
│   │
│   └── tests/                                 # ✅ NOVO - E2E do agent
│       ├── agent-e2e.spec.ts
│       └── fixtures/
│
├── sample-react-app/                          # App React + Testes
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── forms/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── assets/
│   │
│   ├── tests/                                 # ✅ CONSOLIDADO
│   │   ├── pages/
│   │   │   ├── LoginPage.ts
│   │   │   ├── RegistrationPage.ts
│   │   │   ├── ContactFormPage.ts
│   │   │   ├── ProductListPage.ts
│   │   │   ├── UserManagementPage.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── fixtures/                         # ✅ NOVO
│   │   │   ├── users.ts
│   │   │   ├── products.ts
│   │   │   ├── forms.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                            # ✅ NOVO
│   │   │   ├── test-helpers.ts
│   │   │   ├── constants.ts
│   │   │   ├── selectors.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── login.spec.ts
│   │   ├── registration.spec.ts
│   │   ├── contact-form.spec.ts
│   │   ├── product-list.spec.ts
│   │   └── user-management.spec.ts
│   │
│   ├── playwright.config.ts
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── automation-dashboard/                      # Dashboard (optional)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── docs/                                      # Documentação
│   ├── ARCHITECTURE.md                        # ✅ NOVO - Visão geral
│   ├── SETUP.md                               # ✅ NOVO - Como setup
│   ├── TEST_WRITING.md                        # ✅ NOVO - Como escrever testes
│   ├── arquitetura-empresarial.md
│   ├── guia-escrita-test.md
│   ├── Documentacao_projeto.md
│   └── novas-funcionalidades.md
│
├── .github/
│   ├── workflows/
│   │   ├── test.yml                           # ✅ NOVO - Testes E2E
│   │   ├── lint.yml                           # ✅ NOVO - Linting
│   │   └── agent-test.yml                     # ✅ NOVO - Testes do agent
│   ├── instructions/
│   │   └── prompt-test.instructions.md
│   └── scripts/
│       ├── setup-ci.sh                        # ✅ NOVO
│       └── generate-reports.js
│
├── scripts/                                   # ✅ NOVO - Scripts utilitários
│   ├── setup.sh                               # Setup local
│   ├── setup-ci.sh                            # Setup CI
│   ├── docker-build.sh                        # Build Docker
│   └── generate-reports.sh
│
├── docker-compose.yml                         # Local dev
├── dockerfile.agent
├── .selector-cache.json
├── .gitignore
│
└── logs/                                      # Logs agregados
    ├── agent/
    ├── tests/
    └── ci/
```

---

## 🛠️ Checklist de Ações Recomendadas

- [ ] **Revisar** este documento com o time
- [ ] **Priorizar** as fases de refatoração
- [ ] **Criar** issue/task para cada fase
- [ ] **Atribuir** responsáveis e deadlines
- [ ] **Executar** testes após cada fase
- [ ] **Documentar** mudanças no README
- [ ] **Marcar** commit com `[refactor]` prefix
- [ ] **Fazer** code review antes de merge

---

## 📞 Próximos Passos

1. **Discussão:** Compartilhar este documento com o time
2. **Votação:** Priorizar Fases 1-4
3. **Planejamento:** Quebrar em tasks menores
4. **Execução:** Começar pela Fase 1 (mais impactante)
5. **Validação:** Rodar testes depois de cada mudança

---

**Documento gerado automaticamente.**  
**Última atualização:** 17/01/2026
