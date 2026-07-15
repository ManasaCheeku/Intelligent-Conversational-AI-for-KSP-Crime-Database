from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from app.core.config import settings
from app.database.database import engine
from app.database.base import Base
from app import models
from app.routers import admin, auth, crimes, dashboard, notifications, users

app = FastAPI(
    title="KSP IntelliCrime AI",
    description="AI-Powered Crime Intelligence & Decision Support Platform",
    version="1.0.0"
)


def migrate_legacy_sqlite_users() -> None:
    """Upgrade the original local user table without discarding registered accounts."""
    if engine.dialect.name != "sqlite":
        return
    columns = {column["name"] for column in inspect(engine).get_columns("users")} if inspect(engine).has_table("users") else set()
    if columns and "mobile" not in columns:
        with engine.begin() as connection:
            legacy_users = connection.execute(text("SELECT * FROM users")).mappings().all()
            connection.execute(text("DROP TABLE users"))
            Base.metadata.create_all(bind=connection)
            for legacy_user in legacy_users:
                role = "police_officer" if legacy_user["role"] == "officer" else legacy_user["role"]
                connection.execute(
                    text("""INSERT INTO users (id, full_name, email, mobile, password_hash, role, is_active, created_at, updated_at)
                    VALUES (:id, :full_name, :email, :mobile, :password_hash, :role, :is_active, :created_at, :updated_at)"""),
                    {**legacy_user, "mobile": f"legacy-{legacy_user['id']}", "password_hash": legacy_user["hashed_password"], "role": role},
                )


def migrate_sqlite_reporting_columns() -> None:
    """Add non-destructive columns required by later reporting enhancements."""
    if engine.dialect.name != "sqlite":
        return
    with engine.begin() as connection:
        inspector = inspect(connection)
        if inspector.has_table("users"):
            user_columns = {column["name"] for column in inspector.get_columns("users")}
            for name, definition in {"badge_number": "VARCHAR(50)", "rank": "VARCHAR(80)", "station": "VARCHAR(150)", "district": "VARCHAR(100)"}.items():
                if name not in user_columns:
                    connection.execute(text(f"ALTER TABLE users ADD COLUMN {name} {definition}"))
        if inspector.has_table("crimes"):
            crime_columns = {column["name"] for column in inspector.get_columns("crimes")}
            if "assigned_officer_id" not in crime_columns:
                connection.execute(text("ALTER TABLE crimes ADD COLUMN assigned_officer_id INTEGER"))
                if "assigned_officer" in crime_columns:
                    connection.execute(text("UPDATE crimes SET assigned_officer_id = assigned_officer"))
            if "assigned_at" not in crime_columns:
                connection.execute(text("ALTER TABLE crimes ADD COLUMN assigned_at DATETIME"))


migrate_legacy_sqlite_users()
migrate_sqlite_reporting_columns()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(crimes.router)
app.include_router(admin.router)
app.include_router(dashboard.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"message": "Welcome to KSP IntelliCrime AI", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
