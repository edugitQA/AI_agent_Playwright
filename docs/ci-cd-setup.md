## Configuração do Ambiente CI/CD com Agente de Auto-Correção

Este guia descreve como configurar e utilizar a pipeline CI/CD do GitHub Actions com o agente de auto-correção para testes Playwright.

### 🚀 Requisitos

- Repositório GitHub com o código do projeto
- GitHub Actions habilitado
- Chave API da OpenAI para o agente de auto-correção

### 📋 Estrutura de Arquivos

```
.github/
  ├── workflows/
  │   └── e2e-tests.yml      # Configuração da pipeline
  └── scripts/
      ├── generate-agent-report.js   # Gerador de relatórios
      └── simulate-breaks.js         # Simulador de quebras de seletores

agent/
  ├── __init__.py
  ├── langgraph_handler.py
  ├── python_bridge.py
  ├── self_healing_runner.js
  └── requirements.txt       # Dependências Python do agente

tests/
  ├── pages/                 # Page Objects com auto-correção
  └── *.spec.ts              # Testes E2E

playwright.config.js         # Configuração do Playwright
```

### 🔧 Configuração Inicial

1. **Configurar Secrets no GitHub**
   - Acesse as configurações do repositório: Settings > Secrets and variables > Actions
   - Adicione o secret `OPENAI_API_KEY` com sua chave API da OpenAI

2. **Estrutura do Projeto**
   - Certifique-se de que a estrutura do projeto está conforme descrita acima
   - Verifique se o agente de auto-correção está corretamente configurado

### 🏃‍♂️ Executando a Pipeline

#### Via Interface Web

1. Acesse a aba "Actions" no GitHub
2. Selecione o workflow "E2E Tests com Auto-Correção"
3. Clique em "Run workflow"
4. Opcionalmente, configure:
   - **Debug Mode**: Ative para executar em modo debug
   - **Test Filter**: Especifique um arquivo de teste específico

#### Via Commit/Push

A pipeline será executada automaticamente em:
- Push para as branches main/master
- Pull Requests para main/master

### 🧪 Testes de Simulação de Falhas

Para testar se o agente está funcionando corretamente, você pode simular falhas de seletores:

```bash
# 1. Fazer backup dos arquivos originais
node .github/scripts/simulate-breaks.js backup

# 2. Aplicar modificações que quebram seletores
node .github/scripts/simulate-breaks.js break

# 3. Executar os testes (o agente deve corrigir os seletores)
npx playwright test

# 4. Restaurar os arquivos originais
node .github/scripts/simulate-breaks.js restore
```

### 📊 Analisando Resultados

Após a execução da pipeline, você terá acesso aos seguintes artefatos:

1. **Relatório do Playwright**: Resultados detalhados dos testes
2. **Relatório do Agente**: Estatísticas de auto-correção, incluindo:
   - Total de invocações do agente
   - Número de correções bem-sucedidas
   - Taxa de sucesso
   - Tempo médio de processamento
   - Lista de seletores corrigidos

3. **Snapshots DOM**: Capturas do DOM no momento das falhas
4. **Logs do Agente**: Registros detalhados da atividade do agente

### 🔍 Depuração

Se os testes falharem mesmo com o agente:

1. Verifique os logs do agente em `logs/langgraph_agent.log`
2. Analise os snapshots DOM em `dom_snapshots/`
3. Confira se as descrições de elementos para o agente são detalhadas o suficiente
4. Verifique se a chave API da OpenAI está configurada corretamente

### 📝 Boas Práticas

1. **Descrições Detalhadas**: Forneça descrições ricas para o agente identificar elementos
   ```typescript
   // Bom exemplo
   'Campo de texto para email com placeholder "seu@email.com" localizado abaixo do título "Login"'
   
   // Exemplo ruim
   'campo de email'
   ```

2. **Tratamento de Timeout**: Configure timeouts adequados para dar tempo ao agente
   ```typescript
   // No arquivo playwright.config.js
   timeout: 60000,  // 60 segundos para timeout global
   expect: {
     timeout: 10000  // 10 segundos para assertions
   }
   ```

3. **Logs Detalhados**: Inclua logs informativos nos testes
   ```typescript
   console.log('🔍 Verificando elemento que pode precisar de auto-correção...');
   ```

### 🚨 Solução de Problemas

| Problema | Solução |
|----------|---------|
| Agente não é acionado | Verifique se os seletores realmente mudaram e se o padrão try/catch está implementado |
| Agente falha ao corrigir | Melhore as descrições de elementos, verifique o DOM atual |
| Testes muito lentos | Ajuste os parâmetros do agente para limitar tentativas ou usar cache |
| Erros de API da OpenAI | Verifique o secret OPENAI_API_KEY e os limites da sua conta |

### 📚 Recursos Adicionais

- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Documentação da API da OpenAI](https://platform.openai.com/docs/api-reference)
