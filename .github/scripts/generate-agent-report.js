// .github/scripts/generate-agent-report.js

const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÕES ---
const LOG_DIR = path.join(process.cwd(), 'logs');
const METRICS_DIR = path.join(process.cwd(), 'metrics');
const METRICS_FILE_PATH = path.join(METRICS_DIR, 'dashboard-metrics.json');

// --- FUNÇÕES AUXILIARES ---

function getAllHealingAttempts() {
    if (!fs.existsSync(LOG_DIR)) {
        console.log(`🟡 Diretório de logs não encontrado em ${LOG_DIR}.`);
        return [];
    }
    const logFiles = fs.readdirSync(LOG_DIR).filter(f => f.startsWith('healing_attempt_') && f.endsWith('.json'));
    console.log(`🔎 Encontrados ${logFiles.length} novos arquivos de log de correção.`);
    
    return logFiles.map(file => {
        try {
            const content = fs.readFileSync(path.join(LOG_DIR, file), 'utf8');
            return JSON.parse(content);
        } catch (e) {
            console.error(`❌ Erro ao ler ou parsear o arquivo de log ${file}:`, e);
            return null;
        }
    }).filter(Boolean);
}

function processHealingAttempts(allAttempts) {
    if (!Array.isArray(allAttempts)) {
        allAttempts = [];
    }

    const totalInvocations = allAttempts.length;
    const successfulHeals = allAttempts.filter(a => a.success).length;
    const failedHeals = totalInvocations - successfulHeals;
    const successRate = totalInvocations > 0 ? (successfulHeals / totalInvocations) * 100 : 0;

    const selectorCounts = allAttempts.reduce((acc, attempt) => {
        const key = attempt.originalSelector;
        if (!acc[key]) {
            acc[key] = { key, original: key, success: 0, failure: 0, total: 0, history: [] };
        }
        acc[key].total++;
        if (attempt.success) {
            acc[key].success++;
            acc[key].history.push({ correctedTo: attempt.successfulSelector, date: attempt.timestamp });
        } else {
            acc[key].failure++;
        }
        return acc;
    }, {});
    
    const unstableSelectors = Object.values(selectorCounts).sort((a, b) => b.total - a.total);

    return {
        lastUpdated: new Date().toISOString(),
        summary: {
            totalInvocations,
            successfulHeals,
            failedHeals,
            successRate: parseFloat(successRate.toFixed(2)),
        },
        unstableSelectors,
        allAttempts,
    };
}

// --- FUNÇÃO PRINCIPAL ---
function main() {
    console.log('🚀 Iniciando geração de métricas do agente...');

    // Garante que o diretório de métricas exista
    if (!fs.existsSync(METRICS_DIR)) {
        fs.mkdirSync(METRICS_DIR, { recursive: true });
    }

    // 1. Carrega o histórico de métricas. Se não existir ou estiver malformado, começa com um array vazio.
    let historicAttempts = [];
    if (fs.existsSync(METRICS_FILE_PATH)) {
        try {
            const fileContent = fs.readFileSync(METRICS_FILE_PATH, 'utf8');
            // Lida com o caso de o arquivo estar vazio ou ser inválido
            const data = fileContent ? JSON.parse(fileContent) : {}; 
            if (Array.isArray(data.allAttempts)) {
                historicAttempts = data.allAttempts;
                console.log(`📊 Histórico carregado com ${historicAttempts.length} correções anteriores.`);
            }
        } catch (e) {
            console.warn('⚠️ Não foi possível ler o arquivo de métricas existente. Um novo será criado.', e.message);
        }
    }

    // 2. Lê as novas tentativas de correção da execução atual
    const newAttempts = getAllHealingAttempts();
    if (newAttempts.length === 0) {
        console.log('✅ Nenhuma nova atuação do agente para registrar. O processo será encerrado sem alterações.');
        return; // Encerra o script se não houver nada novo para adicionar
    }

    // 3. Combina os dados históricos com os novos
    const combinedAttempts = [...historicAttempts, ...newAttempts];
    console.log(`📈 Total de correções para processar (histórico + novas): ${combinedAttempts.length}`);
    
    // 4. Processa os dados combinados para gerar o objeto final de métricas
    const finalMetrics = processHealingAttempts(combinedAttempts);
    
    // 5. Salva o JSON de métricas acumulado
    fs.writeFileSync(METRICS_FILE_PATH, JSON.stringify(finalMetrics, null, 2));
    console.log(`✅ Arquivo de métricas salvo com sucesso em: ${METRICS_FILE_PATH}`);
    console.log('Resumo gerado:', finalMetrics.summary);
}

// --- EXECUÇÃO ---
try {
    main();
} catch (error) {
    console.error('❌ Falha crítica ao gerar métricas:', error);
    process.exit(1);
}