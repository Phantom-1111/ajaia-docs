
from fastapi.testclient import TestClient
from app.main import app


def test_document_sharing_and_permissions():
    with TestClient(app) as client:
        owner = {"x-user-id": "1"}
        editor = {"x-user-id": "2"}
        viewer = {"x-user-id": "3"}

        response = client.post(
            "/api/documents",
            headers=owner,
            json={"title": "Test document", "content": {"type": "doc"}}
        )
        assert response.status_code == 201
        doc_id = response.json()["id"]

        response = client.post(
            f"/api/documents/{doc_id}/share",
            headers=owner,
            json={"email": "alex@ajaia.demo", "permission": "editor"}
        )
        assert response.status_code == 200

        response = client.put(
            f"/api/documents/{doc_id}",
            headers=editor,
            json={"title": "Updated by editor"}
        )
        assert response.status_code == 200

        response = client.post(
            f"/api/documents/{doc_id}/share",
            headers=owner,
            json={"email": "sarah@ajaia.demo", "permission": "viewer"}
        )
        assert response.status_code == 200

        response = client.put(
            f"/api/documents/{doc_id}",
            headers=viewer,
            json={"title": "Unauthorized edit"}
        )
        assert response.status_code == 403
