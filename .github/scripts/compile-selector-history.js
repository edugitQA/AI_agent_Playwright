/**
 * Script para compilar histórico de seletores corrigidos
 * 
 * Este script analisa o histórico de correções de seletores
 * e gera um relatório de tendências para análise de longo prazo.
 */

const fs = require('fs');
const path = require('path');

// Configurações
const HISTORY_DIR = path.join(process.cwd(), '.history');
const REPORT_DIR = path.join(process.cwd(), 'test-artifacts', 'reports');
const HISTORY_REPORT_FILE = path.join(REPORT_DIR, 'selector-history.json');
const HISTORY_REPORT_HTML = path.join(REPORT_DIR, 'selector-history.html');

// Garantir que os diretórios existam
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Compilar histórico de seletores
function compileHistory() {
  console.log('Compilando histórico de correções de seletores...');
  
  if (!fs.existsSync(HISTORY_DIR)) {
    console.log('Diretório de histórico não encontrado.');
    return;
  }
  
  // Coletar todos os arquivos de cache
  const cacheFiles = fs.readdirSync(HISTORY_DIR)
    .filter(file => file.startsWith('selector_cache_') && file.endsWith('.json'))
    .sort(); // Ordenar por nome (que inclui timestamp)
  
  if (cacheFiles.length === 0) {
    console.log('Nenhum arquivo de histórico encontrado.');
    return;
  }
  
  console.log(`Encontrados ${cacheFiles.length} registros históricos.`);
  
  // Estrutura para armazenar análise
  const historyData = {
    lastUpdated: new Date().toISOString(),
    totalRecords: cacheFiles.length,
    selectorHistory: {},
    timeline: []
  };
  
  // Processar cada arquivo
  cacheFiles.forEach(file => {
    const timestamp = file.replace('selector_cache_', '').replace('.json', '');
    const date = parseTimestamp(timestamp);
    
    try {
      const filePath = path.join(HISTORY_DIR, file);
      const cacheData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Adicionar ponto na timeline
      historyData.timeline.push({
        date: date.toISOString(),
        selectorCount: Object.keys(cacheData).length,
        file
      });
      
      // Processar cada seletor
      Object.entries(cacheData).forEach(([key, data]) => {
        if (!historyData.selectorHistory[key]) {
          historyData.selectorHistory[key] = {
            firstSeen: date.toISOString(),
            lastUpdated: date.toISOString(),
            changes: [],
            currentValue: data.healed || data.original
          };
        }
        
        // Verificar se houve mudança
        const currentHistory = historyData.selectorHistory[key];
        const currentValue = data.healed || data.original;
        
        if (currentValue !== currentHistory.currentValue) {
          currentHistory.changes.push({
            date: date.toISOString(),
            from: currentHistory.currentValue,
            to: currentValue
          });
          
          currentHistory.currentValue = currentValue;
          currentHistory.lastUpdated = date.toISOString();
        }
      });
      
    } catch (error) {
      console.error(`Erro ao processar arquivo ${file}:`, error);
    }
  });
  
  // Adicionar estatísticas
  historyData.stats = {
    totalSelectors: Object.keys(historyData.selectorHistory).length,
    selectorsWithChanges: Object.values(historyData.selectorHistory)
      .filter(item => item.changes.length > 0).length,
    totalChanges: Object.values(historyData.selectorHistory)
      .reduce((total, item) => total + item.changes.length, 0)
  };
  
  // Salvar relatório
  fs.writeFileSync(HISTORY_REPORT_FILE, JSON.stringify(historyData, null, 2));
  console.log(`Relatório de histórico salvo em ${HISTORY_REPORT_FILE}`);
  
  // Gerar HTML
  generateHistoryHtml(historyData);
}

// Função auxiliar para converter timestamp para Date
function parseTimestamp(timestamp) {
  // Formato esperado: YYYYMMDD_HHMMSS
  const year = timestamp.substring(0, 4);
  const month = parseInt(timestamp.substring(4, 6)) - 1; // Mês em JS é 0-indexed
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(9, 11);
  const minute = timestamp.substring(11, 13);
  const second = timestamp.substring(13, 15);
  
  return new Date(year, month, day, hour, minute, second);
}

// Gerar relatório HTML
function generateHistoryHtml(historyData) {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Histórico de Seletores - Agente de Auto-Correção</title>
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
    .timeline {
      margin: 40px 0;
      position: relative;
      padding-left: 20px;
      border-left: 2px solid #0066cc;
    }
    .timeline-item {
      margin-bottom: 20px;
      position: relative;
    }
    .timeline-item:before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #0066cc;
      left: -26px;
      top: 5px;
    }
    .timeline-date {
      color: #666;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 5px;
    }
    .badge-change {
      background-color: #ffeeba;
      color: #856404;
    }
    .change-entry {
      margin: 10px 0;
      padding: 10px;
      background: #f9f9f9;
      border-left: 3px solid #ffc107;
      border-radius: 0 4px 4px 0;
    }
  </style>
</head>
<body>
  <h1>📊 Histórico de Seletores Corrigidos</h1>
  <p>Última atualização: ${new Date(historyData.lastUpdated).toLocaleString()}</p>
  
  <h2>Estatísticas Gerais</h2>
  <div class="stats-container">
    <div class="stat-card">
      <h3>Total de Seletores</h3>
      <div class="stat-value">${historyData.stats.totalSelectors}</div>
    </div>
    <div class="stat-card">
      <h3>Seletores com Mudanças</h3>
      <div class="stat-value">${historyData.stats.selectorsWithChanges}</div>
    </div>
    <div class="stat-card">
      <h3>Total de Mudanças</h3>
      <div class="stat-value">${historyData.stats.totalChanges}</div>
    </div>
    <div class="stat-card">
      <h3>Registros Históricos</h3>
      <div class="stat-value">${historyData.totalRecords}</div>
    </div>
  </div>
  
  <h2>Seletores com Alterações</h2>
  <table>
    <thead>
      <tr>
        <th>Chave do Seletor</th>
        <th>Primeira Ocorrência</th>
        <th>Última Atualização</th>
        <th>Número de Mudanças</th>
        <th>Valor Atual</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(historyData.selectorHistory)
        .filter(([_, data]) => data.changes.length > 0)
        .map(([key, data]) => `
          <tr>
            <td>${key}</td>
            <td>${new Date(data.firstSeen).toLocaleString()}</td>
            <td>${new Date(data.lastUpdated).toLocaleString()}</td>
            <td>${data.changes.length}</td>
            <td><code>${data.currentValue}</code></td>
          </tr>
        `).join('')}
    </tbody>
  </table>
  
  <h2>Linha do Tempo de Mudanças</h2>
  <div class="timeline">
    ${Object.entries(historyData.selectorHistory)
      .filter(([_, data]) => data.changes.length > 0)
      .flatMap(([key, data]) => data.changes.map(change => ({
        key,
        date: change.date,
        from: change.from,
        to: change.to
      })))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(item => `
        <div class="timeline-item">
          <div class="timeline-date">${new Date(item.date).toLocaleString()}</div>
          <span class="badge badge-change">Alteração de Seletor</span>
          <strong>${item.key}</strong>
          <div class="change-entry">
            <div>De: <code>${item.from}</code></div>
            <div>Para: <code>${item.to}</code></div>
          </div>
        </div>
      `).join('')}
  </div>
  
  <footer>
    <p>Relatório histórico gerado automaticamente pela pipeline CI/CD de testes.</p>
  </footer>
</body>
</html>
  `;
  
  fs.writeFileSync(HISTORY_REPORT_HTML, html);
  console.log(`Relatório HTML de histórico salvo em ${HISTORY_REPORT_HTML}`);
}

// Executar
try {
  compileHistory();
} catch (error) {
  console.error('Erro ao compilar histórico:', error);
}
