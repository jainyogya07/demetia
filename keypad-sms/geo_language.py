"""Map phone / city / GPS to an SMS language.

Indian mobile number portability means prefixes are only a hint.
Order of trust: explicit LANG → GPS/state/city from the gateway → MSISDN series → English.
"""

from __future__ import annotations

import re

from dsa import PrefixTrie

LANGS = ("en", "hi", "as", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "kha", "lus", "mni")

STATE_LANG = {
    "delhi": "hi",
    "nct": "hi",
    "nct of delhi": "hi",
    "new delhi": "hi",
    "dl": "hi",
    "haryana": "hi",
    "hr": "hi",
    "uttar pradesh": "hi",
    "up": "hi",
    "uttarakhand": "hi",
    "uk": "hi",
    "ua": "hi",
    "rajasthan": "hi",
    "rj": "hi",
    "madhya pradesh": "hi",
    "mp": "hi",
    "bihar": "hi",
    "br": "hi",
    "jharkhand": "hi",
    "jh": "hi",
    "himachal pradesh": "hi",
    "hp": "hi",
    "chandigarh": "hi",
    "ch": "hi",
    "chhattisgarh": "hi",
    "cg": "hi",
    "assam": "as",
    "asom": "as",
    "as": "as",
    "west bengal": "bn",
    "wb": "bn",
    "tripura": "bn",
    "tr": "bn",
    "tamil nadu": "ta",
    "tn": "ta",
    "puducherry": "ta",
    "py": "ta",
    "andhra pradesh": "te",
    "ap": "te",
    "telangana": "te",
    "ts": "te",
    "maharashtra": "mr",
    "mh": "mr",
    "goa": "mr",
    "ga": "mr",
    "gujarat": "gu",
    "gj": "gu",
    "karnataka": "kn",
    "ka": "kn",
    "kerala": "ml",
    "kl": "ml",
    "punjab": "pa",
    "pb": "pa",
    "meghalaya": "kha",
    "ml": "kha",
    "mizoram": "lus",
    "mz": "lus",
    "manipur": "mni",
    "mn": "mni",
    "nagaland": "en",
    "nl": "en",
    "arunachal pradesh": "hi",
    "ar": "hi",
    "sikkim": "en",
    "sk": "en",
    "odisha": "hi",
    "orissa": "hi",
    "od": "hi",
    "jammu and kashmir": "hi",
    "jk": "hi",
    "ladakh": "hi",
    "la": "hi",
}

CITY_LANG = {
    "delhi": "hi",
    "new delhi": "hi",
    "noida": "hi",
    "gurgaon": "hi",
    "gurugram": "hi",
    "faridabad": "hi",
    "ghaziabad": "hi",
    "lucknow": "hi",
    "kanpur": "hi",
    "varanasi": "hi",
    "jaipur": "hi",
    "indore": "hi",
    "bhopal": "hi",
    "patna": "hi",
    "ranchi": "hi",
    "guwahati": "as",
    "gauhati": "as",
    "jorhat": "as",
    "dibrugarh": "as",
    "silchar": "as",
    "tezpur": "as",
    "nagaon": "as",
    "tinsukia": "as",
    "kolkata": "bn",
    "calcutta": "bn",
    "howrah": "bn",
    "siliguri": "bn",
    "agartala": "bn",
    "chennai": "ta",
    "madras": "ta",
    "coimbatore": "ta",
    "madurai": "ta",
    "hyderabad": "te",
    "vijayawada": "te",
    "visakhapatnam": "te",
    "warangal": "te",
    "mumbai": "mr",
    "bombay": "mr",
    "pune": "mr",
    "nagpur": "mr",
    "nashik": "mr",
    "ahmedabad": "gu",
    "surat": "gu",
    "vadodara": "gu",
    "rajkot": "gu",
    "bengaluru": "kn",
    "bangalore": "kn",
    "mysuru": "kn",
    "mysore": "kn",
    "hubballi": "kn",
    "kochi": "ml",
    "cochin": "ml",
    "thiruvananthapuram": "ml",
    "trivandrum": "ml",
    "kozhikode": "ml",
    "amritsar": "pa",
    "ludhiana": "pa",
    "jalandhar": "pa",
    "shillong": "kha",
    "aizawl": "lus",
    "imphal": "mni",
    "kohima": "en",
    "itanagar": "hi",
    "gangtok": "en",
    "bhubaneswar": "hi",
}

# Approximate state boxes (south, west, north, east). Good enough for keypad GPS.
STATE_BOXES = (
    ("delhi", 28.40, 76.84, 28.88, 77.35, "hi"),
    ("haryana", 27.65, 74.48, 30.93, 77.60, "hi"),
    ("uttar pradesh", 23.87, 77.08, 30.42, 84.63, "hi"),
    ("rajasthan", 23.03, 69.48, 30.20, 78.27, "hi"),
    ("madhya pradesh", 21.07, 74.03, 26.87, 82.81, "hi"),
    ("bihar", 24.28, 83.32, 27.52, 88.30, "hi"),
    ("assam", 24.13, 89.70, 27.97, 96.02, "as"),
    ("west bengal", 21.54, 85.82, 27.22, 89.89, "bn"),
    ("tripura", 22.94, 91.00, 24.53, 92.67, "bn"),
    ("tamil nadu", 8.07, 76.23, 13.56, 80.35, "ta"),
    ("andhra pradesh", 12.62, 76.76, 19.17, 84.76, "te"),
    ("telangana", 15.83, 77.24, 19.92, 81.32, "te"),
    ("maharashtra", 15.60, 72.65, 22.03, 80.90, "mr"),
    ("gujarat", 20.12, 68.16, 24.71, 74.48, "gu"),
    ("karnataka", 11.59, 74.05, 18.45, 78.59, "kn"),
    ("kerala", 8.18, 74.86, 12.78, 77.41, "ml"),
    ("punjab", 29.54, 73.88, 32.58, 76.84, "pa"),
    ("meghalaya", 25.03, 89.82, 26.12, 92.80, "kha"),
    ("mizoram", 21.94, 92.25, 24.52, 93.44, "lus"),
    ("manipur", 23.83, 93.03, 25.68, 94.78, "mni"),
    ("nagaland", 25.21, 93.33, 27.04, 95.25, "en"),
    ("arunachal pradesh", 26.65, 91.56, 29.42, 97.42, "hi"),
    ("sikkim", 27.08, 88.01, 28.13, 88.92, "en"),
)

# Common 4-digit Indian mobile series → circle (hint only; MNP breaks this).
SERIES_CIRCLE = {
    "9810": "delhi",
    "9811": "delhi",
    "9818": "delhi",
    "9871": "delhi",
    "9873": "delhi",
    "9999": "delhi",
    "9310": "delhi",
    "9311": "delhi",
    "9312": "delhi",
    "9313": "delhi",
    "8586": "delhi",
    "8700": "delhi",
    "9711": "delhi",
    "9717": "delhi",
    "9868": "delhi",
    "9899": "delhi",
    "9910": "delhi",
    "9958": "delhi",
    "9968": "delhi",
    "9435": "assam",
    "9954": "assam",
    "9957": "assam",
    "9864": "assam",
    "9706": "assam",
    "9707": "assam",
    "6000": "assam",
    "6001": "assam",
    "6002": "assam",
    "7002": "assam",
    "8133": "assam",
    "8134": "assam",
    "9101": "assam",
    "9365": "assam",
    "9830": "west bengal",
    "9831": "west bengal",
    "9836": "west bengal",
    "9903": "west bengal",
    "9433": "west bengal",
    "9434": "west bengal",
    "9007": "west bengal",
    "8017": "west bengal",
    "9840": "tamil nadu",
    "9841": "tamil nadu",
    "9842": "tamil nadu",
    "9940": "tamil nadu",
    "9941": "tamil nadu",
    "9444": "tamil nadu",
    "9003": "tamil nadu",
    "9848": "andhra pradesh",
    "9849": "andhra pradesh",
    "9948": "andhra pradesh",
    "9949": "telangana",
    "9866": "telangana",
    "9000": "telangana",
    "9820": "maharashtra",
    "9821": "maharashtra",
    "9867": "maharashtra",
    "9869": "maharashtra",
    "9967": "maharashtra",
    "9004": "maharashtra",
    "9825": "gujarat",
    "9824": "gujarat",
    "9879": "gujarat",
    "9909": "gujarat",
    "9845": "karnataka",
    "9844": "karnataka",
    "9880": "karnataka",
    "9900": "karnataka",
    "9846": "kerala",
    "9847": "kerala",
    "9895": "kerala",
    "9995": "kerala",
    "9814": "punjab",
    "9815": "punjab",
    "9872": "punjab",
    "9876": "punjab",
    "9862": "meghalaya",
    "9436": "meghalaya",
    "9863": "mizoram",
    "8731": "manipur",
    "9856": "nagaland",
}

LANG_LABEL = {
    "en": "English",
    "hi": "हिन्दी",
    "as": "অসমীয়া",
    "bn": "বাংলা",
    "ta": "தமிழ்",
    "te": "తెలుగు",
    "mr": "मराठी",
    "gu": "ગુજરાતી",
    "kn": "ಕನ್ನಡ",
    "ml": "മലയാളം",
    "pa": "ਪੰਜਾਬੀ",
    "kha": "Khasi",
    "lus": "Mizo",
    "mni": "মৈতৈলোন্",
}


def normalize_lang(code: str | None) -> str | None:
    if not code:
        return None
    c = code.strip().lower().replace("_", "-")
    aliases = {
        "hindi": "hi",
        "hin": "hi",
        "assamese": "as",
        "asom": "as",
        "asm": "as",
        "bengali": "bn",
        "bangla": "bn",
        "tamil": "ta",
        "telugu": "te",
        "marathi": "mr",
        "gujarati": "gu",
        "kannada": "kn",
        "malayalam": "ml",
        "punjabi": "pa",
        "khasi": "kha",
        "mizo": "lus",
        "lushai": "lus",
        "manipuri": "mni",
        "meitei": "mni",
        "english": "en",
        "eng": "en",
    }
    c = aliases.get(c, c)
    return c if c in LANGS else None


def digits_phone(raw: str | None) -> str:
    d = re.sub(r"\D", "", raw or "")
    if d.startswith("91") and len(d) >= 12:
        d = d[-10:]
    elif d.startswith("0") and len(d) == 11:
        d = d[1:]
    return d[-10:] if len(d) >= 10 else d


def _fold_place(raw: str | None) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (raw or "").lower()).strip()


def lang_from_place(state: str | None = None, city: str | None = None) -> tuple[str | None, str]:
    city_key = _fold_place(city)
    state_key = _fold_place(state)
    if city_key and city_key in CITY_LANG:
        return CITY_LANG[city_key], f"city:{city_key}"
    if state_key and state_key in STATE_LANG:
        return STATE_LANG[state_key], f"state:{state_key}"
    for key, lang in CITY_LANG.items():
        if city_key and key in city_key:
            return lang, f"city:{key}"
    for key, lang in STATE_LANG.items():
        if state_key and (key == state_key or key in state_key or state_key in key):
            return lang, f"state:{key}"
    return None, ""


def lang_from_gps(lat: float | None, lng: float | None) -> tuple[str | None, str]:
    if lat is None or lng is None:
        return None, ""
    try:
        lat_f = float(lat)
        lng_f = float(lng)
    except (TypeError, ValueError):
        return None, ""
    for name, south, west, north, east, lang in STATE_BOXES:
        if south <= lat_f <= north and west <= lng_f <= east:
            return lang, f"gps:{name}"
    return None, ""


_SERIES_TRIE = PrefixTrie()
for _prefix, _circle in SERIES_CIRCLE.items():
    _SERIES_TRIE.insert(_prefix, _circle)


def lang_from_msisdn(phone: str | None) -> tuple[str | None, str]:
    d = digits_phone(phone)
    if len(d) < 4:
        return None, ""
    circle = _SERIES_TRIE.longest(d[:6]) or SERIES_CIRCLE.get(d[:4])
    if not circle:
        return None, ""
    lang = STATE_LANG.get(circle)
    if not lang:
        return None, ""
    return lang, f"msisdn:{circle}"


def detect_language(
    *,
    explicit: str | None = None,
    state: str | None = None,
    city: str | None = None,
    lat: float | None = None,
    lng: float | None = None,
    phone: str | None = None,
    default: str = "en",
) -> tuple[str, str]:
    forced = normalize_lang(explicit)
    if forced:
        return forced, "explicit"
    lang, src = lang_from_gps(lat, lng)
    if lang:
        return lang, src
    lang, src = lang_from_place(state, city)
    if lang:
        return lang, src
    lang, src = lang_from_msisdn(phone)
    if lang:
        return lang, src
    return default, "default"
