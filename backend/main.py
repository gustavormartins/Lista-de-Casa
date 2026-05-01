from __future__ import annotations

from contextlib import closing
from datetime import datetime
import json
from pathlib import Path
import sqlite3
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.seed_items import build_seed_items

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
FRONTEND_DIST_DIR = FRONTEND_DIR / "dist"
INDEX_FILE = FRONTEND_DIST_DIR / "index.html"
DB_PATH = BASE_DIR / "checklist.db"
STATIC_DIR = FRONTEND_DIST_DIR if FRONTEND_DIST_DIR.exists() else FRONTEND_DIR

app = FastAPI(title="Bia & Gustavo Checklist API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class PurchasePayload(BaseModel):
    item_id: int
    giver_name: str = Field(min_length=2, max_length=80)


def get_connection(db_path: Path | None = None) -> sqlite3.Connection:
    connection = sqlite3.connect(db_path or DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db(db_path: Path | None = None) -> None:
    with closing(get_connection(db_path)) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY,
                position INTEGER NOT NULL,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                store TEXT NOT NULL,
                price_cents INTEGER NOT NULL,
                product_url TEXT NOT NULL,
                image_url TEXT,
                description TEXT NOT NULL,
                alternatives_json TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS purchases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_id INTEGER NOT NULL UNIQUE,
                giver_name TEXT NOT NULL,
                purchased_at TEXT NOT NULL,
                FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE
            )
            """
        )

        total_items = connection.execute("SELECT COUNT(*) AS total FROM items").fetchone()["total"]
        if total_items == 0:
            connection.executemany(
                """
                INSERT INTO items (
                    id,
                    position,
                    name,
                    category,
                    store,
                    price_cents,
                    product_url,
                    image_url,
                    description,
                    alternatives_json
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        item["id"],
                        item["position"],
                        item["name"],
                        item["category"],
                        item["store"],
                        item["price_cents"],
                        item["product_url"],
                        item["image_url"],
                        item["description"],
                        json.dumps(item["alternatives"], ensure_ascii=True),
                    )
                    for item in build_seed_items()
                ],
            )
        connection.commit()


def serialize_item(row: sqlite3.Row) -> dict[str, Any]:
    purchased = row["giver_name"] is not None
    return {
        "id": row["id"],
        "position": row["position"],
        "name": row["name"],
        "category": row["category"],
        "store": row["store"],
        "price_cents": row["price_cents"],
        "product_url": row["product_url"],
        "image_url": row["image_url"],
        "description": row["description"],
        "alternatives": json.loads(row["alternatives_json"]),
        "purchased": purchased,
        "giver_name": row["giver_name"],
        "purchased_at": row["purchased_at"],
    }


def fetch_items(db_path: Path | None = None) -> list[dict[str, Any]]:
    with closing(get_connection(db_path)) as connection:
        rows = connection.execute(
            """
            SELECT
                i.id,
                i.position,
                i.name,
                i.category,
                i.store,
                i.price_cents,
                i.product_url,
                i.image_url,
                i.description,
                i.alternatives_json,
                p.giver_name,
                p.purchased_at
            FROM items AS i
            LEFT JOIN purchases AS p
                ON p.item_id = i.id
            ORDER BY i.position ASC
            """
        ).fetchall()
    return [serialize_item(row) for row in rows]


def fetch_progress(db_path: Path | None = None) -> dict[str, Any]:
    with closing(get_connection(db_path)) as connection:
        totals = connection.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(
                    CASE
                        WHEN p.item_id IS NOT NULL THEN 1
                        ELSE 0
                    END
                ) AS purchased
            FROM items AS i
            LEFT JOIN purchases AS p
                ON p.item_id = i.id
            """
        ).fetchone()
        by_category = connection.execute(
            """
            SELECT
                i.category AS category,
                COUNT(*) AS total,
                SUM(
                    CASE
                        WHEN p.item_id IS NOT NULL THEN 1
                        ELSE 0
                    END
                ) AS purchased
            FROM items AS i
            LEFT JOIN purchases AS p
                ON p.item_id = i.id
            GROUP BY i.category
            ORDER BY i.category ASC
            """
        ).fetchall()

    total = totals["total"] or 0
    purchased = totals["purchased"] or 0
    percentage = round((purchased / total) * 100, 1) if total else 0.0

    return {
        "total": total,
        "purchased": purchased,
        "remaining": total - purchased,
        "percentage": percentage,
        "by_category": [
            {
                "category": row["category"],
                "total": row["total"],
                "purchased": row["purchased"] or 0,
            }
            for row in by_category
        ],
    }


def fetch_purchases(db_path: Path | None = None) -> list[dict[str, Any]]:
    with closing(get_connection(db_path)) as connection:
        rows = connection.execute(
            """
            SELECT
                p.id,
                p.item_id,
                i.name AS item_name,
                i.category AS category,
                p.giver_name,
                p.purchased_at
            FROM purchases AS p
            INNER JOIN items AS i
                ON i.id = p.item_id
            ORDER BY p.purchased_at DESC
            """
        ).fetchall()

    return [
        {
            "id": row["id"],
            "item_id": row["item_id"],
            "item_name": row["item_name"],
            "category": row["category"],
            "giver_name": row["giver_name"],
            "purchased_at": row["purchased_at"],
        }
        for row in rows
    ]


def register_purchase(item_id: int, giver_name: str, db_path: Path | None = None) -> dict[str, Any]:
    cleaned_name = giver_name.strip()
    if len(cleaned_name) < 2:
        raise HTTPException(status_code=422, detail="Informe um nome valido para confirmar a compra.")

    with closing(get_connection(db_path)) as connection:
        item = connection.execute(
            """
            SELECT id, name
            FROM items
            WHERE id = ?
            """,
            (item_id,),
        ).fetchone()
        if item is None:
            raise HTTPException(status_code=404, detail="Item nao encontrado.")

        already_purchased = connection.execute(
            """
            SELECT giver_name
            FROM purchases
            WHERE item_id = ?
            """,
            (item_id,),
        ).fetchone()
        if already_purchased is not None:
            raise HTTPException(
                status_code=409,
                detail=f"Este presente ja foi confirmado por {already_purchased['giver_name']}.",
            )

        purchased_at = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
        connection.execute(
            """
            INSERT INTO purchases (item_id, giver_name, purchased_at)
            VALUES (?, ?, ?)
            """,
            (item_id, cleaned_name, purchased_at),
        )
        connection.commit()

    fresh_items = fetch_items(db_path)
    item_data = next(entry for entry in fresh_items if entry["id"] == item_id)
    return {
        "ok": True,
        "item": item_data,
        "progress": fetch_progress(db_path),
    }


init_db()


def ensure_frontend_build() -> None:
    if not INDEX_FILE.exists():
        raise HTTPException(
            status_code=503,
            detail=(
                "Frontend ainda nao foi compilado. Rode `cd frontend && npm install && npm run build` "
                "antes de abrir a raiz da aplicacao."
            ),
        )


@app.get("/")
def home() -> FileResponse:
    ensure_frontend_build()
    return FileResponse(INDEX_FILE)


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/items")
def get_items() -> list[dict[str, Any]]:
    return fetch_items()


@app.get("/api/progress")
def get_progress() -> dict[str, Any]:
    return fetch_progress()


@app.get("/api/purchases")
def get_purchases() -> list[dict[str, Any]]:
    return fetch_purchases()


@app.post("/api/purchases")
def create_purchase(payload: PurchasePayload) -> dict[str, Any]:
    return register_purchase(payload.item_id, payload.giver_name)


@app.get("/{full_path:path}")
def frontend_router(full_path: str) -> FileResponse:
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="Rota nao encontrada.")
    ensure_frontend_build()
    return FileResponse(INDEX_FILE)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
