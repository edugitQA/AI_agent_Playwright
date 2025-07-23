# Guia de Configuração de Ambiente e Execução do Projeto

Este documento detalha as etapas necessárias para configurar o ambiente de desenvolvimento e executar o projeto de Prova de Conceito (PoC) de Auto-Correção de Testes E2E. Ele abrange desde os pré-requisitos de software até a execução dos testes e visualização dos resultados.

## 1. Visão Geral do Projeto

Esta PoC demonstra um sistema de automação de testes End-to-End (E2E) que utiliza Playwright, LangGraph e agentes autônomos baseados em Inteligência Artificial para detectar e corrigir automaticamente falhas de seletores (XPath/componentes alterados no DOM) em aplicações React. O projeto é composto por:

-   **`sample-react-app/`**: Uma aplicação React de exemplo que serve como alvo para os testes.
-   **`tests/`**: Os scripts de teste Playwright, incluindo a lógica de auto-correção.
-   **`agent/`**: Os componentes Python (LangGraph, OpenAI) que realizam a análise do DOM e a sugestão de seletores.
-   **`logs/`**: Diretório para logs de execução e análises geradas.
-   **`dom_snapshots/`**: Diretório para snapshots do DOM utilizados na análise.

## 2. Pré-requisitos de Software

Para executar este projeto, você precisará dos seguintes softwares instalados em seu sistema:

-   **Node.js (versão 18.x ou superior)**: Inclui o `npm` (Node Package Manager) e `npx`.
    -   Verifique a instalação: `node -v` e `npm -v`
-   **Python (versão 3.9 ou superior)**: Recomendamos Python 3.11.
    -   Verifique a instalação: `python3 --version`
-   **Git**: Para clonar o repositório do projeto.
    -   Verifique a instalação: `git --version`

## 3. Configuração do Ambiente

Siga os passos abaixo para configurar o ambiente do projeto.

### 3.1. Navegar para o Diretório do Projeto

Assumindo que você já tem o projeto em seu ambiente (seja por ter clonado de um repositório Git ou por ter recebido o arquivo ZIP e descompactado), navegue até o diretório raiz do projeto:

```bash
cd /caminho/para/seu/playwright-agent
# Exemplo: cd /home/ubuntu/playwright-agent
```

### 3.2. Configuração do Ambiente Python

É altamente recomendável criar um ambiente virtual Python para isolar as dependências do projeto de outras instalações Python em seu sistema.

1.  **Criar Ambiente Virtual:**
    ```bash
    python3 -m venv venv
    ```

2.  **Ativar Ambiente Virtual:**
    -   **Linux/macOS:**
        ```bash
        source venv/bin/activate
        ```
    -   **Windows (Command Prompt):**
        ```bash
        venv\Scripts\activate.bat
        ```
    -   **Windows (PowerShell):**
        ```bash
        venv\Scripts\Activate.ps1
        ```
    *(Você saberá que o ambiente está ativo quando `(venv)` aparecer no início da sua linha de comando.)*

3.  **Instalar Dependências Python:**
    Com o ambiente virtual ativado, instale as bibliotecas Python necessárias:
    ```bash
    pip install langgraph openai beautifulsoup4 lxml langchain-openai
    ```

### 3.3. Configuração do Ambiente Node.js (Playwright)

1.  **Instalar Dependências Node.js:**
    Navegue para o diretório raiz do projeto (`playwright-agent/`) e instale as dependências do Playwright e do `dotenv`:
    ```bash
    npm install
    ```
    Isso instalará o Playwright e outras dependências definidas no `package.json`.

2.  **Instalar Navegadores do Playwright:**
    O Playwright precisa de navegadores específicos para executar os testes. Instale-os com:
    ```bash
    npx playwright install
    ```

### 3.4. Configuração de Variáveis de Ambiente (`.env`)

O projeto utiliza variáveis de ambiente para configurar a chave da API da OpenAI. Você deve criar um arquivo `.env` na raiz do diretório `playwright-agent/`.

1.  **Criar o arquivo `.env`:**
    Na raiz do projeto (`playwright-agent/`), crie um arquivo chamado `.env` (se ele já não existir).

2.  **Adicionar sua Chave de API:**
    Abra o arquivo `.env` e adicione sua chave de API da OpenAI. Substitua `SUA_CHAVE_API_OPENAI` pela sua chave real.
    ```
    OPENAI_API_KEY=SUA_CHAVE_API_OPENAI
    ```
    **Importante:** Nunca compartilhe seu arquivo `.env` ou sua chave de API publicamente. Se você acidentalmente expôs uma chave, revogue-a imediatamente no painel da OpenAI e gere uma nova.

## 4. Execução do Projeto

Com o ambiente configurado, você pode iniciar a aplicação de teste e executar os testes de auto-correção.

### 4.1. Iniciar a Aplicação React de Exemplo (Front-end de Testes)

Os testes E2E precisam de uma aplicação web para interagir. Inicie a aplicação React de exemplo em um terminal separado.

1.  **Navegar para o diretório da aplicação React:**
    ```bash
    cd sample-react-app
    ```

2.  **Instalar dependências da aplicação React (se ainda não o fez):**
    ```bash
    npm install
    ```

3.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    npm run dev -- --host
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal). Mantenha este terminal aberto enquanto executa os testes.

### 4.2. Executar os Testes Playwright

Abra um **novo terminal** e navegue de volta para o diretório raiz do projeto (`playwright-agent/`). Certifique-se de que seu ambiente virtual Python esteja ativado neste terminal também (`source venv/bin/activate`).

1.  **Executar todos os testes (incluindo os de auto-correção):**
    ```bash
    npx playwright test
    ```
    O Playwright executará os testes em modo headless (sem interface gráfica visível) por padrão, conforme configurado no `playwright.config.ts`.

2.  **Executar um teste específico (ex: o teste de login):**
    ```bash
    npx playwright test tests/login.spec.ts
    ```

Durante a execução, você verá mensagens no console indicando o progresso da auto-correção, a detecção de seletores quebrados, a chamada ao agente Python e as sugestões de novos seletores.

### 4.3. Visualizar Logs e Relatórios

O projeto gera logs detalhados e um relatório HTML dos testes.

-   **Logs do Agente LangGraph e Tentativas de Correção:**
    Os logs do agente Python e os arquivos JSON de análise e tentativas de correção são salvos no diretório `playwright-agent/logs/`.
    Você pode visualizá-los com um editor de texto ou usando comandos como `cat` ou `less`:
    ```bash
    cat logs/langgraph_agent.log
    cat logs/healing_attempt_*.json
    ```

-   **Relatório HTML do Playwright:**
    Após a execução dos testes, o Playwright gera um relatório HTML interativo. Para abri-lo:
    ```bash
    npx playwright show-report
    ```
    Isso abrirá um servidor web local e seu navegador padrão para exibir o relatório, onde você pode ver os resultados de cada teste, capturas de tela e traces de execução.

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

A aplicação deve iniciar em `http://localhost:5173`. Se persistirem problemas, verifique se todas as dependências estão instaladas corretamente e repita o processo.

Se você encontrar outros problemas, consulte a documentação oficial do Playwright, LangGraph e OpenAI, ou verifique os logs detalhados gerados pelo sistema para mais informações.

