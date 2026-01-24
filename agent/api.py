import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Validar OPENAI_API_KEY antes de importar
if not os.getenv("OPENAI_API_KEY"):
    raise EnvironmentError("❌ ERRO: Variável OPENAI_API_KEY não encontrada. Configure-a no Render.")

try:
    from .langgraph_handler import LangGraphSelectorAgent
except ImportError as e:
    print(f"❌ Erro ao importar LangGraphSelectorAgent: {e}")
    sys.exit(1)

# Inicializa API e Agente (Carrega o modelo na memória apenas UMA vez)
app = FastAPI(title="AI Self-Healing Agent")
agent = LangGraphSelectorAgent()

class AnalysisRequest(BaseModel):
    dom_html: str
    original_selector: str
    element_description: str
    error_message: str = ""

@app.get("/health")
def health_check():
    return {"status": "online", "model": "gpt-4o-mini"}

@app.post("/heal")
async def heal_selector(request: AnalysisRequest):
    try:
        result = agent.analyze(
            dom_html=request.dom_html,
            original_selector=request.original_selector,
            description=request.element_description,
            error=request.error_message
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Falha na análise do agente")
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Roda o servidor na porta 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)