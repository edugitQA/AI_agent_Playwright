"""
PoC: Agente LangGraph para Auto-Correção de Seletores em Testes E2E

Este módulo implementa um agente autônomo usando LangGraph e OpenAI gpt-4o-mini,
para analisar o DOM de aplicações React e sugerir novos seletores quando
os seletores originais falham durante a execução de testes Playwright.

Funcionalidades principais:
1. Análise inteligente do DOM atual da página
2. Identificação de elementos semelhantes por texto, classe, estrutura
3. Geração de sugestões de novos seletores (data-testid, text=, CSS, XPath)
4. Logging detalhado para auditoria e aprendizado
5. Cache de seletores corrigidos para reutilização

Autor: EDUARDO ALVES
Data: 2025-07-23
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from pathlib import Path

import openai
from bs4 import BeautifulSoup, Tag
from langgraph.graph import StateGraph
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

# Configuração de logging
log_dir = Path(__file__).parent.parent / 'logs'
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / 'langgraph_agent.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class SelectorAnalysis:
    """Estrutura para armazenar análise de seletores"""
    original_selector: str
    element_description: str
    suggested_selectors: List[str]
    confidence_scores: List[float]
    reasoning: str
    timestamp: str
    dom_snapshot_path: str

@dataclass
class AgentState:
    """Estado do agente LangGraph"""
    dom_html: str
    original_selector: str
    element_description: str
    error_message: str
    analysis_results: Optional[SelectorAnalysis]
    suggested_selectors: List[str]
    final_selector: Optional[str]
    messages: List[Any]

class DOMAnalyzer:
    """Analisador de DOM para identificar elementos semelhantes"""
    
    def __init__(self):
        self.soup: Optional[BeautifulSoup] = None
    
    def parse_dom(self, html_content: str) -> BeautifulSoup:
        """Parseia o conteúdo HTML usando BeautifulSoup"""
        try:
            self.soup = BeautifulSoup(html_content, 'html.parser')
            logger.info("DOM parseado com sucesso")
            return self.soup
        except Exception as e:
            logger.error(f"Erro ao parsear DOM: {e}")
            raise
    
    def find_similar_elements(self, element_description: str) -> List[Dict[str, Any]]:
        """
        Encontra elementos similares no DOM baseado na descrição
        
        Args:
            element_description: Descrição do elemento procurado
            
        Returns:
            Lista de elementos similares com seus atributos
        """
        if not self.soup:
            raise ValueError("DOM não foi parseado. Chame parse_dom() primeiro.")
        
        similar_elements = []
        keywords = self._extract_keywords(element_description)

        # Detectar tipo esperado a partir da descrição
        expected_type = None
        if 'password' in element_description.lower():
            expected_type = 'password'
        elif 'text' in element_description.lower():
            expected_type = 'text'
        # Aqui Adicione outros tipos conforme necessário

        for tag in self.soup.find_all(['input', 'button', 'div', 'span', 'a', 'form']):
            # Filtro: se esperado um input de senha, só aceitar input[type=password]
            if expected_type and tag.name == 'input':
                if tag.get('type') != expected_type:
                    continue
            similarity_score = self._calculate_similarity(tag, keywords, element_description)
            if similarity_score > 0.3:  # Threshold de similaridade
                element_info = {
                    'tag': tag.name,
                    'text': tag.get_text(strip=True)[:100] if tag.get_text(strip=True) else '',
                    'attributes': dict(tag.attrs),
                    'similarity_score': similarity_score,
                    'suggested_selectors': self._generate_selectors_for_element(tag)
                }
                similar_elements.append(element_info)
        # Ordenar por score de similaridade
        similar_elements.sort(key=lambda x: x['similarity_score'], reverse=True)
        logger.info(f"Encontrados {len(similar_elements)} elementos similares")
        return similar_elements[:10]  # Retornar apenas os top 10
    
    def _extract_keywords(self, description: str) -> List[str]:
        """Extrai palavras-chave da descrição do elemento"""
        # Palavras-chave comuns para diferentes tipos de elementos
        common_words = {'input', 'button', 'field', 'text', 'password', 'login', 'submit', 'click'}
        
        words = description.lower().split()
        keywords = [word.strip('.,!?()[]{}') for word in words if len(word) > 2]
        
        return keywords
    
    def _calculate_similarity(self, tag: Tag, keywords: List[str], description: str) -> float:
        """Calcula score de similaridade entre um elemento e a descrição"""
        score = 0.0
        
        # Verificar texto do elemento
        element_text = tag.get_text(strip=True).lower()
        for keyword in keywords:
            if keyword in element_text:
                score += 0.3
        
        # Verificar atributos
        attributes_text = ' '.join([f"{k}={v}" for k, v in tag.attrs.items()]).lower()
        for keyword in keywords:
            if keyword in attributes_text:
                score += 0.2
        
        # Verificar tipo de elemento
        if 'input' in description.lower() and tag.name == 'input':
            score += 0.4
        elif 'button' in description.lower() and tag.name == 'button':
            score += 0.4
        
        # Verificar placeholder
        if tag.get('placeholder'):
            placeholder_text = tag.get('placeholder').lower()
            for keyword in keywords:
                if keyword in placeholder_text:
                    score += 0.3
        
        return min(score, 1.0)  # Limitar score a 1.0
    
    def _generate_selectors_for_element(self, tag: Tag) -> List[str]:
        """Gera diferentes tipos de seletores para um elemento"""
        selectors = []
        
        # data-testid (prioridade alta)
        if tag.get('data-testid'):
            selectors.append(f'[data-testid="{tag.get("data-testid")}"]')
        
        # ID
        if tag.get('id'):
            selectors.append(f'#{tag.get("id")}')
        
        # Classes
        if tag.get('class'):
            classes = ' '.join(tag.get('class'))
            selectors.append(f'.{".".join(tag.get("class"))}')
        
        # Texto visível
        text = tag.get_text(strip=True)
        if text and len(text) < 50:
            selectors.append(f'text="{text}"')
        
        # Placeholder
        if tag.get('placeholder'):
            selectors.append(f'[placeholder="{tag.get("placeholder")}"]')
        
        # Tipo de input
        if tag.name == 'input' and tag.get('type'):
            selectors.append(f'input[type="{tag.get("type")}"]')
        
        # Seletor CSS genérico
        css_selector = tag.name
        if tag.get('class'):
            css_selector += f'.{tag.get("class")[0]}'
        selectors.append(css_selector)
        
        return selectors

class LangGraphSelectorAgent:
    """Agente que realiza análise e correção de seletores"""
    
    def __init__(self):
        # Configurar OpenAI
        openai.api_key = os.getenv('OPENAI_API_KEY')
        if not openai.api_key:
            raise ValueError("OPENAI_API_KEY não encontrada nas variáveis de ambiente")
        
        # Configurar modelo (usando modelo suportado)
        self.llm = ChatOpenAI(
            model='gpt-4o-mini', 
            temperature=0.1,  # Baixa temperatura para respostas mais determinísticas
            max_tokens=2000
        )
        
        self.dom_analyzer = DOMAnalyzer()
        self.graph = self._build_graph()
        
        # Criar diretórios necessários
        Path('logs').mkdir(exist_ok=True)
        Path('dom_snapshots').mkdir(exist_ok=True)
    
    def _build_graph(self) -> StateGraph:
        """Constrói o grafo LangGraph para processamento"""
        
        def analyze_dom_node(state: AgentState) -> AgentState:
            """Nó para análise do DOM"""
            logger.info("Iniciando análise do DOM...")
            
            try:
                # Parsear DOM
                self.dom_analyzer.parse_dom(state.dom_html)
                
                # Encontrar elementos similares
                similar_elements = self.dom_analyzer.find_similar_elements(state.element_description)
                
                # Preparar contexto para o LLM
                context = self._prepare_llm_context(state, similar_elements)
                state.messages.append(context)
                
                logger.info("Análise do DOM concluída")
                return state
                
            except Exception as e:
                logger.error(f"Erro na análise do DOM: {e}")
                state.error_message = str(e)
                return state
        
        def generate_suggestions_node(state: AgentState) -> AgentState:
            """Nó para geração de sugestões usando LLM"""
            logger.info("Gerando sugestões de seletores...")
            
            try:
                # Chamar LLM para análise
                response = self.llm.invoke(state.messages)
                
                # Processar resposta
                suggestions = self._process_llm_response(response.content)
                state.suggested_selectors = suggestions
                
                logger.info(f"Geradas {len(suggestions)} sugestões de seletores")
                return state
                
            except Exception as e:
                logger.error(f"Erro na geração de sugestões: {e}")
                state.error_message = str(e)
                return state
        
        def select_best_selector_node(state: AgentState) -> AgentState:
            """Nó para seleção do melhor seletor"""
            logger.info("Selecionando melhor seletor...")
            
            if state.suggested_selectors:
                # Por enquanto, selecionar o primeiro (com maior confiança)
                state.final_selector = state.suggested_selectors[0]
                logger.info(f"Seletor selecionado: {state.final_selector}")
            else:
                logger.warning("Nenhuma sugestão de seletor disponível")
            
            return state
        
        # Construir grafo
        workflow = StateGraph(AgentState)
        
        # Adicionar nós
        workflow.add_node("analyze_dom", analyze_dom_node)
        workflow.add_node("generate_suggestions", generate_suggestions_node)
        workflow.add_node("select_best_selector", select_best_selector_node)
        
        # Definir fluxo
        workflow.set_entry_point("analyze_dom")
        workflow.add_edge("analyze_dom", "generate_suggestions")
        workflow.add_edge("generate_suggestions", "select_best_selector")
        workflow.set_finish_point("select_best_selector")
        
        return workflow.compile()
    
    def _prepare_llm_context(self, state: AgentState, similar_elements: List[Dict]) -> SystemMessage:
        """Prepara o contexto para o LLM"""
        
        context = f"""
Você é um especialista em automação de testes E2E e análise de DOM. Sua tarefa é analisar o DOM de uma aplicação React e sugerir novos seletores quando um seletor original falha.

INFORMAÇÕES DO PROBLEMA:
- Seletor original que falhou: {state.original_selector}
- Descrição do elemento procurado: {state.element_description}
- Mensagem de erro: {state.error_message}

ELEMENTOS SIMILARES ENCONTRADOS NO DOM:
{json.dumps(similar_elements, indent=2, ensure_ascii=False)}

INSTRUÇÕES:
1. Analise os elementos similares encontrados.
2. Identifique qual elemento mais provavelmente corresponde à descrição.
3. Sugira 3-5 seletores alternativos em ordem de prioridade.
4. Para cada seletor, forneça uma explicação do porquê é uma boa opção.
5. Priorize seletores estáveis (data-testid > text > CSS classes > XPath).
6. **IMPORTANTE: Evite seletores excessivamente genéricos como 'body' ou '#root', a menos que seja a única opção possível.**

FORMATO DE RESPOSTA (JSON):
{{
  "analysis": "Sua análise detalhada do problema",
  "recommended_selectors": [
    {{
      "selector": "seletor_sugerido",
      "type": "tipo_do_seletor",
      "confidence": 0.95,
      "reasoning": "explicação_da_escolha"
    }}
  ]
}}
"""
        
        return SystemMessage(content=context)
    
    def _process_llm_response(self, response_content: str) -> List[str]:
        """Processa a resposta do LLM e extrai os seletores sugeridos"""
        try:
            # Tentar parsear como JSON
            if '{' in response_content and '}' in response_content:
                # Extrair JSON da resposta
                start = response_content.find('{')
                end = response_content.rfind('}') + 1
                json_str = response_content[start:end]
                
                response_data = json.loads(json_str)
                
                selectors = []
                if 'recommended_selectors' in response_data:
                    for item in response_data['recommended_selectors']:
                        if 'selector' in item:
                            selectors.append(item['selector'])
                
                return selectors
            
        except json.JSONDecodeError:
            logger.warning("Não foi possível parsear resposta como JSON")
        
        # Fallback: extrair seletores usando regex ou heurísticas
        selectors = []
        lines = response_content.split('\n')
        for line in lines:
            line = line.strip()
            if any(char in line for char in ['[', ']', '#', '.', 'text=', 'data-testid']):
                if len(line) < 200:  # Evitar linhas muito longas
                    selectors.append(line)
        
        return selectors[:5]  # Limitar a 5 sugestões
    
    def analyze_and_suggest(
        self, 
        dom_html: str, 
        original_selector: str, 
        element_description: str,
        error_message: str = ""
    ) -> Optional[SelectorAnalysis]:
        """
        Método principal para análise e sugestão de seletores
        
        Args:
            dom_html: HTML da página atual
            original_selector: Seletor que falhou
            element_description: Descrição do elemento procurado
            error_message: Mensagem de erro do Playwright
            
        Returns:
            Análise com sugestões de seletores ou None se falhar
        """
        logger.info(f"Iniciando análise para seletor: {original_selector}")
        
        try:
            # Salvar snapshot do DOM
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            dom_snapshot_path = f"dom_snapshots/dom_snapshot_{timestamp}.html"
            
            with open(dom_snapshot_path, 'w', encoding='utf-8') as f:
                f.write(dom_html)
            
            # Criar estado inicial
            initial_state = AgentState(
                dom_html=dom_html,
                original_selector=original_selector,
                element_description=element_description,
                error_message=error_message,
                analysis_results=None,
                suggested_selectors=[],
                final_selector=None,
                messages=[]
            )
            
            # Executar grafo LangGraph
            final_state = self.graph.invoke(initial_state)
            
            # Verificar se há seletores sugeridos
            suggested_selectors = getattr(final_state, 'suggested_selectors', [])
            if not suggested_selectors:
                # Fallback: tentar extrair do DOM analyzer diretamente
                try:
                    self.dom_analyzer.parse_dom(dom_html)
                    similar_elements = self.dom_analyzer.find_similar_elements(element_description)
                    if similar_elements:
                        # Pegar os seletores do primeiro elemento mais similar
                        suggested_selectors = similar_elements[0].get('suggested_selectors', [])
                except Exception as e:
                    logger.warning(f"Fallback para extração de seletores falhou: {e}")
            
            # Criar análise final
            analysis = SelectorAnalysis(
                original_selector=original_selector,
                element_description=element_description,
                suggested_selectors=suggested_selectors,
                confidence_scores=[0.9] * len(suggested_selectors),  # Placeholder
                reasoning="Análise baseada em similaridade de DOM e LLM",
                timestamp=timestamp,
                dom_snapshot_path=dom_snapshot_path
            )
            
            # Salvar análise
            self._save_analysis(analysis)
            
            logger.info("Análise concluída com sucesso")
            return analysis
            
        except Exception as e:
            logger.error(f"Erro durante análise: {e}")
            return None
    
    def _save_analysis(self, analysis: SelectorAnalysis):
        """Salva a análise em arquivo JSON para auditoria"""
        try:
            log_dir = Path(__file__).parent.parent / 'logs'
            analysis_path = log_dir / f"analysis_{analysis.timestamp}.json"
            with open(analysis_path, 'w', encoding='utf-8') as f:
                json.dump(asdict(analysis), f, indent=2, ensure_ascii=False)
            
            logger.info(f"Análise salva em: {analysis_path}")
            
        except Exception as e:
            logger.error(f"Erro ao salvar análise: {e}")

# Exemplo de uso
if __name__ == "__main__":
    # Teste básico do agente
    agent = LangGraphSelectorAgent()
    
    # HTML de exemplo
    sample_html = """
    <html>
    <body>
        <div class="login-form">
            <input data-testid="username-input" type="text" placeholder="Digite seu usuário" />
            <input data-testid="password-input" type="password" placeholder="Digite sua senha" />
            <button data-testid="login-button">Entrar</button>
        </div>
    </body>
    </html>
    """
    
    # Testar análise
    analysis = agent.analyze_and_suggest(
        dom_html=sample_html,
        original_selector='[data-testid="password-field-old"]',
        element_description='input field for password with placeholder "Digite sua senha"',
        error_message='Element not found'
    )
    
    if analysis:
        print("Análise concluída:")
        print(f"Seletores sugeridos: {analysis.suggested_selectors}")
    else:
        print("Falha na análise")

