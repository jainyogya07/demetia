"""
Correlated auth for patient / caregiver / doctor dashboards.
Shares Postgres with the Node stack. Household code links the three roles.
"""

from __future__ import annotations

import json
import os
import random
import re
import secrets
import smtplib
import string
import time
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    import psycopg
    from psycopg.rows import dict_row
    from psycopg.types.json import Json
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Install backend deps: pip install -r backend/requirements.txt") from exc

app = FastAPI(title="Smriti Saarthi correlated auth")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROLES = {"user", "caregiver", "doctor"}
OTP_TTL = 300


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if key and not os.environ.get(key):
            os.environ[key] = val


ROOT = Path(__file__).resolve().parents[1]
load_env_file(ROOT / ".env")
load_env_file(ROOT / ".env.local")
load_env_file(Path(__file__).resolve().parent / ".env")

DATABASE_URL = (os.environ.get("DATABASE_URL") or "").strip()
EMAIL = (os.environ.get("SMTP_EMAIL") or os.environ.get("EMAIL") or "").strip()
APP_PASSWORD = (os.environ.get("SMTP_APP_PASSWORD") or os.environ.get("APP_PASSWORD") or "").replace(" ", "")
SMTP_HOST = (os.environ.get("SMTP_HOST") or "smtp.gmail.com").strip()
SMTP_PORT = int(os.environ.get("SMTP_PORT") or 465)
MAILPIT_HOST = (os.environ.get("MAILPIT_HOST") or "127.0.0.1").strip()
MAILPIT_SMTP = int(os.environ.get("MAILPIT_SMTP_PORT") or 1025)
DEV_MODE = os.environ.get("AUTH_DEV_MODE", "false").lower() in {"1", "true", "yes"}

# In-memory alarm feed keyed by household code (demo sync across dashboards)
ALARM_EVENTS: dict[str, list[dict[str, Any]]] = {}


def digits_phone(raw: str | None) -> str:
    d = re.sub(r"\D", "", str(raw or ""))
    return d[-10:] if len(d) >= 10 else d


def new_code() -> str:
    return str(random.randint(100000, 999999))


def new_household_code() -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(6))


def require_db():
    if not DATABASE_URL:
        raise HTTPException(status_code=503, detail="DATABASE_URL is not set. Run: npm run stack && copy .env.example to .env")


def connect():
    require_db()
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


def ensure_schema() -> None:
    require_db()
    with connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS app_users (
              id TEXT PRIMARY KEY,
              first_name TEXT NOT NULL DEFAULT '',
              last_name TEXT NOT NULL DEFAULT '',
              display_name TEXT NOT NULL DEFAULT '',
              phone TEXT NOT NULL UNIQUE,
              email TEXT,
              birth_date DATE,
              role TEXT NOT NULL DEFAULT 'user',
              verified BOOLEAN NOT NULL DEFAULT FALSE,
              household_code TEXT,
              linked_patient_id TEXT,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              last_login_at TIMESTAMPTZ
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS otp_challenges (
              phone TEXT PRIMARY KEY,
              code TEXT NOT NULL,
              purpose TEXT NOT NULL,
              pending_json JSONB,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS households (
              code TEXT PRIMARY KEY,
              patient_id TEXT NOT NULL,
              patient_phone TEXT NOT NULL,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
        for col, ddl in [
            ("household_code", "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS household_code TEXT"),
            ("linked_patient_id", "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS linked_patient_id TEXT"),
        ]:
            cur.execute(ddl)
        conn.commit()


@app.on_event("startup")
def on_startup() -> None:
    if DATABASE_URL:
        try:
            ensure_schema()
        except Exception as err:  # noqa: BLE001
            print("[auth] schema ensure failed:", err)


def send_email_otp(receiver_email: str, otp: str) -> dict[str, Any]:
    if DEV_MODE and not EMAIL and not APP_PASSWORD:
        print(f"[AUTH_DEV_MODE] OTP for {receiver_email}: {otp}")
        return {"ok": True, "previewUrl": f"http://{MAILPIT_HOST}:8025"}

    subject = "स्मृति सारथी — your sign-in code"
    body = f"Your Smriti Saarthi code is {otp}. It expires in 5 minutes.\n\nIf you did not ask for this, ignore the mail."
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["To"] = receiver_email

    try:
        if EMAIL and APP_PASSWORD:
            msg["From"] = EMAIL
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(EMAIL, APP_PASSWORD)
                server.send_message(msg)
            return {"ok": True, "previewUrl": ""}
        msg["From"] = "smriti@localhost"
        with smtplib.SMTP(MAILPIT_HOST, MAILPIT_SMTP, timeout=5) as server:
            server.send_message(msg)
        return {"ok": True, "previewUrl": f"http://{MAILPIT_HOST}:8025"}
    except Exception as exc:  # noqa: BLE001
        print("Email send failed:", exc)
        if DEV_MODE:
            print(f"[AUTH_DEV_MODE] OTP for {receiver_email}: {otp}")
            return {"ok": False, "reason": str(exc), "previewUrl": f"http://{MAILPIT_HOST}:8025"}
        raise HTTPException(status_code=502, detail=f"Could not send mail ({exc})") from exc


def public_user(row: dict[str, Any], patient: dict[str, Any] | None = None) -> dict[str, Any]:
    out = {
        "id": row["id"],
        "firstName": row.get("first_name") or "",
        "lastName": row.get("last_name") or "",
        "name": row.get("display_name") or f"{row.get('first_name', '')} {row.get('last_name', '')}".strip(),
        "phone": row.get("phone") or "",
        "email": row.get("email") or "",
        "birthDate": str(row["birth_date"])[:10] if row.get("birth_date") else "",
        "role": row.get("role") or "user",
        "verified": bool(row.get("verified")),
        "householdCode": row.get("household_code") or "",
        "linkedPatientId": row.get("linked_patient_id") or "",
    }
    if patient:
        out["linkedPatient"] = {
            "id": patient["id"],
            "name": patient.get("display_name") or f"{patient.get('first_name', '')} {patient.get('last_name', '')}".strip(),
            "phone": patient.get("phone") or "",
            "email": patient.get("email") or "",
        }
    return out


def names_match(given: str, user: dict[str, Any]) -> bool:
    a = re.sub(r"\s+", " ", (given or "").strip().lower())
    if not a:
        return False
    full = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip().lower()
    display = (user.get("display_name") or "").strip().lower()
    first = (user.get("first_name") or "").strip().lower()
    return a in {full, display, first} or full.startswith(a) or (first and a.startswith(first))


class SignupBody(BaseModel):
    firstName: str = ""
    lastName: str = ""
    birthDate: str = ""
    email: str
    phone: str
    role: str = "user"
    familyCode: str = ""


class LoginBody(BaseModel):
    name: str
    phone: str
    email: str = ""


class VerifyBody(BaseModel):
    phone: str
    otp: str


class AlarmEventBody(BaseModel):
    householdCode: str
    phone: str = ""
    alarmId: str
    title: str = ""
    action: str = "fired"
    at: str = Field(default_factory=lambda: time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))


@app.get("/health")
@app.get("/auth/health")
def health():
    return {
        "ok": True,
        "database": bool(DATABASE_URL),
        "devMode": DEV_MODE,
        "smtp": bool(EMAIL and APP_PASSWORD),
        "correlate": True,
    }


@app.post("/auth/signup")
def auth_signup(body: SignupBody):
    phone = digits_phone(body.phone)
    first = body.firstName.strip()
    last = body.lastName.strip()
    email = body.email.strip()
    role = (body.role or "user").strip().lower()
    family = (body.familyCode or "").strip().upper()

    if len(phone) != 10:
        raise HTTPException(400, "Enter a 10-digit mobile number.")
    if not first or not last:
        raise HTTPException(400, "First and last name are required.")
    if role == "user" and not body.birthDate.strip():
        raise HTTPException(400, "Choose your date of birth.")
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(400, "Enter a working email. The code is sent there, not by SMS.")
    if role not in ROLES:
        raise HTTPException(400, "Role must be user, caregiver, or doctor.")
    if role != "user" and len(family) < 4:
        raise HTTPException(400, "Enter the household code from the patient account to link dashboards.")

    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM app_users WHERE phone = %s", (phone,))
        existing = cur.fetchone()
        if existing and existing.get("verified"):
            raise HTTPException(409, "This number already has an account. Log in instead.")

        linked_patient_id = None
        household_code = None
        if role == "user":
            household_code = new_household_code()
        else:
            cur.execute("SELECT * FROM households WHERE code = %s", (family,))
            house = cur.fetchone()
            if not house:
                raise HTTPException(404, "Household code not found. Ask the patient for their code.")
            linked_patient_id = house["patient_id"]
            household_code = house["code"]

        otp = new_code()
        pending = {
            "firstName": first,
            "lastName": last,
            "birthDate": body.birthDate.strip(),
            "email": email,
            "phone": phone,
            "role": role,
            "householdCode": household_code,
            "linkedPatientId": linked_patient_id,
        }
        cur.execute(
            """
            INSERT INTO otp_challenges (phone, code, purpose, pending_json, created_at)
            VALUES (%s, %s, 'signup', %s::jsonb, NOW())
            ON CONFLICT (phone) DO UPDATE SET
              code = EXCLUDED.code, purpose = EXCLUDED.purpose,
              pending_json = EXCLUDED.pending_json, created_at = NOW()
            """,
            (phone, otp, Json(pending)),
        )
        conn.commit()

    mail = send_email_otp(email, otp)
    payload = {
        "ok": True,
        "source": "postgres",
        "emailSent": bool(mail.get("ok")),
        "phone": phone,
        "role": role,
        "previewUrl": mail.get("previewUrl") or "",
        "message": "Code mailed. Check inbox / Mailpit.",
        "householdCode": household_code if role == "user" else "",
    }
    if DEV_MODE or not mail.get("ok"):
        payload["otp"] = otp
        payload["devOtp"] = otp
        if not mail.get("ok"):
            payload["emailSent"] = False
            payload["message"] = f"Could not send mail ({mail.get('reason', 'smtp')}). Use the on-screen code."
    return payload


@app.post("/auth/login")
def auth_login(body: LoginBody):
    phone = digits_phone(body.phone)
    name = body.name.strip()
    if len(phone) != 10:
        raise HTTPException(400, "Enter a 10-digit mobile number.")
    if not name:
        raise HTTPException(400, "Enter the name on the account.")

    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM app_users WHERE phone = %s", (phone,))
        user = cur.fetchone()
        if not user:
            raise HTTPException(404, "No account for this number. Create one.")
        if not names_match(name, user):
            raise HTTPException(403, "Name does not match this number.")
        mail_to = (body.email or user.get("email") or "").strip()
        if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", mail_to):
            raise HTTPException(400, "This account needs an email. Enter the email to receive the code.")

        otp = new_code()
        pending = {
            "firstName": user.get("first_name"),
            "lastName": user.get("last_name"),
            "email": mail_to,
            "phone": phone,
            "role": user.get("role") or "user",
            "householdCode": user.get("household_code"),
            "linkedPatientId": user.get("linked_patient_id"),
            "birthDate": str(user["birth_date"])[:10] if user.get("birth_date") else "",
        }
        cur.execute(
            """
            INSERT INTO otp_challenges (phone, code, purpose, pending_json, created_at)
            VALUES (%s, %s, 'login', %s::jsonb, NOW())
            ON CONFLICT (phone) DO UPDATE SET
              code = EXCLUDED.code, purpose = EXCLUDED.purpose,
              pending_json = EXCLUDED.pending_json, created_at = NOW()
            """,
            (phone, otp, Json(pending)),
        )
        conn.commit()

    mail = send_email_otp(mail_to, otp)
    payload = {
        "ok": True,
        "source": "postgres",
        "emailSent": bool(mail.get("ok")),
        "phone": phone,
        "role": pending["role"],
        "previewUrl": mail.get("previewUrl") or "",
        "message": "Code mailed. Check inbox / Mailpit.",
    }
    if DEV_MODE or not mail.get("ok"):
        payload["otp"] = otp
        payload["devOtp"] = otp
        if not mail.get("ok"):
            payload["emailSent"] = False
            payload["message"] = f"Could not send mail ({mail.get('reason', 'smtp')}). Use the on-screen code."
    return payload


@app.post("/auth/verify")
def auth_verify(body: VerifyBody):
    phone = digits_phone(body.phone)
    otp = re.sub(r"\D", "", body.otp or "")
    if len(phone) != 10 or len(otp) != 6:
        raise HTTPException(400, "Enter the 6-digit code.")

    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT code, purpose, pending_json, created_at FROM otp_challenges WHERE phone = %s", (phone,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(400, "No code found. Request a new one.")
        age = time.time() - row["created_at"].timestamp()
        if age > OTP_TTL:
            raise HTTPException(400, "Code expired. Request a new one.")
        if row["code"] != otp:
            raise HTTPException(400, "That code does not match.")

        pending = row["pending_json"] or {}
        if isinstance(pending, str):
            pending = json.loads(pending)

        role = pending.get("role") or "user"
        household_code = pending.get("householdCode") or None
        linked_patient_id = pending.get("linkedPatientId") or None
        user_id = f"u-{phone}"
        display = f"{pending.get('firstName', '')} {pending.get('lastName', '')}".strip()

        cur.execute(
            """
            INSERT INTO app_users
              (id, first_name, last_name, display_name, phone, email, birth_date, role, verified,
               household_code, linked_patient_id, last_login_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,TRUE,%s,%s,NOW())
            ON CONFLICT (phone) DO UPDATE SET
              first_name = EXCLUDED.first_name,
              last_name = EXCLUDED.last_name,
              display_name = EXCLUDED.display_name,
              email = COALESCE(EXCLUDED.email, app_users.email),
              birth_date = COALESCE(EXCLUDED.birth_date, app_users.birth_date),
              role = EXCLUDED.role,
              verified = TRUE,
              household_code = COALESCE(EXCLUDED.household_code, app_users.household_code),
              linked_patient_id = COALESCE(EXCLUDED.linked_patient_id, app_users.linked_patient_id),
              last_login_at = NOW()
            RETURNING *
            """,
            (
                user_id,
                pending.get("firstName") or "",
                pending.get("lastName") or "",
                display,
                phone,
                pending.get("email"),
                pending.get("birthDate") or None,
                role,
                household_code,
                linked_patient_id,
            ),
        )
        user = cur.fetchone()

        if role == "user" and household_code:
            cur.execute(
                """
                INSERT INTO households (code, patient_id, patient_phone, created_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (code) DO UPDATE SET patient_id = EXCLUDED.patient_id, patient_phone = EXCLUDED.patient_phone
                """,
                (household_code, user["id"], phone),
            )

        patient = None
        if linked_patient_id:
            cur.execute("SELECT * FROM app_users WHERE id = %s", (linked_patient_id,))
            patient = cur.fetchone()

        cur.execute("DELETE FROM otp_challenges WHERE phone = %s", (phone,))
        conn.commit()

    return {"ok": True, "source": "postgres", "user": public_user(user, patient)}


@app.get("/auth/household/{code}")
def auth_household(code: str):
    code = code.strip().upper()
    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM households WHERE code = %s", (code,))
        house = cur.fetchone()
        if not house:
            raise HTTPException(404, "Household not found.")
        cur.execute("SELECT * FROM app_users WHERE id = %s", (house["patient_id"],))
        patient = cur.fetchone()
        cur.execute(
            "SELECT id, display_name, role, phone, email FROM app_users WHERE household_code = %s ORDER BY role, display_name",
            (code,),
        )
        members = cur.fetchall()
    return {
        "ok": True,
        "code": code,
        "patient": public_user(patient) if patient else None,
        "members": [
            {"id": m["id"], "name": m["display_name"], "role": m["role"], "phone": m["phone"], "email": m["email"] or ""}
            for m in members
        ],
        "alarms": ALARM_EVENTS.get(code, [])[:20],
    }


@app.post("/alarms/event")
def alarms_event(body: AlarmEventBody):
    code = body.householdCode.strip().upper()
    if not code:
        raise HTTPException(400, "householdCode required")
    bucket = ALARM_EVENTS.setdefault(code, [])
    event = body.model_dump()
    event["householdCode"] = code
    bucket.insert(0, event)
    ALARM_EVENTS[code] = bucket[:40]
    return {"ok": True}


@app.get("/alarms/{code}")
def alarms_list(code: str):
    code = code.strip().upper()
    return {"ok": True, "events": ALARM_EVENTS.get(code, [])[:20]}


# Legacy FastAPI OTP paths (kept for older scripts)
@app.post("/send-email-otp")
def legacy_send(data: dict[str, Any]):
    email = str(data.get("email") or "")
    otp = str(data.get("otp") or new_code())
    send_email_otp(email, otp)
    out = {"message": "OTP sent to email"}
    if DEV_MODE:
        out["otp"] = otp
    return out
