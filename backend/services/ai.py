from groq import Groq
from backend.core.config import settings

# 1. Initialize the Groq client using our secure API key
client = Groq(api_key=settings.groq_api_key)

def get_ai_response(prompt: str) -> str:
    """
    Sends a prompt to the Groq API and returns the AI's text response.
    """
    try:
        # 2. Make the phone call to the AI model
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are DevPilot AI, an elite, highly intelligent coding assistant. Keep your answers concise and accurate."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            # We are using Meta's LLaMA 3 8B model because it is incredibly fast
         model="llama-3.1-8b-instant",
        )
        
        # 3. Extract the actual text from the complex JSON response
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        # If the API is down or the key is wrong, fail gracefully
        return f"Error communicating with AI brain: {str(e)}"