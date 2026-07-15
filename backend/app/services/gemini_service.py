from fastapi import HTTPException, status
from app.core.config import settings


def generate_investigation_insight(crime_context: str, language: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI investigation assistance is unavailable until GEMINI_API_KEY is configured")
    try:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"""You are a Karnataka State Police investigation assistant. Analyse the following report. Return concise sections: Investigation Summary, Suggested Next Steps, Relevant BNS/IPC Sections (state uncertainty), Risk Assessment, Evidence Checklist, and Similar-case search cues. Respond in {language}. Do not invent facts.\n\n{crime_context}"""
        response = client.models.generate_content(model=settings.GEMINI_MODEL, contents=prompt)
        return response.text or "No AI analysis was returned."
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI investigation service could not complete the request") from error
