#!/bin/bash
# 🚀 Script de Instalação - AI Agent Playwright 
# Configuração completa do ambiente de auto-correção inteligente
# Versão: 2.0 - Ambiente Funcional Validado

set -e # Para o script imediatamente em caso de erro

echo "🤖 AI Agent Playwright - Sistema de Auto-Correção Inteligente"
echo "==============================================================="
echo "🚀 Configurando ambiente FUNCIONAL e VALIDADO..."
echo ""

# --- Verificações Iniciais Robustas ---
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $2 não encontrado. Por favor, instale antes de continuar."
        echo "   📖 Consulte: https://github.com/edugitQA/AI_agent_Playwright#prerequisites"
        exit 1
    fi
}

echo "🔍 Verificando dependências do sistema..."
check_dependency "python3" "Python 3"
check_dependency "node" "Node.js"
check_dependency "npm" "npm"

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
NODE_VERSION=$(node --version | cut -d'v' -f2)
NPM_VERSION=$(npm --version)

echo "✅ Python $PYTHON_VERSION detectado"
echo "✅ Node.js $NODE_VERSION detectado" 
echo "✅ npm $NPM_VERSION detectado"

# Verificar versões mínimas
PYTHON_MIN="3.9"
NODE_MIN="18.0"

if [ "$(printf '%s\n' "$PYTHON_MIN" "$PYTHON_VERSION" | sort -V | head -n1)" != "$PYTHON_MIN" ]; then
    echo "⚠️  AVISO: Python $PYTHON_VERSION detectado. Recomendado: $PYTHON_MIN+"
fi

if [ "$(printf '%s\n' "$NODE_MIN" "${NODE_VERSION%.*}" | sort -V | head -n1)" != "$NODE_MIN" ]; then
    echo "⚠️  AVISO: Node.js $NODE_VERSION detectado. Recomendado: $NODE_MIN+"
fi
echo ""

# --- 1. Configurar Ambiente Python Isolado ---
echo "🐍 Configurando ambiente Python isolado..."
if [ ! -d "venv" ]; then
    echo "   📦 Criando ambiente virtual 'venv'..."
    python3 -m venv venv
    echo "   ✅ Ambiente virtual criado com sucesso!"
else
    echo "   ℹ️  Ambiente virtual 'venv' já existe."
fi

echo "   🔄 Atualizando pip no ambiente virtual..."
./venv/bin/pip install --upgrade pip --quiet

echo "   📚 Instalando dependências Python (LangGraph + OpenAI)..."
if ./venv/bin/pip install -r requirements.txt --quiet; then
    echo "   ✅ Dependências Python instaladas com sucesso!"
else
    echo "   ❌ Erro ao instalar dependências Python."
    echo "   🔧 Tente executar manualmente: source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

echo "   🧪 Testando importações críticas..."
if ./venv/bin/python -c "import openai, langgraph, beautifulsoup4; print('✅ Módulos AI importados com sucesso!')" 2>/dev/null; then
    echo "   ✅ Agente de IA funcional e pronto!"
else
    echo "   ❌ Erro crítico: Módulos de IA não funcionais."
    echo "   🔧 Verifique se a instalação das dependências foi bem-sucedida."
    exit 1
fi
echo ""

# --- 2. Configurar Ambiente Node.js e Playwright ---
echo "🟢 Configurando ambiente Node.js..."
echo "   📦 Instalando dependências do projeto principal..."
if npm install --silent; then
    echo "   ✅ Dependências Node.js instaladas!"
else
    echo "   ❌ Erro ao instalar dependências Node.js"
    exit 1
fi

echo "   🎭 Instalando navegadores Playwright..."
if npx playwright install --with-deps chromium --quiet; then
    echo "   ✅ Navegador Chromium instalado e configurado!"
else
    echo "   ❌ Erro ao instalar navegadores Playwright"
    exit 1
fi

echo "   ⚛️  Configurando aplicação React de demonstração..."
if npm install --prefix ./sample-react-app --silent; then
    echo "   ✅ Aplicação React configurada!"
else
    echo "   ⚠️  Aviso: Erro na instalação da app React (não crítico)"
fi
echo ""

# --- 3. Configuração OpenAI API ---
echo "🔑 Configurando integração com OpenAI..."
if [ ! -f ".env" ]; then
    echo "   📝 Criando arquivo .env..."
    cat > .env << 'EOF'
# 🤖 Configurações do AI Agent Playwright
# Adicione sua chave da OpenAI API abaixo:
OPENAI_API_KEY=your_openai_api_key_here

# 🎭 Configurações Playwright
HEADLESS=false
SLOW_MO=500

# 🔍 Configurações do Agente
DEBUG_AGENT=false
CACHE_ENABLED=true
EOF
    echo "   ⚠️  IMPORTANTE: Edite o arquivo '.env' e adicione sua chave OpenAI API!"
    echo "   🔗 Obtenha sua chave em: https://platform.openai.com/api-keys"
else
    echo "   ✅ Arquivo .env já configurado."
fi
echo ""

# --- 4. Criação de Diretórios e Estrutura ---
echo "📁 Preparando estrutura do projeto..."
mkdir -p logs dom_snapshots test-results/artifacts playwright-report
echo "   ✅ Diretórios criados: logs, dom_snapshots, test-results, playwright-report"
echo ""

# --- 5. Verificação Final Completa ---
echo "🧪 Executando verificação final completa..."

echo "   🐍 Testando agente Python..."
if ./venv/bin/python -c "
from agent.langgraph_handler import LangGraphSelectorAgent
from agent import LangGraphSelectorAgent, SelectorAnalysis
print('✅ Agente LangGraph funcional!')
" 2>/dev/null; then
    echo "   ✅ Agente de auto-correção VALIDADO!"
else
    echo "   ❌ Erro: Agente Python não funcional"
    exit 1
fi

echo "   🎭 Testando Playwright..."
if npx playwright --version > /dev/null 2>&1; then
    PLAYWRIGHT_VERSION=$(npx playwright --version)
    echo "   ✅ $PLAYWRIGHT_VERSION funcional!"
else
    echo "   ❌ Erro: Playwright não funcional"
    exit 1
fi

echo "   🤖 Verificando integração OpenAI..."
if grep -q "your_openai_api_key_here" .env 2>/dev/null; then
    echo "   ⚠️  OpenAI API Key precisa ser configurada no arquivo .env"
else
    echo "   ✅ Configuração OpenAI detectada!"
fi
echo ""

# --- Instruções Finais ---
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "===================================="
echo ""
echo "🎯 PRÓXIMOS PASSOS ESSENCIAIS:"
echo ""
echo "1️⃣  📝 CONFIGURAR OPENAI API:"
echo "   • Edite o arquivo '.env'"
echo "   • Substitua 'your_openai_api_key_here' pela sua chave real"
echo "   • Obtenha em: https://platform.openai.com/api-keys"
echo ""
echo "2️⃣  🚀 EXECUTAR O SISTEMA (2 Terminais):"
echo ""
echo "   🖥️  TERMINAL 1 - Aplicação React:"
echo "   cd sample-react-app && npm run dev"
echo "   (Aplicação roda em: http://localhost:5173)"
echo ""
echo "   🧪 TERMINAL 2 - Testes com Auto-Correção:"
echo "   source venv/bin/activate"
echo "   npx playwright test login.spec.ts"
echo ""
echo "3️⃣  � MODOS DE EXECUÇÃO:"
echo "   • Modo normal: npx playwright test"
echo "   • Modo visual:  npx playwright test --headed"
echo "   • Interface UI: npx playwright test --ui"
echo "   • Relatórios:   npx playwright show-report"
echo ""
echo "🤖 SISTEMA DE AUTO-CORREÇÃO ATIVO:"
echo "   ✅ Agente LangGraph funcional"
echo "   ✅ Cache de seletores habilitado"
echo "   ✅ Logs detalhados em /logs"
echo "   ✅ DOM snapshots em /dom_snapshots"
echo ""
echo "📚 Documentação completa: README.md"
echo "🆘 Suporte: https://github.com/edugitQA/AI_agent_Playwright/issues"
echo ""
echo "🎭 Happy Testing with AI! 🤖✨"