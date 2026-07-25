# TaskFlow Pro — MERN Task Management Application

A full-stack Task Management web application built with MongoDB, Express.js, React.js, Node.js, and TypeScript. This repository contains both the **Back_End** REST API and the **Front_End** Single Page Application (SPA).

---

## 📢 Disclosures & Acknowledgments

### 1. AI Assistance Disclosure

- **AI Tool Used**: Antigravity AI (Google DeepMind Agentic Coding Assistant).
- **Scope of AI Assistance**:
  - Code refactoring, security & logic auditing of backend endpoints.
  - Designing TypeScript DTOs, Mongoose schema indexes, and error-handling middleware.

### 2. Libraries & Frameworks Used

- **Backend (`Back_End/`)**:
  - `express`: REST API web framework.
  - `mongoose`: MongoDB object data modeling (ODM) with schema validation & indexing.
  - `jsonwebtoken` & `bcrypt`: JWT authentication and secure password hashing.
  - `joi`: Strict request payload validation schemas.
  - `multer` & `cloudinary` / `multer-storage-cloudinary`: Multi-file attachment uploads to Cloudinary CDN.
  - `cors` & `morgan`: CORS handling and HTTP request logging.
  - `dotenv`: Environment variable management.
  - `typescript` & `tsx`: Type-safe compilation and execution.

- **Frontend (`Front_End/`)**:
  - `vite` & `react` (v18): Fast frontend development and building.
  - `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`: Modern component library & styling system.
  - `@tanstack/react-query`: Server state management, data fetching, and query invalidation.
  - `react-router-dom` (v6): SPA routing and protected route guards.
  - `axios`: HTTP client with request/response interceptors for JWT authorization headers and global 401 handling.
  - `react-hook-form` & `@hookform/resolvers/zod`: Type-safe form validation matching backend rules.
  - `@hello-pangea/dnd`: Accessible drag-and-drop Kanban board view.

---

## ✨ Implemented Features

### 🔐 Authentication & Security

- User Registration with password policy enforcement (8+ chars, uppercase, lowercase, number, special character).
- Login with JWT token issuance (`7-day` expiry).
- Protected API routes requiring `Authorization: Bearer <token>`.
- Strict user data isolation: authenticated users can only view, edit, or delete their own tasks.
- Automatic logout on `401 Unauthorized` token expiry.
- Password hashes automatically stripped from API responses.

### 📋 Task Management (CRUD)

- **Create, Read, Update, Delete** tasks.
- Task properties: `title`, `description`, `status`, `priority`, `dueDate`, `attachments`.
- **Available Statuses**: `To Do`, `In Progress`, `Done`.
- **Available Priorities**: `Low`, `Medium`, `High`.
- Overdue due-date indicators and relative formatting.

### 🔍 Search, Filter & Server-Side Pagination

- Real-time **debounced search** by task title (safely escaped against Regex Injection / ReDoS).
- Combined **filtering** by status and priority.
- **Server-side pagination** (`page`, `limit`, `totalPages`, `total`) driven by backend query calculations.

### 📎 File Attachments (Bonus Feature)

- Upload up to **3 files per request** (max 5MB each, max 10 attachments per task total).
- Supported file types: Images (`jpg`, `png`, `gif`, `webp`), PDFs, Word documents (`doc`, `docx`), and plain text.
- Uploaded directly to Cloudinary CDN storage.
- Interactive **Attachment Viewer** modal with thumbnail image previews, direct file view links, and individual attachment deletion (`DELETE /api/tasks/:id/attachments/:publicId`).

### 🎨 Responsive & Interactive UI

- Custom Dark Theme built with Material-UI (Indigo & Pink accent palette).
- **Dual View Modes**:
  - **List / Table View**: Clean MUI Data Table on desktop, card grid on mobile screens.
  - **Kanban Board View**: Interactive Drag and Drop board across `To Do`, `In Progress`, and `Done` columns.
- Skeleton loaders, empty states, error banners, and toast notifications (`Snackbar`).

---

## 🛠️ Prerequisites

Before running the application, make sure you have installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI.
- **Cloudinary Account**: Cloud name, API key, and API secret for file attachment uploads.

---

## ⚙️ Environment Variables Setup

### 1. Backend (`Back_End/.env`)

Create a `.env` file inside the `Back_End/` folder:

```env
PORT=5000
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# Cloudinary Credentials (Required for attachments)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend (`Front_End/.env`)

Create a `.env` file inside the `Front_End/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application Locally

### 1. Run the Backend API (`Back_End`)

```bash
# Navigate to Back_End directory
cd Back_End

# Install dependencies
npm install

# Build TypeScript code
npm run build

# Start development server with auto-reload
npm run dev
```

The API server will start on **`http://localhost:5000`**.

To run the automated integration tests:

```bash
npx tsx src/tests/test-api.ts
```

---

### 2. Run the Frontend Application (`Front_End`)

Open a new terminal window:

```bash
# Navigate to Front_End directory
cd Front_End

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend application will start on **`http://localhost:5173`** (or the port indicated by Vite).

---

## 🐳 Docker Deployment (Backend)

A multi-stage `Dockerfile` and `.dockerignore` are included in `Back_End/` for containerized production deployment.

### Build the Docker Image

```bash
cd Back_End
docker build -t taskmanager-backend .
```

### Run the Docker Container

```bash
docker run -d -p 5000:5000 --env-file .env --name taskmanager-api taskmanager-backend
```

---

## 📂 Project Directory Structure

```
.
├── .gitignore               # Root gitignore rules
├── README.md                # Project documentation & setup instructions
├── Back_End/                # Express + TypeScript + MongoDB REST API
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── DB/
│   │   ├── connection.ts
│   │   └── models/          # User & Task Mongoose models
│   └── src/
│       ├── app.routes.ts    # Central Express app initialization & global error handler
│       ├── middleware/      # Auth JWT, Validation (Joi), Upload (Multer/Cloudinary)
│       ├── modules/
│       │   ├── auth/        # Auth Controller, Service, Router, Validation
│       │   └── task/        # Task Controller, Service, Router, Validation
│       ├── tests/           # Integration tests
│       └── utils/           # AppError, catchAsync, apiResponse
└── Front_End/               # React 18 + TypeScript + MUI SPA
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── components/      # Navbar, Cards, Tables, Modals, AttachmentViewer, KanbanBoard
        ├── context/         # AuthContext
        ├── hooks/           # useAuth, useTasks (React Query)
        ├── lib/             # Axios instance & QueryClient config
        ├── pages/           # LoginPage, RegisterPage, TasksPage, NotFoundPage
        ├── routes/          # AppRouter & ProtectedRoute
        ├── theme/           # Material-UI custom dark theme
        └── types/           # TypeScript interfaces (IUser, ITask, etc.)
```
