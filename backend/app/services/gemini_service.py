import json
from fastapi import HTTPException, status
from pydantic import BaseModel, Field
from app.core.config import settings
import google.generativeai as genai

class ReasoningStep(BaseModel):
    step: int
    description: str
    evidenceRef: list[str] = Field(default_factory=list)

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
    reasoningSteps: list[ReasoningStep] | None = None
    evidenceTags: list[EvidenceTag] | None = None
    IPCSections: list[IPCSection] | None = None
    suggestedActions: list[str] | None = None


def generate_investigation_insight(crime_context: str, language: str) -> ChatResponse:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI investigation assistance is unavailable until GEMINI_API_KEY is configured")

    genai.configure(api_key=settings.GEMINI_API_KEY)

    prompt = f"""You are a Karnataka State Police investigation assistant. Analyze the following report and user query. Return a JSON object with the following structure:
    {{
        "text": "Your summary of the analysis.",
        "reasoningSteps": [{{ "step": 1, "description": "...", "evidenceRef": ["..."] }}],
        "evidenceTags": [{{ "id": "...", "title": "...", "type": "...", "confidence": 0.0, "summary": "..." }}],
        "IPCSections": [{{ "section": "...", "title": "...", "relevantClause": "..." }}],
        "suggestedActions": ["..."]
    }}
    Respond in {language}. Do not invent facts.

    {crime_context}
    """

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(prompt)
        
        # Clean the response to extract only the JSON part.
        clean_response = response.text.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]

        response_json = json.loads(clean_response)
        return ChatResponse(**response_json)
    except json.JSONDecodeError:
        # If the response is not valid JSON, return it as plain text.
        return ChatResponse(text=response.text or "No AI analysis was returned.")
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI investigation service could not complete the request") from error
