from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import tempfile
from ..engine.ingestion import extract_text_from_pdf
from ..engine.chunking import HierarchicalChunker
from ..engine.llm import evaluate_clauses_against_framework

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    audit_profile: str = Form(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
            
        # 1. Ingestion
        text = extract_text_from_pdf(tmp_path)
        
        # 2. Chunking
        chunker = HierarchicalChunker()
        hierarchical_data = chunker.chunk_document(text)
        
        # Mocking Qdrant integration for scaffolding
        # Take the top 3 parent chunks as a mockup for the LLM context.
        parent_chunks = [p["parent_text"] for p in hierarchical_data[:3]]
        
        if not parent_chunks:
            parent_chunks = ["No text extracted from document."]
        
        # 3. LLM Evaluation
        evaluation_result = evaluate_clauses_against_framework(parent_chunks, audit_profile)
        
        os.remove(tmp_path)
        
        return evaluation_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
