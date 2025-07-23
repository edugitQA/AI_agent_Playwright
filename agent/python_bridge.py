#!/usr/bin/env python3
"""
Ponte Python para integração do agente LangGraph com Playwright JavaScript

Este script serve como uma ponte entre o código JavaScript do Playwright
e o agente Python LangGraph, permitindo a análise do DOM e sugestão de seletores.

Uso:
    python3 python_bridge.py <original_selector> <element_description> <dom_file>

Autor: Manus AI
Data: 2025-07-23
"""

import sys
import json
import os
from pathlib import Path

# Adicionar o diretório atual ao path para importar o módulo
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from langgraph_handler import LangGraphSelectorAgent

def main():
    if len(sys.argv) != 4:
        print(json.dumps({
            "error": "Uso: python3 python_bridge.py <original_selector> <element_description> <dom_file>"
        }))
        sys.exit(1)
    
    original_selector = sys.argv[1]
    element_description = sys.argv[2]
    dom_file = sys.argv[3]
    
    try:
        # Ler o arquivo DOM
        with open(dom_file, 'r', encoding='utf-8') as f:
            dom_html = f.read()
        
        # Criar agente e analisar
        agent = LangGraphSelectorAgent()
        analysis = agent.analyze_and_suggest(
            dom_html=dom_html,
            original_selector=original_selector,
            element_description=element_description,
            error_message=f"Selector '{original_selector}' not found"
        )
        
        if analysis:
            # Retornar resultado como JSON
            result = {
                "success": True,
                "original_selector": analysis.original_selector,
                "element_description": analysis.element_description,
                "suggested_selectors": analysis.suggested_selectors,
                "confidence_scores": analysis.confidence_scores,
                "reasoning": analysis.reasoning,
                "timestamp": analysis.timestamp
            }
        else:
            result = {
                "success": False,
                "error": "Falha na análise do agente LangGraph",
                "suggested_selectors": []
            }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "suggested_selectors": []
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)
    


if __name__ == "__main__":
    main()

