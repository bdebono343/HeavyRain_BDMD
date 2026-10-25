import os
import sys
from dotenv import load_dotenv
from google import genai

# Fix Windows terminal encoding
sys.stdout.reconfigure(encoding="utf-8")

# Load API key from .env
load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

SYSTEM_PROMPT = "You are Argon, a helpful AI assistant powered by Gemini 4. Be concise, clear, and helpful."

print("\n" + "=" * 50)
print("  ARGON - Gemini 4 Agent")
print("  Type your message and press Enter.")
print("  Type 'exit' or 'quit' to end the session.")
print("=" * 50 + "\n")

history = []

while True:
    try:
        user_input = input("You: ")
    except (EOFError, KeyboardInterrupt):
        print("\n\nGoodbye!")
        break

    if user_input.strip().lower() in ("exit", "quit", "q"):
        print("\nGoodbye!")
        break

    if not user_input.strip():
        continue

    # Build conversation contents
    history.append({"role": "user", "parts": [{"text": user_input}]})

    try:
        interaction = client.interactions.create(
            model="gemini-4-argon",
            config={"system_instruction": SYSTEM_PROMPT},
            input=history,
        )
        response_text = interaction.output_text
        history.append({"role": "model", "parts": [{"text": response_text}]})
        print(f"Argon: {response_text}\n")
    except Exception as e:
        print(f"Error: {e}\n")
        # Remove the failed user message from history
        history.pop()

sys.exit(0)
