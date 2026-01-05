import os
import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from bs4 import BeautifulSoup, Tag
from langgraph.graph import StateGraph
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Modelos de Dados (Pydantic) ---
class SelectorSuggestion(BaseModel):
    """Estrutura de resposta estrita para o LLM"""
    analysis: str = Field(description="Análise do porquê o seletor original falhou")
    suggested_selectors: List[str] = Field(description="Lista de novos seletores em ordem de prioridade")
    confidence: float = Field(description="Nível de confiança de 0 a 1")

class AgentState(BaseModel):
    dom_html: str
    original_selector: str
    element_description: str
    error_message: str
    final_response: Optional[SelectorSuggestion] = None

# --- Analisador de DOM ---
class DOMAnalyzer:
    def parse_dom(self, html_content: str) -> str:
        """Limpa o DOM para reduzir tokens e barulho"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove tags inúteis para testes
        for tag in soup(['script', 'style', 'svg', 'path', 'noscript', 'meta']):
            tag.decompose()
            
        # Retorna o HTML limpo (pode ser truncado se necessário)
        return str(soup)

# --- Agente LangGraph ---
class LangGraphSelectorAgent:
    def __init__(self):
        self.dom_analyzer = DOMAnalyzer()
        
        # LLM com Structured Output (Garante JSON válido)
        llm = ChatOpenAI(model='gpt-4o-mini', temperature=0)
        self.structured_llm = llm.with_structured_output(SelectorSuggestion)
        
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        workflow = StateGraph(AgentState)
        
        workflow.add_node("analyze_and_suggest", self._analyze_node)
        workflow.set_entry_point("analyze_and_suggest")
        workflow.set_finish_point("analyze_and_suggest")
        
        return workflow.compile()

    def _analyze_node(self, state: AgentState) -> dict:
        logger.info(f"Analisando seletor falho: {state.original_selector}")
        
        # Limpa o DOM
        clean_html = self.dom_analyzer.parse_dom(state.dom_html)
        
        # Prompt Otimizado
        prompt = f"""
        Você é um expert em QA Automation (Playwright).
        Analise o DOM abaixo e encontre um substituto para o seletor que falhou.
        
        Contexto:
        - Seletor Original: {state.original_selector}
        - Descrição: {state.element_description}
        - Erro: {state.error_message}
        
        DOM (Simplificado):
        {clean_html[:15000]}  # Limite de caracteres para segurança
        
        Retorne APENAS o JSON estruturado.
        """
        
        # Chamada ao LLM
        try:
            response = self.structured_llm.invoke([SystemMessage(content=prompt)])
            return {"final_response": response}
        except Exception as e:
            logger.error(f"Erro na LLM: {e}")
            return {"final_response": SelectorSuggestion(
                analysis="Erro interno na IA", 
                suggested_selectors=[], 
                confidence=0.0
            )}

    def analyze(self, dom_html: str, original_selector: str, description: str, error: str) -> dict:
        initial_state = AgentState(
            dom_html=dom_html,
            original_selector=original_selector,
            element_description=description,
            error_message=error
        )
        
        result = self.graph.invoke(initial_state)
        output = result.get('final_response')
        
        if output:
            return output.model_dump()
        return None