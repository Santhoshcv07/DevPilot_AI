from groq import Groq
from backend.core.config import settings

# 1. Initialize the Groq client using our secure API key
client = Groq(api_key=settings.groq_api_key)

def get_ai_response_with_history(conversation_history: list) -> str:
    """
    Sends a full transcript of messages to Groq and returns the AI's next response.
    """
    try:
        # 1. Start with the master system instructions
        messages = [
            {
                "role": "system",
                "content": "You are DevPilot AI, an elite coding assistant. Keep answers concise."
            }
        ]
        
        # 2. Append the entire database history (which includes the newest user prompt)
        messages.extend(conversation_history)

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant", 
        )
        
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        return f"Error communicating with AI brain: {str(e)}"