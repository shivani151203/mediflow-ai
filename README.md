# MediFlow AI – AI-Powered Healthcare Enquiry & Appointment Automation System

## Overview

MediFlow AI is a healthcare automation application that combines an AI-powered chatbot with an appointment management system. It helps users access general hospital information, submit appointment requests, and receive appointment status updates.

Administrators can manage appointments and notifications through a protected dashboard.

**Healthcare disclaimer:** This application provides general information only. It does not diagnose medical conditions or prescribe medicines. It is not a replacement for professional medical advice.

## Key Features

### 1. AI Healthcare Chatbot
- Answers general hospital and healthcare questions.
- Integrated with Google Gemini AI.
- Uses healthcare safety instructions.
- Avoids medical diagnosis and medication prescriptions.
- Includes input validation and rate limiting.

### 2. Appointment Management
- Submit appointment requests.
- Validate patient details and mobile numbers.
- Select medical speciality and appointment date.
- Store appointment data in MySQL.
- Track appointment status: PENDING, APPROVED, REJECTED.

### 3. Admin Dashboard
- Secure administrator login.
- View and search appointments.
- Approve or reject appointment requests.
- View appointment statistics.
- Refresh dashboard data.

### 4. Notification System
- Generate notifications after appointment approval or rejection.
- View appointment notifications.
- Mark notifications as read.

### 5. Security
- Password hashing using bcryptjs.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Protected administrator APIs.
- Server-side environment variables.
- Input validation and parameterized SQL queries.
- Rate limiting and origin validation.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Route Handlers |
| Database | MySQL |
| AI | Google Gemini API |
| Authentication | jose, bcryptjs |
| Database library | mysql2 |
| Tools | VS Code, Git, npm |

## Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   │   ├── appointments/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── logout/
│   │   │   ├── chat/
│   │   │   └── notifications/
│   │   └── page.tsx
│   ├── components/
│   │   ├── AppointmentForm.tsx
│   │   └── ChatWidget.tsx
│   └── lib/
│       ├── auth.ts
│       ├── db.ts
│       └── rate-limit.ts
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MySQL Server
- Google Gemini API key
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_NAME/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

Open MySQL and execute:

```sql
CREATE DATABASE mediflow_ai;
USE mediflow_ai;
```

Create the appointments table:

```sql
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    message TEXT,
    status ENUM('PENDING','APPROVED','REJECTED')
        DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create the notifications table:

```sql
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('APPROVED','REJECTED') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id)
        REFERENCES appointments(id)
        ON DELETE CASCADE
);
```

### 4. Configure environment variables

Create `.env.local` inside the `frontend` directory.

Add your own configuration:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=YOUR_MYSQL_USERNAME
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
MYSQL_DATABASE=mediflow_ai

ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD_HASH=YOUR_BCRYPT_PASSWORD_HASH
SESSION_SECRET=YOUR_LONG_RANDOM_SECRET
```
**Admin configuration notes:**
- `ADMIN_EMAIL`: Email address used for administrator login.
- `ADMIN_PASSWORD_HASH`: A bcrypt hash of the administrator password. Do not enter the plain-text password here.
- `SESSION_SECRET`: A long, random secret used to sign authentication sessions.

**Important:** Never upload `.env.local` or share API keys, passwords, password hashes, or session secrets.

### 5. Start the application

```bash
npm run dev
```

Open the application:

http://localhost:3000

Admin login:

http://localhost:3000/admin/login

Use the administrator credentials configured in your environment variables.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI chatbot interaction |
| POST | `/api/appointments` | Submit appointment |
| GET | `/api/appointments` | Retrieve appointments (admin) |
| PATCH | `/api/appointments` | Update appointment status (admin) |
| POST | `/api/auth/login` | Administrator login |
| POST | `/api/auth/logout` | Administrator logout |
| GET | `/api/notifications` | Retrieve notifications (admin) |
| PATCH | `/api/notifications` | Mark notification as read (admin) |

## Testing and Validation

The following tests have been performed:

- AI chatbot response testing.
- Healthcare safety response testing.
- Appointment creation and database storage.
- Invalid mobile number validation.
- Invalid speciality validation.
- Past appointment date validation.
- Appointment approval and rejection.
- Notification creation and mark-as-read.
- Unauthorized API access testing.
- Login and logout testing.
- Production build verification.
- Production dependency security audit.

**Latest verification:**
- Production build: Successful.
- TypeScript checks: Passed.
- Production dependency audit: 0 vulnerabilities.

## Production Build

Create an optimized production build:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

## Future Enhancements

- Patient login and appointment history.
- Email and SMS notifications.
- Doctor availability management.
- Cloud deployment.
- Shared rate-limiting storage for production.
- Additional automated testing.

## Project Objective

MediFlow AI was developed as a practical healthcare automation project to explore AI integration, prompt engineering, full-stack development, database management, authentication, API development, and real-world problem solving.
