# 🚀 AI Code Helper - SaaS Platform

An intelligent, full-stack AI-powered coding assistant and workspace platform designed to streamline software development, code generation, refactoring, explanation, and security auditing. Built as a comprehensive solution featuring context-aware chat sessions, interactive code blocks, and secure local AI integration.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, React Syntax Highlighter
- **Backend:** Laravel (PHP RESTful API)
- **Database:** MySQL (managed via Laragon)
- **AI Engine:** Local LLM (`qwen2.5-coder:7b`) powered via **Ollama** (running locally on port `11434`)
- **Version Control:** Git & GitHub (`ai-code-helper-blendi`)

---

## ✨ Key Features

1. **Context-Aware AI Chat:** Retains full session history and conversation context, allowing natural follow-up prompts (e.g., generating code and then asking to style it or refactor it without resending the snippet).
2. **Interactive Code Workspaces (`EditableCodeBlock`):** Features live syntax highlighting, copy-to-clipboard functionality, and an inline **Edit/Save** feature for direct code modifications inside chat responses.
3. **Multi-Mode Operations:** Supports distinct developer actions:
   - **Generate:** Write clean, production-ready code across multiple languages (JavaScript, PHP/Laravel, HTML, CSS, React, Python) with auto-detection.
   - **Explain:** Deeply analyze and break down code logic and architecture.
   - **Refactor:** Optimize and clean up inefficient code snippets.
   - **Security Audit:** Scan code for vulnerabilities, logic errors, and security recommendations.
4. **Session & Folder Organization:** Group workspaces into custom folders with local persistence and secure authentication management.

---

## ⚙️ Installation & Local Setup Guide

Follow these steps to set up and run the project locally on your machine:

### Prerequisites
Make sure you have the following installed:
- PHP & Composer
- Node.js & npm
- MySQL (via Laragon)
- [Ollama](https://ollama.com/) installed and running locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ai-code-helper-blendi.git](https://github.com/your-username/ai-code-helper-blendi.git)
cd ai-code-helper-blendi
2. Set Up the Backend (Laravel)
Navigate to the backend directory, install dependencies, configure environment, and start the server:

Bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
Configure your database credentials in .env (ensuring MySQL runs on your preferred port, e.g., 3307 or 3306), then run migrations:

Bash
php artisan migrate
php artisan serve --port=8085
3. Set Up the Frontend (React & Vite)
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

Bash
cd frontend
npm install
npm run dev
4. Configure & Run the Local AI Model (Ollama)
Ensure Ollama is running in the background and the required model is pulled:

Bash
ollama run qwen2.5-coder:7b
(The backend communicates with Ollama locally via http://127.0.0.1:11434).

🎯 Usage Demo Flow (For Presentation)
Open the application in your browser (http://localhost:5173).

Log in or create a session.

Select the Generate mode and request a component or snippet (e.g., "Create a simple HTML page with a modern header").

Use the Edit button on the code block to modify the code directly, or ask a follow-up question leveraging the Context Memory (e.g., "Now add CSS styling for a dark theme").

Test the Explain, Refactor, and Security Audit modes on existing code snippets.

👨‍💻 Author
Developed by Blend Rexhepaj

Computer Science Undergraduate at UBT College


---

### Si ta shtosh në projektin tënd në Git:
Pasi ta krijosh skedarin `README.md` në rrënjë të projektit dhe ta ruash, ekzekuto këto komanda në terminal për ta përditësuar në GitHub:
```bash
git add README.md
git commit -m "Add detailed professional README for project presentation"
git push origin main