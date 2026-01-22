# 📊 Módulo: Automation Dashboard

**Status:** 🟠 Em Desenvolvimento  
**Prioridade:** 🟡 MÉDIA  
**Duração Estimada:** 6-8 horas  
**Dificuldade:** 🟡 Média  

---

## 🎯 Objetivo do Módulo

O módulo **Automation Dashboard** é um painel visual para monitorar a saúde e performance dos testes E2E. Ele:

1. **Coleta** métricas dos testes e do agente
2. **Visualiza** dados em gráficos e tabelas
3. **Identifica** padrões de falha
4. **Monitora** performance do agente
5. **Fornece** insights para otimização

---

## 📋 Tarefas do Módulo Dashboard

### ✅ Task 1: Estruturar Componentes de Visualização

**O que fazer:**
- Criar componentes React para mostrar métricas
- Implementar gráficos com recharts
- Criar tabelas de dados
- Implementar filtros e busca

**Componentes a criar:**
- `TestHealthOverview.jsx` - Overview geral dos testes
- `TestResultsChart.jsx` - Gráfico de resultados (pass/fail/flaky)
- `AgentPerformanceChart.jsx` - Performance do agente
- `TestExecutionTimeline.jsx` - Timeline de execuções
- `FailureAnalysis.jsx` - Análise de falhas
- `SelectorHealsChart.jsx` - Gráfico de seletores corrigidos

**Checklist:**
- [ ] 6+ componentes implementados
- [ ] Componentes reutilizáveis
- [ ] Responsivos (mobile + desktop)
- [ ] Carregamento de dados funciona
- [ ] Filtros funcionam

**Prompt para IA:**
```
Você é um especialista em React, TypeScript e data visualization.

Preciso criar componentes de dashboard para visualizar
métricas de testes E2E e auto-correção.

Contexto:
- Framework: React 19
- Styling: Tailwind CSS
- Charts: Recharts
- Data: Vem de JSON files (logs)
- App já tem: componentes shadcn/ui, hooks, utils

Dados disponíveis (sample):
{
  testResults: [
    { date: "2025-01-17", passed: 25, failed: 2, flaky: 1, skipped: 0 },
    { date: "2025-01-16", passed: 24, failed: 1, flaky: 2, skipped: 0 }
  ],
  agentMetrics: [
    { selectorCorrected: 5, successRate: 98%, avgTime: 2.3 }
  ],
  failurePatterns: [
    { selector: "[data-testid='login-btn']", count: 3, lastSeen: "2025-01-17" }
  ]
}

Tarefas:
1. Criar /automation-dashboard/src/components/TestHealthOverview.jsx:
   - Card mostrando:
     - Total de testes
     - Pass rate (percentual com cor: verde>90%, amarelo>70%, vermelho<70%)
     - Últimas 7 runs
     - Trend (↑ melhora ou ↓ piora)
   - Usa recharts BarChart ou AreaChart

2. Criar TestResultsChart.jsx:
   - Gráfico tipo donut/pie
   - Cores: Verde=passed, Vermelho=failed, Amarelo=flaky
   - Interativo: hover mostra count
   - Legend customizada

3. Criar AgentPerformanceChart.jsx:
   - LineChart: Taxa de sucesso do agente (%)
   - BarChart: Tempo médio de correção (s)
   - Last 30 days
   - KPIs destacados

4. Criar TestExecutionTimeline.jsx:
   - Timeline vertical mostrando últimas 10 execuções
   - Status de cada execução (✅ pass, ❌ fail, ⚠️ flaky)
   - Duration e resultado
   - Clicável para ver detalhes

5. Criar FailureAnalysis.jsx:
   - Tabela com falhas comuns
   - Colunas: Seletor, Count, % do Total, Última Falha, Trend
   - Ordenável
   - Filtrável por tipo

6. Criar SelectorHealsChart.jsx:
   - Gráfico de seletores que foram corrigidos
   - Top 10 seletores mais corrigidos
   - Horário de correção
   - Taxa de sucesso de cada um

Requisitos para todos:
- TypeScript types completos
- JSDoc comments
- Props bem definidas
- Componentes reutilizáveis
- Acessibilidade básica (alt text, labels)
- Responsivo (mobile friendly)
- Loading states
- Error handling

Gere componentes React profissionais com recharts.
```

---

### ✅ Task 2: Integrar Coleta de Dados

**O que fazer:**
- Criar sistema de coleta de métricas dos testes
- Integrar com logs do agent
- Criar parser de resultados Playwright
- Armazenar em JSON ou banco local

**Arquivos a criar:**
- `/automation-dashboard/src/services/metricsService.js` - Coleta de métricas
- `/automation-dashboard/src/services/logParser.js` - Parser de logs
- `/automation-dashboard/src/hooks/useMetrics.js` - Hook para dados

**Checklist:**
- [ ] Métricas coletadas de:
  - playwright-report/results.json
  - logs/agent.log
  - .selector-cache.json
- [ ] Parser de logs funciona
- [ ] Dados agregados por dia/semana/mês
- [ ] Cache local atualizado
- [ ] Hook React funciona

**Prompt para IA:**
```
Você é um especialista em data aggregation e React hooks.

Preciso criar um sistema para coletar, processar e disponibilizar
métricas de testes E2E e auto-correção.

Contexto:
- Testes Playwright geram: playwright-report/results.json
- Agent Python gera: logs/agent.log
- Cache: .selector-cache.json
- Dashboard precisa consumir esses dados

Dados de Playwright:
{
  "stats": { "duration": 12.5, "expected": 25, "unexpected": 2, "skipped": 0 },
  "suites": [
    {
      "title": "login.spec.ts",
      "tests": [
        { "title": "should login", "ok": true, "duration": 1234 }
      ]
    }
  ]
}

Dados de Agent (logs):
[timestamp] [LEVEL] [Module] Message with context
2025-01-17T10:30:45 [INFO] [SelfHealingRunner] Auto-corrected selector
  selectorName: loginButton
  originalSelector: [data-testid='login-btn']
  newSelector: [data-testid='login-button']
  description: "Main login button"
  success: true
  timeMs: 2350

Tarefas:
1. Criar /automation-dashboard/src/services/metricsService.js:
   
   Functions:
   - loadPlaywrightResults(filePath) → aggregated results
   - loadAgentMetrics(logPath) → parsed agent activities
   - loadSelectorCache(filePath) → cache statistics
   - aggregateByDate(data, period='day') → grouped by time
   - calculateTrends(data) → % change
   - getTopFailures(data, limit=10) → list
   
   Returns structured data:
   {
     testRunsDaily: [...],
     agentSuccessRate: 98.5,
     totalSelectorsCorrected: 143,
     commonFailures: [...],
     agentAvgTime: 2.34,
     testPassRate: 96.2
   }

2. Criar /automation-dashboard/src/services/logParser.js:
   
   Parser para logs do agent:
   - regex parsing de timestamp, level, module, message
   - extração de dados estruturados
   - agregação por type de evento
   - cálculo de estatísticas
   
   Eventos a parsear:
   - Auto-correction (sucesso/falha)
   - Timeouts
   - Cache hits
   - Errors

3. Criar /automation-dashboard/src/hooks/useMetrics.js:
   
   Hook React:
   - const { metrics, loading, error, refresh } = useMetrics(options)
   - Carrega dados ao montar
   - Polling automático (ex: a cada 5min)
   - Cache local (localStorage)
   - Error handling

4. Criar /automation-dashboard/src/utils/dataTransform.ts:
   
   Helpers:
   - transformToChartData(rawData) → formato recharts
   - calculateStats(data) → aggregate stats
   - filterByDate(data, startDate, endDate) → filter
   - formatDuration(ms) → "2.3s"

5. Criar /automation-dashboard/src/types/metrics.d.ts:
   
   Types:
   - TestResult
   - AgentMetric
   - SelectorHeal
   - DashboardData
   - ChartDataPoint

Gere código JavaScript/TypeScript profissional,
bem tipado, com boas práticas.
```

---

### ✅ Task 3: Criar Tela Principal do Dashboard

**O que fazer:**
- Criar layout principal com grid
- Organizar componentes de forma lógica
- Adicionar navegação entre views
- Implementar filtros globais

**Arquivos a criar:**
- `/automation-dashboard/src/pages/Dashboard.jsx` - Página principal
- `/automation-dashboard/src/pages/DetailedAnalysis.jsx` - Análise detalhada
- `/automation-dashboard/src/components/Filters.jsx` - Filtros

**Checklist:**
- [ ] Layout responsivo com grid
- [ ] Componentes posicionados logicamente
- [ ] Filtros por data/teste/status
- [ ] Navegação entre abas funciona
- [ ] Performance boa (sem lag)

**Prompt para IA:**
```
Você é um especialista em UI/UX e React layouts.

Preciso criar a página principal do dashboard que organize
todos os componentes de visualização de forma intuitiva.

Contexto:
- Componentes disponíveis: overview, charts, tables, timeline
- Tamanhos de tela: mobile, tablet, desktop
- Dados podem ser grandes (30+ dias de histórico)
- Performance importante

Tarefas:
1. Criar /automation-dashboard/src/pages/Dashboard.jsx:
   
   Layout (mobile-first, responsive):
   - Header com título e filtros
   - Grid 2x2 (mobile: 1x4) com:
     - TestHealthOverview (1x1)
     - TestResultsChart (1x1)
     - AgentPerformanceChart (1x1)
     - SelectorHealsChart (1x1)
   - Below: FailureAnalysis (full width)
   - Below: TestExecutionTimeline (full width)
   
   Features:
   - Dark mode toggle (se app suporta)
   - Export como PDF (opcional)
   - Auto-refresh toggle
   - Data range picker

2. Criar /automation-dashboard/src/pages/DetailedAnalysis.jsx:
   
   Page específica para análise profunda:
   - Expandir dados de FailureAnalysis
   - Drilldown por teste/seletor
   - Histórico completo de correções
   - Comparação period-over-period

3. Criar /automation-dashboard/src/components/Filters.jsx:
   
   Componente de filtros:
   - Date range picker
   - Test selector (multi-select)
   - Status filter (pass/fail/flaky)
   - Search box
   - Apply/Clear buttons

4. Criar /automation-dashboard/src/layouts/MainLayout.jsx:
   
   Layout raiz:
   - Sidebar com navegação
   - Header com logo/title
   - Main content area
   - Footer

5. Style com Tailwind:
   - Cores: primária (azul), sucesso (verde), erro (vermelho), warning (amarelo)
   - Spacing e tipografia consistentes
   - Responsive design

Gere React JSX profissional, responsivo,
com boas práticas de layout.
```

---

### ✅ Task 4: Implementar Relatórios Exportáveis

**O que fazer:**
- Criar gerador de relatórios em PDF
- Gerar relatórios em HTML
- Criar resumo executivo
- Implementar agendamento de relatórios

**Arquivos a criar:**
- `/automation-dashboard/src/services/reportGenerator.js` - Geração de relatórios
- `/automation-dashboard/src/components/ReportBuilder.jsx` - UI para criar relatórios

**Checklist:**
- [ ] Relatório PDF gerado com jsPDF
- [ ] Relatório HTML com styles
- [ ] Resumo executivo incluído
- [ ] Gráficos inclusos nos PDFs
- [ ] Download funciona

**Prompt para IA:**
```
Você é um especialista em geração de relatórios com JavaScript.

Preciso criar funcionalidade de geração de relatórios
dos dados do dashboard em PDF e HTML.

Contexto:
- Dados: métricas de testes e agente
- Formatos: PDF e HTML
- Informações: overview, gráficos, tabelas, análises
- Público: stakeholders, gerentes, time de QA

Tarefas:
1. Criar /automation-dashboard/src/services/reportGenerator.js:
   
   Functions:
   - generatePDFReport(metrics, options) → PDF file
   - generateHTMLReport(metrics, options) → HTML string
   - generateSummary(metrics) → executive summary
   - calculateMetrics(metrics) → KPIs principais
   
   PDF content:
   - Capa com data, período, projeto
   - Executive summary (1 página)
   - Key metrics e KPIs
   - Test results overview (gráfico)
   - Failure analysis (tabela)
   - Recommendations para melhoria
   - Appendix com detalhes

2. Usar libraries:
   - jsPDF para PDF
   - html2canvas para renderizar gráficos
   - recharts exports (se suportar)

3. Criar /automation-dashboard/src/components/ReportBuilder.jsx:
   
   UI para:
   - Selecionar período
   - Escolher formato (PDF/HTML)
   - Selecionar seções a incluir
   - Preview
   - Download button

4. Styles profesionales:
   - Branding da empresa
   - Cores corporativas
   - Fontes legíveis
   - Margens e spacing

Gere código JavaScript profissional
para geração de relatórios.
```

---

### ✅ Task 5: Integrar com CI/CD e Notificações

**O que fazer:**
- Criar webhook para receber dados dos testes
- Implementar notificações (email, Slack)
- Integrar com GitHub Actions
- Criar API para POST de resultados

**Arquivos a criar:**
- `/automation-dashboard/src/api/resultsWebhook.js` - Webhook para resultados
- `/automation-dashboard/src/services/notificationService.js` - Notificações

**Checklist:**
- [ ] Webhook recebe POST com resultados
- [ ] Dados salvos corretamente
- [ ] Notificações enviadas (se configurado)
- [ ] Integração com GitHub Actions funciona

**Prompt para IA:**
```
Você é um especialista em integrações e CI/CD.

Preciso criar sistema para o dashboard receber dados automaticamente
dos testes executados em CI/CD.

Contexto:
- Tests rodam em GitHub Actions
- Resultados precisam ser enviados para dashboard
- Dashboard precisa notificar time de falhas críticas
- Notificações: Slack, Email

Tarefas:
1. Criar /automation-dashboard/src/api/resultsWebhook.js:
   
   Express endpoint:
   - POST /api/results
   - Recebe: { testResults, agentMetrics, timestamp, runId }
   - Valida dados
   - Salva em arquivo ou DB
   - Retorna { success: true, id: "..." }
   
   Validação:
   - Schema validation com Zod/Joi
   - Authentication (token)
   - Rate limiting

2. Criar /automation-dashboard/src/services/notificationService.js:
   
   Functions:
   - sendSlackNotification(message, channel, options)
   - sendEmailNotification(to, subject, body, data)
   - determineAlertLevel(metrics) → 'info'|'warning'|'critical'
   
   Triggers:
   - Pass rate cai > 10%
   - Selector heal failure rate > 5%
   - Test timeout issues
   - Critical test failures

3. Criar GitHub Actions workflow que:
   - Roda testes
   - Coleta resultados (JSON)
   - Envia POST para webhook
   - Workflow file: .github/workflows/test-report.yml

4. Gerar .env.example com:
   - WEBHOOK_URL
   - SLACK_TOKEN
   - SLACK_CHANNEL
   - EMAIL_SERVICE
   - EMAIL_FROM

Gere código Node.js/Express profissional
com webhooks e notificações.
```

---

## 📊 Dependências do Módulo Dashboard

```
Dashboard depende de:
├── sample-react-app (lê playwright-report/)
├── agent (lê logs/)
└── .selector-cache.json

Dashboard é usado por:
└── Visualização e análise de métricas
```

---

## 📝 Arquivos Entregáveis

Após completar este módulo, você deve ter:

```
/automation-dashboard/
├── src/
│   ├── components/
│   │   ├── TestHealthOverview.jsx        ✅ NOVO
│   │   ├── TestResultsChart.jsx          ✅ NOVO
│   │   ├── AgentPerformanceChart.jsx     ✅ NOVO
│   │   ├── TestExecutionTimeline.jsx     ✅ NOVO
│   │   ├── FailureAnalysis.jsx           ✅ NOVO
│   │   ├── SelectorHealsChart.jsx        ✅ NOVO
│   │   ├── Filters.jsx                   ✅ NOVO
│   │   ├── ReportBuilder.jsx             ✅ NOVO
│   │   └── ui/                           (já existe)
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx                 ✅ NOVO
│   │   ├── DetailedAnalysis.jsx          ✅ NOVO
│   │   └── NotFound.jsx                  (já existe)
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx                ✅ NOVO
│   │
│   ├── services/
│   │   ├── metricsService.js             ✅ NOVO
│   │   ├── logParser.js                  ✅ NOVO
│   │   ├── reportGenerator.js            ✅ NOVO
│   │   ├── notificationService.js        ✅ NOVO
│   │   └── resultsWebhook.js             ✅ NOVO
│   │
│   ├── hooks/
│   │   ├── useMetrics.js                 ✅ NOVO
│   │   └── useFilters.js                 ✅ NOVO
│   │
│   ├── utils/
│   │   ├── dataTransform.js              ✅ NOVO
│   │   ├── formatters.js                 ✅ NOVO
│   │   └── validators.js                 ✅ NOVO
│   │
│   ├── types/
│   │   └── metrics.d.ts                  ✅ NOVO
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json                          ✅ Atualizado
├── vite.config.js
├── README.md
└── .env.example                          ✅ NOVO
```

---

## ✅ Checklist de Conclusão do Módulo

- [ ] 6+ componentes de visualização criados
- [ ] Sistema de coleta de métricas funciona
- [ ] Dashboard principal implementado
- [ ] Filtros funcionam
- [ ] Relatórios podem ser gerados (PDF/HTML)
- [ ] Webhook para receber dados funciona
- [ ] Notificações (Slack/Email) funcionam
- [ ] Integração CI/CD funciona
- [ ] Performance boa (sem lag)
- [ ] Responsive design funciona
- [ ] Code review aprovado
- [ ] Pronto para merge na master

---

## 📚 Referências

- Recharts: https://recharts.org/
- React Hooks: https://react.dev/reference/react
- jsPDF: https://github.com/parallax/jsPDF
- Tailwind CSS: https://tailwindcss.com/

---

**Próximo Módulo:** `MODULO_CI_CD.md`

