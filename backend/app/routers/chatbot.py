from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services import gemini_service, crime_service
from app.services.auth_service import get_current_active_user
from app.models.user import User
from app.schemas.chatbot import ChatRequest, ChatResponse

router = APIRouter() # No prefix here, as it's defined in main.py

@router.post("/", response_model=ChatResponse)
def handle_chat_query(payload: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        # In a real app, you'd fetch case context from the DB based on payload.case_id
        # For this demo, we'll use a generic context.
        crime_context = f"User '{current_user.full_name}' is asking about case '{payload.case_id}'. The query is: {payload.query}"
        response = gemini_service.generate_investigation_insight(crime_context, "English")
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))