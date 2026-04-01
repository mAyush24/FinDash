# FinDash 📊

A full-stack Finance Dashboard application designed to help individuals and teams manage and track dynamic financial records seamlessly.

## ✨ Features
- **Role-Based Access Control**: Secure JWT-based authentication supporting Viewers, Analysts, and Admins.
- **Financial Records Management**: Complete CRUD operations for income and expenses with chronological filtering and pagination.
- **Analytics Dashboard**: Real-time aggregated metrics summarizing total income, total expenses, net balance, category totals, and monthly trends manually aggregated and graphed via Recharts.
- **Admin Configuration**: Dedicated admin-only space to edit user roles and toggle active/inactive account statuses instantly against the database.
- **Responsive UI**: Beautiful, premium layout structured entirely with modern Tailwind CSS utilities.

## 🛠️ Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, Recharts, Lucide Icons, React Router
- **Backend**: Node.js, Express.js, Joi Validation, jsonwebtoken, bcryptjs
- **Database**: Supabase (PostgreSQL)

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed. You will also need a Supabase project configured with `users` and `records` tables.

### 2. Environment Setup
Configure your environment variables.
In the `backend/` folder, create a `.env` file referencing `.env.example`:
```env
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-super-secret-jwt-key
```
In the root directory, configure your frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Boot
This project utilizes `concurrently` in the root script to streamline your startup.
```bash
# Install dependencies for both frontend and backend
npm install

# Start both servers concurrently (Vite + Express)
npm run dev
```

## 🔐 Default Admin Access
By default, the database is seeded with an overarching administrator account you can use to initially manage the platform:
- **Email:** `admin@finance.com`
- **Password:** `adminpassword123`