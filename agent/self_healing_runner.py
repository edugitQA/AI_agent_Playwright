"""
PoC: Sistema de Auto-Correção de Testes E2E (Self-Healing Test Runner)

Este módulo integra o Playwright com o agente LangGraph para criar um sistema
de auto-correção que detecta seletores quebrados, analisa o DOM atual e
aplica automaticamente novos seletores sugeridos pelo agente de IA.

Funcionalidades principais:
1. Detecção automática de falhas de seletores
2. Captura do DOM atual da página
3. Integração com o agente LangGraph para análise
4. Aplicação automática de seletores corrigidos
5. Cache de correções para reutilização
6. Logging detalhado para auditoria

Autor: Manus AI
Data: 2025-07-23
"""

import os
import json
import logging
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from pathlib import Path
from dataclasses import dataclass, asdict

from playwright.async_api import Page, TimeoutError as PlaywrightTimeoutError
from langgraph_handler import LangGraphSelectorAgent, SelectorAnalysis

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/self_healing_runner.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class HealingAttempt:
    """Estrutura para registrar tentativas de correção"""
    original_selector: str
    element_description: str
    suggested_selectors: List[str]
    successful_selector: Optional[str]
    timestamp: str
    success: bool
    error_message: str
    dom_snapshot_path: str

class SelectorCache:
    """Cache para armazenar seletores corrigidos"""
    
    def __init__(self, cache_file: str = "logs/selector_cache.json"):
        self.cache_file = cache_file
        self.cache: Dict[str, str] = {}
        self._load_cache()
    
    def _load_cache(self):
        """Carrega o cache do arquivo"""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    self.cache = json.load(f)
                logger.info(f"Cache carregado com {len(self.cache)} entradas")
        except Exception as e:
            logger.warning(f"Erro ao carregar cache: {e}")
            self.cache = {}
    
    def _save_cache(self):
        """Salva o cache no arquivo"""
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(self.cache, f, indent=2, ensure_ascii=False)
            logger.info("Cache salvo com sucesso")
        except Exception as e:
            logger.error(f"Erro ao salvar cache: {e}")
    
    def get(self, original_selector: str) -> Optional[str]:
        """Obtém seletor corrigido do cache"""
        return self.cache.get(original_selector)
    
    def set(self, original_selector: str, corrected_selector: str):
        """Armazena seletor corrigido no cache"""
        self.cache[original_selector] = corrected_selector
        self._save_cache()
        logger.info(f"Seletor adicionado ao cache: {original_selector} -> {corrected_selector}")

class SelfHealingTestRunner:
    """Runner principal para auto-correção de testes"""
    
    def __init__(self, page: Page):
        self.page = page
        self.langgraph_agent = LangGraphSelectorAgent()
        self.selector_cache = SelectorCache()
        self.healing_attempts: List[HealingAttempt] = []
        
        # Criar diretórios necessários
        Path('logs').mkdir(exist_ok=True)
        Path('dom_snapshots').mkdir(exist_ok=True)
    
    async def heal_broken_selector(
        self, 
        selector_name: str,
        original_selector: str, 
        element_description: str,
        max_attempts: int = 3,
        timeout: int = 5000
    ) -> Optional[str]:
        """
        Método principal para correção de seletores quebrados
        
        Args:
            selector_name: Nome identificador do seletor
            original_selector: Seletor que falhou
            element_description: Descrição do elemento procurado
            max_attempts: Número máximo de tentativas
            timeout: Timeout em ms para cada tentativa
            
        Returns:
            Seletor corrigido ou None se falhar
        """
        logger.info(f"🔧 Iniciando auto-correção para seletor: {original_selector}")
        
        # Verificar cache primeiro
        cached_selector = self.selector_cache.get(original_selector)
        if cached_selector:
            logger.info(f"✅ Seletor encontrado no cache: {cached_selector}")
            
            # Testar se o seletor em cache ainda funciona
            if await self._test_selector(cached_selector, timeout):
                return cached_selector
            else:
                logger.warning("Seletor em cache não funciona mais, removendo do cache")
                # Remover do cache se não funcionar mais
                if original_selector in self.selector_cache.cache:
                    del self.selector_cache.cache[original_selector]
                    self.selector_cache._save_cache()
        
        # Capturar DOM atual
        dom_html = await self._capture_current_dom()
        if not dom_html:
            logger.error("Falha ao capturar DOM atual")
            return None
        
        # Analisar com LangGraph
        analysis = self.langgraph_agent.analyze_and_suggest(
            dom_html=dom_html,
            original_selector=original_selector,
            element_description=element_description,
            error_message=f"Selector '{original_selector}' not found"
        )
        
        if not analysis or not analysis.suggested_selectors:
            logger.error("Agente LangGraph não retornou sugestões")
            return None
        
        # Testar seletores sugeridos
        successful_selector = await self._test_suggested_selectors(
            analysis.suggested_selectors, 
            timeout, 
            max_attempts
        )
        
        # Registrar tentativa de correção
        healing_attempt = HealingAttempt(
            original_selector=original_selector,
            element_description=element_description,
            suggested_selectors=analysis.suggested_selectors,
            successful_selector=successful_selector,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            success=successful_selector is not None,
            error_message="" if successful_selector else "Nenhum seletor sugerido funcionou",
            dom_snapshot_path=analysis.dom_snapshot_path
        )
        
        self.healing_attempts.append(healing_attempt)
        self._save_healing_attempt(healing_attempt)
        
        # Salvar no cache se bem-sucedido
        if successful_selector:
            self.selector_cache.set(original_selector, successful_selector)
            logger.info(f"✅ Auto-correção bem-sucedida: {successful_selector}")
        else:
            logger.error("❌ Auto-correção falhou")
        
        return successful_selector
    
    async def _capture_current_dom(self) -> Optional[str]:
        """Captura o DOM atual da página"""
        try:
            # Aguardar a página carregar completamente
            await self.page.wait_for_load_state('networkidle', timeout=10000)
            
            # Capturar HTML completo
            dom_html = await self.page.content()
            
            logger.info(f"DOM capturado com {len(dom_html)} caracteres")
            return dom_html
            
        except Exception as e:
            logger.error(f"Erro ao capturar DOM: {e}")
            return None
    
    async def _test_selector(self, selector: str, timeout: int = 5000) -> bool:
        """Testa se um seletor funciona na página atual"""
        try:
            # Tentar localizar o elemento
            element = self.page.locator(selector)
            await element.wait_for(state='visible', timeout=timeout)
            
            # Verificar se o elemento está realmente visível
            is_visible = await element.is_visible()
            
            logger.info(f"Seletor '{selector}' testado: {'✅ Funciona' if is_visible else '❌ Não funciona'}")
            return is_visible
            
        except PlaywrightTimeoutError:
            logger.debug(f"Seletor '{selector}' não encontrado (timeout)")
            return False
        except Exception as e:
            logger.debug(f"Erro ao testar seletor '{selector}': {e}")
            return False
    
    async def _test_suggested_selectors(
        self, 
        suggested_selectors: List[str], 
        timeout: int,
        max_attempts: int
    ) -> Optional[str]:
        """Testa uma lista de seletores sugeridos"""
        logger.info(f"Testando {len(suggested_selectors)} seletores sugeridos...")
        
        for i, selector in enumerate(suggested_selectors[:max_attempts]):
            logger.info(f"Testando seletor {i+1}/{min(len(suggested_selectors), max_attempts)}: {selector}")
            
            if await self._test_selector(selector, timeout):
                logger.info(f"✅ Seletor funcionou: {selector}")
                return selector
            
            # Pequena pausa entre tentativas
            await asyncio.sleep(0.5)
        
        logger.warning("❌ Nenhum dos seletores sugeridos funcionou")
        return None
    
    def _save_healing_attempt(self, attempt: HealingAttempt):
        """Salva tentativa de correção em arquivo"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"logs/healing_attempt_{timestamp}.json"
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(asdict(attempt), f, indent=2, ensure_ascii=False)
            
            logger.info(f"Tentativa de correção salva em: {filename}")
            
        except Exception as e:
            logger.error(f"Erro ao salvar tentativa de correção: {e}")
    
    async def execute_with_healing(
        self, 
        action_func, 
        selector: str, 
        element_description: str,
        *args, 
        **kwargs
    ):
        """
        Executa uma ação com auto-correção automática
        
        Args:
            action_func: Função de ação do Playwright (click, fill, etc.)
            selector: Seletor original
            element_description: Descrição do elemento
            *args, **kwargs: Argumentos para a função de ação
        """
        try:
            # Tentar executar ação com seletor original
            element = self.page.locator(selector)
            await action_func(element, *args, **kwargs)
            logger.info(f"✅ Ação executada com sucesso usando seletor original: {selector}")
            
        except Exception as original_error:
            logger.warning(f"⚠️ Ação falhou com seletor original: {original_error}")
            
            # Tentar auto-correção
            corrected_selector = await self.heal_broken_selector(
                selector_name=selector,
                original_selector=selector,
                element_description=element_description
            )
            
            if corrected_selector:
                try:
                    # Tentar novamente com seletor corrigido
                    element = self.page.locator(corrected_selector)
                    await action_func(element, *args, **kwargs)
                    logger.info(f"✅ Ação executada com sucesso usando seletor corrigido: {corrected_selector}")
                    
                except Exception as corrected_error:
                    logger.error(f"❌ Ação falhou mesmo com seletor corrigido: {corrected_error}")
                    raise corrected_error
            else:
                logger.error("❌ Auto-correção falhou, não foi possível executar a ação")
                raise original_error
    
    def get_healing_statistics(self) -> Dict[str, Any]:
        """Retorna estatísticas das tentativas de correção"""
        total_attempts = len(self.healing_attempts)
        successful_attempts = sum(1 for attempt in self.healing_attempts if attempt.success)
        
        stats = {
            "total_healing_attempts": total_attempts,
            "successful_healings": successful_attempts,
            "success_rate": (successful_attempts / total_attempts * 100) if total_attempts > 0 else 0,
            "cache_size": len(self.selector_cache.cache),
            "recent_attempts": [asdict(attempt) for attempt in self.healing_attempts[-5:]]
        }
        
        return stats
    
    def export_healing_report(self, filename: str = None) -> str:
        """Exporta relatório detalhado das correções"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"logs/healing_report_{timestamp}.json"
        
        report = {
            "report_generated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "statistics": self.get_healing_statistics(),
            "all_attempts": [asdict(attempt) for attempt in self.healing_attempts],
            "selector_cache": self.selector_cache.cache
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Relatório de correções exportado para: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Erro ao exportar relatório: {e}")
            return ""

# Versão síncrona para compatibilidade com Playwright sync
class SelfHealingTestRunnerSync:
    """Versão síncrona do Self-Healing Test Runner"""
    
    def __init__(self, page):
        self.page = page
        self.langgraph_agent = LangGraphSelectorAgent()
        self.selector_cache = SelectorCache()
        self.healing_attempts: List[HealingAttempt] = []
        
        # Criar diretórios necessários
        Path('logs').mkdir(exist_ok=True)
        Path('dom_snapshots').mkdir(exist_ok=True)
    
    def heal_broken_selector(
        self, 
        selector_name: str,
        original_selector: str, 
        element_description: str,
        max_attempts: int = 3,
        timeout: int = 5000
    ) -> Optional[str]:
        """Versão síncrona da correção de seletores"""
        logger.info(f"🔧 Iniciando auto-correção para seletor: {original_selector}")
        
        # Verificar cache primeiro
        cached_selector = self.selector_cache.get(original_selector)
        if cached_selector:
            logger.info(f"✅ Seletor encontrado no cache: {cached_selector}")
            
            # Testar se o seletor em cache ainda funciona
            if self._test_selector(cached_selector, timeout):
                return cached_selector
            else:
                logger.warning("Seletor em cache não funciona mais, removendo do cache")
                if original_selector in self.selector_cache.cache:
                    del self.selector_cache.cache[original_selector]
                    self.selector_cache._save_cache()
        
        # Capturar DOM atual
        dom_html = self._capture_current_dom()
        if not dom_html:
            logger.error("Falha ao capturar DOM atual")
            return None
        
        # Analisar com LangGraph
        analysis = self.langgraph_agent.analyze_and_suggest(
            dom_html=dom_html,
            original_selector=original_selector,
            element_description=element_description,
            error_message=f"Selector '{original_selector}' not found"
        )
        
        if not analysis or not analysis.suggested_selectors:
            logger.error("Agente LangGraph não retornou sugestões")
            return None
        
        # Testar seletores sugeridos
        successful_selector = self._test_suggested_selectors(
            analysis.suggested_selectors, 
            timeout, 
            max_attempts
        )
        
        # Registrar tentativa de correção
        healing_attempt = HealingAttempt(
            original_selector=original_selector,
            element_description=element_description,
            suggested_selectors=analysis.suggested_selectors,
            successful_selector=successful_selector,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            success=successful_selector is not None,
            error_message="" if successful_selector else "Nenhum seletor sugerido funcionou",
            dom_snapshot_path=analysis.dom_snapshot_path
        )
        
        self.healing_attempts.append(healing_attempt)
        self._save_healing_attempt(healing_attempt)
        
        # Salvar no cache se bem-sucedido
        if successful_selector:
            self.selector_cache.set(original_selector, successful_selector)
            logger.info(f"✅ Auto-correção bem-sucedida: {successful_selector}")
        else:
            logger.error("❌ Auto-correção falhou")
        
        return successful_selector
    
    def _capture_current_dom(self) -> Optional[str]:
        """Captura o DOM atual da página (versão síncrona)"""
        try:
            # Aguardar a página carregar
            self.page.wait_for_load_state('networkidle', timeout=10000)
            
            # Capturar HTML completo
            dom_html = self.page.content()
            
            logger.info(f"DOM capturado com {len(dom_html)} caracteres")
            return dom_html
            
        except Exception as e:
            logger.error(f"Erro ao capturar DOM: {e}")
            return None
    
    def _test_selector(self, selector: str, timeout: int = 5000) -> bool:
        """Testa se um seletor funciona na página atual (versão síncrona)"""
        try:
            # Tentar localizar o elemento
            element = self.page.locator(selector)
            element.wait_for(state='visible', timeout=timeout)
            
            # Verificar se o elemento está realmente visível
            is_visible = element.is_visible()
            
            logger.info(f"Seletor '{selector}' testado: {'✅ Funciona' if is_visible else '❌ Não funciona'}")
            return is_visible
            
        except Exception as e:
            logger.debug(f"Erro ao testar seletor '{selector}': {e}")
            return False
    
    def _test_suggested_selectors(
        self, 
        suggested_selectors: List[str], 
        timeout: int,
        max_attempts: int
    ) -> Optional[str]:
        """Testa uma lista de seletores sugeridos (versão síncrona)"""
        logger.info(f"Testando {len(suggested_selectors)} seletores sugeridos...")
        
        for i, selector in enumerate(suggested_selectors[:max_attempts]):
            logger.info(f"Testando seletor {i+1}/{min(len(suggested_selectors), max_attempts)}: {selector}")
            
            if self._test_selector(selector, timeout):
                logger.info(f"✅ Seletor funcionou: {selector}")
                return selector
            
            # Pequena pausa entre tentativas
            import time
            time.sleep(0.5)
        
        logger.warning("❌ Nenhum dos seletores sugeridos funcionou")
        return None
    
    def _save_healing_attempt(self, attempt: HealingAttempt):
        """Salva tentativa de correção em arquivo"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"logs/healing_attempt_{timestamp}.json"
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(asdict(attempt), f, indent=2, ensure_ascii=False)
            
            logger.info(f"Tentativa de correção salva em: {filename}")
            
        except Exception as e:
            logger.error(f"Erro ao salvar tentativa de correção: {e}")

# Alias para compatibilidade
SelfHealingTestRunner = SelfHealingTestRunnerSync

