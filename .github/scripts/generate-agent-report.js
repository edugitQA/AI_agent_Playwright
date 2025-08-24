/**
 * Script para gerar relatório avançado do agente de auto-correção
 * 
 * Este script analisa os logs do agente e gera um relatório detalhado 
 * sobre as tentativas de auto-correção, seletores ajustados e performance.
 */

// .github/scripts/generate-agent-report.js

const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÕES ---
const LOG_DIR = path.join(process.cwd(), 'logs');
const REPORT_DIR = path.join(process.cwd(), 'test-results');
const METRICS_DIR = path.join(process.cwd(), 'metrics');
const METRICS_FILE = 'dashboard-metrics.json';
const METRICS_FILE_PATH = path.join(METRICS_DIR, METRICS_FILE);

// --- FUNÇÃO PRINCIPAL ---
function main() {
    console.log('🚀 Iniciando geração de métricas e relatório do agente...');

    // Garante que os diretórios de destino existam
    [REPORT_DIR, METRICS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // 1. Carrega o histórico de métricas, se existir
    let historicMetrics = { allAttempts: [] };
    if (fs.existsSync(METRICS_FILE_PATH)) {
        console.log('📊 Histórico de métricas encontrado. Carregando...');
        try {
            historicMetrics = JSON.parse(fs.readFileSync(METRICS_FILE_PATH, 'utf8'));
        } catch (e) {
            console.error('⚠️ Erro ao ler o arquivo de métricas. Começando do zero.', e);
            historicMetrics = { allAttempts: [] };
        }
    }

    // 2. Lê as novas tentativas de correção da execução atual
    const newAttempts = getAllHealingAttempts();
    if (newAttempts.length === 0) {
        console.log('🟡 Nenhuma nova tentativa de correção encontrada. Apenas atualizando o timestamp.');
        if(historicMetrics.summary) {
            historicMetrics.lastUpdated = new Date().toISOString();
            fs.writeFileSync(METRICS_FILE_PATH, JSON.stringify(historicMetrics, null, 2));
        }
        return;
    }

    // 3. Combina os dados históricos com os novos
    const combinedAttempts = [...(historicMetrics.allAttempts || []), ...newAttempts];

    // 4. Processa os dados combinados para gerar as novas métricas
    const finalMetrics = processHealingAttempts(combinedAttempts);

    // 5. Salva o JSON de métricas acumulado para o dashboard
    fs.writeFileSync(METRICS_FILE_PATH, JSON.stringify(finalMetrics, null, 2));
    console.log(`✅ Métricas do dashboard acumuladas e salvas em: ${METRICS_FILE_PATH}`);
    
    // Opcional: Gerar relatório HTML
    const reportHtml = generateReportHtml(finalMetrics);
    const reportHtmlPath = path.join(REPORT_DIR, 'agent-health-report.html');
    fs.writeFileSync(reportHtmlPath, reportHtml);
    console.log(`✅ Relatório HTML de saúde da automação gerado em: ${reportHtmlPath}`);
}

// --- FUNÇÕES AUXILIARES ---

function getAllHealingAttempts() {
    if (!fs.existsSync(LOG_DIR)) return [];
    const logFiles = fs.readdirSync(LOG_DIR).filter(f => f.startsWith('healing_attempt_') && f.endsWith('.json'));
    return logFiles.map(file => {
        try {
            return JSON.parse(fs.readFileSync(path.join(LOG_DIR, file), 'utf8'));
        } catch (e) { return null; }
    }).filter(Boolean);
}

function processHealingAttempts(attempts) {
    const totalInvocations = attempts.length;
    const successfulHeals = attempts.filter(a => a.success).length;
    const failedHeals = totalInvocations - successfulHeals;
    const successRate = totalInvocations > 0 ? (successfulHeals / totalInvocations) * 100 : 0;
    const selectorCounts = attempts.reduce((acc, attempt) => {
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
        allAttempts: attempts,
    };
}

function generateReportHtml(metrics) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><title>Relatório de Saúde da Automação</title></head>
    <body><h1>Relatório de Saúde da Automação</h1><p>Invocações: ${metrics.summary.totalInvocations}, Sucessos: ${metrics.summary.successfulHeals}, Falhas: ${metrics.summary.failedHeals}</p></body>
    </html>`;
}

// --- EXECUÇÃO ---
try {
    main(); // <-- Garante que a função principal 'main' está sendo chamada
} catch (error) {
    console.error('❌ Falha crítica ao gerar métricas:', error);
    process.exit(1);
}