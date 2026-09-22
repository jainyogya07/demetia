"""Disk-backed household store. Survives restarts and 2G drops. No cloud required."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from threading import Lock

from dsa import MinHeap, Outbox

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "saarthi-offline.sqlite"

# due minutes from midnight — same Jorhat household day as caregiver placeholders
TASK_DUE = {
    "tea": 7 * 60 + 30,
    "am-med": 8 * 60,
    "med-am": 7 * 60 + 30,
    "water": 9 * 60,
    "brain": 11 * 60,
    "lunch": 13 * 60,
    "ca": 13 * 60 + 30,
    "story": 16 * 60,
    "walk": 16 * 60 + 30,
    "pm-med": 20 * 60 + 30,
    "med-pm": 20 * 60 + 30,
}
DEFAULT_PENDING = ["med-am", "water", "brain", "lunch", "walk", "med-pm"]
DEFAULT_DONE = []

_lock = Lock()
_conn: sqlite3.Connection | None = None


def _db() -> sqlite3.Connection:
    global _conn
    if _conn is None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        _conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        _conn.execute("PRAGMA journal_mode=WAL")
        _conn.execute(
            """
            CREATE TABLE IF NOT EXISTS kv (
              k TEXT PRIMARY KEY,
              v TEXT NOT NULL
            )
            """
        )
        _conn.execute(
            """
            CREATE TABLE IF NOT EXISTS outbox (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              phone TEXT NOT NULL,
              kind TEXT NOT NULL,
              payload TEXT NOT NULL,
              ts REAL NOT NULL
            )
            """
        )
        _conn.commit()
    return _conn


def _now_min() -> int:
    now = time.localtime()
    return now.tm_hour * 60 + now.tm_min


def _blank(phone: str) -> dict:
    return {
        "phone": phone,
        "lang": None,
        "lang_source": "",
        "state": "menu",
        "pending": list(DEFAULT_PENDING),
        "done": list(DEFAULT_DONE),
        "seen_welcome": False,
        "checkins": [],
        "sos_at": None,
    }


def _heap_for(row: dict) -> MinHeap:
    pairs = [(TASK_DUE.get(tid, 24 * 60), tid) for tid in row.get("pending") or []]
    return MinHeap.from_pairs(pairs)


def get_session(phone: str) -> dict:
    with _lock:
        cur = _db().execute("SELECT v FROM kv WHERE k = ?", (f"sess:{phone}",))
        hit = cur.fetchone()
        if not hit:
            return _blank(phone)
        try:
            return json.loads(hit[0])
        except json.JSONDecodeError:
            return _blank(phone)


def put_session(phone: str, row: dict) -> None:
    with _lock:
        _db().execute(
            "INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)",
            (f"sess:{phone}", json.dumps(row, ensure_ascii=False)),
        )
        _db().commit()


def peek_next(row: dict) -> str | None:
    """Best case: next due task in O(1) after heapify of pending (tiny n)."""
    heap = _heap_for(row)
    top = heap.peek()
    return None if not top else top[1]


def peek_next_med(row: dict) -> str | None:
    meds = {"am-med", "med-am", "ca", "pm-med", "med-pm"}
    heap = _heap_for(row)
    ordered = heap.ids_in_order()
    for tid in ordered:
        if tid in meds:
            return tid
    return None


def ack_task(row: dict, task_id: str) -> bool:
    if task_id not in row.get("pending", []):
        return False
    heap = _heap_for(row)
    heap.remove_id(task_id)
    row["pending"] = heap.ids_in_order()
    done = row.setdefault("done", [])
    if task_id not in done:
        done.append(task_id)
    enqueue_outbox(row.get("phone") or "", "ack", {"task": task_id, "at": time.time()})
    return True


def enqueue_outbox(phone: str, kind: str, payload: dict) -> None:
    with _lock:
        _db().execute(
            "INSERT INTO outbox (phone, kind, payload, ts) VALUES (?, ?, ?, ?)",
            (phone, kind, json.dumps(payload, ensure_ascii=False), time.time()),
        )
        _db().commit()


def outbox_snapshot(limit: int = 50) -> list[dict]:
    with _lock:
        rows = _db().execute(
            "SELECT id, phone, kind, payload, ts FROM outbox ORDER BY id ASC LIMIT ?",
            (limit,),
        ).fetchall()
    return [
        {
            "id": r[0],
            "phone": r[1],
            "kind": r[2],
            "payload": json.loads(r[3]),
            "ts": r[4],
        }
        for r in rows
    ]


def drain_outbox(ids: list[int]) -> int:
    if not ids:
        return 0
    with _lock:
        _db().executemany("DELETE FROM outbox WHERE id = ?", [(i,) for i in ids])
        _db().commit()
    return len(ids)


def status() -> dict:
    with _lock:
        sess = _db().execute("SELECT COUNT(*) FROM kv").fetchone()[0]
        pending_sync = _db().execute("SELECT COUNT(*) FROM outbox").fetchone()[0]
    return {
        "db": str(DB_PATH),
        "sessions": sess,
        "outbox": pending_sync,
        "online_hint": False,
    }
