#!/bin/bash
# Script de instalação do ambiente Playwright Agent
# Execute este script para configurar todo o ambiente de desenvolvimento

set -e  # Para parar em caso de erro

echo "🚀 Configurando ambiente do Playwright Agent com Auto-Correção..."
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.9+ antes de continuar."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar."
    exit 1
fi

# Verificar versões
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
NODE_VERSION=$(node --version | cut -d'v' -f2)

echo "✅ Python $PYTHON_VERSION detectado"
echo "✅ Node.js $NODE_VERSION detectado"
echo ""

# 1. Configurar ambiente Python
echo "🐍 Configurando ambiente Python..."
if [ ! -d "venv" ]; then
    echo "   Criando ambiente virtual..."
    python3 -m venv venv
fi

echo "   Ativando ambiente virtual..."
source venv/bin/activate

echo "   Atualizando pip..."
pip install --upgrade pip

echo "   Instalando dependências Python..."
pip install -r requirements.txt

echo "✅ Ambiente Python configurado!"
echo ""

# 2. Configurar ambiente Node.js
echo "🟢 Configurando ambiente Node.js..."
echo "   Instalando dependências do projeto principal..."
npm install

echo "   Instalando navegadores do Playwright..."
npx playwright install

echo "   Configurando aplicação React de exemplo..."
cd sample-react-app
npm install --legacy-peer-deps
cd ..

echo "✅ Ambiente Node.js configurado!"
echo ""

# 3. Verificar arquivo .env
echo "🔑 Verificando configuração da API OpenAI..."
if [ ! -f ".env" ]; then
    echo "   Criando arquivo .env de exemplo..."
    cat > .env << EOL
# Configuração da OpenAI API
OPENAI_API_KEY=sua-chave-api-aqui

# Configurações do Playwright (opcional)
PLAYWRIGHT_TIMEOUT=30000
PLAYWRIGHT_HEADLESS=false

# Configurações do agente (opcional)
AGENT_LOG_LEVEL=INFO
AGENT_MAX_RETRIES=3
EOL
    echo "   ⚠️  Arquivo .env criado. IMPORTANTE: Adicione sua chave da OpenAI API!"
    echo "      Edite o arquivo .env e substitua 'sua-chave-api-aqui' pela sua chave real."
else
    echo "   ✅ Arquivo .env já existe."
fi
echo ""

# 4. Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p logs
mkdir -p dom_snapshots
mkdir -p test-results/artifacts
echo "✅ Diretórios criados!"
echo ""

# 5. Testar instalação
echo "🧪 Testando instalação..."
echo "   Testando importação das bibliotecas Python..."
python3 -c "
import langgraph
import openai
import beautifulsoup4
print('✅ Bibliotecas Python importadas com sucesso!')
"

echo "   Testando Playwright..."
npx playwright --version

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure sua chave da OpenAI API no arquivo .env"
echo "   2. Ative o ambiente virtual: source venv/bin/activate"
echo "   3. Inicie a aplicação React: npm run dev"
echo "   4. Execute os testes: npx playwright test"
echo ""
echo "📖 Para mais informações, consulte o README.md"
