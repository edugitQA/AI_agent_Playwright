/**
 * PoC: Sistema de Auto-Correção de Testes E2E (Self-Healing Test Runner)
 * Versão JavaScript para compatibilidade com Playwright TypeScript
 * 
 * Este módulo integra o Playwright com o agente LangGraph (via Python)
 * para criar um sistema de auto-correção que detecta seletores quebrados,
 * analisa o DOM atual e aplica automaticamente novos seletores sugeridos.
 * 
 * Autor: Eduardo Alves
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios'); // Certifique-se de instalar: npm install axios

class SelfHealingTestRunner {
    constructor(page) {
        this.page = page;
        this.apiBaseUrl = 'https://ai-agent-playwright-1.onrender.com'; // URL da API Python em Produção
        this.healingAttempts = [];
        this.selectorCache = new Map();
        this.cacheFile = path.join(__dirname, '../.selector-cache.json');
        this._loadCache();
    }

    async _loadCache() {
        try {
            const data = await fs.readFile(this.cacheFile, 'utf8');
            const cacheData = JSON.parse(data);
            this.selectorCache = new Map(Object.entries(cacheData));
            console.log(`✅ Cache carregado: ${this.selectorCache.size} seletores`);
        } catch (error) {
            console.log('ℹ️  Nenhum cache encontrado, iniciando novo');
        }
    }

    async _saveCache() {
        try {
            const cacheData = Object.fromEntries(this.selectorCache);
            await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
            console.log('💾 Cache salvo com sucesso');
        } catch (error) {
            console.error('⚠️  Erro ao salvar cache:', error.message);
        }
    }

    async _captureCurrentDOM() {
        try {
            const domHtml = await this.page.content();
            console.log(`📄 DOM capturado: ${domHtml.length} caracteres`);
            return domHtml;
        } catch (error) {
            console.error('❌ Erro ao capturar DOM:', error.message);
            return null;
        }
    }

    async healBrokenSelector(originalSelector, elementDescription, maxAttempts = 3) {
        console.log(`🔧 Iniciando auto-correção para: ${originalSelector}`);
        
        // 1. Verifica Cache Local
        if (this.selectorCache.has(originalSelector)) {
            const cached = this.selectorCache.get(originalSelector);
            if (await this._testSelector(cached)) return cached;
            this.selectorCache.delete(originalSelector);
        }

        // 2. Captura o DOM
        const domHtml = await this._captureCurrentDOM();
        if (!domHtml) return null;

        // 3. Chama a API Python
        try {
            const analysis = await this._callPythonApi(domHtml, originalSelector, elementDescription);
            
            if (analysis && analysis.suggested_selectors.length > 0) {
                console.log(`🤖 IA Sugeriu: ${analysis.suggested_selectors.join(', ')}`);
                
                const fixedSelector = await this._testSuggestedSelectors(analysis.suggested_selectors);
                
                if (fixedSelector) {
                    this.selectorCache.set(originalSelector, fixedSelector);
                    await this._saveCache();
                    return fixedSelector;
                }
            }
        } catch (error) {
            console.error('❌ Erro na auto-correção:', error.message);
        }
        
        return null;
    }

    async _callPythonApi(domHtml, originalSelector, elementDescription) {
        try {
            console.log('📡 Enviando DOM para o Agente IA via API...');
            const response = await axios.post(`${this.apiBaseUrl}/heal`, {
                dom_html: domHtml,
                original_selector: originalSelector,
                element_description: elementDescription,
                error_message: "Selector not found timeout"
            });
            return response.data;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.error('❌ ERRO CRÍTICO: A API Python não está rodando na porta 8000.');
                console.error('👉 Execute: python agent/api.py');
            } else {
                console.error('❌ Erro na API:', error.response?.data || error.message);
            }
            return null;
        }
    }
    
    async _testSuggestedSelectors(selectors) {
        for (const selector of selectors) {
            if (await this._testSelector(selector)) return selector;
        }
        return null;
    }
    
    async _testSelector(selector) {
        try {
            const el = this.page.locator(selector).first();
            await el.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = { SelfHealingTestRunner };