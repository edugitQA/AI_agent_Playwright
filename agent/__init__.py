"""
PoC: Sistema de Auto-Correção de Testes E2E

Este pacote contém os módulos principais para o sistema de auto-correção
de seletores em testes Playwright usando LangGraph e agentes autônomos.

Módulos:
- langgraph_handler: Agente LangGraph para análise do DOM e sugestão de seletores
- self_healing_runner: Sistema de integração e execução da auto-correção

Autor: Manus AI
Data: 2025-07-23
"""

from .langgraph_handler import LangGraphSelectorAgent, SelectorAnalysis
from .self_healing_runner import SelfHealingTestRunner, SelfHealingTestRunnerSync, HealingAttempt

__all__ = [
    'LangGraphSelectorAgent',
    'SelectorAnalysis', 
    'SelfHealingTestRunner',
    'SelfHealingTestRunnerSync',
    'HealingAttempt'
]

