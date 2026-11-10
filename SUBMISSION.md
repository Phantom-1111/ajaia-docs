# Ajaia Docs – Project Submission

## 1. Project Information

**Project Name:** Ajaia Docs – Collaborative Document Editor

**Developer:** Deepak Koukuntla

**Description:**

Ajaia Docs is a lightweight, web-based document editor that allows users to create, edit, organize, import, and share documents with permission-based access.

The application provides rich-text editing, automatic saving, document management, and sharing functionality through a React frontend and FastAPI backend.

## 2. Live Application

**Frontend Application:**

https://ajaia-docs-one-delta.vercel.app/

**Backend API:**

https://ajaia-docs-backend-21he.onrender.com/

**API Documentation:**

https://ajaia-docs-backend-21he.onrender.com/docs

## 3. Source Code Repository

**GitHub Repository:**

https://github.com/Phantom-1111/ajaia-docs

The repository contains the frontend, backend, automated tests, and project documentation.

## 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Rich Text Editor | Tiptap |
| API Communication | Axios |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL (Neon) |
| Local Database | SQLite |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## 5. Implemented Features

- Document creation and management.
- Rich-text editing and formatting.
- Automatic document saving.
- Document renaming and deletion.
- TXT and Markdown file importing.
- Document sharing with other demo users.
- Viewer and Editor permission management.
- Access revocation.
- Demo account switching.
- Backend API with access-control checks.

## 6. Architecture and Documentation

The repository includes the following documentation:

| File | Description |
|---|---|
| README.md | Project overview, features, setup, and API endpoints |
| architecture.md | System architecture, database design, and request flow |
| AI_WORKFLOW.md | AI-assisted development workflow |
| SUBMISSION.md | Project submission information |

## 7. Testing and Verification

Backend automated tests were executed using:

```bash
python -m pytest -v
```

**Verified result:** 1 test passed.

Manual functional testing was also performed.

The following features were verified:

- Document creation and editing.
- Content persistence after browser refresh.
- Rich-text formatting.
- Document renaming and deletion.
- TXT file importing.
- Editor and Viewer permissions.
- Revoking document access.
- Frontend and backend communication in production.

The deployed application was tested successfully.

## 8. Deployment Details

| Service | Platform | Status |
|---|---|---|
| Frontend | Vercel | Deployed |
| Backend | Render | Deployed |
| Database | Neon PostgreSQL | Connected |
| Source Code | GitHub | Published |

## 9. Walkthrough Video

**Video URL:** [Add your walkthrough video URL here]

The walkthrough video should demonstrate:

1. Opening the deployed application.
2. Creating a new document.
3. Editing and formatting document content.
4. Verifying automatic saving.
5. Importing a TXT or Markdown file.
6. Sharing a document with another demo user.
7. Demonstrating Editor and Viewer permissions.
8. Revoking access.

## 10. Screenshots and Demo

**Screenshots / Demo GIF:** [Add screenshot or demo GIF links here]

Recommended screenshots:

- Application dashboard.
- Document editor and formatting toolbar.
- Document sharing dialog.
- Viewer permission interface.
- Deployed application.

## 11. Project Limitations

- Demo account switching is used instead of production authentication.
- Real-time collaborative editing and live multi-user synchronization are not implemented.
- WebSocket-based collaboration is not currently supported.

## 12. Final Submission Links

| Deliverable | Link |
|---|---|
| Live Application | https://ajaia-docs-one-delta.vercel.app/ |
| Backend API | https://ajaia-docs-backend-21he.onrender.com/ |
| API Documentation | https://ajaia-docs-backend-21he.onrender.com/docs |
| GitHub Repository | https://github.com/Phantom-1111/ajaia-docs |
| Walkthrough Video | To be added |
| Screenshots / Demo GIF | To be added |

---

**Submitted by:** Deepak Koukuntla

**Project:** Ajaia Docs – Collaborative Document Editor