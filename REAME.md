# Team Task Manager

## Overview
A full-stack task management web application where users can create projects, assign tasks, and track progress — similar to Trello or Asana.

Built with Django REST Framework for backend APIs and React (Vite) for frontend UI.

**Live Demo:** https://task-management-bice-five.vercel.app

---

## Features

### Authentication
- User signup and login
- JWT-based authentication (access + refresh tokens)
- Role-based users (Admin / Member)

### Project Management
- Admin can create and delete projects
- Admin can add/remove members in a project
- Each project has its own member list

### Task Management
- Admin can create and assign tasks to project members
- Task fields: Title, Description, Priority, Due date
- Task status can be updated: To Do / In Progress / Done

### Dashboard
#### Admin View
- Total tasks count
- Tasks by status (Todo / In Progress / Done)
- Overdue tasks
- Member activity table (member name, project, total/completed/pending tasks)

#### Member View
- Only assigned tasks visible
- Can update task status
- Cannot see other users' data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django, Django REST Framework |
| Authentication | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL (production), MySQL (local) |
| Frontend | React (Vite), Bootstrap, Axios |
| Deployment | Render (backend), Vercel (frontend) |

---

## Project Structure

Task_management/
├── Backend/
│   ├── config/
│   │   ├── core/          # User auth
│   │   ├── projects/      # Project management
│   │   ├── tasks/         # Task management
│   │   └── config/        # Django settings
│   └── requirements.txt
└── Ethara_tm_frontend/
└── frontend/
└── src/
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   └── Tasks.jsx
├── components/
│   └── Navbar.jsx
└── api/
└── axios.js

---

## Local Setup

### Backend
```bash
cd Backend
pip install -r requirements.txt
```

Create `.env` file in `Backend/config/`:
```env
DB_NAME=ethara_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DJANGO_DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

```bash
cd config
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd Ethara_tm_frontend/frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://task-management-bice-five.vercel.app |
| Backend | Render | https://task-management-mmlo.onrender.com |
| Database | Render PostgreSQL | — |

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/signup/ | Register user | No |
| POST | /api/auth/login/ | Login | No |
| GET | /api/auth/profile/ | Get profile | Yes |
| GET | /api/projects/ | List projects | Yes |
| POST | /api/projects/ | Create project | Admin |
| POST | /api/projects/{id}/add-member/ | Add member | Admin |
| GET | /api/tasks/ | List tasks | Yes |
| POST | /api/tasks/ | Create task | Admin |
| PUT | /api/tasks/{id}/ | Update task | Yes |
| GET | /api/tasks/dashboard/ | Dashboard data | Yes |

---

## Important Notes
- Users must be added to a project before assigning tasks
- Only admin can manage projects, members, and create tasks
- Members can only view and update their assigned tasks
- `.env` file should never be pushed to GitHub

---

## Future Improvements
- Better UI/UX design
- Email notifications for task assignments
- File attachments on tasks
- Task comments and activity log
- Dark mode
