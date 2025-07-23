# Automação de Testes com Auto-Correção de Seletores (Playwright + LangGraph)

Este projeto é uma Prova de Conceito (PoC) que demonstra uma solução inovadora para automação de testes End-to-End (E2E) em aplicações React. Utilizando Playwright, LangGraph e agentes autônomos baseados em IA, o sistema detecta e corrige automaticamente falhas de seletores no DOM, garantindo robustez frente a mudanças frequentes em aplicações modernas.

## Visão Geral

A solução foi projetada para resolver um dos maiores desafios em testes E2E: a fragilidade dos seletores. Combinando análise de DOM, aprendizado de máquina e integração com a OpenAI, o sistema:

- Detecta falhas automaticamente durante a execução dos testes.
- Analisa o DOM atual da aplicação para identificar mudanças.
- Sugere novos seletores com base em atributos confiáveis.
- Aplica os seletores corrigidos dinamicamente e reexecuta os testes.

## Funcionalidades

O sistema oferece as seguintes funcionalidades principais:

- **Detecção Automática de Falhas:** Identifica automaticamente quando um elemento não é encontrado durante a execução dos testes E2E.
- **Análise Inteligente do DOM:** Utiliza o agente LangGraph para analisar o DOM atual da aplicação e identificar mudanças estruturais ou de atributos.
- **Sugestão de Seletores Otimizados:** Gera sugestões de novos seletores com base em atributos confiáveis, como texto visível, classes, hierarquia pai-filho e outros critérios relevantes.
- **Auto-Correção Dinâmica:** Aplica os novos seletores sugeridos em tempo de execução e reexecuta os testes quebrados sem intervenção manual.
- **Logs Detalhados:** Gera logs abrangentes para cada etapa do processo, incluindo falhas detectadas, seletores sugeridos e resultados das correções.
- **Relatórios Interativos:** Produz relatórios HTML detalhados com resultados dos testes, capturas de tela e traces de execução para facilitar a análise.
- **Integração com OpenAI:** Utiliza modelos de linguagem avançados para melhorar a análise do DOM e a geração de seletores.
- **Compatibilidade com Aplicações React:** Projetado para lidar com a dinâmica de aplicações React modernas, onde mudanças frequentes no DOM são comuns.

## Estrutura do Projeto

```
/playwright-agent/
├── sample-react-app/       # Aplicação React de exemplo
├── tests/                  # Scripts de teste Playwright
├── agent/                  # Lógica do agente LangGraph
├── dom_snapshots/          # Snapshots do DOM para análise
├── logs/                   # Logs de execução e aprendizado
├── README.md               # Documentação do projeto
├── package.json            # Dependências do projeto
├── playwright.config.ts    # Configuração do Playwright
```

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

- **Node.js (18.x ou superior)**: Inclui `npm` e `npx`.
- **Python (3.9 ou superior)**: Recomendado Python 3.11.
- **Git**: Para clonar o repositório.

## Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone https://github.com/edugitQA/AI_agent_playright.git
cd AI_agent_playright
```

### 2. Configurar Ambiente Python

1. Criar e ativar um ambiente virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate   # Windows
   ```

2. Instalar dependências:
   ```bash
   pip install langgraph openai beautifulsoup4 lxml langchain-openai
   ```

### 3. Configurar Ambiente Node.js

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Instalar navegadores do Playwright:
   ```bash
   npx playwright install
   ```

### 4. Configurar Variáveis de Ambiente

1. Criar um arquivo `.env` na raiz do projeto.
2. Adicionar a chave da API OpenAI:
   ```
   OPENAI_API_KEY=SUA_CHAVE_API_OPENAI
   ```

## Como Executar

1. Iniciar a aplicação React de exemplo:
   ```bash
   npm run dev
   ```

2. Executar os testes Playwright:
   ```bash
   npx playwright test
   ```

## Aplicação React de Testes

O projeto inclui uma aplicação React de exemplo localizada no diretório `sample-react-app/`. Esta aplicação serve como alvo para os testes E2E e simula cenários reais de interação com o usuário. Ela foi projetada para ser simples, mas suficientemente robusta para demonstrar as capacidades do sistema de auto-correção de seletores.

### Estrutura da Aplicação React

```
sample-react-app/
├── src/                    # Código-fonte principal
│   ├── App.jsx            # Componente principal da aplicação
│   ├── components/        # Componentes reutilizáveis da interface
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Funções utilitárias
│   └── assets/            # Recursos estáticos (imagens, ícones, etc.)
├── public/                # Arquivos públicos (favicon, index.html)
├── package.json           # Dependências e scripts do projeto
├── vite.config.js         # Configuração do Vite
```

### Como Iniciar a Aplicação React

1. Navegue até o diretório da aplicação React:
   ```bash
   cd sample-react-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev -- --host
   ```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal). Certifique-se de mantê-la em execução enquanto realiza os testes E2E.

## 5. Resolução de Problemas Comuns

-   **`Error: Cannot find module '...'` (no Playwright):** Certifique-se de que você está no diretório raiz do projeto (`playwright-agent/`) ao executar `npm install` e `npx playwright test`.
-   **`FileNotFoundError: [Errno 2] No such file or directory: '...'` (no Python):** Verifique os caminhos dos arquivos. Certifique-se de que o ambiente virtual Python está ativado e que os diretórios `logs/` e `dom_snapshots/` existem na raiz do projeto.
-   **`Error: browserType.launch: Target page, context or browser has been closed`:** Certifique-se de que a aplicação React de exemplo (`sample-react-app`) está rodando e acessível em `http://localhost:5173` antes de executar os testes Playwright.
-   **Problemas com a API da OpenAI:** Verifique se sua `OPENAI_API_KEY` está corretamente configurada no arquivo `.env` e se você tem acesso à internet. Erros como `400 Bad Request` ou `Unsupported model` podem indicar problemas com a chave ou o modelo selecionado (o projeto usa `gpt-4.1-mini`).

## 5.1. Erro ao Instalar ou Rodar a Aplicação React de Exemplo (Vite não encontrado ou conflito de dependências)

Se ao tentar rodar a aplicação React de exemplo (`npm run dev` dentro de `sample-react-app/`) você receber um erro semelhante a:

```
sh: 1: vite: not found
```
ou um erro de conflito de dependências como:

```
npm error ERESOLVE unable to resolve dependency tree
```

Isso ocorre devido a conflitos entre versões de pacotes (por exemplo, `date-fns` e `react-day-picker`). Para resolver rapidamente:

1. Certifique-se de estar no diretório `sample-react-app`:
   ```bash
   cd sample-react-app
   ```
2. Instale o Vite ignorando conflitos de dependências:
   ```bash
   npm install vite --save-dev --legacy-peer-deps
   ```
3. Agora rode normalmente:
   ```bash
   npm run dev -- --host
   ```

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m 'Minha nova feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.