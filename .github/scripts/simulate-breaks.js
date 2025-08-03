/**
 * Script para quebrar seletores em testes de demonstração
 * 
 * Este script simula alterações no DOM que causariam falhas de seletores,
 * permitindo testar o agente de auto-correção em ambiente controlado.
 */

const fs = require('fs');
const path = require('path');

// Configurações
const DEMO_DIR = path.join(process.cwd(), 'sample-react-app');
const BACKUP_DIR = path.join(process.cwd(), 'sample-react-app', '.backup');

// Garantir que o diretório de backup exista
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Lista de modificações a serem aplicadas
const MODIFICATIONS = [
  {
    file: 'src/components/ContactForm.jsx',
    original: 'data-testid="contact-submit"',
    modified: 'data-testid="contact-submit-button"',
    description: 'Alteração no ID do botão de envio do formulário de contato'
  },
  {
    file: 'src/components/ContactForm.jsx',
    original: 'data-testid="name-error"',
    modified: 'data-testid="name-validation-error"',
    description: 'Alteração no ID da mensagem de erro do campo de nome'
  },
  {
    file: 'src/components/ProductList.jsx',
    original: 'data-testid="search-products"',
    modified: 'data-testid="product-search-input"',
    description: 'Alteração no ID do campo de busca de produtos'
  }
];

// Função para fazer backup de arquivos originais
function backupOriginalFiles() {
  console.log('Fazendo backup dos arquivos originais...');
  
  const backupFiles = new Set();
  
  MODIFICATIONS.forEach(mod => {
    const filePath = path.join(DEMO_DIR, mod.file);
    const backupPath = path.join(BACKUP_DIR, path.basename(mod.file));
    
    if (!backupFiles.has(mod.file) && fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      backupFiles.add(mod.file);
      console.log(`Backup criado: ${backupPath}`);
    }
  });
}

// Função para aplicar modificações
function applyModifications() {
  console.log('Aplicando modificações para simular falhas de seletores...');
  
  MODIFICATIONS.forEach(mod => {
    const filePath = path.join(DEMO_DIR, mod.file);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar se a string original existe
      if (content.includes(mod.original)) {
        content = content.replace(new RegExp(mod.original, 'g'), mod.modified);
        fs.writeFileSync(filePath, content);
        console.log(`✅ Aplicada: ${mod.description}`);
      } else {
        console.log(`⚠️ Não encontrado: ${mod.original} em ${mod.file}`);
      }
    } else {
      console.log(`❌ Arquivo não encontrado: ${mod.file}`);
    }
  });
}

// Função para restaurar os arquivos originais
function restoreOriginalFiles() {
  console.log('Restaurando arquivos originais...');
  
  const backupFiles = new Set();
  
  MODIFICATIONS.forEach(mod => {
    const filePath = path.join(DEMO_DIR, mod.file);
    const backupPath = path.join(BACKUP_DIR, path.basename(mod.file));
    
    if (!backupFiles.has(mod.file) && fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      backupFiles.add(mod.file);
      console.log(`Restaurado: ${mod.file}`);
    }
  });
}

// Tratar argumentos da linha de comando
const action = process.argv[2];

switch (action) {
  case 'backup':
    backupOriginalFiles();
    break;
  case 'break':
    backupOriginalFiles();
    applyModifications();
    break;
  case 'restore':
    restoreOriginalFiles();
    break;
  default:
    console.log(`
Uso: node simulate-breaks.js [comando]

Comandos disponíveis:
  backup  - Cria backup dos arquivos originais
  break   - Aplica modificações para quebrar seletores (faz backup primeiro)
  restore - Restaura os arquivos originais
    `);
}
