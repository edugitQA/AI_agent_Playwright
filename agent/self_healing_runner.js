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

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class SelfHealingTestRunner {
    constructor(page) {
        this.page = page;
        this.healingAttempts = [];
        this.selectorCache = new Map();
        this._loadCache();
    }

    async _loadCache() {
        try {
            const cacheFile = path.join(__dirname, '../logs/selector_cache.json');
            const cacheData = await fs.readFile(cacheFile, 'utf8');
            const cache = JSON.parse(cacheData);
            this.selectorCache = new Map(Object.entries(cache));
            console.log(`✅ Cache carregado com ${this.selectorCache.size} entradas`);
        } catch (error) {
            console.log('ℹ️ Cache não encontrado, iniciando com cache vazio');
        }
    }

    async _saveCache() {
        try {
            const cacheFile = path.join(__dirname, '../logs/selector_cache.json');
            const cacheObj = Object.fromEntries(this.selectorCache);
            await fs.writeFile(cacheFile, JSON.stringify(cacheObj, null, 2));
            console.log('✅ Cache salvo com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar cache:', error);
        }
    }

    async healBrokenSelector(selectorName, originalSelector, elementDescription, maxAttempts = 3, timeout = 5000) {
        console.log(`🔧 Iniciando auto-correção para seletor: ${originalSelector}`);
        
        // Verificar se estamos corrigindo o botão do dashboard após login
        // if (selectorName === 'dashboardButton') {
        //     console.log('⏳ Aguardando navegação após login...');
        //     try {
        //         // Primeiro, tentar encontrar elementos que confirmem que estamos na página correta
        //         await this.page.waitForSelector('text=Login Realizado com Sucesso!', { timeout: 10000 });
        //         console.log('✅ Confirmado: Página de login bem-sucedido');
        //     } catch (error) {
        //         console.error('❌ Não foi possível confirmar o sucesso do login');
        //     }
        // }
        
        // Verificar cache primeiro
        const cachedSelector = this.selectorCache.get(originalSelector);
        if (cachedSelector) {
            console.log(`✅ Seletor encontrado no cache: ${cachedSelector}`);
            if (await this._testSelector(cachedSelector, timeout)) {
                return cachedSelector;
            } else {
                console.log('⚠️ Seletor em cache não funciona mais, removendo do cache');
                this.selectorCache.delete(originalSelector);
                await this._saveCache();
            }
        }

        // Capturar DOM atual com tentativas
        let domHtml = null;
        let attempts = 3;
        while (attempts > 0 && !domHtml) {
            try {
                domHtml = await this._captureCurrentDOM();
                if (domHtml) break;
            } catch (error) {
                console.log(`⚠️ Tentativa ${4-attempts} de captura do DOM falhou`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            attempts--;
        }

        if (!domHtml) {
            console.error('❌ Falha ao capturar DOM após todas as tentativas');
            return null;
        }

        try {
            // Chamar agente Python para análise
            const analysis = await this._callPythonAgent(domHtml, originalSelector, elementDescription);
            if (!analysis || !analysis.suggested_selectors || analysis.suggested_selectors.length === 0) {
                console.error('❌ Agente Python não retornou sugestões válidas');
                return null;
            }

            // Testar seletores sugeridos
            const successfulSelector = await this._testSuggestedSelectors(
                analysis.suggested_selectors, 
                timeout, 
                maxAttempts,
                
            );

            // Registrar tentativa de correção
            const healingAttempt = {
                originalSelector,
                elementDescription,
                suggestedSelectors: analysis.suggested_selectors,
                successfulSelector,
                timestamp: new Date().toISOString(),
                success: successfulSelector !== null,
                errorMessage: successfulSelector ? '' : 'Nenhum seletor sugerido funcionou'
            };

            this.healingAttempts.push(healingAttempt);
            await this._saveHealingAttempt(healingAttempt);

            // Salvar no cache se bem-sucedido
            if (successfulSelector) {
                this.selectorCache.set(originalSelector, successfulSelector);
                await this._saveCache();
                console.log(`✅ Auto-correção bem-sucedida: ${successfulSelector}`);
            } else {
                console.error('❌ Auto-correção falhou');
            }

            return successfulSelector;

        } catch (error) {
            console.error('❌ Erro durante auto-correção:', error);
            return null;
        }
    }

    async _isPageClosed() {
        try {
            // Tenta acessar uma propriedade da página
            await this.page.title();
            return false;
        } catch (error) {
            return true;
        }
    }

    async _captureCurrentDOM() {
        try {
              /*
            await this.page.waitForLoadState('load', { timeout: 30000 });
            // Aguardar requisições de rede terminarem
            await this.page.waitForLoadState('networkidle', { timeout: 30000 });
            // Aguardar elementos do DOM estarem estáveis
            await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
            */
           console.log('⏳ Aguardando o DOM se estabilizar...');
            await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        // Uma pequena pausa para garantir que os scripts do React renderizem os elementos
            await this.page.waitForTimeout(500); 

            // Pequena pausa adicional para garantir estabilidade após redirecionamentos
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Capturar HTML completo com retry em caso de erro
            let retries = 3;
            let domHtml = null;
            while (retries > 0 && !domHtml) {
                try {
                    domHtml = await this.page.content();
                } catch (err) {
                    console.log(`⚠️ Tentativa ${4-retries} de captura do DOM falhou, tentando novamente...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    retries--;
                }
            }

            if (!domHtml) {
                throw new Error('Não foi possível capturar o DOM após várias tentativas');
            }

            console.log(`✅ DOM capturado com ${domHtml.length} caracteres`);
            return domHtml;
        } catch (error) {
            console.error('❌ Erro ao capturar DOM:', error);
            return null;
        }
    }

    async _callPythonAgent(domHtml, originalSelector, elementDescription) {
        return new Promise((resolve, reject) => {
            // Criar arquivo com timestamp para persistência
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const persistentDomFile = path.join(__dirname, `../dom_snapshots/dom_snapshot_${timestamp}.html`);

            fs.writeFile(persistentDomFile, domHtml)
                .then(() => {
                    // Chamar script Python com o caminho do arquivo persistente
                    const pythonScript = path.join(__dirname, 'python_bridge.py');
                    const python = spawn('python3', [
                        pythonScript,
                        originalSelector,
                        elementDescription,
                        persistentDomFile
                    ]);

                    let output = '';
                    let errorOutput = '';

                    python.stdout.on('data', (data) => {
                        output += data.toString();
                    });

                    python.stderr.on('data', (data) => {
                        errorOutput += data.toString();
                    });

                    python.on('close', (code) => {
                        if (code === 0) {
                            try {
                                const analysis = JSON.parse(output);
                                resolve(analysis);
                            } catch (parseError) {
                                console.error('❌ Erro ao parsear resposta do Python:', parseError);
                                console.error('Output:', output);
                                reject(new Error('Falha ao parsear a resposta do agente Python.'));
                            }
                        } else {
                            console.error('❌ Erro no script Python:', errorOutput);
                            reject(new Error(`Script Python finalizado com código ${code}. Erro: ${errorOutput}`));
                        }
                    });
                })
                .catch(err => {
                    console.error('❌ Erro ao escrever o arquivo de DOM:', err);
                    reject(err);
                });
        });
    }

    async _testSelector(selector, timeout = 5000, expectedAttributes = {}) {
        try {
            console.log(`🔍 Testando seletor: ${selector}`);
            const element = this.page.locator(selector);
            
            // Aumentar timeout para elementos pós-login
            const effectiveTimeout = selector.includes('dashboard') ? 30000 : timeout;
            
            // Tentar localizar o elemento com retry
            let isVisible = false;
            let attempts = 3;
            while (attempts > 0 && !isVisible) {
                try {
                    await element.waitFor({ state: 'visible', timeout: effectiveTimeout });
                    isVisible = await element.isVisible();
                    if (isVisible) break;
                } catch (error) {
                    console.log(`⚠️ Tentativa ${4-attempts} falhou, tentando novamente...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                attempts--;
            }

            if (!isVisible) {
                console.log(`❌ Seletor '${selector}' não está visível após todas as tentativas`);
                return false;
            }

            // Validação extra: checar atributos esperados
            let allMatch = true;
            for (const [attr, value] of Object.entries(expectedAttributes)) {
                const attrValue = await element.getAttribute(attr);
                if (attrValue !== value) {
                    allMatch = false;
                    break;
                }
            }
            
            if (!allMatch) {
                console.log(`❌ Seletor '${selector}' não corresponde aos atributos esperados`);
                return false;
            }

            console.log(`✅ Seletor '${selector}' encontrado e validado com sucesso`);
            return true;
        } catch (error) {
            console.log(`❌ Erro ao testar seletor '${selector}':`, error);
            return false;
        }
    }

    async _testSuggestedSelectors(suggestedSelectors, timeout, maxAttempts, expectedAttributes = {}) {
        console.log(`🔍 Testando ${suggestedSelectors.length} seletores sugeridos...`);
        for (let i = 0; i < Math.min(suggestedSelectors.length, maxAttempts); i++) {
            const selector = suggestedSelectors[i];
            console.log(`Testando seletor ${i+1}/${Math.min(suggestedSelectors.length, maxAttempts)}: ${selector}`);
            if (await this._testSelector(selector, timeout, expectedAttributes)) {
                console.log(`✅ Seletor funcionou: ${selector}`);
                return selector;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('❌ Nenhum dos seletores sugeridos funcionou');
        return null;
    }

    async _saveHealingAttempt(attempt) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = path.join(__dirname, `../logs/healing_attempt_${timestamp}.json`);
            
            await fs.writeFile(filename, JSON.stringify(attempt, null, 2));
            console.log(`📝 Tentativa de correção salva em: ${filename}`);
            
        } catch (error) {
            console.error('❌ Erro ao salvar tentativa de correção:', error);
        }
    }

    getHealingStatistics() {
        const totalAttempts = this.healingAttempts.length;
        const successfulAttempts = this.healingAttempts.filter(attempt => attempt.success).length;
        
        return {
            totalHealingAttempts: totalAttempts,
            successfulHealings: successfulAttempts,
            successRate: totalAttempts > 0 ? (successfulAttempts / totalAttempts * 100) : 0,
            cacheSize: this.selectorCache.size,
            recentAttempts: this.healingAttempts.slice(-5)
        };
    }
}

module.exports = { SelfHealingTestRunner };

