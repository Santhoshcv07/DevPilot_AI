<div align="center">
  <img src="./frontend/public/logo.png" alt="DevPilot AI Logo" width="120" />
  <h1>🚀 DevPilot AI</h1>
  <p><strong>Your Intelligent, Next-Generation Developer Assistant</strong></p>
  <p>Explore your codebase, chat with your documents, and supercharge your workflow with AI.</p>
  
  <p>
    <a href="https://devpilot-ai-demo.com"><b>View Live Demo</b></a> •
    <a href="#-setup--deployment"><b>Quick Start</b></a> •
    <a href="#-contributing"><b>Contribute</b></a>
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </div>
</div>

---

## 📑 Table of Contents
- [🤔 What it does](#-what-it-does)
- [✨ Key Features](#-key-features)
- [🎯 Use Cases](#-use-cases)
- [🏗️ Architecture & Workflow](#-architecture--workflow)
- [📁 Detailed Project Structure](#-detailed-project-structure)
- [🚀 Setup & Deployment](#-setup--deployment)
- [🔮 Future Scope](#-future-scope)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🤔 What it does

**DevPilot AI** bridges the gap between large codebases and natural language understanding. It acts as an interactive AI pair programmer that sits right inside your local environment. 

Instead of manually searching through hundreds of files, you simply point DevPilot to your local workspace, and it allows you to:
- **Understand:** Ask questions about complex architectural choices or specific functions.
- **Navigate:** Get instant insights into how different files and components are connected.
- **Modify:** Write and update code directly from the chat interface using the integrated code editor.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🤖 AI-Powered Chat** | Converse with advanced LLMs powered by Groq's high-speed inference to debug, generate, or understand code instantly. |
| **📂 Deep Workspace Integration** | Seamlessly connect your local folders. The system scans, reads, and understands your entire file tree in seconds. |
| **✍️ In-App Code Editor** | Features an integrated Monaco Editor allowing you to review, edit, and save files directly within the platform. |
| **🔐 Secure Authentication** | Robust JWT-based user authentication and secure password hashing using bcrypt ensure your code and chats remain private. |
| **✨ Stunning UI/UX** | A beautifully designed, responsive interface utilizing Tailwind CSS and smooth micro-animations via Framer Motion. |

---

## 🎯 Use Cases

- **Onboarding New Developers:** Instantly get new team members up to speed by letting them ask questions about the codebase structure and logic.
- **Debugging Complex Issues:** Trace bugs across multiple files by querying the AI for variable flows and component interactions.
- **Rapid Prototyping:** Generate boilerplate code, functional components, or API endpoints directly within your workspace.
- **Documentation Generation:** Automatically generate readmes and inline documentation for undocumented legacy code.

---

## 🏗️ Architecture & Workflow

DevPilot AI operates on a modern, decoupled client-server architecture.

```mermaid
graph TD
    subgraph Frontend "Frontend (Next.js)"
        UI[User Interface]
        Editor[Monaco Editor]
        Chat[Chat Interface]
        Tree[File Tree Viewer]
        
        UI --> Editor
        UI --> Chat
        UI --> Tree
    end

    subgraph Backend "Backend (FastAPI)"
        API[API Gateway]
        Auth[Auth Service]
        Work[Workspace Manager]
        AI_Serv[AI Service]
        
        API --> Auth
        API --> Work
        API --> AI_Serv
    end

    subgraph External "External Services"
        DB[(PostgreSQL)]
        Groq[Groq AI Inference]
        Local[Local File System]
    end

    Chat <-->|REST API| API
    Editor <-->|REST API| API
    Tree <-->|REST API| API
    
    Auth <--> DB
    Work <--> Local
    AI_Serv <--> Groq
```

### 🔄 Data Flow
1. **User Action:** The user selects a local folder or sends a prompt in the chat.
2. **Frontend Processing:** Next.js captures the input and sends an API request to the FastAPI backend.
3. **Backend Orchestration:** 
   - The Workspace Manager reads the necessary local files.
   - The AI Service constructs a prompt combining user intent and file context.
4. **AI Inference:** The context is securely sent to the Groq API for rapid processing.
5. **Response & Action:** The generated response is streamed back to the client, displaying answers or opening the Monaco Editor for direct code modifications.

---

## 📁 Detailed Project Structure

```text
DevPilot_AI/
├── backend/                       # Python FastAPI Backend
│   ├── alembic/                   # Database Migration versions
│   ├── api/                       # API Endpoints (Controllers)
│   │   ├── auth.py                # Login/Signup routes
│   │   ├── chat.py                # LLM interaction routes
│   │   └── workspace.py           # File system reading routes
│   ├── core/                      # Application Configurations
│   │   ├── config.py              # Environment variables
│   │   └── security.py            # Password hashing & JWT logic
│   ├── models/                    # SQLAlchemy ORM Models
│   ├── schemas/                   # Pydantic models for request/response validation
│   ├── services/                  # Business Logic layer
│   │   └── llm_service.py         # Groq API integration
│   ├── requirements.txt           # Python dependencies
│   └── main.py                    # FastAPI entry point
│
├── frontend/                      # React / Next.js Frontend
│   ├── public/                    # Static Assets (Images, SVGs, Favicon)
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── (auth)/            # Grouped auth routes (login, register)
│   │   │   ├── dashboard/         # Main application interface
│   │   │   └── page.tsx           # Landing page
│   │   ├── components/            # Reusable UI components (Buttons, Modals)
│   │   ├── lib/                   # Utility functions and API clients
│   │   └── store/                 # State management (Zustand/Context)
│   ├── tailwind.config.ts         # Tailwind CSS styling tokens
│   └── package.json               # Node.js dependencies
│
├── .env.example                   # Template for environment variables
├── .gitignore                     # Git ignored files
└── README.md                      # Project documentation (You are here!)
```

---

## 🚀 Setup & Deployment

We've made running DevPilot AI as simple as possible. People trust repositories that run easily!

### 📋 Prerequisites
- **Node.js** (v18.0.0+)
- **Python** (v3.10+)
- **PostgreSQL** (Running locally or via Docker)
- **Git**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Santhoshcv07/DevPilot_AI.git
cd DevPilot_AI
```

### 2️⃣ Backend Setup
```bash
# Navigate to project root
cd DevPilot_AI

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY and DATABASE_URL
```

### 3️⃣ Database Migrations
Make sure your PostgreSQL database is running, then apply migrations:
```bash
alembic upgrade head
```

### 4️⃣ Frontend Setup
```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install Node modules
npm install
```

### 5️⃣ Run the Servers

**Start the Backend (Terminal 1 - Root Dir):**
```bash
uvicorn backend.main:app --reload --port 8000
```
*API docs available at: `http://localhost:8000/docs`*

**Start the Frontend (Terminal 2 - Frontend Dir):**
```bash
npm run dev
```
*App available at: `http://localhost:3000`*

---

## 🔮 Future Scope

- [ ] **Multi-Model Support:** Add integrations for OpenAI (GPT-4), Anthropic (Claude 3), and local models (Ollama).
- [ ] **Vector Database Integration:** Implement RAG (Retrieval-Augmented Generation) using Pinecone or ChromaDB for indexing massive codebases instantly.
- [ ] **Real-time Collaboration:** Allow multiple developers to interact with the same AI session and workspace simultaneously.
- [ ] **Automated Tests Generation:** 1-click test suite generation for selected components.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/Santhoshcv07">Santhosh</a> & AI</b>
</div>