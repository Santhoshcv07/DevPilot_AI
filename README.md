<div align="center">
  <img src="./frontend/public/logo.png" alt="DevPilot AI Logo" width="120" />
  <h1>🚀 DevPilot AI</h1>
  <p><strong>Your Intelligent, Next-Generation Developer Assistant</strong></p>
  <p>Explore your codebase, chat with your documents, and supercharge your workflow with AI.</p>
</div>

---

## 📑 Table of Contents

- [🚀 Introduction](#-introduction)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🏗️ System Architecture](#-system-architecture)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🚦 Running the Application](#-running-the-application)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Introduction

**DevPilot AI** is an advanced, AI-powered developer assistant designed to bridge the gap between large codebases and natural language understanding. By integrating seamlessly with your local file system, DevPilot AI allows you to query your code, ask for architectural explanations, and even write files directly from the chat interface.

Built with modern web technologies, it features a blazingly fast FastAPI backend and a stunning, highly animated Next.js frontend.

---

## ✨ Key Features

- **🤖 AI-Powered Chat:** Converse with advanced LLMs (powered by Groq) to understand complex code structures, debug issues, and generate new code.
- **📂 Deep Workspace Integration:** Directly select local folders and have DevPilot scan, read, and understand your file tree.
- **✍️ In-App Code Editor:** Integrated Monaco Editor allows you to review and edit files directly within the platform.
- **🔐 Secure Authentication:** Robust JWT-based user authentication and secure password hashing using bcrypt.
- **✨ Stunning UI/UX:** A beautifully designed interface utilizing Tailwind CSS and smooth micro-animations via Framer Motion.
- **⚡ High Performance:** Async Python backend (FastAPI) paired with a responsive Next.js frontend ensures a seamless experience.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Editor:** [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Markdown Rendering:** `react-markdown`, `react-syntax-highlighter`
- **Language:** TypeScript

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database:** PostgreSQL with [SQLAlchemy](https://www.sqlalchemy.org/) ORM & [Alembic](https://alembic.sqlalchemy.org/) (Migrations)
- **AI Integration:** [Groq API](https://groq.com/) (Extremely fast LLM inference)
- **Authentication:** PyJWT, Passlib (bcrypt)
- **Validation:** Pydantic

---

## 🏗️ System Architecture

DevPilot AI operates on a modern client-server architecture:

1. **Client (Next.js):** Handles the user interface, file tree rendering, code editing, and real-time chat interactions.
2. **API Gateway (FastAPI):** Manages user sessions, processes workspace file requests, and acts as the bridge to the AI models.
3. **AI Engine:** Communicates with Groq's high-speed inference endpoints to generate contextual responses based on your codebase.
4. **Database:** Stores user profiles, authentication credentials, and chat histories securely.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** (Running locally or via Docker)
- **Git**

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Santhoshcv07/DevPilot_AI.git
cd DevPilot_AI
```

### 2. Backend Setup
```bash
# Navigate to the root directory
# Create and activate a virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file in the root directory (use .env.example as a template)
# Add your GROQ_API_KEY and Database URL
```

### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install
```

---

## 🚦 Running the Application

To experience DevPilot AI, you need to run both the backend and frontend servers simultaneously.

### Start the Backend (Terminal 1)
From the **root directory** with your virtual environment activated:
```bash
uvicorn backend.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*

### Start the Frontend (Terminal 2)
From the **frontend directory**:
```bash
npm run dev
```
*The web interface will be available at `http://localhost:3000`*

---

## 📁 Project Structure

```text
DevPilot_AI/
├── backend/                  # FastAPI Application
│   ├── api/                  # API Routers (Auth, Chats, Users, Workspace)
│   ├── core/                 # Configuration & Security (JWT, settings)
│   ├── models/               # SQLAlchemy Database Models
│   ├── schemas/              # Pydantic Validation Schemas
│   ├── services/             # Business Logic & AI Integrations (Groq)
│   └── main.py               # Application Entry Point
├── frontend/                 # Next.js Application
│   ├── public/               # Static Assets (Logos, SVGs)
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages (Login, Signup, Chat)
│   │   └── components/       # Reusable UI Components & Landing Page
│   ├── tailwind.config.ts    # Tailwind CSS Configuration
│   └── package.json          # Node Dependencies
├── alembic/                  # Database Migration Scripts
├── requirements.txt          # Python Dependencies
└── README.md                 # Project Documentation
```

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