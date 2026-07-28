PrexInter is an AI-powered interview preparation platform that helps users practise role-specific interviews, generate personalised questions from resumes, save answers, receive AI evaluation, and track performance through an analytics dashboard.

Live Demo

Frontend: https://prex-inter.vercel.app

GitHub: https://github.com/Anup3262/PrexInter

Key Features

Secure user registration and login with JWT authentication

Role-specific AI interview generation

Resume-based interview generation from uploaded PDF files

Question-by-question answer saving

AI-powered evaluation with:

Individual question scores

Overall score

Detailed feedback

Ideal answers

Interview summary

Interview history with pending, in-progress, and completed states

Analytics dashboard with:

Total interviews

Completion rate

Average score

Best score

Score trends

Difficulty distribution

Interview type distribution

Weekly activity

Responsive SaaS-style dashboard

Protected frontend routes

Production deployment using Vercel, Render, and MongoDB Atlas

Tech Stack

Frontend

React

Vite

React Router

Tailwind CSS

Axios

Framer Motion

Lucide React

Recharts

React Hot Toast

React Dropzone

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Multer

pdf-parse

Google Gemini API

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Architecture

User
  |
  v
React + Vite Frontend
  |
  | HTTPS / REST API
  v
Node.js + Express Backend
  |
  +---- JWT Authentication
  |
  +---- MongoDB Atlas
  |
  +---- Google Gemini API
  |
  +---- PDF Resume Parsing

Project Structure

PrexInter/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    ├── .env.example
    ├── server.js
    └── package.json

Core Workflow

Standard Interview

Create Interview
      |
      v
Generate AI Questions
      |
      v
Answer Questions
      |
      v
Save Answers
      |
      v
Submit Interview
      |
      v
AI Evaluation
      |
      v
Score + Feedback + Ideal Answers

Resume-Based Interview

Upload Resume PDF
      |
      v
Extract Resume Text
      |
      v
Analyse Skills, Projects, and Experience
      |
      v
Generate Personalised Questions
      |
      v
Start Interview

Environment Variables

Backend

Create server/.env:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development

Frontend

Create client/.env:

VITE_API_URL=http://localhost:5000/api

For production, set VITE_API_URL to the deployed Render backend URL:

VITE_API_URL=https://your-render-service.onrender.com/api

Never commit .env files or production secrets.

Local Installation

1. Clone the repository

git clone https://github.com/Anup3262/PrexInter.git
cd PrexInter

2. Install backend dependencies

cd server
npm install

3. Install frontend dependencies

cd ../client
npm install

4. Configure environment variables

Create:

server/.env
client/.env

using the examples above.

5. Run the backend

cd server
npm run dev

Backend runs at:

http://localhost:5000

6. Run the frontend

Open another terminal:

cd client
npm run dev

Frontend runs at:

http://localhost:5173

API Endpoints

Authentication

Method

Endpoint

Description

POST

/api/auth/register

Register a new user

POST

/api/auth/login

Log in and receive a JWT

Interviews

Method

Endpoint

Description

POST

/api/interviews

Create an interview

GET

/api/interviews

Get the current user's interviews

GET

/api/interviews/:id

Get one interview

PUT

/api/interviews/:id

Update interview settings

DELETE

/api/interviews/:id

Delete an interview

POST

/api/interviews/:id/generate-questions

Generate AI questions

PUT

/api/interviews/:id/answer

Save an answer

POST

/api/interviews/:id/evaluate

Evaluate the interview

Resume Interview

Method

Endpoint

Description

POST

/api/resume/interview

Upload a PDF and create a personalised interview

Analytics

Method

Endpoint

Description

GET

/api/analytics

Get user performance analytics

Health

Method

Endpoint

Description

GET

/api/health

Check backend status

Security

Passwords are hashed before storage.

Protected endpoints require a valid JWT.

Users can access only their own interviews.

File uploads are restricted to PDF resumes.

Resume file size is limited.

Secrets are stored through environment variables.

CORS is configured for local and deployed frontend origins.

Screenshots

Create a screenshots/ folder and add:

screenshots/
├── dashboard.png
├── create-interview.png
├── resume-interview.png
├── interview.png
├── result.png
└── analytics.png

Then add them here:

![Dashboard](screenshots/dashboard.png)
![Resume Interview](screenshots/resume-interview.png)
![Interview Result](screenshots/result.png)
![Analytics](screenshots/analytics.png)

UI Polish Checklist

Before sharing the project with recruiters, verify:

Consistent card radius, spacing, typography, and shadows

Sidebar visible and aligned on desktop

Mobile navigation available below desktop breakpoint

Loading skeletons instead of plain Loading...

Toast notifications instead of browser alerts

Empty states with clear calls to action

Confirmation before deleting interviews

Consistent button variants across pages

Responsive charts and cards

No console errors

No broken routes

Vercel rewrite configured for React Router

All deployed API requests point to Render, not localhost

Future Improvements

Voice-based interview answers

AI-generated follow-up questions

Webcam interview mode

Downloadable PDF reports

Dark mode

Topic-level strengths and weaknesses

Interview streaks and achievements

Email summaries

Admin analytics

Automated tests

Docker support

CI/CD workflow

Author

Anup Kumar

GitHub: https://github.com/Anup3262

License

This project is intended for learning, portfolio, and demonstration purposes.
