# Configuração da Pipeline CI/CD com Auto-Correção de Seletores

Este guia explica como configurar a pipeline CI/CD para executar testes Playwright com o sistema de auto-correção de seletores. A integração é feita com GitHub Actions e permite testar aplicações React hospedadas no Vercel.

## 📋 Pré-requisitos

1. Conta no GitHub
2. Conta na OpenAI (para API Key)
3. Aplicação React hospedada no Vercel (ou outro serviço similar)

## 🚀 Configuração do GitHub Actions

### 1. Adicionar Segredos no GitHub

1. Acesse seu repositório no GitHub
2. Vá para **Settings > Secrets and variables > Actions**
3. Adicione os seguintes segredos:
   - `OPENAI_API_KEY`: Sua chave da API OpenAI

### 2. Configurar URL da Aplicação

Ao executar o workflow manualmente, você pode especificar a URL da sua aplicação no Vercel:

1. Vá para **Actions > E2E Tests com Auto-Correção > Run workflow**
2. Digite a URL da sua aplicação Vercel no campo `app_url`
3. Clique em **Run workflow**

Alternativamente, você pode editar o arquivo `.github/workflows/e2e-tests.yml` e modificar o valor padrão:

```yaml
app_url:
  description: 'URL da aplicação (padrão: produção)'
  required: false
  default: 'https://sua-app-react.vercel.app'
```

## 📊 Relatórios e Artefatos

Após a execução dos testes, os seguintes artefatos são gerados:

1. **Relatório de Testes Playwright**: HTML padrão do Playwright
2. **Relatório do Agente**: Detalhes sobre as correções realizadas
3. **Histórico de Seletores**: Análise das mudanças nos seletores ao longo do tempo
4. **Snapshots do DOM**: Capturas para análise

Para visualizar:
1. Acesse a execução do workflow concluída
2. Vá para a aba **Artifacts**
3. Baixe os artefatos gerados

## 🔄 Execução Programada

O workflow está configurado para executar automaticamente:

- **A cada push** para os branches `main` e `master`
- **A cada PR** para os branches `main` e `master`
- **Todos os dias às 3h da manhã** (cronograma configurável)

Para modificar o agendamento, edite a seção `cron` no arquivo `.github/workflows/e2e-tests.yml`.

## 🔧 Executando Localmente

Para executar os testes localmente antes de usar a pipeline:

```bash
# Instalar dependências
npm ci
pip install -r agent/requirements.txt

# Executar aplicação React local
npm run start:app

# Em outro terminal, executar os testes
npm test

# Gerar relatórios
npm run all-reports
```

## 🚀 Implantação no Vercel

1. Faça o deploy da aplicação React no Vercel
2. Copie a URL da aplicação implantada
3. Use essa URL na configuração do workflow ou ao executá-lo manualmente

## 📚 Documentação Adicional

- [Guia de Resolução de Problemas](./docs/troubleshooting.md)
- [Detalhes do Agente de Auto-Correção](./docs/agent-details.md)
- [Tutorial de Customização](./docs/customization.md)
