# Ajaia Docs – Collaborative Document Editor

A lightweight, web-based document editor inspired by Google Docs. Users can create, edit, organize, import, and share documents with permission-based access.

## Live Application

- **Frontend:** https://ajaia-docs-one-delta.vercel.app/
- **Backend API:** https://ajaia-docs-backend-21he.onrender.com/
- **API Documentation:** https://ajaia-docs-backend-21he.onrender.com/docs
- **Source Code:** https://github.com/Phantom-1111/ajaia-docs

## Features

- Create, edit, rename, and delete documents.
- Rich-text editing with bold, italic, underline, headings, and lists.
- Automatic document saving.
- Import TXT and Markdown files.
- Share documents with other demo users.
- Permission-based access:
  - **Owner:** Full document control.
  - **Editor:** Can view and modify shared documents.
  - **Viewer:** Read-only access.
- Revoke document access.
- Switch between demo accounts.
- Responsive document dashboard.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Tiptap Rich Text Editor
- Axios
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- PostgreSQL (Neon)
- SQLite for local development

### Deployment
- Vercel – Frontend hosting
- Render – Backend hosting
- Neon – PostgreSQL hosting

## Project Structure

```text
ajaia-docs/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── models.py
│   ├── tests/
│   │   └── test_api.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ShareDialog.jsx
│   │   ├── pages/
│   │   │   └── Editor.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Local Setup

### Prerequisites

- Python 3
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Phantom-1111/ajaia-docs.git
cd ajaia-docs
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows PowerShell:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend runs at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Demo Accounts

The application provides three demo accounts:

| Name | Email |
|---|---|
| Deepak | deepak@ajaia.demo |
| Alex | alex@ajaia.demo |
| Sarah | sarah@ajaia.demo |

Switch between accounts using the demo account selector in the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List demo users |
| GET | `/api/documents` | List accessible documents |
| POST | `/api/documents` | Create a document |
| GET | `/api/documents/{id}` | Retrieve a document |
| PUT | `/api/documents/{id}` | Update a document |
| DELETE | `/api/documents/{id}` | Delete a document |
| POST | `/api/documents/{id}/share` | Share a document |
| GET | `/api/documents/{id}/shares` | List collaborators |
| DELETE | `/api/documents/{id}/share/{user_id}` | Revoke access |
| POST | `/api/import` | Import TXT or Markdown files |

## Testing

Run backend tests from the `backend` directory:

```bash
python -m pytest -v
```

The document-sharing and permission test has been verified successfully.

## Deployment Configuration

### Backend – Render

Configure these environment variables:

```env
DATABASE_URL=your_neon_postgresql_connection_string
ALLOWED_ORIGINS=http://localhost:5173,https://ajaia-docs-one-delta.vercel.app
```

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend – Vercel

Configure:

```env
VITE_API_URL=https://ajaia-docs-backend-21he.onrender.com/api
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

## Current Scope

The application supports document sharing and permission-based access. It does not currently implement real-time collaborative editing or live multi-user synchronization.

The demo account selector is intended for demonstration purposes and is not a production authentication system.

## Author

**Deepak Koukuntla**

GitHub: https://github.com/Phantom-1111