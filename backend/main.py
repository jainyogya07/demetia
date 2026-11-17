from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import random
import smtplib
import time
import asyncio
import json
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

try:
    try:
        from backend.detection.engine import DetectionEngine
        from backend.detection.schema import DetectionInput
    except ModuleNotFoundError:
        from detection.engine import DetectionEngine
        from detection.schema import DetectionInput
    DETECTION_AVAILABLE = True
    detection_engine = DetectionEngine()
except Exception as _detection_err:
    DETECTION_AVAILABLE = False
    detection_engine = None
    print("[detection] Detection module initialization notice:", _detection_err)

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


@app.post("/detection/evaluate")
def evaluate_detection(payload: dict[str, Any]):
    if not DETECTION_AVAILABLE or detection_engine is None:
        raise HTTPException(status_code=503, detail="Detection pipeline not available.")
    try:
        input_obj = DetectionInput(**payload)
        report = detection_engine.evaluate(input_obj, use_onnx=True)
        return report.model_dump()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/detection/health")
def detection_health():
    return {
        "ok": True,
        "detection_available": DETECTION_AVAILABLE,
        "onnx_model_ready": bool(
            detection_engine and detection_engine.onnx_runner.model_path.exists()
        ),
    }


class CompanionChatRequest(BaseModel):
    patient_id: str = "aita"
    message: str
    language: str = "hi"


async def stream_companion_tokens(message: str, patient_id: str, language: str):
    # Simulated RAG Context for dementia reassurance
    greetings = {
        "hi": "नमस्ते आइता जी! मैं आपका स्मृति सारथी हूँ। आप पूरी तरह सुरक्षित हैं और अपने घर पर हैं। ",
        "en": "Hello Aita ji! I am your Smriti Saarthi. You are safe and at home. "
    }
    prefix = greetings.get(language, greetings["hi"])
    reassurance = (
        "आज मौसम बहुत सुहावना है। अनन्य और प्रिया ने आपके लिए सुबह की चाय और दवाइयाँ तैयार रखी थीं। "
        "क्या आप कोई पुराना गीत सुनना चाहेंगे या हम मिलकर पुरानी तस्वीरें देखें?"
    )
    tokens = (prefix + reassurance).split(" ")
    for tok in tokens:
        chunk = json.dumps({"token": tok + " ", "done": False})
        yield f"data: {chunk}\n\n"
        await asyncio.sleep(0.04)

    yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"


@app.post("/api/v1/ai/companion/chat/stream")
async def chat_companion_stream(req: CompanionChatRequest):
    return StreamingResponse(
        stream_companion_tokens(req.message, req.patient_id, req.language),
        media_type="text/event-stream",
    )


class ClinicalScoreRequest(BaseModel):
    patient_id: str = "aita"
    orientation_score: int
    registration_score: int
    attention_score: int
    recall_score: int
    language_score: int


@app.post("/api/v1/clinical/assessment/score")
def calculate_clinical_score(req: ClinicalScoreRequest):
    mmse_total = (
        req.orientation_score
        + req.registration_score
        + req.attention_score
        + req.recall_score
        + req.language_score
    )

    stage = "NORMAL"
    if mmse_total < 10:
        stage = "SEVERE_COGNITIVE_IMPAIRMENT"
    elif mmse_total < 20:
        stage = "MODERATE_DEMENTIA"
    elif mmse_total < 25:
        stage = "MILD_COGNITIVE_IMPAIRMENT"

    return {
        "patient_id": req.patient_id,
        "mmse_total": mmse_total,
        "max_score": 30,
        "clinical_stage": stage,
        "recommendation": "Maintain daily familiar routines and spatial orientation checks.",
        "evaluated_at": time.time(),
    }

