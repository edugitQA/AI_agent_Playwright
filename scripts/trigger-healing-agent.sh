#!/bin/bash

###############################################################################
# Script: Self-Healing Test Agent Trigger
# Descrição: Dispara o agente de auto-correção para analisar e corrigir testes
# Uso: bash scripts/trigger-healing-agent.sh <test-results-path>
###############################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
AGENT_API_URL="${AGENT_API_URL:-https://ai-agent-playwright-1.onrender.com}"
RESULTS_FILE="${1:-sample-react-app/test-results/results.json}"
LOGS_DIR="logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
HEALING_LOG="${LOGS_DIR}/healing_${TIMESTAMP}.log"

# Criar diretório de logs se não existir
mkdir -p "$LOGS_DIR"

echo -e "${BLUE}🤖 Auto-Healing Test Agent - Trigger${NC}" | tee -a "$HEALING_LOG"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$HEALING_LOG"
echo "Timestamp: $(date)" | tee -a "$HEALING_LOG"
echo "Agent API: $AGENT_API_URL" | tee -a "$HEALING_LOG"

# 1. Verificar se arquivo de resultados existe
if [ ! -f "$RESULTS_FILE" ]; then
    echo -e "${RED}❌ Arquivo de resultados não encontrado: $RESULTS_FILE${NC}" | tee -a "$HEALING_LOG"
    exit 1
fi

echo -e "${GREEN}✅ Arquivo de resultados encontrado${NC}" | tee -a "$HEALING_LOG"

# 2. Ler e processar resultados
echo -e "${YELLOW}📊 Analisando resultados dos testes...${NC}" | tee -a "$HEALING_LOG"

# Extrair falhas usando jq (se disponível)
if command -v jq &> /dev/null; then
    FAILED_TESTS=$(jq '.suites[].tests[] | select(.status != "passed") | {title: .title, error: .error}' "$RESULTS_FILE" 2>/dev/null || echo "[]")
    STATS=$(jq '.stats' "$RESULTS_FILE" 2>/dev/null)
else
    # Fallback se jq não estiver instalado
    STATS=$(grep -o '"failed":[0-9]*' "$RESULTS_FILE" || echo '{"failed": 0}')
fi

echo "Resultados processados:" | tee -a "$HEALING_LOG"
echo "$STATS" | tee -a "$HEALING_LOG"

# 3. Capturar DOM snapshots
echo -e "${YELLOW}📸 Capturando snapshots do DOM...${NC}" | tee -a "$HEALING_LOG"
DOM_SNAPSHOT_DIR="dom_snapshots"
mkdir -p "$DOM_SNAPSHOT_DIR"

# Listar snapshots capturados
if [ "$(ls -A $DOM_SNAPSHOT_DIR)" ]; then
    SNAPSHOT_COUNT=$(ls -1 "$DOM_SNAPSHOT_DIR" | wc -l)
    echo -e "${GREEN}✅ $SNAPSHOT_COUNT snapshots encontrados${NC}" | tee -a "$HEALING_LOG"
else
    echo -e "${YELLOW}⚠️  Nenhum snapshot DOM encontrado${NC}" | tee -a "$HEALING_LOG"
fi

# 4. Preparar payload para o agente
echo -e "${YELLOW}📦 Preparando payload para o agente...${NC}" | tee -a "$HEALING_LOG"

PAYLOAD=$(cat <<EOF
{
  "repository": "${GITHUB_REPOSITORY:-local-dev}",
  "run_id": "${GITHUB_RUN_ID:-manual}",
  "branch": "${GITHUB_REF##*/:-unknown}",
  "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "test_results": $(cat "$RESULTS_FILE"),
  "snapshots_available": $([ -d "$DOM_SNAPSHOT_DIR" ] && echo "true" || echo "false")
}
EOF
)

echo "Payload preparado (primeiras 500 chars):" | tee -a "$HEALING_LOG"
echo "$PAYLOAD" | head -c 500 | tee -a "$HEALING_LOG"
echo "..." | tee -a "$HEALING_LOG"

# 5. Enviar para agente
echo -e "${YELLOW}🚀 Enviando para agente de auto-correção...${NC}" | tee -a "$HEALING_LOG"

RESPONSE=$(curl -s -X POST "$AGENT_API_URL/analyze" \
  -H "Content-Type: application/json" \
  -H "User-Agent: PlaywrightTestRunner/1.0" \
  -d "$PAYLOAD" \
  --max-time 300 \
  --connect-timeout 10 \
  -w "\n%{http_code}" 2>&1)

# Separar response e status code
HTTP_STATUS=$(echo "$RESPONSE" | tail -1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "Status HTTP: $HTTP_STATUS" | tee -a "$HEALING_LOG"

# 6. Processar resposta
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "202" ]; then
    echo -e "${GREEN}✅ Agente acionado com sucesso!${NC}" | tee -a "$HEALING_LOG"
    echo "Resposta:" | tee -a "$HEALING_LOG"
    echo "$RESPONSE_BODY" | tee -a "$HEALING_LOG"
    
    # Extrair sugestões se disponível
    if command -v jq &> /dev/null; then
        echo -e "\n${BLUE}📋 Recomendações do Agente:${NC}" | tee -a "$HEALING_LOG"
        echo "$RESPONSE_BODY" | jq '.recommendations[]' 2>/dev/null | tee -a "$HEALING_LOG" || true
    fi
    
    exit 0
else
    echo -e "${RED}❌ Erro ao acionar agente (HTTP $HTTP_STATUS)${NC}" | tee -a "$HEALING_LOG"
    echo "Resposta:" | tee -a "$HEALING_LOG"
    echo "$RESPONSE_BODY" | tee -a "$HEALING_LOG"
    exit 1
fi
