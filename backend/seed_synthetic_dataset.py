"""
KSP IntelliCrime AI — Synthetic Demo Dataset Generator
Populates the database with realistic synthetic crime intelligence data for Karnataka State Police.
All crime_type, status, and priority values strictly match schema Enums.
"""

import random
from datetime import datetime, date, time, timedelta, timezone
from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.database.base import Base
from app.models.user import User
from app.models.crime import Crime, Evidence
from app.models.investigation import Investigation, InvestigationNote, CaseStatusHistory
from app.models.notification import Notification
from app.models.audit_log import AuditLog
from app.security.hashing import hash_password

Base.metadata.create_all(bind=engine)

# Karnataka District Coordinates & Police Stations
KARNATAKA_DISTRICTS = {
    "Bengaluru": {
        "lat": (12.90, 13.08),
        "lng": (77.50, 77.72),
        "stations": ["Electronic City PS", "Hebbal PS", "Koramangala PS", "Indiranagar PS", "Whitefield PS", "Jayanagar PS", "M.G. Road PS", "Peenya PS"]
    },
    "Mysuru": {
        "lat": (12.28, 12.35),
        "lng": (76.60, 76.70),
        "stations": ["Mysuru Central PS", "Devaraja PS", "Nazarbad PS", "Vidyaranyapuram PS", "K.R. PS"]
    },
    "Mangaluru": {
        "lat": (12.85, 12.95),
        "lng": (74.80, 74.92),
        "stations": ["Mangaluru Port PS", "Urwa PS", "Kadri PS", "Pandeshwar PS", "Barkeke PS"]
    },
    "Hubballi-Dharwad": {
        "lat": (15.30, 15.45),
        "lng": (75.05, 75.20),
        "stations": ["Hubballi Sub-Urban PS", "Dharwad Town PS", "Gokul Road PS", "Keshwapur PS"]
    },
    "Belagavi": {
        "lat": (15.80, 15.90),
        "lng": (74.48, 74.58),
        "stations": ["Belagavi Market PS", "Camp PS", "Khade Bazar PS", "APMC PS"]
    },
    "Kalaburagi": {
        "lat": (17.30, 17.38),
        "lng": (76.80, 76.90),
        "stations": ["Kalaburagi Town PS", "Station Bazar PS", "Chowk PS", "Brahampur PS"]
    },
    "Udupi": {
        "lat": (13.30, 13.40),
        "lng": (74.72, 74.80),
        "stations": ["Udupi Town PS", "Manipal PS", "Malpe PS", "Kaup PS"]
    },
    "Shivamogga": {
        "lat": (13.90, 13.98),
        "lng": (75.52, 75.62),
        "stations": ["Shivamogga Town PS", "Doddapete PS", "Kote PS", "Tunga PS"]
    },
    "Tumakuru": {
        "lat": (13.30, 13.40),
        "lng": (77.08, 77.18),
        "stations": ["Tumakuru Town PS", "Kyathsandra PS", "Tilak Park PS"]
    },
    "Ballari": {
        "lat": (15.10, 15.20),
        "lng": (76.88, 76.98),
        "stations": ["Ballari Town PS", "Brucepet PS", "Gandhinagar PS", "Cowled Bazar PS"]
    }
}

# Strict Enum Mapping for Pydantic Schema compatibility
CRIME_TYPE_MAPPING = {
    "cyber_crime": [
        "Unauthorised ATM Skimming & Card Cloning",
        "Phishing & Banking Credential Theft",
        "SIM Swap Fraud & UPI Exploitation",
        "Ransomware Attack on Supply Chain Network",
        "Identity Theft & Fake Loan App Scam",
        "Crypto Investment Ponzi Scheme Fraud"
    ],
    "fraud": [
        "Corporate Cheque Forgery & Fund Diversion",
        "Real Estate Land Deed Fraud Syndicate",
        "Multi-crore GST E-way Bill Tax Evasion",
        "Microfinance Cooperative Embezzlement",
        "Illegal Chit Fund Operation Default"
    ],
    "theft": [
        "Luxury SUV Theft at Commercial Parking",
        "Two-wheeler Theft Ring in Residential Zone",
        "Inter-state Stolen Vehicle Dismantling Hub",
        "Night Residential Break-in & Gold Theft",
        "Commercial Warehouse Forced Break-in",
        "Electronics Showroom Safe Break-in"
    ],
    "robbery": [
        "Armed Highway Robbery on State Highway",
        "Jewellery Showroom Daylight Heist",
        "Cash Delivery Van Interception",
        "Chain Snatching by Motorbike Duo"
    ],
    "drug_offense": [
        "Synthetic Drug Distribution Syndicate",
        "Inter-state Cannabis Transport Seizure",
        "MDMA & Ecstasy Parcel Smuggling",
        "Pharmaceutical Opioid Diversion"
    ],
    "assault": [
        "Street Violence & Aggravated Assault",
        "Commercial Property Dispute Brawl",
        "Gang Conflict in Suburban Market",
        "Road Rage Aggravated Attack"
    ],
    "murder": [
        "Targeted Dispute Homicide Investigation",
        "Unidentified Deceased Found in Forest Zone",
        "Business Rivalry Violence Investigation"
    ],
    "kidnapping": [
        "Abduction for Ransom Demand",
        "Inter-state Kidnapping & Extortion"
    ],
    "domestic_violence": [
        "Domestic Physical Assault & Harassment Complaint",
        "Family Property Dispute Intimidation"
    ],
    "traffic_violation": [
        "Hit and Run Aggravated Driving Incident",
        "Reckless Highway Drag Racing Endangerment"
    ]
}

OFFICER_NAMES = [
    ("Suresh Kumar", "Inspector"),
    ("Rajesh Gowda", "Sub-Inspector"),
    ("Ananya Patil", "DSP"),
    ("Venkatesh Naik", "Inspector"),
    ("Mahesh Shetty", "Sub-Inspector"),
    ("Priya Deshmukh", "ASI"),
    ("Basavaraj Bommai", "Inspector"),
    ("Kiran Rao", "Sub-Inspector"),
    ("Deepak Hegde", "DSP"),
    ("Lakshmi Narasimhan", "Inspector"),
    ("Vinay Kumar", "Sub-Inspector"),
    ("Sunil Dutt", "ASI"),
    ("Ramesh Babu", "Inspector"),
    ("Ganesh Prasad", "Sub-Inspector"),
    ("Siddharth Kulkarni", "DSP"),
    ("Vidya Sagar", "Inspector"),
    ("Arun Joshi", "Sub-Inspector"),
    ("Chandrashekar H.", "Inspector"),
    ("Manjunath V.", "Sub-Inspector"),
    ("Pradeep Kumar", "ASI"),
    ("Vijayendra B.", "Inspector"),
    ("Shilpa Reddy", "Sub-Inspector"),
    ("Nagaraj Bhat", "DSP"),
    ("Praveen Tejasvi", "Inspector"),
    ("Santhosh Shenoy", "Sub-Inspector"),
    ("Kavitha Rao", "ASI"),
    ("Sujay Urs", "Inspector"),
    ("Harish Poojary", "Sub-Inspector"),
    ("Nandini Gowda", "DSP"),
    ("Shivanand Swamy", "Inspector"),
    ("Girish Chandra", "Sub-Inspector"),
    ("Bharath Kumar", "ASI"),
    ("Chetan Bhagwat", "Inspector"),
    ("Divya Murthy", "Sub-Inspector"),
    ("Eeshwarppa K.", "Inspector"),
    ("Farooq Ahmed", "Sub-Inspector"),
    ("Gururaj Katti", "ASI"),
    ("Hanumanthappa R.", "Inspector"),
    ("Jagadish Shettar", "Sub-Inspector"),
    ("Karthik Raja", "Inspector")
]

CITIZEN_NAMES = [
    "Aarav Sharma", "Ananya Hegde", "Bhavya Reddy", "Chetan Kumar",
    "Divya Sri", "Eshwar Gowda", "Farhan Khan", "Gautam Rao",
    "Harini V.", "Irfan Pasha", "Jyothi Nair", "Kartik Kulkarni",
    "Lata Magesh", "Mohan Das", "Naveen Prasad", "Omkar Joshi",
    "Pooja Bhat", "Rahul Dravid", "Sneha Kulkarni", "Tarun Kumar"
]

EVIDENCE_TYPES = [
    ("CCTV Footages", "video/mp4", "CCTV_RECORDING"),
    ("CDR Transcripts", "application/pdf", "CDR_ANALYSIS"),
    ("Forensic Lab Report", "application/pdf", "FORENSIC_REPORT"),
    ("Financial Bank Statement", "application/vnd.ms-excel", "FINANCIAL_AUDIT"),
    ("Fingerprint Latent Lift", "image/png", "FINGERPRINT_SCAN"),
    ("Seized Digital Device Dump", "application/zip", "DIGITAL_EVIDENCE"),
    ("Witness Signed Statement", "application/pdf", "WITNESS_DEPOSITION"),
    ("Ballistics Inspection Sheet", "application/pdf", "BALLISTICS_REPORT"),
    ("GPS Tracker Telemetry Logs", "application/json", "GPS_LOGS")
]

def seed_database():
    db: Session = SessionLocal()
    try:
        print("Clearing and re-generating synthetic dataset for 100% schema compliance...")
        db.query(AuditLog).delete()
        db.query(Notification).delete()
        db.query(InvestigationNote).delete()
        db.query(Investigation).delete()
        db.query(CaseStatusHistory).delete()
        db.query(Evidence).delete()
        db.query(Crime).delete()
        db.query(User).delete()
        db.commit()

        print("Seeding core accounts...")
        common_password_hash = hash_password("password123")
        
        # Admin
        admin_user = User(
            email="admin@ksp.gov.in",
            full_name="State Command Admin",
            mobile="+919876543200",
            password_hash=common_password_hash,
            role="admin",
            is_active=True
        )
        db.add(admin_user)

        # Demo shortcut accounts
        c_user = User(
            email="c@x.com",
            full_name="Demo Citizen",
            mobile="+919876543201",
            password_hash=common_password_hash,
            role="citizen",
            is_active=True
        )
        o_user = User(
            email="o@x.com",
            full_name="Demo Police Officer",
            mobile="+919876543202",
            password_hash=common_password_hash,
            role="police_officer",
            badge_number="KSP-BLR-001",
            rank="Inspector",
            station="Electronic City PS",
            district="Bengaluru",
            is_active=True
        )
        a_user = User(
            email="a@x.com",
            full_name="Demo Admin",
            mobile="+919876543203",
            password_hash=common_password_hash,
            role="admin",
            is_active=True
        )
        db.add_all([c_user, o_user, a_user])
        db.flush()

        # 2. Seed 40 Police Officers
        print("Seeding 40 police officer accounts...")
        officer_users = [o_user]
        districts_list = list(KARNATAKA_DISTRICTS.keys())
        
        for idx, (name, rank) in enumerate(OFFICER_NAMES, start=1):
            email = f"officer.{idx}@ksp.gov.in"
            district = districts_list[idx % len(districts_list)]
            stations = KARNATAKA_DISTRICTS[district]["stations"]
            station = stations[idx % len(stations)]
            badge = f"KSP-POL-{1000 + idx}"
            mobile = f"+9198450{idx:05d}"
            
            user = User(
                email=email,
                full_name=f"{rank} {name}",
                mobile=mobile,
                badge_number=badge,
                rank=rank,
                station=station,
                district=district,
                password_hash=common_password_hash,
                role="police_officer",
                is_active=True
            )
            db.add(user)
            db.flush()
            officer_users.append(user)

        # 3. Seed 20 Citizens
        print("Seeding 20 citizen accounts...")
        citizen_users = [c_user]
        for idx, name in enumerate(CITIZEN_NAMES, start=1):
            email = f"citizen.{idx}@example.com"
            mobile = f"+9199800{idx:05d}"
            user = User(
                email=email,
                full_name=name,
                mobile=mobile,
                password_hash=common_password_hash,
                role="citizen",
                is_active=True
            )
            db.add(user)
            db.flush()
            citizen_users.append(user)

        db.commit()

        # 4. Generate 300 Synthetic Crime Reports
        print("Generating 300 synthetic crime reports...")
        statuses = ["under_investigation", "under_investigation", "resolved", "assigned", "pending", "rejected"]
        priorities = ["low", "medium", "medium", "high", "critical"]
        crime_types = list(CRIME_TYPE_MAPPING.keys())
        base_start_date = date(2025, 8, 1)

        crimes_list = []
        for i in range(1, 301):
            district = random.choice(districts_list)
            dist_info = KARNATAKA_DISTRICTS[district]
            station = random.choice(dist_info["stations"])
            lat = round(random.uniform(*dist_info["lat"]), 5)
            lng = round(random.uniform(*dist_info["lng"]), 5)
            
            crime_type = random.choice(crime_types)
            title = random.choice(CRIME_TYPE_MAPPING[crime_type])
            
            day_offset = random.randint(0, 355)
            inc_date = base_start_date + timedelta(days=day_offset)
            inc_time = time(hour=random.randint(0, 23), minute=random.choice([0, 15, 30, 45]))
            
            status = random.choice(statuses)
            priority = random.choice(priorities)
            
            fir_year = inc_date.year
            fir_num = f"KSP-{fir_year}-{100000 + i}"
            
            reporter = random.choice(citizen_users)
            officer = random.choice(officer_users) if status != "pending" else None
            assigned_dt = datetime.combine(inc_date, inc_time) + timedelta(hours=random.randint(1, 12)) if officer else None
            
            desc = (
                f"Synthetic Report: Incident of {crime_type.replace('_', ' ')} reported at {station} jurisdiction, {district}. "
                f"First Information Report {fir_num} registered following preliminary complaint. "
                f"Investigation underway by {station} patrol unit."
            )
            
            notes = (
                f"Initial evidence gathered at scene. Cell tower dump logs and localized security feeds requested. "
                f"Suspect risk assessment evaluated by IntelliCrime AI."
            ) if status in ["under_investigation", "resolved"] else None

            crime = Crime(
                crime_number=fir_num,
                title=title,
                crime_type=crime_type,
                description=desc,
                status=status,
                priority=priority,
                location=f"{station} Ward Area, {district}",
                district=district,
                state="Karnataka",
                latitude=lat,
                longitude=lng,
                incident_date=inc_date,
                incident_time=inc_time,
                citizen_id=reporter.id,
                assigned_officer_id=officer.id if officer else None,
                assigned_at=assigned_dt,
                investigation_notes=notes,
                created_at=datetime.combine(inc_date, inc_time)
            )
            db.add(crime)
            crimes_list.append(crime)
        
        db.commit()

        # Reload crimes
        crimes_list = db.query(Crime).all()
        print(f"Total crime records in database: {len(crimes_list)}")

        # 5. Generate 500 Evidence Records
        print("Generating 500 synthetic evidence records...")
        for idx in range(1, 501):
            crime = random.choice(crimes_list)
            ev_type, mime, code = random.choice(EVIDENCE_TYPES)
            file_ext = "mp4" if "video" in mime else "pdf" if "pdf" in mime else "png" if "image" in mime else "zip" if "zip" in mime else "json"
            orig_name = f"{code}_{crime.crime_number}_{idx:03d}.{file_ext}"
            stored_name = f"ev_item_{crime.id}_{idx}_{random.randint(1000, 9999)}.{file_ext}"
            path = f"./uploads/evidence/{stored_name}"
            size = random.randint(1048576, 20971520)
            
            upload_dt = datetime.combine(crime.incident_date, crime.incident_time) + timedelta(hours=random.randint(2, 72))

            evidence = Evidence(
                crime_id=crime.id,
                original_filename=orig_name,
                stored_filename=stored_name,
                content_type=mime,
                file_size=size,
                storage_path=path,
                uploaded_at=upload_dt
            )
            db.add(evidence)

        db.commit()

        # 6. Generate Investigations & Case History
        print("Generating synthetic investigations, notes, notifications...")
        active_crimes = [c for c in crimes_list if c.assigned_officer_id is not None]
        
        for crime in active_crimes[:160]:
            inv = Investigation(
                crime_id=crime.id,
                officer_id=crime.assigned_officer_id,
                notes=f"Active investigation for case {crime.crime_number}. Forensic and digital evidence correlated.",
                action_taken="Gathered CDR logs, conducted suspect interviews, filed status report.",
                recommendation="Proceed with charge-sheet filing under relevant IPC/BNS clauses.",
                status=crime.status if crime.status in ["assigned", "under_investigation", "resolved"] else "assigned",
                created_at=crime.assigned_at or datetime.now(timezone.utc)
            )
            db.add(inv)
            db.flush()
            
            note1 = InvestigationNote(
                investigation_id=inv.id,
                author_id=crime.assigned_officer_id,
                note=f"Preliminary CCTV analysis completed for {crime.location}. Suspect entry recorded at {crime.incident_time}.",
                visibility="internal"
            )
            note2 = InvestigationNote(
                investigation_id=inv.id,
                author_id=crime.assigned_officer_id,
                note=f"Correlated financial records. High probability of organized network involvement.",
                visibility="internal"
            )
            db.add_all([note1, note2])

            history = CaseStatusHistory(
                crime_id=crime.id,
                actor_id=crime.assigned_officer_id,
                event_type="status_change",
                status=crime.status,
                detail=f"Case status updated to {crime.status.upper()} by assigned investigation officer."
            )
            db.add(history)

        # 7. Generate Notifications & Audit Logs
        for i in range(1, 60):
            officer = random.choice(officer_users)
            crime = random.choice(crimes_list)
            notif = Notification(
                user_id=officer.id,
                notification_type="case_assignment",
                title=f"New Case Assignment: {crime.crime_number}",
                message=f"You have been assigned to investigate {crime.title} in {crime.district}.",
                is_read=random.choice([True, False])
            )
            db.add(notif)

            audit = AuditLog(
                actor_user_id=officer.id,
                crime_id=crime.id,
                action="VIEW_CASE_DETAILS",
                details=f"Officer accessed case file {crime.crime_number} for intelligence review."
            )
            db.add(audit)

        db.commit()
        print("Successfully generated all synthetic data structures with 100% Enum compliance!")

    except Exception as err:
        db.rollback()
        print(f"Error seeding synthetic dataset: {err}")
        raise err
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
