# 🚔 KSP IntelliCrime AI

> AI-Powered Conversational Crime Intelligence & Decision Support Platform

---

## 📌 Overview

KSP IntelliCrime AI is an intelligent crime analytics platform developed for the Karnataka State Police Datathon 2026. The platform assists police officers, investigators, and citizens by leveraging Artificial Intelligence for crime reporting, pattern analysis, predictive insights, multilingual assistance, and decision support.

---

# 🎯 Problem Statement

Traditional crime management systems provide data storage but lack intelligent analysis and conversational assistance.

KSP IntelliCrime AI addresses this by providing:

- AI-powered crime intelligence
- Natural language crime queries
- Predictive crime analytics
- FIR assistance
- Interactive dashboards
- Officer decision support

---

# ✨ Features

## 👮 Citizen Module

- Online FIR Registration
- Complaint Tracking
- Multilingual Support
- AI Chat Assistant
- Emergency Assistance

## 🚓 Police Module

- Crime Dashboard
- Case Analytics
- Hotspot Detection
- Officer Assignment
- Investigation Support

## 🤖 AI Intelligence

- Conversational Crime Assistant
- Crime Trend Analysis
- Similar Case Retrieval
- Crime Category Classification
- AI Recommendations
- Risk Prediction

---

# 🏗 Architecture

```text
React Frontend
        │
        ▼
FastAPI Backend
        │
 ┌──────────────┐
 │ Authentication │
 │ AI Engine      │
 │ Crime Service  │
 │ Analytics      │
 └──────────────┘
        │
SQLite / PostgreSQL
```

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib (bcrypt)

### AI

- OpenAI
- Ollama (optional)
- LangChain (future)
- Sentence Transformers
- FAISS

### Database

- SQLite
- PostgreSQL (Production)

---

# 📂 Project Structure

```text
KSP-IntelliCrime-AI/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── models/
│   ├── routers/
│   └── services/
│
├── frontend/
│
├── datasets/
│
├── docs/
│
├── diagrams/
│
└── README.md
```

---

# ⚙ Installation

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create `.env`

```env
DATABASE_URL=sqlite:///./ksp_intellicrime.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Generate Secret Key

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Run

```bash
uvicorn app.main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

# 🔐 Authentication

- JWT Tokens
- Secure Password Hashing
- Role-Based Access Control
- Protected APIs

---

# 📡 Current APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Register User |
| POST | `/auth/login` | Login |
| GET | `/users/me` | Current User |
| GET | `/health` | Health Check |

---

# 🚀 Future Enhancements

- Crime Heatmaps
- Predictive Policing
- CCTV AI Integration
- Face Recognition
- Vehicle Detection
- Real-time Incident Alerts
- Kannada Voice Assistant

---

# 👨‍💻 Developed For

**Karnataka State Police Datathon 2026**

AI for Smart Policing & Crime Intelligence

---

# 📄 License

MIT License