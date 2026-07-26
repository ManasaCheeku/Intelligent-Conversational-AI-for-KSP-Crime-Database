"""
Seed demo accounts for KSP IntelliCrime AI
"""
from app.database.database import SessionLocal, engine
from app.database.base import Base
from app.models.user import User
from app.models.crime import Crime
from app.security.hashing import hash_password
from datetime import date

Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    try:
        demo_users = [
            {
                "email": "c@x.com",
                "full_name": "Citizen User",
                "mobile": "+919876543210",
                "password": "password123",
                "role": "citizen"
            },
            {
                "email": "o@x.com",
                "full_name": "Inspector Ramesh",
                "mobile": "+919876543211",
                "password": "password123",
                "role": "police_officer",
                "badge_number": "KSP-IND-884",
                "rank": "Inspector",
                "station": "Mysuru Central",
                "district": "Mysuru"
            },
            {
                "email": "a@x.com",
                "full_name": "System Administrator",
                "mobile": "+919876543212",
                "password": "password123",
                "role": "admin"
            },
            {
                "email": "citizen@ksp.gov.in",
                "full_name": "KSP Citizen",
                "mobile": "+919876543220",
                "password": "citizen123",
                "role": "citizen"
            },
            {
                "email": "officer@ksp.gov.in",
                "full_name": "Sub-Inspector Suresh",
                "mobile": "+919876543221",
                "password": "officer123",
                "role": "police_officer",
                "badge_number": "KSP-BLR-102",
                "rank": "Sub-Inspector",
                "station": "Electronic City",
                "district": "Bengaluru"
            },
            {
                "email": "admin@ksp.gov.in",
                "full_name": "Super Admin",
                "mobile": "+919876543222",
                "password": "admin123",
                "role": "admin"
            }
        ]

        for data in demo_users:
            existing = db.query(User).filter(User.email == data["email"]).first()
            pwd_hash = hash_password(data["password"])
            if existing:
                existing.password_hash = pwd_hash
                existing.full_name = data["full_name"]
                existing.role = data["role"]
                existing.is_active = True
                if "badge_number" in data:
                    existing.badge_number = data["badge_number"]
                    existing.rank = data["rank"]
                    existing.station = data["station"]
                    existing.district = data["district"]
            else:
                user = User(
                    email=data["email"],
                    full_name=data["full_name"],
                    mobile=data["mobile"],
                    password_hash=pwd_hash,
                    role=data["role"],
                    is_active=True,
                    badge_number=data.get("badge_number"),
                    rank=data.get("rank"),
                    station=data.get("station"),
                    district=data.get("district")
                )
                db.add(user)

        # Seed default crime report if empty
        if db.query(Crime).count() == 0:
            citizen_user = db.query(User).filter(User.email == "c@x.com").first()
            officer_user = db.query(User).filter(User.email == "o@x.com").first()
            crime = Crime(
                crime_number="KSP-2026-000001",
                title="ATM Skimming & Cyber Fraud at Central Market",
                crime_type="Cyber Crime",
                description="Multiple unauthorised transactions reported from ATM Terminal #42. Suspected skimmer device installed.",
                location="Central Market Road",
                district="Mysuru",
                state="Karnataka",
                latitude=12.3052,
                longitude=76.6552,
                incident_date=date(2026, 7, 20),
                incident_time="22:15",
                priority="high",
                status="under_investigation",
                reporter_id=citizen_user.id if citizen_user else 1,
                assigned_officer_id=officer_user.id if officer_user else 2
            )
            db.add(crime)

        db.commit()
        print("Successfully seeded demo users & initial crime report.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding demo users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
