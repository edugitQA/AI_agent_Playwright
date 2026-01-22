# 📦 Módulo: Agent (Python + Bridge Node.js)

**Status:** 🟡 Refatoração Necessária  
**Prioridade:** 🔴 CRÍTICA  
**Duração Estimada:** 8-10 horas  
**Dificuldade:** 🟠 Média  

---

## 🎯 Objetivo do Módulo

O módulo **Agent** é o coração inteligente do sistema. Ele:

1. **Recebe** snapshots de DOM do Playwright quando um seletor quebra
2. **Analisa** a estrutura HTML com LangGraph
3. **Consulta** o modelo OpenAI GPT-4o-mini para sugestões de seletores
4. **Valida** os seletores candidatos no browser real
5. **Retorna** o melhor seletor encontrado ao teste

---

## 📋 Tarefas do Módulo Agent

### ✅ Task 1: Criar Estrutura de Pasta para Agent

**O que fazer:**
- Criar diretório `/agent/src/` para código Node.js
- Criar diretório `/agent/python/` para código Python
- Reorganizar arquivos Python existentes
- Criar `/agent/package.json`

**Checklist:**
- [ ] Diretório `/agent/src/` criado
- [ ] Diretório `/agent/python/` criado
- [ ] `api.py` movido para `/agent/python/api.py`
- [ ] `langgraph_handler.py` movido para `/agent/python/langgraph_handler.py`
- [ ] `self_healing_runner.js` movido para `/agent/src/runner.js`
- [ ] `/agent/package.json` criado
- [ ] `/agent/tsconfig.json` criado

**Prompt para IA:**
```
Você é um arquiteto de software especializado em Node.js e Python.
Preciso reorganizar o módulo /agent para uma estrutura modular e profissional.

Contexto atual:
- /agent/api.py (FastAPI server)
- /agent/langgraph_handler.py (LangGraph agent logic)
- /agent/self_healing_runner.js (Node.js client que chama o agent)
- /agent/requirements.txt (Python dependencies)
- Sem package.json próprio do agent

Tarefas:
1. Criar estrutura de pastas:
   /agent/
   ├── src/              (Node.js code)
   ├── python/           (Python code)
   ├── tests/            (Tests)
   ├── package.json      (Node module config)
   ├── tsconfig.json     (TS config)
   └── README.md         (Documentation)

2. Gerar package.json com:
   - name: "@playwright-agent/self-healing"
   - Scripts: start (Python), dev (with watch), test
   - Exports para runner.js, bridge.ts, types.ts
   - DevDependencies: @playwright/test, axios, dotenv

3. Gerar tsconfig.json com:
   - Strict mode
   - Module: ESNext
   - Target: ES2020
   - sourceMap: true

4. Gerar README.md com:
   - Overview da arquitetura
   - Como iniciar o serviço Python
   - Como usar o bridge Node.js
   - Exemplos de código
   - Troubleshooting

Gere os arquivos completos e prontos para colar no projeto.
```

---

### ✅ Task 2: Criar Bridge Node.js para Comunicação HTTP

**O que fazer:**
- Transformar `self_healing_runner.js` em um módulo TypeScript profissional
- Criar cliente HTTP para comunicar com FastAPI
- Implementar tipagem com TypeScript
- Adicionar error handling robusto
- Implementar cache local de seletores

**Arquivos a criar:**
- `/agent/src/runner.ts` - Main runner class
- `/agent/src/bridge.ts` - HTTP client
- `/agent/src/types.ts` - TypeScript types/interfaces
- `/agent/src/index.ts` - Export central

**Checklist:**
- [ ] `/agent/src/runner.ts` criado com classe SelfHealingTestRunner
- [ ] `/agent/src/bridge.ts` criado com cliente HTTP axios
- [ ] `/agent/src/types.ts` criado com interfaces
- [ ] `/agent/src/index.ts` criado com exports
- [ ] Error handling implementado
- [ ] Cache local funcional
- [ ] Testes unitários passando

**Prompt para IA:**
```
Você é um especialista em TypeScript e testes E2E com Playwright.

Preciso refatorar e melhorar o bridge Node.js que conecta testes Playwright 
ao agente Python de auto-correção.

Contexto:
- Agent Python roda em http://localhost:8000
- Endpoint: POST /heal
- Entrada: { dom_html, original_selector, element_description, error_message }
- Saída: { suggested_selectors: [...], best_selector: "..." }
- Tests chamam esse bridge via require('@agent/runner')

Tarefas:
1. Refatorar /agent/src/runner.ts:
   - Classe SelfHealingTestRunner
   - Constructor(page: Page)
   - Method: async healBrokenSelector(selectorName, originalSelector, description)
   - Error handling com retry logic (3 tentativas)
   - Logging estruturado
   - TypeScript strict mode

2. Criar /agent/src/bridge.ts:
   - Cliente HTTP com axios
   - Method: async sendHealRequest(payload)
   - Validação de payload
   - Timeout handling
   - Fallback para cache local
   - Retry com exponential backoff

3. Criar /agent/src/types.ts:
   - Interface HealRequest
   - Interface HealResponse
   - Interface SelectorCandidate
   - Type definitions completas
   - JSDoc documentation

4. Implementar cache em /agent/src/cache.ts:
   - Arquivo: .selector-cache.json (raiz do projeto)
   - Methods: get, set, clear, load, save
   - Auto-carregamento ao inicializar
   - Sem lock (assume single-threaded)

5. Adicionar logging estruturado:
   - Colors no console (verde=sucesso, vermelho=erro, amarelo=warning)
   - Timestamps
   - Contexto (seletor, descrição, etc)
   - Salvando em logs/agent-runner.log

Gere código TypeScript profissional, pronto para produção,
com exemplo de uso e testes unitários básicos.
```

---

### ✅ Task 3: Refatorar Agent Python (LangGraph + OpenAI)

**O que fazer:**
- Reorganizar código Python em módulos menores
- Implementar tipagem com Pydantic
- Adicionar logging estruturado
- Melhorar tratamento de erros
- Adicionar validation de inputs

**Arquivos a atualizar:**
- `/agent/python/api.py` - FastAPI server
- `/agent/python/langgraph_handler.py` - LangGraph agent
- `/agent/python/config.py` - NOVO: Configurações centralizadas
- `/agent/python/selectors.py` - NOVO: Lógica de seletores
- `/agent/python/dom_analyzer.py` - NOVO: Análise de DOM

**Checklist:**
- [ ] Código Python refatorado em módulos lógicos
- [ ] Pydantic models para validação
- [ ] Logging estruturado com colors
- [ ] Error handling robusto
- [ ] Docstrings completas
- [ ] Type hints em 100% do código

**Prompt para IA:**
```
Você é um especialista em Python, LangGraph e OpenAI API.

Preciso refatorar o agent Python que analisa DOM e sugere seletores.

Contexto:
- Arquivo atual: /agent/python/langgraph_handler.py
- Tecnologia: LangGraph 0.5.4 + OpenAI GPT-4o-mini
- Entrada: DOM HTML, seletor original, descrição, erro
- Saída: Lista de seletores sugeridos com ranking
- Ambiente: Python 3.9+, usa .env para OPENAI_API_KEY

Tarefas:
1. Criar /agent/python/config.py:
   - Variáveis de environment com defaults
   - Validation com Pydantic
   - Logging configuration
   - Cache configuration
   - Timeouts configuration

2. Criar /agent/python/models.py:
   - Pydantic models para entrada/saída
   - HealRequest model
   - HealResponse model
   - SelectorCandidate model
   - Validators customizados

3. Criar /agent/python/dom_analyzer.py:
   - Classe DOMAnalyzer
   - Methods para extrair informações do DOM
   - Similaridade de seletores
   - Context extraction (elementos vizinhos)
   - Atributos prioritários ([data-testid] > [id] > [class])

4. Refatorar /agent/python/langgraph_handler.py:
   - Classe LangGraphSelectorAgent
   - Method: analyze(dom_html, original_selector, description, error)
   - LangGraph graph definition com 3-4 nodes
   - Prompt engineering otimizado
   - Retorna List[SelectorCandidate] ordenado por score

5. Atualizar /agent/python/api.py:
   - Usar models.py para validation
   - Better error handling (422 para validation, 500 para server)
   - Logging de requests/responses
   - /health endpoint melhorado
   - CORS configurado

6. Adicionar logging estruturado:
   - Cores no console (usando colorama)
   - Timestamps
   - Níveis: DEBUG, INFO, WARNING, ERROR
   - Log file: logs/agent.log

Gere código Python profissional, bem documentado,
com type hints completos e examples de uso.
```

---

### ✅ Task 4: Criar Testes Unitários para Agent Python

**O que fazer:**
- Criar suite de testes com pytest
- Testar LangGraph handler
- Testar API FastAPI
- Testar DOM analyzer
- Gerar coverage report

**Arquivos a criar:**
- `/agent/python/tests/__init__.py`
- `/agent/python/tests/test_api.py`
- `/agent/python/tests/test_langgraph_handler.py`
- `/agent/python/tests/test_dom_analyzer.py`
- `/agent/python/tests/conftest.py` - pytest fixtures
- `/agent/python/tests/fixtures/sample_doms.py` - Sample DOM data

**Checklist:**
- [ ] pytest configurado
- [ ] Fixtures criadas para DOMs de exemplo
- [ ] Testes para API (GET /health, POST /heal)
- [ ] Testes para LangGraph handler
- [ ] Testes para DOM analyzer
- [ ] Mocking de OpenAI API
- [ ] Coverage > 80%

**Prompt para IA:**
```
Você é um especialista em testes Python com pytest.

Preciso criar uma suite completa de testes para o agent Python.

Contexto:
- Tecnologia: pytest 8.0+, pytest-asyncio
- Estrutura: /agent/python/tests/
- Módulos a testar:
  - api.py (FastAPI endpoints)
  - langgraph_handler.py (LangGraph agent)
  - dom_analyzer.py (DOM analysis)
  - config.py (Configuration)

Tarefas:
1. Criar /agent/python/tests/conftest.py:
   - Pytest configuration
   - Fixtures para:
     - Sample DOMs (HTML complexo)
     - FastAPI TestClient
     - Mock OpenAI client
     - Temporary files/dirs

2. Criar /agent/python/tests/fixtures/sample_doms.py:
   - Real DOM examples (5-10 HTMLs diferentes)
   - Com seletores que funcionam e que não funcionam
   - Complexidade variada (simples até muito complexo)
   - Comentários explicando cada exemplo

3. Criar /agent/python/tests/test_api.py:
   - Test GET /health (deve retornar status online)
   - Test POST /heal com payload válido
   - Test POST /heal com payload inválido (422)
   - Test POST /heal com erro do agente (500)
   - Test timeout handling
   - Mock OpenAI API

4. Criar /agent/python/tests/test_langgraph_handler.py:
   - Test initialization
   - Test analyze() com DOM válido
   - Test analyze() com DOM inválido
   - Test selector ranking/scoring
   - Test error handling
   - Test response format

5. Criar /agent/python/tests/test_dom_analyzer.py:
   - Test DOM parsing
   - Test context extraction (elementos vizinhos)
   - Test attribute priority ([data-testid] > [id] > [class])
   - Test selector similarity matching
   - Test performance com DOMs grandes

6. Gerar pytest.ini:
   - testpaths = ["tests"]
   - python_files = ["test_*.py"]
   - asyncio_mode = "auto"
   - log_cli = true
   - addopts = "--cov=. --cov-report=html --cov-report=term"

7. Atualizar requirements-dev.txt:
   - pytest==8.0.0
   - pytest-asyncio==0.23.0
   - pytest-cov==4.1.0
   - pytest-mock==3.12.0
   - httpx==0.28.1 (para TestClient)

Gere testes profissionais, bem organizados,
com boa cobertura e boas práticas.
```

---

### ✅ Task 5: Criar E2E Tests para Agent

**O que fazer:**
- Testar agent integrado com Playwright real
- Testar fluxo completo: teste quebra → agente corrige
- Testar cache funcionando
- Testar performance

**Arquivos a criar:**
- `/agent/tests/agent-e2e.spec.ts` - E2E test suite

**Checklist:**
- [ ] Agent Python rodando localmente
- [ ] E2E test que quebra intencionalmente um seletor
- [ ] Verifica se agent corrige
- [ ] Verifica se cache é atualizado
- [ ] Testa 3+ cenários diferentes

**Prompt para IA:**
```
Você é um especialista em Playwright E2E testing.

Preciso criar testes end-to-end que validem todo o fluxo
do agent de auto-correção funcionando.

Contexto:
- Playwright 1.57.0
- Agent Python em http://localhost:8000
- App React em http://localhost:5173
- Cache em .selector-cache.json

Tarefas:
1. Criar /agent/tests/agent-e2e.spec.ts:
   
   Test 1: "Agent corrige seletor quebrado"
   - Iniciar app React
   - Intencionalmente "quebrar" um seletor no Page Object
   - Chamar SelfHealingTestRunner.healBrokenSelector()
   - Validar que agent retorna novo seletor
   - Validar que novo seletor funciona
   - Validar que cache foi atualizado
   
   Test 2: "Cache previne chamadas ao agent"
   - Usar mesmo seletor quebrado 2x
   - Primeira vez: chama agent
   - Segunda vez: usa cache (sem chamada HTTP)
   - Validar tempo de resposta (cache < 10ms)
   
   Test 3: "Agent sugere múltiplos seletores com ranking"
   - Quebrar seletor complicado
   - Validar que agent retorna 3+ sugestões
   - Validar que estão ordenadas por score/confiança
   - Validar que primeira sugestão é melhor
   
   Test 4: "Agent lida com DOM complexo"
   - Testar em página com 500+ elementos
   - Validar performance < 5 segundos
   - Validar acurácia > 95%

2. Gerar fixtures:
   - Sample Page Objects com seletores "quebrados"
   - Sample DOMs que causam falhas
   - Mock data para diferentes cenários

3. Adicionar configuração em playwright.config.ts:
   - webServer para agent Python
   - webServer para app React
   - Timeout apropriado para agent

Gere testes Playwright profissionais que validem
o sistema completo de auto-correção.
```

---

## 📊 Dependências do Módulo Agent

```
Agent depende de:
├── sample-react-app (chama agent quando teste falha)
└── Nada mais (isolado e self-contained)

Agent é usado por:
├── sample-react-app/tests (via SelfHealingTestRunner)
└── automation-dashboard (pode ler logs do agent)
```

---

## 🔗 Integração com Outros Módulos

| Módulo | Como Integra | Status |
|--------|--------------|--------|
| **sample-react-app** | Chama agent quando seletor quebra | Já funciona ✅ |
| **automation-dashboard** | Lê logs e métricas do agent | Precisa integração |
| **CI/CD (GitHub Actions)** | Roda agent em background | Precisa configuração |

---

## 📝 Arquivos Entregáveis

Após completar este módulo, você deve ter:

```
/agent/
├── src/
│   ├── runner.ts           ✅ Bridge Playwright
│   ├── bridge.ts           ✅ Cliente HTTP
│   ├── types.ts            ✅ Type definitions
│   ├── cache.ts            ✅ Cache management
│   └── index.ts            ✅ Exports
│
├── python/
│   ├── api.py              ✅ FastAPI server
│   ├── langgraph_handler.py ✅ Agent logic
│   ├── config.py           ✅ Configuration
│   ├── models.py           ✅ Pydantic models
│   ├── dom_analyzer.py     ✅ DOM analysis
│   ├── requirements.txt    ✅ Updated
│   ├── requirements-dev.txt ✅ NOVO
│   └── tests/              ✅ Unit tests
│       ├── test_api.py
│       ├── test_langgraph_handler.py
│       ├── test_dom_analyzer.py
│       ├── conftest.py
│       └── fixtures/
│
├── tests/
│   └── agent-e2e.spec.ts   ✅ E2E tests
│
├── package.json            ✅ Node module config
├── tsconfig.json           ✅ TS config
├── README.md               ✅ Documentation
└── logs/                   ✅ Logs directory
```

---

## ✅ Checklist de Conclusão do Módulo

- [ ] Estrutura de pasta criada e organizada
- [ ] package.json e tsconfig.json criados
- [ ] Bridge Node.js (runner.ts, bridge.ts) funcional
- [ ] Agent Python refatorado em módulos
- [ ] Testes unitários Python > 80% coverage
- [ ] E2E tests criados e passando
- [ ] Logging estruturado em todos os arquivos
- [ ] Error handling robusto
- [ ] Documentation completa
- [ ] Code review aprovado
- [ ] Pronto para merge na master

---

## 📚 Referências

- LangGraph Docs: https://langchain-ai.github.io/langgraph/
- FastAPI Docs: https://fastapi.tiangolo.com/
- Playwright API: https://playwright.dev/docs/api/class-page
- Pytest Best Practices: https://docs.pytest.org/

---

**Próximo Módulo:** `MODULO_SAMPLE_REACT_APP.md`

