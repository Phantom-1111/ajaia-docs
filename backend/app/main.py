
import os
import json
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, Field

from .database import Base, engine, get_db
from .models import User, Document, DocumentShare


Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    try:
        accounts = [
            ("Deepak", "deepak@ajaia.demo"),
            ("Alex", "alex@ajaia.demo"),
            ("Sarah", "sarah@ajaia.demo"),
        ]

        for name, email in accounts:
            if not db.query(User).filter_by(email=email).first():
                db.add(User(name=name, email=email))

        db.commit()
    finally:
        db.close()

    yield


app = FastAPI(
    title="Ajaia Docs API",
    version="1.0.0",
    lifespan=lifespan
)


allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DocumentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: dict = {}


class DocumentUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    content: Optional[dict] = None


class ShareCreate(BaseModel):
    email: str
    permission: str = "viewer"


def current_user(
    x_user_id: int = Header(default=1),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == x_user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid demo user")

    return user


def get_access(db, document_id, user_id):
    doc = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc.owner_id == user_id:
        return doc, "owner"

    share = db.query(DocumentShare).filter_by(
        document_id=document_id,
        user_id=user_id
    ).first()

    if not share:
        raise HTTPException(status_code=403, detail="Access denied")

    return doc, share.permission


@app.get("/")
def home():
    return {"message": "Ajaia Docs API is running"}


@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/api/documents")
def list_documents(
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    docs = db.query(Document).outerjoin(
        DocumentShare,
        Document.id == DocumentShare.document_id
    ).filter(
        or_(
            Document.owner_id == user.id,
            DocumentShare.user_id == user.id
        )
    ).all()

    result = []

    for doc in docs:
        share = db.query(DocumentShare).filter_by(
            document_id=doc.id,
            user_id=user.id
        ).first()

        permission = "owner" if doc.owner_id == user.id else share.permission

        result.append({
            "id": doc.id,
            "title": doc.title,
            "content": json.loads(doc.content),
            "owner_id": doc.owner_id,
            "permission": permission,
            "updated_at": doc.updated_at
        })

    return result


@app.post("/api/documents", status_code=201)
def create_document(
    data: DocumentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    title = data.title.strip()

    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    doc = Document(
        title=title,
        content=json.dumps(data.content),
        owner_id=user.id
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "id": doc.id,
        "title": doc.title,
        "content": data.content,
        "owner_id": doc.owner_id,
        "permission": "owner"
    }


@app.get("/api/documents/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    doc, permission = get_access(db, document_id, user.id)

    return {
        "id": doc.id,
        "title": doc.title,
        "content": json.loads(doc.content),
        "owner_id": doc.owner_id,
        "permission": permission
    }


@app.put("/api/documents/{document_id}")
def update_document(
    document_id: int,
    data: DocumentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    doc, permission = get_access(db, document_id, user.id)

    if permission == "viewer":
        raise HTTPException(status_code=403, detail="Viewers cannot edit")

    if data.title is not None:
        if not data.title.strip():
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        doc.title = data.title.strip()

    if data.content is not None:
        doc.content = json.dumps(data.content)

    db.commit()
    db.refresh(doc)

    return {"message": "Document saved", "id": doc.id}


@app.delete("/api/documents/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    doc, permission = get_access(db, document_id, user.id)

    if permission != "owner":
        raise HTTPException(status_code=403, detail="Only owners can delete")

    db.query(DocumentShare).filter_by(
        document_id=document_id
    ).delete()

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted"}


@app.post("/api/documents/{document_id}/share")
def share_document(
    document_id: int,
    data: ShareCreate,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    doc, permission = get_access(db, document_id, user.id)

    if permission != "owner":
        raise HTTPException(status_code=403, detail="Only owners can share")

    if data.permission not in ["viewer", "editor"]:
        raise HTTPException(status_code=400, detail="Invalid permission")

    target = db.query(User).filter_by(email=data.email).first()

    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    if target.id == user.id:
        raise HTTPException(status_code=400, detail="Cannot share with yourself")

    share = db.query(DocumentShare).filter_by(
        document_id=document_id,
        user_id=target.id
    ).first()

    if share:
        share.permission = data.permission
    else:
        share = DocumentShare(
            document_id=document_id,
            user_id=target.id,
            permission=data.permission
        )
        db.add(share)

    db.commit()

    return {"message": "Document shared", "permission": data.permission}


@app.get("/api/documents/{document_id}/shares")
def get_document_shares(
    document_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    doc, permission = get_access(db, document_id, user.id)

    if permission != "owner":
        raise HTTPException(
            status_code=403,
            detail="Only owners can manage sharing"
        )

    shares = db.query(DocumentShare, User).join(
        User,
        DocumentShare.user_id == User.id
    ).filter(
        DocumentShare.document_id == document_id
    ).all()

    return [
        {
            "user_id": shared_user.id,
            "name": shared_user.name,
            "email": shared_user.email,
            "permission": share.permission
        }
        for share, shared_user in shares
    ]


@app.delete("/api/documents/{document_id}/share/{target_user_id}")
def revoke_share(
    document_id: int,
    target_user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    doc, permission = get_access(db, document_id, user.id)

    if permission != "owner":
        raise HTTPException(status_code=403, detail="Only owners can revoke access")

    share = db.query(DocumentShare).filter_by(
        document_id=document_id,
        user_id=target_user_id
    ).first()

    if not share:
        raise HTTPException(status_code=404, detail="Share not found")

    db.delete(share)
    db.commit()

    return {"message": "Access revoked"}


@app.post("/api/import")
async def import_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    filename = file.filename or ""

    if not filename.lower().endswith((".txt", ".md")):
        raise HTTPException(
            status_code=400,
            detail="Only TXT and Markdown files are supported"
        )

    content = await file.read(1024 * 1024 + 1)

    if len(content) > 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 1 MB")

    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must use UTF-8 encoding")

    doc = Document(
        title=filename.rsplit(".", 1)[0][:200] or "Imported document",
        content=json.dumps({
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [{"type": "text", "text": text}]
                }
            ] if text else [{"type": "paragraph"}]
        }),
        owner_id=user.id
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "id": doc.id,
        "title": doc.title,
        "message": "File imported"
    }
