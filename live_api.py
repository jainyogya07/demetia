import asyncio
import websockets
import json
import base64
import sys

import os
from pathlib import Path

def _load_env_files():
    root = Path(__file__).resolve().parent
    for name in (".env.local", ".env"):
        path = root / name
        if not path.exists():
            continue
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)

_load_env_files()

API_KEY = os.environ.get("GEMINI_API_KEY", "") or os.environ.get("VITE_GEMINI_API_KEY", "")
# Using the experimental flash live model for multimodal live interactions
MODEL_NAME = "gemini-2.0-flash-exp"
WS_URL = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={API_KEY}"
# Voice name only — PCM / mic pipeline unchanged. Female: Aoede. Male: Charon (or Puck).
VOICE_NAME = os.environ.get("GEMINI_LIVE_VOICE", "Aoede")

async def receive_from_gemini(websocket):
    """Listen for messages from Gemini and print the text or handle audio."""
    try:
        async for message in websocket:
            response = json.loads(message)
            
            # Check for server content (can be text or audio)
            if "serverContent" in response:
                server_content = response["serverContent"]
                
                # Check for model turn (text/audio generation)
                if "modelTurn" in server_content:
                    parts = server_content["modelTurn"].get("parts", [])
                    for part in parts:
                        if "text" in part:
                            # Print text chunks directly as they arrive
                            print(part["text"], end="", flush=True)
                        
                        if "inlineData" in part:
                            # This is where audio data comes back! 
                            # mimeType is usually audio/pcm;rate=24000
                            # To play it, you'd decode base64 and pipe to PyAudio.
                            # print("\n[Received Audio Chunk]")
                            pass
                            
                # Check if it's the end of a turn
                if server_content.get("turnComplete"):
                    print("\n\n[Saheli finished speaking]")
                    break
                    
    except websockets.exceptions.ConnectionClosed:
        print("\nConnection closed by the server.")
    except Exception as e:
        print(f"\nError receiving from Gemini: {e}")

async def connect_and_configure():
    """Connect to the WebSocket and configure the session."""
    print("Connecting to Gemini Live API...")
    try:
        async with websockets.connect(WS_URL) as websocket:
            print("✅ WebSocket Connected!\n")

            # 1. Send the initial configuration (Setup Message)
            setup_message = {
                "setup": {
                    "model": f"models/{MODEL_NAME}",
                    # Requesting both AUDIO and TEXT is not directly supported in responseModalities in some versions,
                    # but asking for AUDIO and enabling transcription is the standard way.
                    # For a simple test, we will request AUDIO.
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": VOICE_NAME
                                }
                            }
                        }
                    },
                    "systemInstruction": {
                        "parts": [{
                            "text": "You are Saheli, a compassionate AI companion helping widows in India navigate legal, financial, and emotional challenges. Speak in a mix of Hindi and English. Be warm and supportive."
                        }]
                    }
                }
            }
            
            await websocket.send(json.dumps(setup_message))
            
            # Read the setup response
            setup_response = await websocket.recv()
            print("[System] Setup complete.")
            print(f"[System] Voice: {VOICE_NAME}")
            
            # 2. Interactive Loop (Sending text for now to test)
            while True:
                user_message = input("\nYou (type 'quit' to exit): ")
                if user_message.lower() in ['quit', 'exit']:
                    break
                    
                # Create a client message to send text
                client_message = {
                    "clientContent": {
                        "turns": [
                            {
                                "role": "user",
                                "parts": [{"text": user_message}]
                            }
                        ],
                        "turnComplete": True
                    }
                }
                
                print("Saheli: ", end="", flush=True)
                await websocket.send(json.dumps(client_message))
                
                # Receive the response
                await receive_from_gemini(websocket)

    except Exception as e:
        print(f"Connection failed: {e}")

async def main():
    print("--- SAHELI SAHAAY: GEMINI LIVE API TEST ---")
    await connect_and_configure()

if __name__ == "__main__":
    # Handle graceful exit on Windows/Mac
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)
