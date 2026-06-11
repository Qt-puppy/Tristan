import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import List

class SuggestedRemediation(BaseModel):
    original_clause: str
    suggested_clause: str
    reason: str

class EvaluationResponse(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall compliance score from 0 to 100")
    risk_radar: dict = Field(..., description="5 categories: Data Protection, Indemnification, Termination, Compliance, Governance, each 0-100")
    flagged_clauses: List[str]
    remediations: List[SuggestedRemediation]

def evaluate_clauses_against_framework(retrieved_parents: List[str], framework: str) -> dict:
    """
    Evaluates retrieved chunks using Gemini against a given compliance framework.
    Returns structured JSON output.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        # Mock response if API key is not yet set
        return {
            "overall_score": 75,
            "risk_radar": {"Data Protection": 40, "Indemnification": 80, "Termination": 30, "Compliance": 50, "Governance": 20},
            "flagged_clauses": ["Mock flagged clause about indemnification."],
            "remediations": [{
                "original_clause": "Mock flagged clause about indemnification.",
                "suggested_clause": "Revised mock clause with limited liability.",
                "reason": "Reduces liability exposure."
            }]
        }

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.1,
        google_api_key=api_key
    )
    
    context = "\n\n".join(retrieved_parents)
    
    prompt = f"""
    You are an elite Enterprise Compliance Auditor. You have been provided with retrieved clauses from a legal contract. 

    Your job is to evaluate these clauses for LEGAL AND FINANCIAL RISK based on the user's selected compliance framework: {framework}.

    CRITICAL INSTRUCTIONS TO PREVENT FALSE POSITIVES:
    1. DO NOT flag a clause simply because it mentions liability, data, or termination. 
    2. You must evaluate the SENTIMENT and INTENT. 
       - Example of SAFE: "Data will be deleted in 30 days." (DO NOT FLAG)
       - Example of RISKY: "Provider keeps data forever." (FLAG THIS)
       - Example of SAFE: "Liability is capped at 12 months of fees." (DO NOT FLAG)
       - Example of RISKY: "Client indemnifies Provider for gross negligence." (FLAG THIS)
    3. If a clause represents standard, fair, B2B enterprise practices, ignore it. 
    4. Only flag clauses that are predatory, asymmetrical, or explicitly violate regulatory standards.

    Evaluate the provided text and return a JSON payload with an overall score (100 = perfectly safe, 0 = highly toxic), risk axis distributions (out of 100 where higher means higher risk), and ONLY the truly dangerous clauses with suggested remediations.

    Retrieved Clauses: 
    {context}
    
    Please provide the output matching this exact JSON schema:
    {{
        "overall_score": <int>,
        "risk_radar": {{"Data Protection": <int>, "Indemnification": <int>, "Termination": <int>, "Compliance": <int>, "Governance": <int>}},
        "flagged_clauses": ["<string>"],
        "remediations": [{{"original_clause": "<string>", "suggested_clause": "<string>", "reason": "<string>"}}]
    }}
    """
    
    response = llm.invoke(prompt)
    
    # Try to parse JSON from the response text
    try:
        clean_json = response.content.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:-3]
        elif clean_json.startswith("```"):
            clean_json = clean_json[3:-3]
            
        result = json.loads(clean_json)
        return result
    except Exception as e:
        print(f"Error parsing JSON from LLM: {e}")
        return {
            "overall_score": 0,
            "risk_radar": {"Data Protection": 0, "Indemnification": 0, "Termination": 0, "Compliance": 0, "Governance": 0},
            "flagged_clauses": [],
            "remediations": []
        }
