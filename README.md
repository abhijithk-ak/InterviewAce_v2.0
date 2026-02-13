# InterviewAce v2.0 🎯

**AI-enhanced mock interview platform with deterministic algorithmic evaluation**

> **Core Philosophy**: InterviewAce does not depend on AI to evaluate candidates. Evaluation is performed using a deterministic NLP-based scoring engine. AI is used only to enhance feedback quality.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.1-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎓 Academic Distinction

**What sets InterviewAce apart:**

### Algorithmic Evaluation Engine
- **768+ curated domain keywords** across 6 specializations
- **5-dimensional scoring model** with explainable weights
- **Deterministic NLP algorithms** - same input always produces same output
- **Works offline** - no external API dependencies required
- **Sub-10ms evaluation** - faster than AI by 200-500x
- **Fully auditable** - every score can be traced to specific linguistic features

**Technical Implementation:**
- Lexical similarity using Jaccard coefficient (Relevance: 30%)
- Flesch readability principles (Clarity: 20%)
- Domain-specific lexicon matching (Technical Depth: 25%)
- Linguistic marker analysis (Confidence: 15%)
- Discourse coherence detection (Structure: 10%)

📚 **[Read the full technical documentation](src/lib/evaluation/README.md)**

## ✨ Features

### Phase 1-3 (Completed)
- ✅ **Authentication** - GitHub OAuth via NextAuth v4
- ✅ **Modern UI** - Dark sidebar, chat-style interview interface
- ✅ **Interview Engine** - Deterministic state machine with question flow
- ✅ **Algorithmic Evaluation** - NLP-based scoring engine (no AI required)
- ✅ **Question Bank** - 45+ curated questions across multiple domains
- ✅ **Real-time Chat** - Message bubbles, auto-scroll, thinking indicators

### Phase 4 (Completed)
- ✅ **Session Persistence** - MongoDB storage for interview history
- ✅ **Analytics Dashboard** - Performance trends with real data visualization
- ✅ **Session Detail View** - Detailed breakdowns of questions and evaluations
- ✅ **Profile Integration** - GitHub user info in sidebar

## 🚀 Tech Stack

**Core Framework:**
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5.9.3 (strict mode)
- **Authentication**: NextAuth v4.24.13
- **Database**: MongoDB 7.1.0 + Mongoose 9.1.5
- **Styling**: Tailwind CSS 4.1.18
- **Icons**: Lucide React 0.563.0

**Evaluation Stack:**
- **Primary**: Custom algorithmic engine (NLP-based, deterministic)
- **Enhancement**: OpenRouter with Meta Llama 3.2 3B (optional, free tier)
- **Keyword Library**: 768+ domain-specific terms
- **Processing**: Sub-10ms evaluation time

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB Atlas account (free tier)
- GitHub OAuth App
- OpenRouter API key (free)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhijithk-ak/InterviewAce_v2.0.git
   cd InterviewAce_v2.0
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # MongoDB
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/interviewace

   # OpenRouter (Free AI)
   OPENROUTER_API_KEY=your-openrouter-api-key
   OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
   ```

4. **Get your API keys**
   
   - **GitHub OAuth**: https://github.com/settings/developers
   - **MongoDB**: https://cloud.mongodb.com (free M0 cluster)
   - **OpenRouter**: https://openrouter.ai/keys (100% free)
   - **NextAuth Secret**: Run `openssl rand -base64 32`

5. **Run development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Starting an Interview

1. **Sign in** with your GitHub account
2. **Configure session** - Choose role, type, and difficulty
3. **Answer questions** - AI asks follow-ups based on your responses
4. **Complete interview** - Get instant feedback

### Interview Types
- Technical (coding & problem-solving)
- Behavioral (past experiences)
- System Design (architecture & scalability)
- HR (culture fit & background)

### Difficulty Levels
- Easy - Entry-level questions
- Medium - Mid-level challenges
- Hard - Senior-level depth

## 🏗️ Architecture

### Key Components

```
src/
├── app/
│   ├── (app)/                    # Authenticated pages
│   │   ├── dashboard/            # User dashboard
│   │   ├── interview/
│   │   │   ├── setup/            # Interview configuration
│   │   │   └── session/          # Live interview chat
│   │   ├── analytics/            # Performance insights
│   │   └── settings/             # User preferences
│   └── api/
│       ├── auth/                 # NextAuth routes
│       └── interview/
│           ├── start/            # Initialize session
│           └── respond/          # AI evaluation endpoint
├── components/
│   ├── layout/                   # Sidebar, AppLayout
│   └── ui/                       # Button, Card components
├── lib/
│   ├── ai/
│   │   ├── client.ts             # OpenRouter integration
│   │   └── prompts/              # Evaluation & follow-up prompts
│   ├── db/
│   │   ├── mongoose.ts           # DB connection
│   │   └── models/Session.ts    # Session schema
│   ├── auth.ts                   # NextAuth config
│   └── routes.ts                 # Static route definitions
└── hooks/
    └── use-mounted.ts            # Hydration safety
```

### State Machine

The interview engine uses a deterministic state machine:

```typescript
type InterviewState = {
  status: "idle" | "active" | "ended"
  currentQuestionIndex: number
  questions: Question[]
  messages: InterviewMessage[]
  questionProgress: Map<string, QuestionProgress>
}
```

**Flow**:
1. User answers main question
2. AI evaluates answer (silent, JSON)
3. If evaluation suggests follow-up → ask ONE follow-up
4. Else → advance to next main question
5. Repeat until all main questions completed

### AI Integration

**Evaluation Prompt** (`lib/ai/prompts/evaluateAnswer.ts`):
- Scores: 0-10 on score, confidence, clarity, technical_depth
- Provides: strengths, improvements, follow-up recommendation

**Follow-up Prompt** (`lib/ai/prompts/followUp.ts`):
- Conditional based on evaluation
- Max 1 per main question (enforced in code)
- Sounds like real interviewer

## 🔒 Security

- All sensitive credentials in `.env.local` (gitignored)
- NextAuth JWT sessions with signed tokens
- MongoDB connection with connection pooling
- Environment validation on startup

## 🧪 Testing Locally

1. Start dev server: `pnpm dev`
2. Sign in with GitHub
3. Start interview from dashboard
4. Try short answers to trigger follow-ups
5. Check console for evaluation logs

## 📈 Roadmap

- [x] Phase 1: Foundation & Authentication
- [x] Phase 2: Interview Engine
- [x] Phase 3: AI Evaluation & Follow-ups
- [ ] Phase 4: Persistence & Analytics
- [ ] Phase 5: Advanced Features (voice, video)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Follow existing code style
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [NextAuth](https://next-auth.js.org) - Authentication
- [OpenRouter](https://openrouter.ai) - Free AI access
- [Meta](https://ai.meta.com) - Llama models
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons

## 📧 Contact

Created by [@abhijithk-ak](https://github.com/abhijithk-ak)

---

**Star ⭐ this repo if you find it helpful!**
