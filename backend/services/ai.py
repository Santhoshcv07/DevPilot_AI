from groq import Groq
from backend.core.config import settings
from backend.agent_tools import create_local_file
import json
import re

# --- UPGRADED CLEANER: PERFECT CHATGPT TYPOGRAPHY ---
def clean_chatgpt_style(text: str) -> str:
    if not text: 
        return ""
        
    # 1. Erase ONLY the hidden tool tags (leaves HTML and Java code perfectly safe!)
    cleaned = re.sub(r'<function.*?>.*?</function>', '', text, flags=re.DOTALL)
    cleaned = re.sub(r'</?function.*?>', '', cleaned)
    
    # 2. Strip out ugly markdown headers (### or ##) at the start of lines
    cleaned = re.sub(r'^#{1,6}\s*', '', cleaned, flags=re.MULTILINE)
    
    # 3. Clean up loose asterisks (**bold**) if your frontend isn't rendering markdown
    cleaned = cleaned.replace("**", "")
    
    # 4. Normalize spacing so it looks open and clean
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    
    return cleaned.strip()

# 1. Initialize the Groq client using our secure API key
client = Groq(api_key=settings.groq_api_key)

# 1. THE NEW ABSOLUTE PATH TOOL
DEVPILOT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "create_local_file",
            "description": "Writes a file directly to the user's local computer. You MUST use this tool to output code. Never output raw code blocks in the chat.",
            "parameters": {
                "type": "object",
                "properties": {
                    "absolute_directory": {
                        "type": "string",
                        "description": "The absolute folder path the user provided (e.g., 'C:\\Users\\Name\\Desktop\\Project')"
                    },
                    "file_name": {
                        "type": "string",
                        "description": "The name of the file to create (e.g., 'index.html', 'styles.css')"
                    },
                    "content": {
                        "type": "string",
                        "description": "The complete, exact code for this file. CRITICAL: DO NOT MINIFY. You must format the code beautifully with line breaks (\\n), proper indentation, and blank lines."
                    }
                },
                "required": ["absolute_directory", "file_name", "content"]
            }
        }
    }
]

def get_ai_response_with_history(conversation_history: list):
    """
    Generator that yields tokens of the AI's response.
    Handles tool calls first synchronously before yielding the final stream.
    """
    try:
        # 1. Check if the frontend injected a Workspace path!
        last_msg = conversation_history[-1].get("content", "") if conversation_history else ""
        has_workspace = "[SYSTEM NOTE:" in last_msg
        
        # --- PERFECTLY TUNED PERSONALITY PROMPT ---
        if has_workspace:
            system_content = (
                "You are DevPilot AI. You speak naturally and elegantly, exactly like ChatGPT.\n\n"
                "RULES:\n"
                "1. Write short, beautiful, clean paragraphs.\n"
                "2. Never use markdown headers (## or ###) or bold brackets.\n"
                "3. State what files you created using a standard markdown bullet list (- file.name).\n"
                "4. Execute all code generation using tools completely silently.\n"
                "5. CRITICAL: NEVER minify generated code. Always use proper indentation and line breaks."
            )
            active_tools = DEVPILOT_TOOLS
        else:
            system_content = (
                "You are DevPilot AI, a brilliant coding assistant. Speak conversationally like ChatGPT.\n\n"
                "RULES:\n"
                "1. Do not use markdown headers (## or ###).\n"
                "2. Wrap all code snippets in standard markdown code blocks (```).\n"
                "3. Keep text explanations spacious, neat, and brief."
            )
            active_tools = None

        messages = [
            {"role": "system", "content": system_content}
        ]
        
        # Append the entire database history
        messages.extend(conversation_history)
        
        kwargs = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages
        }
        
        # 2. Check for Tool Calls first if tools are active
        if active_tools:
            kwargs["tools"] = active_tools
            kwargs["tool_choice"] = "auto"

            response = client.chat.completions.create(**kwargs)
            response_message = response.choices[0].message
            
            if hasattr(response_message, 'tool_calls') and response_message.tool_calls:
                messages.append(response_message)
                
                for tool_call in response_message.tool_calls:
                    if tool_call.function.name == "create_local_file":
                        arguments = json.loads(tool_call.function.arguments)
                        absolute_directory = arguments["absolute_directory"]
                        file_name = arguments["file_name"]
                        content = arguments["content"]
                        
                        tool_result = create_local_file(absolute_directory, file_name, content)
                        
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": tool_call.function.name,
                            "content": tool_result
                        })
                
                kwargs["messages"] = messages
                del kwargs["tools"]
                del kwargs["tool_choice"]

        # 3. Stream the final response
        kwargs["stream"] = True
        stream = client.chat.completions.create(**kwargs)
        
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
                
    except Exception as e:
        print(f"API Error: {str(e)}")
        yield "⚠️ The AI encountered an error processing that request. Please try again or rephrase."