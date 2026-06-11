from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
import uuid

class HierarchicalChunker:
    def __init__(self, parent_chunk_size=1000, child_chunk_size=100, parent_overlap=100, child_overlap=20):
        self.parent_splitter = RecursiveCharacterTextSplitter(
            chunk_size=parent_chunk_size,
            chunk_overlap=parent_overlap,
        )
        self.child_splitter = RecursiveCharacterTextSplitter(
            chunk_size=child_chunk_size,
            chunk_overlap=child_overlap,
        )

    def chunk_document(self, text: str) -> List[Dict[str, Any]]:
        """
        Splits the document into Parent Chunks and Child Chunks.
        Returns a list of parent chunks, each containing its respective child chunks.
        """
        parent_chunks = self.parent_splitter.split_text(text)
        
        hierarchical_data = []
        for p_chunk in parent_chunks:
            p_id = str(uuid.uuid4())
            child_chunks = self.child_splitter.split_text(p_chunk)
            
            children_data = []
            for c_chunk in child_chunks:
                children_data.append({
                    "id": str(uuid.uuid4()),
                    "text": c_chunk,
                    "parent_id": p_id
                })
                
            hierarchical_data.append({
                "parent_id": p_id,
                "parent_text": p_chunk,
                "children": children_data
            })
            
        return hierarchical_data
