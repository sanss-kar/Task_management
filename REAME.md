# Team Task Manager
## Overview
This is a simple full-stack web application where users can create projects, assign tasks, and track progress.
It works similar to basic task management tools like Trello or Asana.

The project is built using Django for backend APIs and React for frontend UI.
---
## Features
### Authentication

* User signup and login
* JWT-based authentication
* Role-based users (Admin / Member)

### Project Management

* Admin can create projects
* Admin can add/remove members in a project
* Each project has its own members

### Task Management

* Admin can create tasks
* Tasks can be assigned to project members
* Task fields include:

  * Title
  * Description
  * Priority
  * Due date
* Task status can be updated:

  * To Do
  * In Progress
  * Done

### Dashboard

#### Admin View

* Total tasks
* Tasks by status
* Overdue tasks
* Member activity table:

  * Member name
  * Project
  * Total tasks
  * Completed / Pending

#### Member View

* Only shows assigned tasks
* Can update task status
* Cannot see other users' data

---

## Tech Stack

**Backend**

* Django
* Django REST Framework
* SQLite (default)

**Frontend**

* React (Vite)
* Bootstrap
* Axios

---

## Project Structure

```
backend/
    core/
    projects/
    tasks/
    manage.py

frontend/
    src/
    pages/
    components/
```

---

## How to Run the Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

Backend will run on:

```
http://127.0.0.1:8000
```

---

## Important Notes

* Users must be added to a project before assigning tasks
* Only admin can manage projects and members
* Members can only work on their assigned tasks

---

## Future Improvements

* Better UI design
* Notifications for tasks
* File attachments

---