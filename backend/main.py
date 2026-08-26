from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import random
import smtplib
import time
from email.mime.text import MIMEText
from pathlib import Path

app = FastAPI(title="Samveti Saarthi email OTP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

otp_store = {}
verified_users = set()
users = []


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

EMAIL = os.environ.get("SMTP_EMAIL") or os.environ.get("EMAIL") or ""
APP_PASSWORD = os.environ.get("SMTP_APP_PASSWORD") or os.environ.get("APP_PASSWORD") or ""
DEV_MODE = os.environ.get("AUTH_DEV_MODE", "").lower() in {"1", "true", "yes"}


class EmailRequest(BaseModel):
    email: str
    otp: str | None = None


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class SignupRequest(BaseModel):
    name: str
    password: str
    age: int
    phone: str | None = None
    email: str
    role: str


def send_email_otp(receiver_email: str, otp: str) -> None:
    if DEV_MODE:
        print(f"[AUTH_DEV_MODE] OTP for {receiver_email}: {otp}")
        return
    if not EMAIL or not APP_PASSWORD:
        raise HTTPException(
            status_code=500,
            detail="SMTP_EMAIL and SMTP_APP_PASSWORD must be set in the environment",
        )
    msg = MIMEText(f"Your OTP is {otp}. It will expire in 5 minutes.")
    msg["Subject"] = "समवेती सारथी OTP"
    msg["From"] = EMAIL
    msg["To"] = receiver_email
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL, APP_PASSWORD)
            server.send_message(msg)
    except Exception as exc:
        print("Email send failed:", exc)
        raise HTTPException(status_code=500, detail="Email sending failed") from exc


@app.get("/health")
def health():
    return {
        "ok": True,
        "smtp_configured": bool(EMAIL and APP_PASSWORD),
        "dev_mode": DEV_MODE,
    }


@app.post("/send-email-otp")
def send_email_otp_api(data: EmailRequest):
    otp = data.otp or str(random.randint(100000, 999999))
    otp_store[data.email] = {"otp": otp, "time": time.time()}
    send_email_otp(data.email, otp)
    payload = {"message": "OTP sent to email"}
    if DEV_MODE:
        payload["otp"] = otp
        payload["dev_mode"] = True
    return payload


@app.post("/verify-email-otp")
def verify_email_otp(data: VerifyOTPRequest):
    record = otp_store.get(data.email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found")
    if time.time() - record["time"] > 300:
        raise HTTPException(status_code=400, detail="OTP expired")
    if record["otp"] == data.otp:
        verified_users.add(data.email)
        return {"status": "verified"}
    raise HTTPException(status_code=400, detail="Invalid OTP")


@app.post("/signup")
def signup(data: SignupRequest):
    if data.email not in verified_users:
        raise HTTPException(status_code=403, detail="Email not verified")
    users.append(data.model_dump())
    return {"message": "User created successfully", "role": data.role}
