#!/bin/bash
# Script para executar testes com simulação de quebra de seletores

# Verificar se o script está sendo executado da raiz do projeto
if [ ! -f "package.json" ]; then
  echo "❌ Erro: Execute este script da raiz do projeto"
  exit 1
fi

# Verificar dependências
if ! command -v node &> /dev/null; then
  echo "❌ Erro: Node.js não está instalado"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ Erro: npm não está instalado"
  exit 1
fi

# Função para exibir mensagem colorida
print_message() {
  local color=$1
  local message=$2
  
  case $color in
    "green") echo -e "\033[0;32m$message\033[0m" ;;
    "red") echo -e "\033[0;31m$message\033[0m" ;;
    "yellow") echo -e "\033[0;33m$message\033[0m" ;;
    "blue") echo -e "\033[0;34m$message\033[0m" ;;
    *) echo "$message" ;;
  esac
}

# Configurações
REACT_APP_DIR="./sample-react-app"
TEST_SPEC=${1:-"contact-form.spec.ts"}

# Verificar se a aplicação React existe
if [ ! -d "$REACT_APP_DIR" ]; then
  print_message "red" "❌ Erro: Diretório da aplicação React não encontrado: $REACT_APP_DIR"
  exit 1
fi

# 1. Verificar se a aplicação está em execução
print_message "blue" "🔍 Verificando se a aplicação React está em execução..."
if ! curl -s http://localhost:5173 > /dev/null; then
  print_message "yellow" "⚠️ Aplicação React não está em execução. Iniciando..."
  
  # Iniciar a aplicação React em segundo plano
  cd "$REACT_APP_DIR" || exit 1
  npm install > /dev/null
  npm run dev &
  
  # Armazenar o PID do processo
  REACT_APP_PID=$!
  
  # Voltar ao diretório raiz
  cd - > /dev/null || exit 1
  
  # Aguardar a aplicação iniciar
  print_message "yellow" "⏳ Aguardando a aplicação React iniciar..."
  while ! curl -s http://localhost:5173 > /dev/null; do
    sleep 2
  done
else
  print_message "green" "✅ Aplicação React já está em execução"
fi

# 2. Fazer backup dos arquivos originais
print_message "blue" "📦 Fazendo backup dos arquivos originais..."
node .github/scripts/simulate-breaks.js backup

# 3. Aplicar modificações que quebram seletores
print_message "blue" "🔨 Aplicando modificações que quebram seletores..."
node .github/scripts/simulate-breaks.js break

# 4. Executar os testes específicos
print_message "blue" "🧪 Executando testes para $TEST_SPEC..."
npx playwright test "$TEST_SPEC"
TEST_EXIT_CODE=$?

# 5. Restaurar os arquivos originais
print_message "blue" "🔄 Restaurando arquivos originais..."
node .github/scripts/simulate-breaks.js restore

# 6. Gerar relatório do agente
print_message "blue" "📊 Gerando relatório do agente..."
node .github/scripts/generate-agent-report.js

# 7. Apresentar resultado
if [ $TEST_EXIT_CODE -eq 0 ]; then
  print_message "green" "✅ Testes concluídos com sucesso! O agente corrigiu os seletores."
else
  print_message "red" "❌ Testes falharam. Verifique os logs para mais detalhes."
fi

# Se a aplicação foi iniciada por este script, encerrar
if [ -n "$REACT_APP_PID" ]; then
  print_message "yellow" "⏹️ Encerrando aplicação React..."
  kill "$REACT_APP_PID"
fi

print_message "blue" "🔍 Relatório HTML disponível em: test-artifacts/reports/agent-report.html"

exit $TEST_EXIT_CODE
