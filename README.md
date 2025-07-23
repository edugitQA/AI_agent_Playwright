# PoC: Automação de Testes com Auto-Correção de Seletores (Playwright + LangGraph)

Este projeto demonstra uma Prova de Conceito (PoC) para um sistema de automação de testes E2E que utiliza Playwright, LangGraph e agentes autônomos para detectar e corrigir automaticamente falhas de XPath/componentes alterados no DOM em aplicações React. O objetivo é fornecer uma solução para ambientes de desenvolvimento e CI, onde a dinâmica das aplicações React frequentemente causa quebras nos testes E2E devido a mudanças nos seletores.

## Estrutura do Projeto

```
/playwright-agent/
├── tests/                  # Contém os scripts de teste Playwright
│   └── login.spec.ts       # Exemplo de teste de login
├── agent/                  # Contém a lógica do agente LangGraph
│   └── langgraph_handler.py # Handler para o agente LangGraph
├── dom_snapshots/          # Armazena snapshots do DOM em caso de falha
├── logs/                   # Logs de execução e aprendizado do agente
├── README.md               # Este arquivo
├── package.json            # Dependências do projeto React (se aplicável)
├── tsconfig.json           # Configuração TypeScript (se aplicável)
├── playwright.config.ts    # Configuração do Playwright
```

## Funcionalidades

- **Detecção de Falhas:** Identifica automaticamente quando um elemento não é encontrado durante a execução do teste Playwright.
- **Análise do DOM:** Utiliza o agente LangGraph para analisar o DOM atual da aplicação.
- **Sugestão de Seletores:** Gera sugestões de novos seletores (baseados em texto visível, classe, estrutura pai-filho, etc.) usando o LLM da OpenAI.
- **Auto-Correção:** Aplica o novo seletor dinamicamente e reexecuta o teste quebrado.

## Como Rodar Localmente

Instruções detalhadas serão fornecidas aqui após a implementação completa da PoC.

## Escalabilidade e Melhorias Futuras

Sugestões para escalar esta solução para times de QA reais e futuras melhorias serão documentadas aqui.

