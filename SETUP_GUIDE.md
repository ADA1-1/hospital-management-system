# Hospital Management System - Local Setup Guide

This guide will help you run the Hospital Management System (HMS) locally on your computer using VS Code.

## Prerequisites

Before you start, make sure you have the following installed on your computer:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **VS Code**
   - Download from: https://code.visualstudio.com/

4. **pnpm** (Package Manager)
   - Install globally: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

5. **MySQL Database** (Local or Remote)
   - You'll need a MySQL database connection string

## Step-by-Step Setup

### 1. Clone the Repository

```bash
# Clone the project from GitHub (if available)
git clone <your-github-repo-url>
cd hospital-management-system
```

Or if you have the project files already, open the folder in VS Code.

### 2. Install Dependencies

Open the terminal in VS Code (Ctrl + `) and run:

```bash
pnpm install
```

This will install all required dependencies from the `package.json` file.

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Connection
DATABASE_URL="mysql://username:password@localhost:3306/hospital_db"

# Authentication
JWT_SECRET="your-secret-key-here"
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"

# Owner Information
OWNER_OPEN_ID="your-owner-id"
OWNER_NAME="Your Name"

# API Keys
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"

# Analytics
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# App Configuration
VITE_APP_TITLE="ADASIT HOSPITAL"
VITE_APP_LOGO="https://your-logo-url.png"
```

**Note:** Replace the values with your actual credentials.

### 4. Set Up Database

If you don't have a MySQL database yet:

#### Option A: Using Local MySQL
```bash
# Create database
mysql -u root -p
CREATE DATABASE hospital_db;
EXIT;
```

#### Option B: Using Docker
```bash
docker run --name mysql-hospital -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=hospital_db -p 3306:3306 -d mysql:8.0
```

### 5. Run Database Migrations

```bash
# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit push
```

### 6. Start the Development Server

```bash
pnpm dev
```

This will start both the frontend (Vite) and backend (Express) servers.

**Output will show:**
- Frontend: `http://localhost:5173` (or similar)
- Backend: `http://localhost:3000`

### 7. Access the Application

1. Open your browser
2. Navigate to `http://localhost:5173` (or the URL shown in terminal)
3. Log in with your credentials

## Project Structure

```
hospital-management-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Express backend
│   ├── routers.ts         # tRPC routes
│   ├── db.ts              # Database queries
│   └── _core/             # Core server logic
├── drizzle/               # Database schema
│   └── schema.ts
├── package.json           # Dependencies
└── .env.local             # Environment variables (create this)
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm drizzle-kit generate    # Generate migrations
pnpm drizzle-kit push        # Apply migrations

# Testing
pnpm test             # Run tests with Vitest

# Linting
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## Troubleshooting

### Issue: Port Already in Use
```bash
# Kill process on port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: Database Connection Failed
- Check your `DATABASE_URL` in `.env.local`
- Verify MySQL is running
- Ensure database exists: `CREATE DATABASE hospital_db;`

### Issue: Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Port 5173 Not Available
The dev server will automatically use the next available port. Check the terminal output for the correct URL.

## VS Code Extensions (Recommended)

1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Prettier - Code formatter** - esbenp.prettier-vscode
3. **ESLint** - dbaeumer.vscode-eslint
4. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
5. **Thunder Client** or **REST Client** - for API testing

## Default Login Credentials

After setup, you can create test accounts or use:
- **Email:** admin@hospital.local
- **Password:** (Set during registration)

## Next Steps

1. Explore the codebase in `client/src` and `server/`
2. Check `todo.md` for planned features
3. Read the main `README.md` for architecture details
4. Start developing and testing features locally

## Need Help?

- Check the logs in `.manus-logs/` directory
- Review error messages in VS Code terminal
- Ensure all prerequisites are properly installed
- Verify environment variables are correctly set

## Production Deployment

When ready to deploy:

1. Build the project: `pnpm build`
2. Set production environment variables
3. Run: `pnpm start` (or deploy to your hosting platform)

---

Happy coding! 🚀
