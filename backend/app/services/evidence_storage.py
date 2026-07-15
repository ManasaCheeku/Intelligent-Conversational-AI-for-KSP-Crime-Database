from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings

ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "video/mp4": ".mp4", "video/webm": ".webm", "application/pdf": ".pdf"}


async def save_evidence_file(file: UploadFile) -> tuple[str, str, int, str]:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only JPEG, PNG, WEBP, MP4, WEBM, and PDF evidence files are allowed")
    content = await file.read()
    maximum_size = settings.MAX_EVIDENCE_FILE_SIZE_MB * 1024 * 1024
    if not content:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Evidence file is empty")
    if len(content) > maximum_size:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f"Evidence files must not exceed {settings.MAX_EVIDENCE_FILE_SIZE_MB} MB")
    upload_dir = Path(settings.UPLOAD_DIRECTORY)
    upload_dir.mkdir(parents=True, exist_ok=True)
    stored_filename = f"{uuid4().hex}{ALLOWED_TYPES[file.content_type]}"
    storage_path = upload_dir / stored_filename
    storage_path.write_bytes(content)
    return file.filename or "evidence", stored_filename, len(content), str(storage_path)
