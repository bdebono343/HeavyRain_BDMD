import os
from dotenv import load_dotenv
from google import genai

# Load API key from .env
load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

interaction = client.interactions.create(
    model="gemini-4-argon",
    input="Explain how AI works in a few words"
)
print(interaction.output_text)
