# AI Workflow Documentation

## 1. Overview

AI-assisted development tools were used during the development of Ajaia Docs to support implementation, debugging, code review, and documentation.

The development process combined AI assistance with manual coding, testing, debugging, and verification.

AI tools were used as development aids. All application changes were reviewed and tested before being included in the project.

## 2. AI Tools Used

| Tool | Purpose |
|---|---|
| ChatGPT | Technical guidance, implementation assistance, debugging, and documentation |
| GitHub | Source code management and version control |
| Visual Studio Code | Code editing, integration, and local development |

## 3. Development Workflow

The project was developed through an iterative workflow.

### Step 1: Requirement Understanding

The application requirements were reviewed and divided into major areas:

- Document management.
- Rich-text editing.
- Automatic saving.
- Document sharing.
- Permission management.
- File importing.
- Backend API development.
- Database integration.
- Deployment.

### Step 2: Architecture and Technology Selection

The application architecture was planned using:

- React and Vite for the frontend.
- Tiptap for rich-text editing.
- FastAPI for backend API development.
- SQLAlchemy for database operations.
- PostgreSQL for production data storage.
- SQLite for local development.

AI assistance was used to understand technology choices, API structure, and communication between application layers.

### Step 3: Frontend Development

AI assistance supported the implementation and debugging of frontend features, including:

- Document dashboard.
- Editor interface.
- Rich-text formatting controls.
- Autosave behavior.
- Sharing interface.
- Demo account switching.
- API integration using Axios.

The frontend was manually run and tested in the browser to verify the behavior of these features.

### Step 4: Backend Development

AI assistance supported the development and review of FastAPI endpoints.

The backend implementation includes:

- User retrieval.
- Document creation and retrieval.
- Document updates and deletion.
- Document sharing.
- Collaborator listing.
- Access revocation.
- TXT and Markdown file importing.

The implementation was reviewed and tested using the FastAPI application and automated tests.

### Step 5: Debugging and Integration

AI assistance was used to investigate implementation issues and guide debugging.

Examples included:

- Resolving frontend and backend integration issues.
- Fixing the document-sharing dialog behavior.
- Configuring API request headers.
- Handling file-upload requests.
- Updating database connection configuration.
- Configuring CORS for production deployment.

Changes were applied incrementally and verified through application testing.

### Step 6: Testing

Testing was performed locally and after deployment.

The backend test suite was executed using:

```bash
python -m pytest -v
```

The document-sharing and permission test passed successfully.

Manual testing included:

- Creating and editing documents.
- Refreshing documents to verify saved content.
- Renaming and deleting documents.
- Importing TXT files.
- Sharing documents with Editor and Viewer permissions.
- Revoking document access.
- Verifying that viewers cannot edit documents.

The deployed application was also tested to verify frontend and backend communication.

### Step 7: Deployment Assistance

AI assistance was used to guide the deployment process.

The application was deployed using:

- Vercel for the React frontend.
- Render for the FastAPI backend.
- Neon for PostgreSQL hosting.

Environment variables were configured for database connectivity, frontend API communication, and cross-origin access.

The production application was tested after deployment.

## 4. Human Review and Validation

AI-generated suggestions were not treated as automatically correct.

The development process included:

1. Reviewing suggested implementation changes.
2. Applying changes to the project.
3. Running the application locally.
4. Checking browser behavior.
5. Running automated backend tests.
6. Verifying permissions and document operations.
7. Testing the deployed application.

This iterative process helped identify and resolve issues before final deployment.

## 5. Git and Version Control

Git and GitHub were used to maintain the project source code.

The development workflow included:

- Initializing the repository.
- Adding `.gitignore` rules.
- Committing implementation changes.
- Pushing the project to GitHub.
- Maintaining the main branch.
- Updating documentation through separate commits.

Repository:

https://github.com/Phantom-1111/ajaia-docs

## 6. AI Usage Boundaries

AI assistance was primarily used for:

- Technical explanations.
- Implementation guidance.
- Debugging suggestions.
- Code review assistance.
- Documentation preparation.
- Deployment guidance.

Application execution, manual verification, environment configuration, and final testing were performed by the developer.

## 7. Conclusion

AI-assisted development helped accelerate implementation, debugging, and documentation of Ajaia Docs.

The project followed an iterative development process in which AI suggestions were reviewed, implemented, and validated through local and production testing.

The final application was deployed successfully, and its core document management and sharing features were verified.