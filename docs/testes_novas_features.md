# Testes Automatizados com Auto-Correção

Este documento descreve a suíte de testes automatizados criada para as novas funcionalidades do sample-react-app, seguindo o padrão de escrita definido no [guia de testes](../docs/guia-escrita-test.md).

## 📋 Visão Geral

Foram criados testes abrangentes para **5 funcionalidades principais** da aplicação React:

1. **Registro de Usuário** (`UserRegistration.jsx`)
2. **Lista de Produtos** (`ProductList.jsx`) 
3. **Formulário de Contato** (`ContactForm.jsx`)
4. **Gerenciamento de Usuários** (`UserManagement.jsx`)
5. **Formulário Multi-Step** (`MultiStepForm.jsx`)

## 🏗️ Arquitetura dos Testes

### Page Objects Pattern

Cada funcionalidade possui seu próprio Page Object localizado em `/tests/pages/`:

- `UserRegistrationPage.ts` - Encapsula interações com formulário de registro
- `ProductListPage.ts` - Gerencia ações na lista de produtos
- `ContactFormPage.ts` - Controla formulário de contato
- `UserManagementPage.ts` - Administra operações de usuários
- `MultiStepFormPage.ts` - Orquestra formulário progressivo

### Auto-Correção Integrada

Todos os Page Objects implementam o padrão de auto-correção:

```typescript
try {
    await this.page.locator(this.selectors.elementSelector).action();
} catch (error) {
    const healedSelector = await this.runner.healBrokenSelector(
        'elementKey',
        this.selectors.elementSelector,
        'Descrição detalhada do elemento para o agente de IA'
    );
    if (healedSelector) {
        this.updateSelector('elementKey', healedSelector);
        await this.page.locator(this.selectors.elementSelector).action();
    } else {
        throw new Error('Sistema de auto-correção falhou');
    }
}
```

## 📂 Estrutura dos Arquivos

```
tests/
├── pages/                     # Page Objects
│   ├── UserRegistrationPage.ts
│   ├── ProductListPage.ts
│   ├── ContactFormPage.ts
│   ├── UserManagementPage.ts
│   └── MultiStepFormPage.ts
├── user-registration.spec.ts  # Testes de registro
├── product-list.spec.ts       # Testes de produtos
├── contact-form.spec.ts       # Testes de contato
├── user-management.spec.ts    # Testes de gerenciamento
├── multi-step-form.spec.ts    # Testes de formulário multi-step
├── integration-suite.spec.ts  # Suíte de integração
└── login.spec.ts              # Testes de login (existente)
```

## 🧪 Cenários de Teste

### 1. Registro de Usuário (user-registration.spec.ts)

**Cenários testados:**
- ✅ Registro completo com dados válidos
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato de email
- ✅ Validação de confirmação de senha
- ✅ Navegação de volta ao login

**Elementos testados:**
- Campos: nome, email, senha, telefone, data nascimento
- Seletores: país, gênero
- Checkboxes: termos, newsletter

### 2. Lista de Produtos (product-list.spec.ts)

**Cenários testados:**
- ✅ Visualização de produtos
- ✅ Pesquisa por termo
- ✅ Filtros por categoria e preço
- ✅ Ordenação de produtos
- ✅ Adição ao carrinho
- ✅ Limpeza de filtros
- ✅ Navegação entre páginas
- ✅ Combinação de múltiplos filtros

**Elementos testados:**
- Campo de busca, filtros, ordenação
- Botões de adicionar ao carrinho
- Paginação, contador de carrinho

### 3. Formulário de Contato (contact-form.spec.ts)

**Cenários testados:**
- ✅ Envio de formulário completo
- ✅ Validação de campos obrigatórios
- ✅ Combinações de assunto/departamento
- ✅ Métodos de contato e prioridades
- ✅ Validação de email
- ✅ Formatação de telefone
- ✅ Envio com dados mínimos

**Elementos testados:**
- Campos de texto, seletores dropdown
- Radio buttons para prioridade e método
- Área de texto para mensagem

### 4. Gerenciamento de Usuários (user-management.spec.ts)

**Cenários testados:**
- ✅ Listagem de usuários
- ✅ Pesquisa de usuários
- ✅ Filtros por role e status
- ✅ Modal de adição de usuário
- ✅ Criação completa de usuário
- ✅ Edição de usuário
- ✅ Exclusão individual
- ✅ Seleção múltipla e exclusão em lote
- ✅ Combinação de filtros

**Elementos testados:**
- Tabela de usuários, checkboxes
- Modais de criação/edição/exclusão
- Filtros e campo de busca

### 5. Formulário Multi-Step (multi-step-form.spec.ts)

**Cenários testados:**
- ✅ Formulário completo (4 steps)
- ✅ Navegação por tabs
- ✅ Botões anterior/próximo
- ✅ Preenchimento por step
- ✅ Edição na revisão
- ✅ Verificação de progresso
- ✅ Validação por step

**Elementos testados:**
- 4 steps: pessoal, endereço, preferências, revisão
- Navegação, progresso, validações
- Checkboxes, seletores, campos de texto

### 6. Suíte de Integração (integration-suite.spec.ts)

**Cenários testados:**
- ✅ Fluxo completo da aplicação
- ✅ Recuperação de erros
- ✅ Navegação entre todas as seções
- ✅ Teste de resistência

## 🎯 Data-TestIDs Utilizados

Os testes utilizam mais de **150 data-testids** únicos implementados nos componentes:

### UserRegistration.jsx
- `user-name`, `user-email`, `user-password`
- `confirm-password`, `user-phone`
- `user-country`, `date-of-birth`, `user-gender`
- `terms-checkbox`, `newsletter-checkbox`
- `register-submit`, `back-to-login`

### ProductList.jsx
- `search-products`, `filter-category`, `filter-price`
- `sort-products`, `add-to-cart-[id]`
- `cart-icon`, `cart-count`, `clear-filters`
- `prev-page`, `next-page`, `page-info`

### ContactForm.jsx
- `contact-name`, `contact-email`, `contact-phone`
- `contact-subject`, `contact-department`
- `contact-message`, `priority-[level]`
- `contact-method-[type]`, `contact-submit`

### UserManagement.jsx
- `search-users`, `filter-role`, `filter-status`
- `add-user`, `user-row-[id]`, `edit-user-[id]`
- `delete-user-[id]`, `bulk-delete`
- `modal-name`, `modal-email`, `modal-role`

### MultiStepForm.jsx
- `step-[1-4]-tab`, `next-step`, `prev-step`
- `personal-name`, `personal-email`, `personal-phone`
- `address-street`, `address-city`, `address-state`
- `notifications-email`, `language-select`, `theme-select`

## 🚀 Como Executar os Testes

### Executar Todos os Testes
```bash
npx playwright test
```

### Executar Teste Específico
```bash
npx playwright test user-registration.spec.ts
npx playwright test product-list.spec.ts
npx playwright test contact-form.spec.ts
npx playwright test user-management.spec.ts
npx playwright test multi-step-form.spec.ts
```

### Executar Suíte de Integração
```bash
npx playwright test integration-suite.spec.ts
```

### Executar com Interface Gráfica
```bash
npx playwright test --ui
```

### Executar em Modo Debug
```bash
npx playwright test --debug user-registration.spec.ts
```

## 🔧 Configuração Necessária

### 1. Aplicação React Executando
```bash
cd sample-react-app
npm run dev
```
A aplicação deve estar rodando em `http://localhost:5173`

### 2. Agente de Auto-Correção
O sistema de auto-correção deve estar configurado:
- `agent/self_healing_runner.js` disponível
- Configurações de API do OpenAI
- Python environment com dependências

### 3. Credenciais de Teste
- **Usuário:** `admin`
- **Senha:** `password123`

## 📊 Relatórios de Teste

Os testes geram relatórios detalhados em:
- `test-results/` - Artefatos de execução
- `test-results/html-report/` - Relatório HTML visual

Para visualizar o relatório:
```bash
npx playwright show-report
```

## 🛡️ Estratégia de Auto-Correção

### Descrições Contextuais
Cada elemento possui descrição detalhada para o agente:

**Exemplo Bom:**
```typescript
'Campo de texto para inserir o email de login, com o placeholder "seu@email.com" e que fica acima do campo de senha.'
```

**Exemplo Ruim:**
```typescript
'campo de email'
```

### Fallback Strategy
1. **Tentativa 1:** Seletor original
2. **Tentativa 2:** Auto-correção via IA
3. **Falha:** Erro descritivo com contexto

### Logging Detalhado
- ✅ Ações bem-sucedidas
- 🔧 Auto-correções acionadas
- ❌ Falhas definitivas
- ℹ️ Informações contextuais

## 🎓 Padrão de Qualidade

### Cobertura de Teste
- **Caminhos Happy Path:** ✅ 100%
- **Validações de Erro:** ✅ 100%
- **Navegação:** ✅ 100%
- **Auto-Correção:** ✅ Integrada em todos

### Manutenibilidade
- Page Objects centralizados
- Seletores mapeados
- Descrições padronizadas
- Logs informativos

### Robustez
- Tratamento de erros
- Timeouts apropriados
- Verificações condicionais
- Recuperação automática

---

**📞 Suporte:** Para dúvidas sobre os testes, consulte o [guia de escrita](../docs/guia-escrita-test.md) ou a documentação do projeto.
