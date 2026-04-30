# 🚀 AI Session Feedback Dashboard

🔗 **Live Demo:**
https://bfde9809-0480-449f-9d31-414020392230.canvases.tempo.build/dashboard

---

## 🌟 Features

* 🔐 **User Authentication**

  * Secure login using Supabase Auth
  * Session-based access control

* 🤖 **AI-Generated Feedback**

  * Session analysis (mock / OpenAI-ready)
  * Key insights and improvement tips

* 📊 **Performance Metrics**

  * Clarity Score
  * Interaction Quality
  * Engagement Score
  * Overall Score

* 🎤 **Speaking Time Analysis**

  * Visual comparison (Teacher vs Learner)
  * Ideal ratio suggestions

* 💡 **Smart Suggestions**

  * AI-generated improvement tips
  * Actionable learning insights

* 🎨 **Modern UI**

  * Glassmorphism design
  * Tailwind CSS styling
  * Fully responsive layout

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Lucide Icons

### Backend / Services

* Supabase (Authentication + Database)
* Supabase SSR Client

### AI Integration (Pluggable)

* OpenAI API (recommended)
* Mock data (current implementation)

---

## 📂 Project Structure

```bash
src/
│
├── app/
│   └── dashboard/
│       └── sessions/
│           └── feedback/
│               └── page.tsx
│
├── components/
│   └── dashboard-navbar.tsx
│
├── supabase/
│   └── server.ts
│
└── styles/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd project-folder
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

### 4️⃣ Run the development server

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User logs in via Supabase
2. Session stored in cookies
3. Server verifies user on each request
4. Unauthorized users redirected to `/sign-in`

---

## 🧠 AI Feedback Logic

Currently uses **mock data**, but structured for real AI integration.

Future workflow:

```
Session Recording → Speech Analysis → OpenAI API → Feedback Generation
```

---

## 📈 Future Improvements

* 🔗 Real OpenAI integration
* 🎙️ Voice/audio analysis
* 📹 Video session tracking
* 📊 Historical analytics dashboard
* 🧑‍🏫 Personalized learning recommendations

---

## 🐞 Known Issues

* Requires correct Supabase setup
* SSR cookie handling must be configured properly
* AI feedback is currently static (mock data)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## 📜 License

This project is for educational and development purposes.

---

## 👨‍💻 Author

**Pavan G P**
Full Stack Developer | AI Enthusiast | Database "Superbase" | Stripe "Security"

**Varshini N** 
Frontend Developer | Prompt engineer

**Ankitha S N**
Backend Developer | Database

**Sindhu N**
UI/UX Designer



---
