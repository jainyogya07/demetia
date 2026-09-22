"""Standalone keypad SMS + USSD + WAP page. Offline SQLite. Port 8010."""

from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, Form, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse

from geo_language import detect_language, digits_phone
from handlers import handle_message, handle_ussd
from i18n import lang_name
from store import drain_outbox, outbox_snapshot, status as store_status

ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT.parent / "public"
PUBLIC_PAGE = PUBLIC_DIR / "keypad.html"


def _load_env() -> None:
    path = ROOT / ".env"
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


_load_env()

app = FastAPI(title="Smriti keypad", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _float(value: str | None) -> float | None:
    if value is None or str(value).strip() == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _sms_xml(body: str) -> PlainTextResponse:
    try:
        from twilio.twiml.messaging_response import MessagingResponse

        twiml = MessagingResponse()
        twiml.message(body)
        return PlainTextResponse(str(twiml), media_type="application/xml")
    except Exception:
        return PlainTextResponse(body, media_type="text/plain; charset=utf-8")


def _hint(city, state, country, lat, lng, lang) -> dict:
    return {
        "city": city,
        "state": state or country,
        "lat": _float(lat),
        "lng": _float(lng),
        "explicit": lang,
    }


def _run_sms(sender: str, body: str, hint: dict):
    return handle_message(sender, body, hint)


@app.get("/")
@app.get("/keypad.html")
def home():
    if PUBLIC_PAGE.exists():
        return FileResponse(PUBLIC_PAGE, media_type="text/html")
    return PlainTextResponse(
        "Smriti keypad\nOpen /keypad.html on the web app, or POST /sms/inbound\n",
        media_type="text/plain; charset=utf-8",
    )


@app.get("/sw.js")
def service_worker():
    path = PUBLIC_DIR / "sw.js"
    if path.exists():
        return FileResponse(path, media_type="application/javascript")
    return PlainTextResponse("// missing", status_code=404)


@app.get("/offline-pack.json")
def offline_pack():
    path = PUBLIC_DIR / "offline-pack.json"
    if path.exists():
        return FileResponse(path, media_type="application/json")
    return JSONResponse({"offline": False}, status_code=404)


@app.get("/keypad-manifest.json")
def keypad_manifest():
    path = PUBLIC_DIR / "keypad-manifest.json"
    if path.exists():
        return FileResponse(path, media_type="application/manifest+json")
    return JSONResponse({"error": "missing"}, status_code=404)


@app.get("/health")
def health():
    st = store_status()
    st.update({
        "ok": True,
        "service": "keypad-sms",
        "offline_first": True,
        "twilio": bool(os.environ.get("TWILIO_ACCOUNT_SID")),
    })
    return st


@app.get("/debug/geo")
def debug_geo(
    phone: str = Query(""),
    state: str = Query(""),
    city: str = Query(""),
    lat: float | None = Query(None),
    lng: float | None = Query(None),
    lang: str = Query(""),
):
    code, source = detect_language(
        explicit=lang or None,
        state=state or None,
        city=city or None,
        lat=lat,
        lng=lng,
        phone=phone or None,
    )
    return {
        "phone": digits_phone(phone),
        "lang": code,
        "label": lang_name(code),
        "source": source,
    }


@app.get("/sms/inbound")
@app.post("/sms/inbound")
async def sms_inbound(
    request: Request,
    From: str = Query(""),
    Body: str = Query(""),
    FromCity: str = Query(""),
    FromState: str = Query(""),
    FromCountry: str = Query(""),
    FromLat: str = Query(""),
    FromLong: str = Query(""),
    Lang: str = Query(""),
):
    """Twilio POST, feature-phone GET (?From=&Body=1), and curl."""
    form = {}
    if request.method == "POST":
        try:
            form = dict(await request.form())
        except Exception:
            form = {}
    city = FromCity or form.get("FromCity") or ""
    state = FromState or form.get("FromState") or ""
    country = FromCountry or form.get("FromCountry") or ""
    lat = FromLat or form.get("FromLat") or ""
    lng = FromLong or form.get("FromLong") or ""
    sender = From or form.get("From") or form.get("from") or ""
    body = Body if Body != "" else str(form.get("Body") or form.get("text") or "")
    explicit = Lang or form.get("Lang") or ""
    if not sender:
        sender = "0000000000"
    reply = _run_sms(sender, body, _hint(city, state, country, lat, lng, explicit))
    if request.method == "GET" and "xml" not in (request.headers.get("accept") or "").lower():
        return PlainTextResponse(reply, media_type="text/plain; charset=utf-8")
    return _sms_xml(reply)


@app.post("/ussd/inbound")
async def ussd_inbound(
    phoneNumber: str = Form(""),
    text: str = Form(""),
    FromCity: str = Form(""),
    FromState: str = Form(""),
    FromLat: str = Form(""),
    FromLong: str = Form(""),
):
    reply, cont = handle_ussd(
        phoneNumber,
        text,
        _hint(FromCity, FromState, "", FromLat, FromLong, ""),
    )
    return PlainTextResponse(("CON " if cont else "END ") + reply, media_type="text/plain; charset=utf-8")


@app.post("/keypad-api/sim")
@app.post("/sim")
async def sim(
    phone: str = Form("9810112345"),
    body: str = Form(""),
    state: str = Form(""),
    city: str = Form(""),
    lat: str = Form(""),
    lng: str = Form(""),
    lang: str = Form(""),
):
    reply = handle_message(
        phone,
        body,
        {
            "state": state,
            "city": city,
            "lat": _float(lat),
            "lng": _float(lng),
            "explicit": lang,
        },
    )
    return JSONResponse({"phone": digits_phone(phone), "reply": reply, "offline": True})


@app.get("/sync/outbox")
def sync_outbox():
    rows = outbox_snapshot()
    return {"pending": len(rows), "items": rows}


@app.post("/sync/drain")
async def sync_drain(request: Request):
    """Mark outbox rows synced after a successful cloud push."""
    try:
        body = await request.json()
    except Exception:
        body = {}
    ids = body.get("ids") or []
    return {"drained": drain_outbox([int(i) for i in ids])}
