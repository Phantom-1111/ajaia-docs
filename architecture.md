# Ajaia Docs – System Architecture

## 1. Overview

Ajaia Docs is a web-based document editor built using React and FastAPI. It allows users to create, edit, organize, import, and share documents with permission-based access.

The application follows a client-server architecture. The frontend communicates with the backend through REST APIs, while the backend handles document operations, access control, and database interactions.

## 2. Technology Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React + Vite | User interface and document editing |
| Rich Text Editor | Tiptap | Document formatting and content editing |
| API Communication | Axios | HTTP requests to backend |
| Backend | FastAPI | API endpoints and business logic |
| ORM | SQLAlchemy | Database operations |
| Database | PostgreSQL / SQLite | Persistent document and user storage |
| Frontend Hosting | Vercel | Frontend deployment |
| Backend Hosting | Render | Backend deployment |
| Database Hosting | Neon | Production PostgreSQL database |

## 3. High-Level Architecture

```text
                USER
                  |
                  v
          REACT FRONTEND
          (Vercel Hosting)
                  |
                  | Axios HTTP Requests
                  | X-User-Id Header
                  v
          FASTAPI BACKEND
          (Render Hosting)
                  |
          +-------+-------+
          |               |
          v               v
    API ENDPOINTS    ACCESS CONTROL
          |               |
          +-------+-------+
                  |
                  v
             SQLALCHEMY
                  |
                  v
          POSTGRESQL DATABASE
             (Neon)
```

## 4. Frontend Architecture

The frontend is developed using React and Vite.

### Main Components

**App.jsx**
- Controls the main application interface.
- Loads and displays documents.
- Handles demo user switching.
- Manages dashboard and editor navigation.
- Controls sharing dialog visibility.

**Editor.jsx**
- Provides the document editing interface.
- Integrates the Tiptap rich-text editor.
- Supports formatting operations.
- Handles document title and content updates.
- Implements debounced autosaving.
- Applies viewer and editor permissions.

**ShareDialog.jsx**
- Displays available demo users.
- Allows document owners to share documents.
- Supports Viewer and Editor permissions.
- Displays existing collaborators.
- Allows owners to revoke access.

**api.js**
- Configures Axios.
- Adds the current demo user ID to API requests.
- Provides functions for document operations, sharing, user retrieval, and file imports.
- Uses the VITE_API_URL environment variable for backend configuration.

## 5. Backend Architecture

The backend uses FastAPI and follows a modular structure.

### database.py

- Creates the SQLAlchemy database engine.
- Configures database sessions.
- Defines the declarative base.
- Provides database sessions through `get_db()`.
- Supports SQLite locally and PostgreSQL in production through `DATABASE_URL`.

### models.py

Defines the database models:

- User
- Document
- DocumentShare

### main.py

Contains the FastAPI application and API routes.

Responsibilities include:

- Initializing the application.
- Creating database tables.
- Seeding demo users.
- Handling document CRUD operations.
- Enforcing access permissions.
- Managing document sharing.
- Importing TXT and Markdown files.
- Configuring CORS.

## 6. Database Design

The application uses three primary entities.

### User

Stores demo user information.

| Field | Description |
|---|---|
| id | Unique user identifier |
| name | User's name |
| email | User's email address |

### Document

Stores document information.

| Field | Description |
|---|---|
| id | Unique document identifier |
| title | Document title |
| content | Serialized Tiptap JSON content |
| owner_id | ID of the document owner |
| updated_at | Last update timestamp |

### DocumentShare

Stores document sharing relationships.

| Field | Description |
|---|---|
| id | Unique share identifier |
| document_id | Shared document identifier |
| user_id | Recipient user identifier |
| permission | Viewer or Editor |

### Relationships

- A user can own multiple documents.
- A document belongs to one owner.
- A document can be shared with multiple users.
- DocumentShare connects users and documents.
- Each sharing relationship stores a permission level.

## 7. Document Request Flow

1. The user creates or opens a document in the React interface.
2. The frontend calls the corresponding API using Axios.
3. The request includes the `X-User-Id` header.
4. FastAPI identifies the current demo user.
5. SQLAlchemy retrieves or updates the relevant database record.
6. Access permissions are checked before protected operations.
7. The backend returns a JSON response.
8. React updates the interface based on the response.

## 8. Permission Management

The application supports three permission levels.

| Permission | View | Edit | Share | Delete |
|---|---|---|---|---|
| Owner | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | No | No |
| Viewer | Yes | No | No | No |

Permissions are enforced by backend API checks, not only by frontend controls.

## 9. Autosave Workflow

1. The user modifies document content.
2. The editor detects the change.
3. A debounce delay prevents unnecessary repeated requests.
4. The frontend sends an update request to the backend.
5. FastAPI validates access and updates the database.
6. The saved document remains available after refresh.

## 10. Deployment Architecture

### Frontend

- Platform: Vercel
- Framework: React + Vite
- Production URL: https://ajaia-docs-one-delta.vercel.app/

### Backend

- Platform: Render
- Framework: FastAPI
- Production URL: https://ajaia-docs-backend-21he.onrender.com/

### Database

- Platform: Neon
- Database: PostgreSQL
- Region: Singapore

Environment variables are used to configure the production database connection, allowed frontend origins, and frontend API URL.

## 11. Current Limitations

- Demo user switching is used instead of production authentication.
- Real-time multi-user synchronization is not implemented.
- The application does not currently include WebSocket-based collaboration.

## 12. Conclusion

The architecture separates the frontend, backend, and database responsibilities. This makes the application easier to maintain, test, and deploy. The REST API provides a clear communication layer, while backend permission checks protect document operations.