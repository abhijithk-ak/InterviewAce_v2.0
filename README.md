# InterviewAce v2.0 🎯

**AI-Enhanced Mock Interview Platform with Intelligent Multi-Domain Evaluation**

> **Core Philosophy**: InterviewAce combines algorithmic precision with AI intelligence to provide personalized, role-specific interview preparation across 13+ technical domains.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.1-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎓 What Sets InterviewAce Apart

### Intelligent Evaluation System
- **700+ curated domain keywords** across 13+ specializations
- **5-dimensional scoring algorithm** (Technical, Clarity, Confidence, Relevance, Structure)
- **Role-specific evaluation** - Flutter, System Design, Technical Support, Data Engineering, ML, QA, and more
- **Hybrid scoring approach** - Combines algorithmic consistency with AI contextual understanding
- **Actionable feedback** - Role-specific suggestions (e.g., "Consider using 'ipconfig /all' or 'Event Viewer'")
- **Fair and encouraging** - Reward-based scoring that recognizes incremental knowledge

**Technical Implementation:**
- Domain keyword matching with context awareness
- Code snippet detection for programming roles
- Systematic approach recognition for support/troubleshooting roles
- Confidence signal analysis (action verbs, methodologies)
- AI-powered contextual feedback with role-specific guidance

📚 **[Read the full technical documentation](docs/EVALUATION_ENGINE.md)**

## ✨ Features

### Interview Experience
- ✅ **13+ Role Types** - Frontend, Backend, Flutter, Mobile, Data Engineering, ML Engineering, QA, Technical Support, DevOps, System Design, and more
- ✅ **Smart Question Bank** - 100+ questions with sample answers across all domains
- ✅ **Adaptive Evaluation** - Role-specific keyword libraries and scoring criteria
- ✅ **Real-time Feedback** - Instant scoring with actionable improvements
- ✅ **Personalized AI** - Customizable AI model, temperature, and interview length via MongoDB settings

### Platform Features
- ✅ **Authentication** - GitHub OAuth via NextAuth v4
- ✅ **Modern UI** - Dark sidebar, chat-style interview interface with auto-scroll
- ✅ **Session Management** - MongoDB persistence with full history
- ✅ **Analytics Dashboard** - Performance trends and detailed session breakdowns
- ✅ **User Profiles** - GitHub integration with preference storage

### Evaluation Domains

**Mobile Development:**
- **Flutter** (80+ keywords): StatefulWidget, Provider, BLoC, hot reload, Future, Stream, Navigator
- **Mobile** (60+ keywords): React Native, Swift, Kotlin, push notifications, offline sync

**Backend Development:**
- **Backend Java** (50+ keywords): Spring Boot, JPA, Hibernate, microservices, Kafka
- **Backend General** (50+ keywords): Node.js, Express, PostgreSQL, Redis, API design

**Data & ML:**
- **Data Engineering** (60+ keywords): Spark, Airflow, ETL, Kafka, data pipeline
- **ML Engineering** (70+ keywords): TensorFlow, PyTorch, model training, feature engineering
- **Data Science** (40+ keywords): pandas, scikit-learn, statistical analysis

**Quality & Operations:**
- **QA/Testing** (60+ keywords): Selenium, Cypress, unit test, automation, JMeter
- **Technical Support** (100+ keywords): troubleshooting, Event Viewer, ping, ipconfig, Active Directory
- **DevOps** (40+ keywords): Kubernetes, Docker, CI/CD, Terraform, monitoring

**Architecture & Frontend:**
- **System Design** (100+ keywords): scalability, microservices, load balancer, caching, Kafka
- **Frontend** (50+ keywords): React, hooks, virtual DOM, state management, performance

## 🚀 Tech Stack

**Core Framework:**
- **Framework**: Next.js 16.1.6 (App Router, React Server Components, Turbopack)
- **Language**: TypeScript 5.9.3 (strict mode, full type safety)
- **Authentication**: NextAuth v4.24.13 (OAuth, JWT sessions)
- **Database**: MongoDB 7.1.0 + Mongoose 9.1.5 (user profiles, interview sessions, settings)
- **Styling**: Tailwind CSS 4.1.18 (utility-first, dark mode support)
- **Icons**: Lucide React 0.563.0 (modern, consistent icon system)

**AI & Evaluation:**
- **AI Provider**: OpenRouter with configurable models (default: Meta Llama 3.1 8B)
- **Evaluation**: Hybrid approach - algorithmic scoring + AI feedback enhancement
- **Keyword Engine**: 700+ domain-specific technical terms across 13+ specializations
- **Scoring Algorithm**: 5-dimensional with role-specific weights and bonuses
- **Processing**: Optimized for sub-100ms evaluation

**Key Features:**
- Server-side rendering with Next.js App Router
- MongoDB-backed user settings (AI model, temperature, interview length)
- Real-time interview state management
- Automatic question counter and interview length enforcement
- Code snippet detection and methodology recognition

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ and **pnpm** (or npm)
- **MongoDB Atlas** account (free M0 tier sufficient)
- **GitHub OAuth App** (for authentication)
- **OpenRouter API key** (free tier available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/InterviewAce_v2.git
   cd InterviewAce_v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth (https://github.com/settings/developers)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # MongoDB (https://cloud.mongodb.com)
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/interviewace

   # OpenRouter AI (https://openrouter.ai/keys)
   OPENROUTER_API_KEY=your-openrouter-api-key
   OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
   ```

4. **Get your API keys**
   
   - **GitHub OAuth**: 
     - Go to https://github.com/settings/developers
     - New OAuth App → Set callback URL to `http://localhost:3000/api/auth/callback/github`
   
   - **MongoDB**: 
     - Create free cluster at https://cloud.mongodb.com
     - Get connection string, copy to `MONGODB_URI`
   
   - **OpenRouter**: 
     - Sign up at https://openrouter.ai
     - Copy key from https://openrouter.ai/keys
     - Free models available (Llama 3.2 3B, Llama 3.1 8B)
   
   - **NextAuth Secret**: 
     ```bash
     openssl rand -base64 32
     ```

5. **Run development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

6. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## 🎯 Usage Guide

### Starting Your First Interview

1. **Sign In**
   - Click "Sign in with GitHub" on homepage
   - Authorize the application

2. **Configure Interview**
   - Navigate to Dashboard → "Start New Interview"
   - Select **Role** (e.g., Flutter Developer, Data Engineer, QA Engineer)
   - Choose **Type** (Technical, Behavioral, System Design, HR)
   - Pick **Difficulty** (Easy, Medium, Hard)
   - Click "Start Interview"

3. **Answer Questions**
   - Provide detailed, technical answers
   - AI asks follow-up questions based on your responses
   - Use domain-specific terminology for better scores

4. **Receive Feedback**
   - Instant evaluation with 5-dimensional scoring
   - See Technical Depth, Clarity, Confidence, Relevance, Structure scores
   - Get actionable improvement suggestions

5. **Review Analytics**
   - Check Dashboard for performance trends
   - View detailed session breakdowns
   - Track improvement over time

### Interview Types & When to Use Them

| Type | Purpose | Example Questions | Best For |
|------|---------|-------------------|----------|
| **Technical** | Assess coding & problem-solving | "Explain StatefulWidget lifecycle" | Developers, Engineers |
| **Behavioral** | Evaluate soft skills & experience | "Describe a challenging bug you fixed" | All roles |
| **System Design** | Test architecture knowledge | "Design a URL shortening service" | Senior engineers |
| **HR** | Culture fit & background | "Tell me about yourself" | Initial screening |

### Supported Roles & Keywords

**Mobile Development:**
- **Flutter Developer**: StatefulWidget, Provider, BLoC, Navigator, hot reload, Future, Stream
- **Mobile Developer**: React Native, Swift, Kotlin, push notifications, platform channels

**Backend Development:**
- **Backend Java Developer**: Spring Boot, JPA, Hibernate, microservices, Kafka, Maven
- **Backend Developer**: Node.js, Express, PostgreSQL, Redis, REST API, authentication

**Data & ML:**
- **Data Engineer**: Spark, Airflow, ETL pipeline, Kafka, BigQuery, data lake
- **ML Engineer**: TensorFlow, PyTorch, model training, hyperparameter tuning, deployment
- **Data Scientist**: pandas, scikit-learn, statistical analysis, feature engineering

**Quality & Support:**
- **QA Engineer**: Selenium, Cypress, unit testing, test automation, JMeter
- **Technical Support Engineer**: Event Viewer, ipconfig, troubleshooting, Active Directory, DHCP

**DevOps & Architecture:**
- **DevOps Engineer**: Kubernetes, Docker, CI/CD, Terraform, Prometheus
- **System Design**: Scalability, load balancer, microservices, caching, distributed systems

**Frontend:**
- **Frontend Developer**: React, hooks, virtual DOM, state management, performance optimization

### Customizing AI Settings

Navigate to **Settings** page to customize:
- **AI Model**: Choose from various models (Llama 3.1 8B, Llama 3.2 3B, etc.)
- **Temperature**: Adjust creativity (0.0 = focused, 1.0 = creative)
- **Interview Length**: Set number of questions (3-10)
- **User Profile**: Experience level, areas to focus on (coming soon)

*Settings are stored in MongoDB and persist across sessions.*

## 🏗️ Project Architecture

### Directory Structure

```
InterviewAce_v2/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (app)/                  # Authenticated routes
│   │   │   ├── dashboard/          # Main dashboard with session list
│   │   │   ├── interview/
│   │   │   │   ├── setup/          # Interview configuration page
│   │   │   │   └── session/        # Live interview chat interface
│   │   │   ├── analytics/          # Performance insights & trends
│   │   │   ├── settings/           # AI settings & user preferences
│   │   │   └── layout.tsx          # Shared layout with sidebar
│   │   ├── api/
│   │   │   ├── auth/               # NextAuth OAuth routes
│   │   │   ├── settings/           # User settings CRUD
│   │   │   └── interview/
│   │   │       ├── start/          # Initialize interview session
│   │   │       ├── respond/        # AI evaluation endpoint
│   │   │       └── sessions/       # Session management
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Sidebar + main content wrapper
│   │   │   └── Sidebar.tsx         # Navigation sidebar
│   │   └── ui/                     # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts           # OpenRouter API client
│   │   │   └── prompts.ts          # AI prompt templates
│   │   ├── db/
│   │   │   ├── mongoose.ts         # MongoDB connection
│   │   │   └── models/
│   │   │       ├── Session.ts      # Interview session schema
│   │   │       ├── UserSettings.ts # User preferences schema
│   │   │       └── UserProfile.ts  # User profile schema
│   │   ├── evaluation/
│   │   │   ├── keywords.ts         # 700+ domain keywords
│   │   │   └── scorers.ts          # Scoring algorithms
│   │   ├── questions/
│   │   │   ├── bank.ts             # Original question bank
│   │   │   └── comprehensive-bank.ts # 100+ questions with sample answers
│   │   ├── auth.ts                 # NextAuth configuration
│   │   └── routes.ts               # Route constants
│   └── hooks/
│       └── use-mounted.ts          # Client-side hydration hook
├── public/                         # Static assets
├── scripts/                        # Database management scripts
├── docs/                           # Additional documentation
├── .env.example                    # Environment variable template
├── .env.local                      # Your secrets (gitignored)
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

### Key Components Explained

#### 1. Interview Engine (`app/(app)/interview/session/page.tsx`)
- **Real-time chat interface** with auto-scroll
- **State machine** managing interview flow
- **Question counter** showing progress (e.g., "Question 3 of 5")
- **Automatic advancement** after evaluation
- **Interview length enforcement** - stops at configured question limit

#### 2. Evaluation System (`lib/evaluation/`)

**Keywords Module** (`keywords.ts`):
- 13+ role-specific keyword libraries
- `getRelevantKeywords(role, type)` - Returns appropriate keyword set
- Role detection logic (Flutter, Support, Data Engineer, etc.)

**Scoring Module** (`scorers.ts`):
- **Technical Score**: Keyword matching + code detection + diversity bonuses
  ```typescript
  Base score: 30 points (any technical knowledge)
  + 5 points per keyword (up to 50 points)
  + 10 points for 3+ diverse keywords
  + 10 points for 5+ diverse keywords
  + 10 points for code/command snippets
  = Max 95-100 points
  ```
- **Clarity Score**: Readability analysis (word length, sentence complexity)
- **Confidence Score**: Action verbs, systematic approach indicators
- **Relevance Score**: Answer-question similarity
- **Structure Score**: Logical organization, transitions

#### 3. AI Integration (`lib/ai/`)

**Client** (`client.ts`):
- OpenRouter API wrapper
- Error handling with retries
- Streaming support (disabled for structured output)
- Model/temperature configuration from MongoDB

**Prompts** (`prompts.ts`):
- **Evaluation Prompt**: Generates structured JSON with scores and feedback
  - Role-specific guidance (Flutter, System Design, Technical Support)
  - Score ranges with examples (75+, 65-74, 55-64, <55)
  - Actionable suggestions ("Consider using X", "Add specific command Y")
  
- **Follow-up Prompt**: Creates contextual follow-up questions
- **System Prompt**: Interview personality and tone

#### 4. Database Layer (`lib/db/`)

**Models:**
- **Session**: Stores complete interview history
  ```typescript
  {
    userId: string
    config: { role, type, difficulty, length }
    questions: Array<{ questionId, text, answer, evaluation }>
    overallScore: number
    status: "active" | "ended"
    timestamps: { createdAt, endedAt }
  }
  ```
  
- **UserSettings**: Per-user AI configuration
  ```typescript
  {
    userId: string
    aiModel: string
    temperature: number
    maxQuestionsPerSession: number
  }
  ```

- **UserProfile**: User preferences and experience
  ```typescript
  {
    userId: string
    experienceLevel: "junior" | "mid" | "senior"
    primaryRole: string
    areasToFocus: string[]
  }
  ```

### Interview Flow Diagram

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │ Click "Start Interview"
       v
┌─────────────┐
│    Setup    │ ← Select role, type, difficulty
└──────┬──────┘
       │ Submit configuration
       v
┌─────────────────────────────────────────────┐
│           POST /api/interview/start         │
│  • Create Session in MongoDB                │
│  • Fetch UserSettings (AI model, temp)      │
│  • Select questions from bank               │
│  • Return session ID                        │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│         Interview Session (Chat UI)         │
│  1. Display first question                  │
│  2. User types answer                       │
│  3. Send to /api/interview/respond          │
│  4. AI evaluates (algorithmic + AI)         │
│  5. Return score + feedback                 │
│  6. Display results                         │
│  7. Auto-advance to next question           │
│  8. Repeat until maxQuestions reached       │
│  9. Show "Interview Complete" message       │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────┐
│  Analytics  │ ← View performance, trends
└─────────────┘
```

### Scoring Algorithm Details

**Technical Depth Scoring (Role-Specific)**

Example for **Technical Support Engineer**:
```typescript
// Answer: "I'd check ipconfig, ping the gateway, and review Event Viewer logs"

Step 1: Keyword Matching
- Matched: ["ipconfig", "ping", "gateway", "event viewer"] = 4 keywords
- Base score: 30

Step 2: Keyword Points
- 4 keywords × 5 points = 20 points
- Running total: 30 + 20 = 50

Step 3: Diversity Bonus
- 4 unique keywords ≥ 3 → +10 bonus
- Running total: 50 + 10 = 60

Step 4: Code/Command Detection
- Contains commands → +10 bonus
- Running total: 60 + 10 = 70

Final Technical Score: 70/100 → 7.0/10
```

**Confidence Scoring**

Detects:
- Action verbs: "I implemented", "I diagnosed", "I resolved"
- Systematic approaches: "First, then, finally"
- Specific tools: "using Event Viewer", "via RDP"
- Methodologies: "step by step", "systematically"

**AI Feedback Enhancement**

Based on technical score, AI provides:
- **75+**: "Excellent! Great depth. Consider XYZ for extra polish."
- **65-74**: "Strong answer. To improve, add specific examples like ABC."
- **55-64**: "Good foundation. Expand on technical details - mention tools like XYZ."
- **<55**: "Needs more depth. Include specific tools, commands, and systematic approaches."

## 🔒 Security & Best Practices

### Environment Security
- **All secrets in `.env.local`** - Never commit this file
- **`.gitignore` pre-configured** - Excludes sensitive files automatically
- **Environment validation** - App checks for required vars on startup

### Authentication
- **NextAuth v4** - Industry-standard OAuth implementation
- **JWT sessions** - Secure, signed tokens
- **GitHub OAuth** - No password management required
- **Session encryption** - `NEXTAUTH_SECRET` secures all session data

### Database Security
- **MongoDB connection pooling** - Prevents connection exhaustion
- **Connection string encryption** - Environment variable only
- **User-scoped data** - All queries filtered by `userId`
- **Input validation** - Mongoose schemas enforce data integrity

### API Security
- **Server-side validation** - Never trust client input
- **Rate limiting** - Prevents abuse (planned)
- **Error handling** - No sensitive data in error messages
- **CORS configuration** - Controlled origin access

## 🧪 Development & Testing

### Local Development

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Testing Checklist

**Before Committing:**
- [ ] All TypeScript errors resolved (`pnpm type-check`)
- [ ] ESLint warnings fixed (`pnpm lint`)
- [ ] Tested interview flow end-to-end
- [ ] Verified scoring works for your role
- [ ] Checked console for errors

**Interview Testing:**
1. Sign in with GitHub
2. Navigate to Setup page
3. Select different roles (Flutter, Support, Data Engineer, etc.)
4. Provide technical answers with domain keywords
5. Verify scoring is fair (not too harsh)
6. Check feedback is actionable
7. Confirm question counter accurate
8. Ensure interview stops at configured length

**Scoring Verification:**

Test with **Technical Support** interview:
```
Q: "How do you troubleshoot network connectivity?"
A: "I use a systematic approach: First ping localhost to test TCP/IP. 
    Then ping gateway using ipconfig. Run ipconfig /flushdns to clear DNS cache. 
    Check Event Viewer for network errors. Verify firewall settings."

Expected: Technical 7-8/10 (keywords: ping, ipconfig, TCP/IP, DNS, Event Viewer, firewall)
```

### Database Management Scripts

```bash
# Clear all interview sessions
pnpm db:clear

# Seed sample data (coming soon)
pnpm db:seed

# View database stats
pnpm db:stats
```

### Adding New Roles

1. **Add keywords** to `src/lib/evaluation/keywords.ts`:
   ```typescript
   "your-role": [
     "keyword1", "keyword2", "framework", "tool", ...
   ]
   ```

2. **Update role detection** in same file:
   ```typescript
   else if (roleLower.includes('your-role-name')) {
     roleKeywords = DOMAIN_KEYWORDS['your-role']
   }
   ```

3. **Add AI guidance** to `src/lib/ai/prompts.ts`:
   ```typescript
   else if (data.config.type === 'Technical' && role.includes('your-role')) {
     scoringGuidance = `
       TECHNICAL DEPTH SCORING:
       ✅ HIGH SCORE (7-10/10) when answer includes:
         - Tool1, Tool2, Framework
       ...
     `
   }
   ```

4. **Add questions** to `src/lib/questions/comprehensive-bank.ts`:
   ```typescript
   {
     id: "your-role-easy-1",
     category: "technical",
     role: "your-role",
     difficulty: "easy",
     text: "Your question here?",
     sampleAnswer: "Sample answer demonstrating expected depth"
   }
   ```

### Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXTAUTH_SECRET` | Encrypts JWT sessions | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | OAuth callback base URL | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID | `Iv1.a1b2c3d4e5f6g7h8` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | `abc123...` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | Default AI model | `meta-llama/llama-3.1-8b-instruct:free` |

## 📈 Roadmap & Future Enhancements

### ✅ Completed Features
- [x] GitHub OAuth authentication
- [x] MongoDB session persistence
- [x] 13+ role-specific keyword libraries (700+ keywords)
- [x] Hybrid evaluation (algorithmic + AI)
- [x] Real-time interview interface
- [x] User settings (AI model, temperature, length)
- [x] Question bank with sample answers
- [x] Analytics dashboard
- [x] Role-specific AI feedback
- [x] Code snippet detection
- [x] Systematic approach recognition
- [x] Question counter and interview length enforcement

### 🚧 In Progress
- [ ] UserProfile integration (experience level, focus areas)
- [ ] Research Dashboard 2.0
- [ ] Performance optimization (caching, lazy loading)

### 🔮 Planned Features

**Phase 5: Advanced Analytics**
- [ ] Performance trend graphs (weekly, monthly)
- [ ] Skill gap analysis
- [ ] Personalized recommendations
- [ ] Comparison with average scores
- [ ] Export session reports (PDF)

**Phase 6: Enhanced Experience**
- [ ] Voice interview mode (speech-to-text)
- [ ] Video interview practice
- [ ] Screen sharing simulation (system design)
- [ ] Whiteboard feature (draw architectures)
- [ ] Timer mode (timed technical challenges)

**Phase 7: Social & Collaboration**
- [ ] Share anonymized session results
- [ ] Community question contributions
- [ ] Peer review system
- [ ] Mock interview with real reviewers
- [ ] Leaderboards (optional, privacy-first)

**Phase 8: AI Improvements**
- [ ] Multi-model ensemble scoring
- [ ] Custom AI fine-tuning per role
- [ ] Real-time answer suggestions
- [ ] Automated code execution for coding questions
- [ ] Plagiarism detection

**Phase 9: Platform Expansion**
- [ ] Mobile app (React Native)
- [ ] Browser extension (quick practice)
- [ ] Slack/Discord bot integration
- [ ] API for third-party integrations
- [ ] White-label solution for companies

### 📊 Metrics & Goals
- **Current**: 100+ questions across 13+ roles
- **Goal**: 500+ questions, 20+ roles by Q2 2026
- **Current**: Hybrid scoring (algorithmic + AI)
- **Goal**: 95%+ satisfaction with fairness

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Ways to Contribute
1. **Add questions** to question bank (with sample answers)
2. **Add roles** with keyword libraries
3. **Improve scoring** algorithms
4. **Fix bugs** or improve performance
5. **Write documentation** or tutorials
6. **Report issues** with detailed steps to reproduce

### Contribution Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/InterviewAce_v2.git
   cd InterviewAce_v2
   git remote add upstream https://github.com/original/InterviewAce_v2.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types
   - Comment complex logic
   - Test thoroughly

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: Add Data Analyst role with 50+ keywords"
   git commit -m "fix: Correct technical scoring for short answers"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open PR on GitHub with:
   - Clear description of changes
   - Screenshots if UI changes
   - Test results
   - Link to related issue

### Code Style Guidelines
- **TypeScript**: Strict mode, explicit types
- **Formatting**: Prettier default config
- **Naming**: camelCase for vars, PascalCase for components
- **Comments**: JSDoc for functions, inline for complex logic
- **Commits**: Conventional commits (feat, fix, docs, refactor, test)

### Question Contribution Guidelines

When adding questions to `comprehensive-bank.ts`:

```typescript
{
  id: "role-difficulty-number",  // e.g., "flutter-medium-4"
  category: "technical",          // technical | behavioral | system-design | hr
  role: "flutter",                // Match DOMAIN_KEYWORDS key
  difficulty: "medium",           // easy | medium | hard
  text: "Your question here?",
  sampleAnswer: `
    Comprehensive sample answer that:
    - Uses 5-7 domain keywords
    - Shows expected structure (bullet points, numbered steps)
    - Demonstrates appropriate depth for difficulty level
    - Includes specific examples or commands
    - Mentions tools/frameworks where relevant
  `
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Use with attribution

## 🙏 Acknowledgments

### Technologies
- [Next.js](https://nextjs.org) - React framework for production
- [NextAuth](https://next-auth.js.org) - Authentication for Next.js
- [OpenRouter](https://openrouter.ai) - Unified AI API access
- [Meta AI](https://ai.meta.com) - Llama open-source models
- [MongoDB](https://www.mongodb.com) - NoSQL database
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Lucide](https://lucide.dev) - Beautiful icon library
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript

### Inspiration
- **LeetCode** - Technical interview practice platform
- **Pramp** - Peer mock interviewing
- **Interviewing.io** - Anonymous technical interviews
- **ByteByByte** - Interview preparation resources

### Community
Special thanks to all contributors who helped improve InterviewAce!

## 📧 Contact & Support

- **Author**: [@abhijithk-ak](https://github.com/abhijithk-ak)
- **Issues**: [GitHub Issues](https://github.com/abhijithk-ak/InterviewAce_v2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abhijithk-ak/InterviewAce_v2/discussions)
- **Email**: your.email@example.com

## 📚 Additional Resources

- **[Evaluation Engine Documentation](docs/EVALUATION_ENGINE.md)** - Deep dive into scoring algorithms
- **[API Documentation](docs/API.md)** - API endpoints and usage
- **[Database Schema](docs/DATABASE.md)** - MongoDB collections and indexes
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Vercel, AWS, or self-host

---

**⭐ Star this repo if you find it helpful!**

**🐛 Found a bug? [Open an issue](https://github.com/abhijithk-ak/InterviewAce_v2/issues/new)**

**💡 Have an idea? [Start a discussion](https://github.com/abhijithk-ak/InterviewAce_v2/discussions/new)**
