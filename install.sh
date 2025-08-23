#!/bin/bash
# Script de instalação aprimorado para o ambiente Playwright Agent
# Garante que as dependências sejam instaladas nos locais corretos e verifica a instalação.

set -e # Para o script imediatamente em caso de erro

echo "🚀 Configurando ambiente do Playwright Agent com Auto-Correção (Versão Aprimorada)..."
echo ""

# --- Verificações Iniciais ---
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.9+ antes de continuar."
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
NODE_VERSION=$(node --version | cut -d'v' -f2)

echo "✅ Python $PYTHON_VERSION detectado"
echo "✅ Node.js $NODE_VERSION detectado"
echo ""

# --- 1. Configurar Ambiente Python (de forma mais robusta) ---
echo "🐍 Configurando ambiente Python..."
if [ ! -d "venv" ]; then
    echo "   Criando ambiente virtual 'venv'..."
    python3 -m venv venv
fi

echo "   Instalando dependências Python DENTRO do ambiente virtual..."
# Executa o pip de dentro do venv para garantir o contexto correto
./venv/bin/pip install --upgrade pip > /dev/null
./venv/bin/pip install -r requirements.txt

echo "   Verificando instalação das dependências..."
# Usa o python do venv para verificar se um pacote chave foi instalado
if ! ./venv/bin/python -c "import beautifulsoup4" &> /dev/null; then
    echo "❌ Erro Crítico: Falha ao instalar as dependências Python."
    echo "   Por favor, ative o ambiente virtual manualmente ('source venv/bin/activate') e rode 'pip install -r requirements.txt'."
    exit 1
fi
echo "✅ Ambiente Python configurado com sucesso!"
echo ""

# --- 2. Configurar Ambiente Node.js (sem precisar entrar e sair de pastas) ---
echo "🟢 Configurando ambiente Node.js..."
echo "   Instalando dependências do projeto principal (Playwright)..."
npm install

echo "   Instalando os navegadores do Playwright..."
npx playwright install --with-deps

echo "   Instalando dependências da aplicação React de exemplo..."
# O comando --prefix executa o npm install no diretório especificado
npm install --prefix ./sample-react-app

echo "✅ Ambiente Node.js configurado!"
echo ""

# --- 3. Configuração de Arquivos e Diretórios ---
echo "🔑 Verificando configuração da API OpenAI..."
if [ ! -f ".env" ]; then
    echo "   Criando arquivo .env de exemplo..."
    cp .env.example .env
    echo "   ⚠️  Arquivo .env criado. IMPORTANTE: Adicione sua chave da OpenAI API!"
else
    echo "   ✅ Arquivo .env já existe."
fi
echo ""

echo "📁 Criando diretórios necessários (logs, snapshots)..."
mkdir -p logs dom_snapshots test-results/artifacts
echo "✅ Diretórios criados!"
echo ""

# --- 4. Verificação Final ---
echo "🧪 Testando a instalação final..."
./venv/bin/python -c "import langgraph, openai, beautifulsoup4; print('✅ Bibliotecas Python importadas com sucesso!')"
npx playwright --version
echo ""

# --- Instruções Finais (Mais Claras) ---
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "   1. Abra o arquivo '.env' e adicione sua chave da OpenAI API."
echo "   2. IMPORTANTE: Para rodar os comandos manualmente, você precisa de dois terminais."
echo ""
echo "   ➡️  No Terminal 1 (para rodar a aplicação):"
echo "      source venv/bin/activate"
echo "      npm run dev"
echo "      (A aplicação estará rodando em http://localhost:5173)"
echo ""
echo "   ➡️  No Terminal 2 (para rodar os testes):"
echo "      source venv/bin/activate"
echo "      npx playwright test"
echo ""
echo "📖 Para uma experiência visual, use: npx playwright test --ui"