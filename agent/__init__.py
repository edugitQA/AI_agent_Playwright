"""
PoC: Sistema de Auto-Correção de Testes E2E

Este pacote contém os módulos principais para o sistema de auto-correção
de seletores em testes Playwright usando LangGraph e agentes autônomos.

Módulos:
- langgraph_handler: Agente LangGraph para análise do DOM e sugestão de seletores
- python_bridge: Interface Python para comunicação com JavaScript
- self_healing_runner.js: Sistema JavaScript de integração com Playwright

Autor: Eduardo Alves
Data: 2025-08-23
"""

from .langgraph_handler import LangGraphSelectorAgent, SelectorSuggestion

__all__ = [
    'LangGraphSelectorAgent',
    'SelectorSuggestion'
]

