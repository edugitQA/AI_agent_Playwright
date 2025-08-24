/**
 * Script para gerar relatório avançado do agente de auto-correção
 * 
 * Este script analisa os logs do agente e gera um relatório detalhado 
 * sobre as tentativas de auto-correção, seletores ajustados e performance.
 */

const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÕES ATUALIZADAS ---
const LOG_DIR = path.join(process.cwd(), 'logs');
const REPORT_DIR = path.join(process.cwd(), 'test-results');
// NOVO: Diretório de métricas na raiz
const METRICS_DIR = path.join(process.cwd(), 'metrics'); 
const METRICS_FILE = 'dashboard-metrics.json';
const METRICS_FILE_PATH = path.join(METRICS_DIR, METRICS_FILE);

// Arquivos específicos para análise
// const AGENT_LOG_FILE = path.join(LOG_DIR, 'langgraph_agent.log');
// const SELECTOR_CACHE_FILE = path.join(LOG_DIR, 'selector_cache.json');
// const SNAPSHOT_DIR = path.join(process.cwd(), 'dom_snapshots');

function generateMetricsAndReport() {
    console.log('🚀 Iniciando geração de métricas e relatório do agente...');

    // Garante que os diretórios de destino existam
    [REPORT_DIR, METRICS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Lógica para ler logs, processar e gerar métricas
    const stats = collectAgentStats();
    const finalMetrics = generateDashboardMetrics(stats);
    
    // Gerar relatório HTML
    generateReport(stats);
    
    // Salvar métricas para o dashboard
    fs.writeFileSync(METRICS_FILE_PATH, JSON.stringify(finalMetrics, null, 2));
    console.log(`✅ Métricas do dashboard acumuladas e salvas em: ${METRICS_FILE_PATH}`);
}

function collectAgentStats() {
  console.log('Gerando relatório do agente de auto-correção...');

  // Estatísticas do agente
  let stats = {
    totalInvocations: 0,
    successfulHeals: 0,
    failedHeals: 0,
    healingAttempts: [],
    selectors: {},
    timing: {
      average: 0,
      fastest: Infinity,
      slowest: 0,
      total: 0
    }
  };

  // Analisar logs do agente se existirem
  if (fs.existsSync(AGENT_LOG_FILE)) {
    const agentLogs = fs.readFileSync(AGENT_LOG_FILE, 'utf8');
    const healingAttempts = agentLogs.match(/Tentando corrigir seletor|Attempting to heal selector/g);
    
    if (healingAttempts) {
      stats.totalInvocations = healingAttempts.length;
    }

    // Encontrar correções bem-sucedidas
    const successMatches = agentLogs.match(/Seletor corrigido com sucesso|Selector healed successfully/g);
    if (successMatches) {
      stats.successfulHeals = successMatches.length;
    }

    // Calcular falhas
    stats.failedHeals = stats.totalInvocations - stats.successfulHeals;
    
    // Extrair tempos de execução (simplificado)
    const timeMatches = agentLogs.match(/Tempo de processamento: (\d+)ms|Processing time: (\d+)ms/g);
    if (timeMatches && timeMatches.length > 0) {
      const times = timeMatches.map(t => parseInt(t.match(/(\d+)ms/)[1]));
      stats.timing.total = times.reduce((a, b) => a + b, 0);
      stats.timing.average = stats.timing.total / times.length;
      stats.timing.fastest = Math.min(...times);
      stats.timing.slowest = Math.max(...times);
    }
  }

  // Analisar cache de seletores se existir
  if (fs.existsSync(SELECTOR_CACHE_FILE)) {
    try {
      const selectorCache = JSON.parse(fs.readFileSync(SELECTOR_CACHE_FILE, 'utf8'));
      stats.selectors = selectorCache;
    } catch (e) {
      console.error('Erro ao analisar cache de seletores:', e);
    }
  }

  // Listar snapshots DOM capturados
  const snapshots = fs.existsSync(SNAPSHOT_DIR) ? 
    fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.html')) : [];

  // Gerar HTML do relatório
  const reportHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório do Agente de Auto-Correção</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #0066cc;
    }
    .stats-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 15px;
      min-width: 200px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
    }
    .success-rate {
      color: ${stats.successfulHeals > 0 ? '#28a745' : '#dc3545'};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .timing {
      display: flex;
      gap: 15px;
    }
    .timing div {
      flex: 1;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>📊 Relatório do Agente de Auto-Correção</h1>
  <p>Relatório gerado em ${new Date().toLocaleString()}</p>
  
  <h2>Estatísticas Gerais</h2>
  <div class="stats-container">
    <div class="stat-card">
      <h3>Total de Invocações</h3>
      <div class="stat-value">${stats.totalInvocations}</div>
    </div>
    <div class="stat-card">
      <h3>Correções Bem-sucedidas</h3>
      <div class="stat-value success-rate">${stats.successfulHeals}</div>
    </div>
    <div class="stat-card">
      <h3>Correções Falhas</h3>
      <div class="stat-value" style="color: #dc3545">${stats.failedHeals}</div>
    </div>
    <div class="stat-card">
      <h3>Taxa de Sucesso</h3>
      <div class="stat-value success-rate">
        ${stats.totalInvocations > 0 ? 
          Math.round((stats.successfulHeals / stats.totalInvocations) * 100) : 0}%
      </div>
    </div>
  </div>
  
  <h2>⏱️ Métricas de Tempo</h2>
  <div class="timing">
    <div>
      <h3>Média</h3>
      <p>${Math.round(stats.timing.average)} ms</p>
    </div>
    <div>
      <h3>Mais Rápido</h3>
      <p>${stats.timing.fastest !== Infinity ? stats.timing.fastest : 'N/A'} ms</p>
    </div>
    <div>
      <h3>Mais Lento</h3>
      <p>${stats.timing.slowest} ms</p>
    </div>
    <div>
      <h3>Tempo Total</h3>
      <p>${stats.timing.total} ms</p>
    </div>
  </div>
  
  <h2>🔄 Seletores Corrigidos</h2>
  <table>
    <thead>
      <tr>
        <th>Chave do Seletor</th>
        <th>Seletor Original</th>
        <th>Seletor Corrigido</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(stats.selectors).map(([key, data]) => `
        <tr>
          <td>${key}</td>
          <td>${data.original || 'N/A'}</td>
          <td>${data.healed || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>📷 Snapshots DOM Capturados</h2>
  <ul>
    ${snapshots.map(snap => `<li>${snap}</li>`).join('')}
  </ul>
  
  <footer>
    <p>Relatório gerado automaticamente pela pipeline CI/CD de testes.</p>
  </footer>
</body>
</html>
  `;

  // Salvar relatório
  fs.writeFileSync(path.join(REPORT_DIR, 'agent-report.html'), reportHtml);
  console.log(`Relatório gerado em: ${path.join(REPORT_DIR, 'agent-report.html')}`);
  
  // Também gerar versão resumida em JSON para integração com outros sistemas
  const reportJson = {
    timestamp: new Date().toISOString(),
    summary: {
      totalInvocations: stats.totalInvocations,
      successfulHeals: stats.successfulHeals,
      failedHeals: stats.failedHeals,
      successRate: stats.totalInvocations > 0 ? 
        (stats.successfulHeals / stats.totalInvocations) : 0
    },
    timing: stats.timing,
    selectors: stats.selectors,
    snapshots: snapshots
  };
  
  fs.writeFileSync(path.join(REPORT_DIR, 'agent-report.json'), JSON.stringify(reportJson, null, 2));
}

// Executar geração de relatório
try {
  generateReport();
} catch (error) {
  console.error('Erro ao gerar relatório:', error);
  process.exit(1);
}
