"""Parse keypad SMS / USSD text and return a plain reply."""

from __future__ import annotations

import re
import time

from geo_language import detect_language, digits_phone, normalize_lang
from i18n import (
    LANG_MENU_CODES,
    alert_lines,
    contacts,
    helplines,
    lang_name,
    t,
    task_name,
)
from store import ack_task, enqueue_outbox, get_session, peek_next, peek_next_med, put_session

_LANG_CMD = re.compile(r"^\s*(?:lang(?:uage)?|bhasha|ভাষা)\s*[=:]?\s*([a-zA-Z]{2,12})\s*$", re.I)
_GPS_CMD = re.compile(
    r"^\s*(?:gps|geo|loc)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*$",
    re.I,
)
_DONE_CMD = re.compile(r"^\s*(?:done|ok|ack|हो गया|হৈ)\s*(\d+)\s*$", re.I)


def _join(*parts: str) -> str:
    return "\n".join(p for p in parts if p)


def _ensure_lang(row: dict, hint: dict) -> None:
    if row.get("lang"):
        return
    lang, src = detect_language(
        explicit=hint.get("explicit"),
        state=hint.get("state"),
        city=hint.get("city"),
        lat=hint.get("lat"),
        lng=hint.get("lng"),
        phone=hint.get("phone"),
    )
    row["lang"] = lang
    row["lang_source"] = src


def _menu(lang: str, geo_note: str = "") -> str:
    parts = [t(lang, "app"), t(lang, "welcome")]
    if geo_note:
        parts.append(t(lang, "geo", label=geo_note))
    parts.append(t(lang, "menu"))
    return _join(*parts)


def _reminders(lang: str, row: dict) -> str:
    pending = row["pending"]
    nxt = peek_next(row)
    if not pending:
        return _join(t(lang, "remind_head"), t(lang, "none_left"), t(lang, "menu"))
    lines = [t(lang, "remind_head")]
    if nxt:
        lines.append(f"* {task_name(lang, nxt)}")
    for i, tid in enumerate(pending, 1):
        lines.append(f"{i}. {task_name(lang, tid)}")
    lines.append(t(lang, "ack_ask", n=len(pending)))
    return "\n".join(lines)


def _alerts(lang: str) -> str:
    lines = [t(lang, "alerts_head"), t(lang, "safe")]
    lines.extend(alert_lines(lang))
    return "\n".join(lines)


def _calls(lang: str) -> str:
    lines = [t(lang, "call_head")]
    for i, (_cid, name, phone) in enumerate(contacts(lang), 1):
        lines.append(t(lang, "call_line", n=i, name=name, phone=phone))
    lines.append("H helplines")
    return "\n".join(lines)


def _helplines() -> str:
    lines = ["Helplines"]
    for i, (_cid, name, phone) in enumerate(helplines(), 1):
        lines.append(f"{i}. {name} {phone}")
    return "\n".join(lines)


def _ack_by_index(lang: str, row: dict, index: int) -> str:
    pending = row["pending"]
    if index < 1 or index > len(pending):
        return t(lang, "ack_bad")
    tid = pending[index - 1]
    ack_task(row, tid)
    row["state"] = "menu"
    return _join(t(lang, "ack_ok", item=task_name(lang, tid)), _reminders(lang, row))


def handle_message(phone: str, body: str, hint: dict | None = None) -> str:
    hint = hint or {}
    hint["phone"] = digits_phone(phone) or phone
    key = hint["phone"] or phone or "unknown"
    row = get_session(key)
    row["phone"] = key
    _ensure_lang(row, hint)
    lang = row["lang"] or "en"
    text = (body or "").strip()
    folded = text.lower()

    match = _LANG_CMD.match(text)
    if match:
        chosen = normalize_lang(match.group(1))
        if chosen:
            row["lang"] = chosen
            row["lang_source"] = "explicit"
            row["state"] = "menu"
            put_session(key, row)
            return _join(t(chosen, "lang_set", label=lang_name(chosen)), _menu(chosen))
        return t(lang, "unknown")

    gps = _GPS_CMD.match(text)
    if gps:
        row["lang"], row["lang_source"] = detect_language(
            lat=float(gps.group(1)),
            lng=float(gps.group(2)),
            phone=hint["phone"],
        )
        lang = row["lang"]
        row["state"] = "menu"
        put_session(key, row)
        return _menu(lang, geo_note=lang_name(lang))

    if folded in {"0", "menu", "help", "hello", "start", "*"}:
        row["state"] = "menu"
        row["seen_welcome"] = True
        put_session(key, row)
        note = lang_name(lang) if row.get("lang_source") not in {"", "default"} else ""
        if folded in {"0", "help"}:
            return _join(t(lang, "help"), _menu(lang, geo_note=note))
        return _menu(lang, geo_note=note)

    if not text:
        row["seen_welcome"] = True
        put_session(key, row)
        note = lang_name(lang) if row.get("lang_source") not in {"", "default"} else ""
        return _menu(lang, geo_note=note)

    if folded in {"8", "lang", "language"}:
        row["state"] = "lang_wait"
        put_session(key, row)
        return t(lang, "lang_ask")

    if row.get("state") == "lang_wait":
        chosen = LANG_MENU_CODES.get(folded) or normalize_lang(text)
        row["state"] = "menu"
        if chosen:
            row["lang"] = chosen
            row["lang_source"] = "explicit"
            lang = chosen
            put_session(key, row)
            return _join(t(lang, "lang_set", label=lang_name(lang)), _menu(lang))
        put_session(key, row)
        return t(lang, "unknown")

    done = _DONE_CMD.match(text)
    if done or (row.get("state") == "ack_wait" and re.fullmatch(r"\d+", text)):
        index = int(done.group(1) if done else text)
        reply = _ack_by_index(lang, row, index)
        put_session(key, row)
        return reply

    if folded in {"1", "today", "din", "aaj"}:
        row["state"] = "ack_wait"
        put_session(key, row)
        return _reminders(lang, row)

    if folded in {"3", "alert", "alerts"}:
        row["state"] = "menu"
        put_session(key, row)
        return _alerts(lang)

    if folded in {"4", "call", "phone"}:
        row["state"] = "call_wait"
        put_session(key, row)
        return _calls(lang)

    if row.get("state") == "call_wait" and re.fullmatch(r"\d+", text):
        people = contacts(lang)
        idx = int(text) - 1
        row["state"] = "menu"
        put_session(key, row)
        if 0 <= idx < len(people):
            _cid, name, number = people[idx]
            return t(lang, "dial", name=name, phone=number)
        return t(lang, "unknown")

    if folded in {"5", "ok", "checkin"}:
        row.setdefault("checkins", []).append(time.time())
        enqueue_outbox(key, "checkin", {"at": row["checkins"][-1]})
        row["state"] = "menu"
        put_session(key, row)
        return t(lang, "checkin_ok")

    if folded in {"6", "med", "medicine"}:
        med = peek_next_med(row)
        row["state"] = "menu"
        put_session(key, row)
        if not med:
            return t(lang, "no_med")
        return t(lang, "next_med", item=task_name(lang, med))

    if folded in {"7", "sos", "helpme"}:
        row["sos_at"] = time.time()
        enqueue_outbox(key, "sos", {"at": row["sos_at"]})
        row["state"] = "menu"
        put_session(key, row)
        return t(lang, "sos")

    if folded in {"h", "helpline", "helplines"}:
        row["state"] = "menu"
        put_session(key, row)
        return _helplines()

    if folded in {"9", "zone", "home", "safe"}:
        row["state"] = "menu"
        put_session(key, row)
        return t(lang, "zone")

    if folded == "2" or folded in {"done", "ack", "next"}:
        nxt = peek_next(row)
        if nxt and nxt in row.get("pending", []):
            idx = row["pending"].index(nxt) + 1
            reply = _ack_by_index(lang, row, idx)
            put_session(key, row)
            return reply
        row["state"] = "ack_wait"
        put_session(key, row)
        return _reminders(lang, row)

    if not row.get("seen_welcome"):
        row["seen_welcome"] = True
        put_session(key, row)
        note = lang_name(lang) if row.get("lang_source") not in {"", "default"} else ""
        return _menu(lang, geo_note=note)

    put_session(key, row)
    return t(lang, "unknown")


def handle_ussd(phone: str, text: str, hint: dict | None = None) -> tuple[str, bool]:
    """Africa's Talking style: text is '' then '1' then '1*2'. Returns (message, continue?)."""
    hint = hint or {}
    parts = [p for p in (text or "").split("*") if p != ""]
    last = parts[-1] if parts else ""
    body = last if last else "start"
    reply = handle_message(phone, body, hint)
    cont = True
    if last.lower() in {"3", "4"}:
        # Keep session open so they can still pick a call number.
        cont = True
    return reply, cont
