\# 🚔 KSP IntelliCrime AI - Frontend



\## Overview



The frontend of \*\*KSP IntelliCrime AI\*\* provides a modern, responsive web interface for citizens, police officers, and administrators. It communicates with the FastAPI backend through REST APIs and offers AI-powered crime intelligence, dashboards, FIR management, and analytics.



\---



\## Tech Stack



\- React 19

\- Vite

\- JavaScript (ES6+)

\- React Router DOM

\- Axios

\- Tailwind CSS

\- Recharts

\- React Icons



\---



\## Features



\### Citizen Portal

\- Register/Login

\- File FIR

\- Track Complaint Status

\- AI Crime Assistant

\- Emergency Reporting



\### Police Portal

\- Dashboard

\- Crime Analytics

\- FIR Management

\- Investigation Support

\- Crime Hotspots



\### Admin Portal

\- User Management

\- System Monitoring

\- Reports \& Analytics

\- Audit Logs



\---



\## Project Structure



```text

frontend/

│

├── public/

│

├── src/

│   ├── assets/

│   ├── components/

│   ├── pages/

│   ├── layouts/

│   ├── services/

│   ├── context/

│   ├── hooks/

│   ├── utils/

│   ├── styles/

│   ├── App.jsx

│   └── main.jsx

│

├── package.json

├── vite.config.js

└── README.md

```



\---



\## Installation



```bash

npm install

```



Run Development Server



```bash

npm run dev

```



Build Production



```bash

npm run build

```



Preview Production Build



```bash

npm run preview

```



\---



\## Backend Connection



Create a `.env` file:



```env

VITE\_API\_URL=http://127.0.0.1:8000

```



\---



\## Main Pages



\- Home

\- Login

\- Register

\- Dashboard

\- FIR Registration

\- Complaint Tracking

\- AI Assistant

\- Analytics

\- Profile



\---



\## API Communication



The frontend communicates with the backend using Axios and JWT authentication.



\---



\## Future Enhancements



\- Dark Mode

\- Kannada Language Support

\- Voice Commands

\- AI Chatbot

\- Live Crime Map

\- Push Notifications



\---



\## Developed For



Karnataka State Police Datathon 2026

