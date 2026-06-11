import fitz  # PyMuPDF
from typing import List

def extract_text_from_pdf(file_path: str) -> str:
    """Extract clean text from a multi-page PDF."""
    doc = fitz.open(file_path)
    text_content = []
    for page in doc:
        text_content.append(page.get_text("text"))
    return "\n\n".join(text_content)
