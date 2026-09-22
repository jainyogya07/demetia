# Isolated keypad SMS / USSD gateway for feature phones.
# Not mounted into backend/main.py or the Vite app.

from geo_language import detect_language
from handlers import handle_message

__all__ = ["detect_language", "handle_message"]
