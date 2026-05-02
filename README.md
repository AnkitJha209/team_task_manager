# TaskFlow - Project Management Application

A full-stack task management application built with React, Express, and PostgreSQL. TaskFlow allows users to create projects, manage team members, assign tasks, and track progress with role-based access control (Admin and Member roles).

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Demo Credentials](#demo-credentials)
- [Key Pages & Components](#key-pages--components)

---

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma v6
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **CORS**: cors middleware

### Frontend

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite v7
- **Routing**: react-router-dom v7
- **HTTP Client**: axios
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui primitives
- **Icons**: Phosphor Icons

---

## 📁 Project Structure

```
EtharaAI_Assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/           # Business logic for each resource
│   │   │   ├── auth.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── member.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── routes/                # Route definitions
│   │   │   ├── index.ts           # Main router aggregation
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── member.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── middlewares/           # Authentication middleware
│   │   │   └── auth.middleware.ts (verifyToken, isAdmin, isMember)
│   │   ├── utils/
│   │   │   └── prismaClient.ts    # Prisma client instance
│   │   └── index.ts               # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   │   ├── SignInPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectMembersPage.tsx
│   │   │   ├── ProjectTasksPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── api/                   # API client modules
│   │   │   ├── endpoints.ts       # Centralized endpoint URLs
│   │   │   ├── authApi.ts
│   │   │   ├── projectApi.ts
│   │   │   ├── memberApi.ts
│   │   │   ├── taskApi.ts
│   │   │   ├── dashboardApi.ts
│   │   │   └── userApi.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── AppNavbar.tsx
│   │   │   ├── routing/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── ui/                # Reusable UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   └── badge.tsx
│   │   ├── utils/
│   │   │   └── auth.ts            # Auth helpers (token, role, decode)
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript type definitions
│   │   ├── App.tsx                # Main layout (Outlet + Navbar)
│   │   ├── main.tsx               # Router setup & app entry
│   │   └── index.css              # Global Tailwind styles
│   └── package.json
│
└── README.md (this file)
```

---

## ✨ Features

### Authentication

- User registration with email and password
- JWT-based authentication with token stored in `localStorage`
- Role-based access control (ADMIN and MEMBER)
- Token verification on protected routes

### Admin Features

- Create, read, update, delete projects
- Add and remove project members
- Create tasks and assign them to members
- View project status dashboard (all projects, completed/in-progress tasks)
- View user list

### Member Features

- View projects they are added to
- View project members
- Update task status (TODO → IN_PROGRESS → COMPLETED / CANCELLED)
- View dashboard with assigned tasks and overdue tasks
- Navigate to projects from task links

### General Features

- Responsive UI with white-tone gradient theme
- Real-time error handling with toast-like messages
- Protected routes with automatic redirection
- Quick demo login buttons for testing both roles

---

## 📊 Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(MEMBER)  # ADMIN or MEMBER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ownedProjects  Project[]
  projectMembers ProjectMember[]
  assignedTasks  Task[]      @relation("AssignedTasks")
  createdTasks   Task[]      @relation("CreatedTasks")
}
```

### Project Model

```prisma
model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner   User            @relation(fields: [ownerId], references: [id])
  members ProjectMember[]
  tasks   Task[]
}
```

### ProjectMember Model

```prisma
model ProjectMember {
  id        String   @id @default(uuid())
  userId    String
  projectId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  project Project @relation(fields: [projectId], references: [id])
}
```

### Task Model

```prisma
model Task {
  id           String       @id @default(uuid())
  title        String
  description  String?
  projectId    String
  createdById  String
  assignedToId String?
  status       TaskStatus   @default(TODO)      # TODO, IN_PROGRESS, COMPLETED, CANCELLED
  priority     TaskPriority @default(MEDIUM)    # LOW, MEDIUM, HIGH, CRITICAL
  dueDate      DateTime?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  project    Project @relation(fields: [projectId], references: [id])
  createdBy  User    @relation("CreatedTasks", fields: [createdById], references: [id])
  assignedTo User?   @relation("AssignedTasks", fields: [assignedToId], references: [id])
}
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint       | Description               | Auth Required |
| ------ | -------------- | ------------------------- | ------------- |
| POST   | `/auth/signUp` | Register a new user       | No            |
| POST   | `/auth/signIn` | Login with email/password | No            |

### Projects

| Method | Endpoint               | Description                                | Auth Required | Role  |
| ------ | ---------------------- | ------------------------------------------ | ------------- | ----- |
| GET    | `/projects`            | Get all projects (user is owner or member) | Yes           | Any   |
| POST   | `/projects`            | Create new project                         | Yes           | ADMIN |
| GET    | `/projects/:projectId` | Get project details                        | Yes           | ADMIN |
| PATCH  | `/projects/:projectId` | Update project                             | Yes           | ADMIN |
| DELETE | `/projects/:projectId` | Delete project                             | Yes           | ADMIN |

### Members

| Method | Endpoint                                 | Description                | Auth Required | Role         |
| ------ | ---------------------------------------- | -------------------------- | ------------- | ------------ |
| GET    | `/projects/:projectId/members`           | Get project members        | Yes           | ADMIN/MEMBER |
| POST   | `/projects/:projectId/members`           | Add member to project      | Yes           | ADMIN        |
| DELETE | `/projects/:projectId/members/:memberId` | Remove member from project | Yes           | ADMIN        |

### Tasks

| Method | Endpoint                                    | Description           | Auth Required | Role   |
| ------ | ------------------------------------------- | --------------------- | ------------- | ------ |
| GET    | `/projects/:projectId/tasks`                | Get all project tasks | Yes           | Any    |
| POST   | `/projects/:projectId/tasks`                | Create new task       | Yes           | ADMIN  |
| PATCH  | `/projects/:projectId/tasks/:taskId/status` | Update task status    | Yes           | MEMBER |

### Dashboard

| Method | Endpoint             | Description               | Auth Required |
| ------ | -------------------- | ------------------------- | ------------- |
| GET    | `/dashboard/tasks`   | Get user's assigned tasks | Yes           |
| GET    | `/dashboard/stats`   | Get dashboard statistics  | Yes           |
| GET    | `/dashboard/overdue` | Get overdue tasks         | Yes           |

### Users

| Method | Endpoint | Description   | Auth Required | Role  |
| ------ | -------- | ------------- | ------------- | ----- |
| GET    | `/users` | Get all users | Yes           | ADMIN |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup

1. **Navigate to backend directory**

    ```bash
    cd backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
    JWT_SECRET="your_jwt_secret_key"
    PORT=5000
    ```

4. **Run database migrations**

    ```bash
    npx prisma migrate dev
    ```

5. **Build TypeScript**

    ```bash
    npm run build
    ```

6. **Start development server**
    ```bash
    npm run dev
    ```
    Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

    ```bash
    cd frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables (optional)**
   Create a `.env.local` file in the frontend directory:

    ```env
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    ```

4. **Start development server**

    ```bash
    npm run dev
    ```

    Frontend runs on `http://localhost:5173`

5. **Build for production**
    ```bash
    npm run build
    ```

---

## 🔐 Authentication

### JWT Token Structure

- **Header**: Standard JWT header with `alg` and `typ`
- **Payload**: Contains `id` (user ID) and `role` (ADMIN or MEMBER)
- **Secret**: Configured via `JWT_SECRET` environment variable

### Token Storage

- JWT token is stored in `localStorage` under key `token`
- Token is sent in request headers as: `Authorization: Bearer <token>`

### Token Verification

- Frontend decodes token payload using `atob()` to extract user role
- Backend verifies token signature using JWT middleware
- Expired or invalid tokens trigger re-authentication

---

## 👤 Demo Credentials

### Admin Account

- **Email**: `adminTest@mail.com`
- **Password**: `Admin123`
- **Capabilities**: Create projects, manage members, create tasks, view all projects

### Member Account

- **Email**: `khushi@gmail.com`
- **Password**: `Ankit123`
- **Capabilities**: View assigned projects and tasks, update task status

**Quick Login**: Use the "Login as Admin" and "Login as Member" buttons on the SignIn page to auto-fill credentials.

---

## 🎨 Key Pages & Components

### Pages

#### SignInPage

- Login form with email/password fields
- Quick login buttons for demo credentials (Admin & Member)
- Link to signup page
- Error handling with inline messages

#### SignUpPage

- Registration form with email, password, name, and role selection
- Validates input before submission
- Auto-redirects to SignIn after successful registration
- Theme matches SignInPage

#### DashboardPage

- **For Admins**: Overview of all projects, task statistics, and per-project status
- **For Members**: Personal task assignments, overdue tasks, and quick links to project details
- "View project" links allow members to navigate to project tasks

#### ProjectsPage

- Lists all projects (admin only)
- Create new project form
- Edit and delete project controls
- Links to manage members and tasks for each project

#### ProjectMembersPage

- Shows all members in a project
- **For Admins**: Add/remove members with user selection and management buttons
- **For Members**: Read-only view of project members
- Only admin-only operations (add/remove) are hidden for members

#### ProjectTasksPage

- Lists all tasks in a project
- **For Admins**: Create new task form with assignment and priority controls
- **For Members**: Update task status via dropdown select
- Shows task details (title, description, assignee, due date, priority)

#### NotFoundPage

- Displays 404 error for invalid routes
- Link to return to dashboard

### Components

#### AppNavbar

- Sticky header with project logo and navigation
- Shows "Dashboard" link for all logged-in users
- Shows "Projects" link for all logged-in users (allows members to access)
- Logout button that clears token and redirects to signin

#### ProtectedRoute

- Guards routes requiring authentication
- Redirects to signin if not logged in
- Optional `requiredRole` prop to enforce role-specific access
- Decodes JWT payload to verify role

#### UI Components (shadcn-style)

- **Button**: Primary, outline, and destructive variants
- **Card**: Container with header, title, description, and content sections
- **Input**: Text input with label and placeholder support
- **Label**: Form labels with accessibility attributes
- **Textarea**: Multi-line text input for descriptions
- **Badge**: Status badges with success, warning, danger, and default variants

---

## 🔄 Workflow Examples

### Creating a Project (Admin)

1. Admin logs in with admin credentials
2. Navigates to "Projects" page
3. Fills in project name and description
4. Clicks "Create Project"
5. Project appears in the projects list

### Adding a Member to Project (Admin)

1. Admin navigates to project
2. Clicks "Members" tab
3. Selects a user from the available users list
4. Clicks "Add Member" button
5. Member is added and appears in the members list

### Assigning a Task (Admin)

1. Admin navigates to project tasks
2. Fills in task title, description, and assigns to a member
3. Sets priority and due date
4. Clicks "Create Task"
5. Task appears in the task list

### Updating Task Status (Member)

1. Member logs in with member credentials
2. Navigates to "Dashboard" to see assigned tasks
3. Clicks "View project" link on an assigned task
4. Uses the status dropdown to change task status
5. Status updates immediately

---

## 📝 Notes

- All passwords are hashed using bcrypt before storage
- Projects can only be managed by their owner (ADMIN)
- Members can only view projects they are explicitly added to
- Task assignment is project-specific (admin assigns to project members)
- Dashboard statistics filter by user ID for accuracy
- CORS is enabled for cross-origin requests from frontend

---

## 🐛 Troubleshooting

### Backend won't start

- Check `.env` file has correct `DATABASE_URL` and `JWT_SECRET`
- Ensure PostgreSQL is running
- Run `npx prisma migrate dev` to set up database

### Frontend can't connect to backend

- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` environment variable
- Ensure CORS is enabled in backend

### Login fails

- Verify credentials match those in database
- Check JWT_SECRET is consistent between sessions
- Clear localStorage and try again

---

## 📄 License

ISC

---

**Last Updated**: May 2, 2026
