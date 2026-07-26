from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    case_id: str

from pydantic import BaseModel, Field
from typing import List, Optional

class ReasoningStep(BaseModel):
    step: int
    description: str
    evidenceRef: List[str] = Field(default_factory=list)

class EvidenceTag(BaseModel):
    id: str
    title: str
    type: str
    confidence: float
    summary: str

class IPCSection(BaseModel):
    section: str
    title: str
    relevantClause: str

class ChatResponse(BaseModel):
    text: str
    reasoningSteps: Optional[List[ReasoningStep]] = None
    evidenceTags: Optional[List[EvidenceTag]] = None
    IPCSections: Optional[List[IPCSection]] = None
    suggestedActions: Optional[List[str]] = None
