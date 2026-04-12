# Job Tracker

A full-stack job application tracker built with React and Supabase. Track every application, update statuses, and filter by stage — all with per-user authentication and data isolation.

## Live Demo
🔗 https://job-tracker-iota-tawny.vercel.app/

## Features
- Auth — signup, login, logout with Supabase Auth
- Protected routes using React Context API
- Add, update status, and delete job applications
- Filter by status — Applied, Interview, Offer, Rejected
- Per-user data isolation with Row Level Security (RLS)

## Tech Stack
- React.js
- Vite
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- Vercel

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/imneshat7/job-tracker.git
cd job-tracker
npm install
```

Create a `.env` file in the root:

Run the dev server:

```bash
npm run dev
```

## Project Structure

src/
├── components/
│   └── AddApplicationModal.jsx
├── context/
│   └── AuthContext.jsx
├── lib/
│   └── supabase.js
├── pages/
│   ├── Dashboard.jsx
│   └── Login.jsx
├── App.jsx
└── main.jsx
