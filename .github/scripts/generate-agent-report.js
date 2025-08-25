// .github/scripts/generate-agent-report.js

const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÕES ---
const LOG_DIR = path.join(process.cwd(), 'logs');
const METRICS_DIR = path.join(process.cwd(), 'metrics');
const ACTIVITY_LOG_PATH = path.join(METRICS_DIR, 'agent_activity.log');

function main() {
    console.log('🚀 Iniciando coleta de novas atividades do agente...');

    if (!fs.existsSync(LOG_DIR)) {
        console.log('🟡 Diretório de logs não encontrado. Nenhuma atividade para registrar.');
        return;
    }

    const logFiles = fs.readdirSync(LOG_DIR).filter(f => f.startsWith('healing_attempt_') && f.endsWith('.json'));

    if (logFiles.length === 0) {
        console.log('✅ Nenhum arquivo de log de correção encontrado nesta execução.');
        return;
    }

    console.log(`🔎 Encontrados ${logFiles.length} novos arquivos de log de correção.`);

    // Garante que o diretório de métricas exista
    if (!fs.existsSync(METRICS_DIR)) {
        fs.mkdirSync(METRICS_DIR, { recursive: true });
    }

    for (const file of logFiles) {
        try {
            const content = fs.readFileSync(path.join(LOG_DIR, file), 'utf8');
            const data = JSON.parse(content);

            // Cria um registro simplificado de uma linha
            const logEntry = {
                timestamp: data.timestamp,
                success: data.success,
                originalSelector: data.originalSelector,
                successfulSelector: data.successfulSelector || null,
                confidence: data.confidence || null,
            };

            // Adiciona (append) a nova linha ao nosso log de atividades
            fs.appendFileSync(ACTIVITY_LOG_PATH, JSON.stringify(logEntry) + '\n');
            console.log(`📝 Atividade registrada para o seletor: ${data.originalSelector}`);

        } catch (e) {
            console.error(`❌ Erro ao processar o arquivo de log ${file}:`, e);
        }
    }

    console.log(`✅ Novas atividades salvas com sucesso em: ${ACTIVITY_LOG_PATH}`);
}

try {
    main();
} catch (error) {
    console.error('❌ Falha crítica ao coletar métricas:', error);
    process.exit(1);
}