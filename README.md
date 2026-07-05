# 🎓 Campus Copilot AI

> An intelligent AI-powered academic assistant that helps students manage their college life—from lectures and assignments to exam preparation and attendance—all in one place.

## 🚀 Overview

Campus Copilot AI is an AI agent designed to simplify the everyday academic journey of college students. Instead of acting as a simple chatbot, it functions as a personal academic assistant that can plan, organize, retrieve information, and provide personalized guidance using multiple AI capabilities.

The project is built as part of the **Google × Kaggle 5-Day AI Agents Workshop Hackathon**.

---

## ✨ Problem Statement

College students often struggle with:

* Keeping track of assignments and deadlines
* Managing attendance requirements
* Organizing study materials
* Preparing efficiently for exams
* Finding information across multiple lecture notes
* Maintaining a consistent study schedule

Campus Copilot AI addresses these challenges through a single intelligent assistant.

---

## 🎯 Features

### 📚 Smart Study Assistant

* Upload lecture notes (PDFs)
* Ask questions from uploaded notes
* AI-generated summaries
* Topic explanations
* Quick revision notes

### 📝 Assignment Manager

* Track assignments
* Deadline reminders
* Task prioritization
* Assignment planning

### 📅 Study Planner

* Personalized daily study schedule
* Exam preparation roadmap
* Time management suggestions

### 🎓 Attendance Tracker

* Attendance percentage calculator
* Attendance prediction
* Safe leave recommendations
* Attendance alerts

### 🧠 Quiz Generator

* AI-generated quizzes
* Flashcards
* Practice questions
* Self-assessment

### 🔍 Intelligent Search

* Search across uploaded notes
* Retrieve relevant information instantly
* Context-aware responses using Retrieval-Augmented Generation (RAG)

### 💾 Personalized Memory

* Remembers student preferences
* Tracks learning progress
* Adapts recommendations over time

---

## 🏗️ AI Agent Workflow

```text
          User
            │
            ▼
     Campus Copilot AI
            │
 ┌──────────┼──────────┐
 │          │          │
 ▼          ▼          ▼
Planner   Study     Assignment
 Agent     Agent       Agent
 │          │          │
 └──────────┼──────────┘
            ▼
      Memory + RAG
            │
            ▼
      Personalized Response
```

---

## 🛠️ Tech Stack

* Python
* Google Gemini
* Google AI Studio
* AI Agent Framework
* Streamlit
* LangChain (optional)
* ChromaDB / FAISS
* SQLite
* PDF Processing
* Retrieval-Augmented Generation (RAG)

---

## 📂 Project Structure

```text
Campus-Copilot/
│
├── app.py
├── agents/
├── tools/
├── memory/
├── database/
├── documents/
├── vector_store/
├── utils/
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/campus-copilot.git
```

Navigate to the project:

```bash
cd campus-copilot
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your environment variables:

```env
GOOGLE_API_KEY=YOUR_API_KEY
```

Run the application:

```bash
streamlit run app.py
```

---

## 💡 Future Enhancements

* Multi-agent collaboration
* Google Calendar integration
* Gmail reminders
* Voice assistant
* OCR support for handwritten notes
* Placement preparation module
* Campus event notifications
* Mobile application
* LMS integration
* Collaborative study groups

---

## 🌍 Impact

Campus Copilot AI aims to reduce academic stress by helping students:

* Stay organized
* Improve productivity
* Learn more efficiently
* Never miss important deadlines
* Make better use of study materials
* Build consistent study habits

---

## 🎯 Hackathon Goals

This project demonstrates modern AI agent capabilities, including:

* Autonomous task planning
* Tool calling
* Memory management
* Retrieval-Augmented Generation (RAG)
* Context-aware reasoning
* Personalized assistance
* Multi-step workflow execution

---

## 🤝 Contributing

Contributions, feature requests, and suggestions are welcome. Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed with ❤️ to make college life smarter, simpler, and more productive.

