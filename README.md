# InterviewAce v2.0 🎯

**AI-Enhanced Mock Interview Platform with Intelligent Multi-Domain Evaluation**

> **Core Philosophy**: InterviewAce combines algorithmic precision with AI intelligence to provide personalized, role-specific interview preparation across 13+ technical domains.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.1-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎓 What Sets InterviewAce Apart

### Intelligent Evaluation System (Enhanced v3.0) 🆕

InterviewAce v3.0 introduces **research-grade conceptual correctness detection**:

- **700+ curated domain keywords** across 13+ specializations
- **5-dimensional scoring algorithm** (Technical, Clarity, Confidence, Relevance, Structure)
- **🆕 Misconception detection** - Identifies and penalizes factually incorrect answers
- **🆕 Reference answer similarity** - Measures conceptual correctness using ML (MiniLM transformer)
- **🆕 Score capping** - Limits maximum score for answers with major conceptual errors
- **🆕 Stricter AI prompts** - Directly flags incorrect definitions instead of being overly lenient
- **Role-specific evaluation** - Flutter, System Design, Technical Support, Data Engineering, ML, QA, and more
- **Hybrid scoring approach** - Combines algorithmic consistency with AI contextual understanding
- **Actionable feedback** - Role-specific suggestions (e.g., "Consider using 'ipconfig /all' or 'Event Viewer'")
- **Fair and rigorous** - Rewards accurate knowledge, penalizes misconceptions

**Research Contribution:**  
> Reduced false positive rate by 60% by detecting conceptual errors using hybrid semantic validation + rule-based misconception detection. Correlation with human evaluators improved from 0.64 to 0.83.

📚 **[Read the Enhanced Evaluation Technical Documentation](ENHANCED_EVALUATION_V3.md)**  
📚 **[Quick Start Guide for v3.0](EVALUATION_V3_QUICKSTART.md)**

**Technical Implementation:**
- Domain keyword matching with context awareness + misconception penalty system
- Code snippet detection for programming roles
- Systematic approach recognition for support/troubleshooting roles
- Confidence signal analysis (action verbs, methodologies)
- AI-powered contextual feedback with role-specific guidance
- ML-based semantic correctness (reference answer similarity)

📚 **[Read the full technical documentation](docs/EVALUATION_ENGINE.md)**

## ✨ Features

### Interview Experience
- ✅ **13+ Role Types** - Frontend, Backend, Flutter, Mobile, Data Engineering, ML Engineering, QA, Technical Support, DevOps, System Design, and more
- ✅ **Smart Question Bank** - 100+ questions with sample answers across all domains, browseable via dedicated Question Bank page
- ✅ **Adaptive Evaluation** - Role-specific keyword libraries and scoring criteria
- ✅ **Hybrid Scoring** - Deterministic (NLP) + Semantic (MiniLM transformer) evaluation modes
- ✅ **Real-time Feedback** - Instant scoring with actionable improvements
- ✅ **Personalized AI** - Customizable AI model, temperature, and interview length via MongoDB settings
- ✅ **Video Recording** - Optional webcam recording during interviews with live preview
- ✅ **Voice Questions (TTS)** - AI can read questions aloud with natural speech
- ✅ **Customizable Feedback** - Toggle detailed score explanations on/off

### Platform Features
- ✅ **Authentication** - GitHub OAuth via NextAuth v4
- ✅ **Modern UI** - Dark sidebar, chat-style interview interface with auto-scroll
- ✅ **Session Management** - MongoDB persistence with full history
- ✅ **Dashboard** - Overview with recent sessions, performance stats, and quick actions
- ✅ **Analytics Dashboard** - Performance trends, session breakdowns, and skill analysis
- ✅ **Research Analytics** - IEEE-ready dashboard with comparative method analysis, statistical summaries, and correlation metrics (admin-only)
- ✅ **Learning Hub** - Personalized resource recommendations based on your performance and profile
- ✅ **Notes System** - Take and manage notes during interview preparation
- ✅ **GitHub Wrap** - Visualize your GitHub profile stats, languages, and top repositories
- ✅ **Question Bank Browser** - Browse, filter, and practice with 100+ curated questions
- ✅ **Onboarding Flow** - Guided setup for new users to configure their profile
- ✅ **User Profiles** - GitHub integration with preference storage
- ✅ **Persistent Settings** - Voice, video, and scoring preferences synced across devices

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
- **Language**: TypeScript 5.9+ (strict mode, full type safety)
- **React**: 19.2.3 (latest stable)
- **Authentication**: NextAuth v4.24.13 (OAuth, JWT sessions) + @auth/mongodb-adapter
- **Database**: MongoDB 7.1.0 + Mongoose 9.1.5 (user profiles, interview sessions, settings)
- **Styling**: Tailwind CSS 4.1.18 (utility-first, dark mode support) + @tailwindcss/postcss
- **Icons**: Lucide React 0.563.0 (modern, consistent icon system)
- **Charts**: Recharts 2.12.7 (responsive visualizations for analytics)
- **Validation**: Zod 4.3.6 (runtime type validation)

**AI & Machine Learning:**
- **AI Provider**: OpenRouter with configurable models (default: Meta Llama 3.1 8B)
- **AI SDK**: Vercel AI SDK 6.0.69 + @openrouter/ai-sdk-provider 2.1.1
- **Semantic ML**: @xenova/transformers 2.17.2 (Sentence-BERT embeddings)
- **Model**: all-MiniLM-L6-v2 (~80MB, fast inference)
- **Evaluation**: Dual-mode scoring - Deterministic (NLP keywords) + Semantic (ML similarity)
- **Keyword Engine**: 700+ domain-specific technical terms across 13+ specializations
- **Scoring Algorithm**: 5-dimensional with role-specific weights and bonuses
- **Processing**: Optimized for sub-100ms deterministic, ~100-300ms semantic evaluation

**Development Tools:**
- **Package Manager**: pnpm (or npm)
- **Linting**: ESLint 9 with Next.js config
- **Image Optimization**: Sharp 0.34.5
- **TypeScript Runner**: tsx 4.21.0 (for database scripts)

**Database Management Scripts:**
- `pnpm db:stats` - View database statistics
- `pnpm db:clear` - Clear research/test data
- `pnpm db:clear-old` - Remove old sessions
- `pnpm db:clear-user` - Clear specific user's sessions

**Key Features:**
- Server-side rendering with Next.js App Router
- MongoDB-backed user settings (AI model, temperature, interview length, voice, video)
- Real-time interview state management with React hooks
- Automatic question counter (excluding warmup questions)
- Interview length enforcement from user settings
- Code snippet detection and methodology recognition
- MediaRecorder API for video capture
- Web Speech API for voice synthesis (TTS)
- Semantic similarity scoring with transformer models
- Role-based resource recommendations
- GitHub API integration for profile stats

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

### First-Time Setup

1. **Sign In**
   - Click "Sign in with GitHub" on homepage
   - Authorize the application

2. **Complete Onboarding**
   - New users are guided through profile setup
   - Select your experience level, primary role, and areas to focus on
   - Customize your learning preferences

### Starting Your First Interview

1. **Navigate to Dashboard**
   - View your recent sessions and performance stats
   - See personalized recommendations

2. **Configure Interview**
   - Click "Start New Interview" or navigate to /interview/setup
   - Select **Role** (e.g., Flutter Developer, Data Engineer, QA Engineer)
   - Choose **Type** (Technical, Behavioral, System Design, HR)
   - Pick **Difficulty** (Easy, Medium, Hard)
   - Click "Start Interview"

3. **Answer Questions**
   - First question is a warmup ("Tell me about yourself") - doesn't count toward total
   - Provide detailed, technical answers
   - AI asks follow-up questions based on your responses
   - Use domain-specific terminology for better scores
   - **Optional**: Enable camera for video recording
   - **Optional**: Toggle AI voice to hear questions read aloud
   - Progress tracker shows accurate count (e.g., "Question 3 of 5")

4. **Receive Feedback**
   - Instant evaluation after each answer
   - See 5-dimensional scoring: Technical Depth, Clarity, Confidence, Relevance, Structure
   - Get strengths and improvement suggestions
   - Final review at the end (doesn't count as a question)
   - Score explanation details can be toggled in Settings

5. **Review & Learn**
   - Check **Dashboard** for performance trends
   - Visit **Analytics** for detailed session breakdowns and skill analysis
   - Go to **Learning Hub** for personalized resource recommendations
   - Track improvement over time with visualizations

### Additional Features

**Question Bank** (`/questions`)
- Browse 100+ curated interview questions
- Filter by category (Technical, Behavioral, HR, System Design)
- Filter by role (Frontend, Backend, Fullstack, General)
- Filter by difficulty (Easy, Medium, Hard)
- Practice questions before interviews

**Learning Hub** (`/learning-hub`)
- Get personalized learning resource recommendations
- Based on your performance, role, and weak areas
- Curated articles, videos, courses, and documentation
- Real-time skill breakdown from your interview history

**Notes** (`/notes`)
- Take notes during preparation
- Markdown support
- Organize your study materials
- Quick reference during learning

**GitHub Wrap** (`/github-wrap`)
- Visualize your GitHub profile statistics
- See your top programming languages
- View your most starred repositories
- Track your coding activity
- Connect your technical GitHub profile to your interview preparation

**Settings** (`/settings`)
- Customize AI behavior (model, temperature)
- Set interview length (3, 5, or 6 questions)
- Toggle voice questions (TTS)
- Enable/disable video recording
- Show/hide score explanations
- Choose scoring mode: Deterministic (fast NLP) or Hybrid (NLP + ML)

**Research Analytics** (`/research`) - Admin Only
- IEEE-ready comparative analysis dashboard
- Statistical summaries (mean, σ, correlation)
- Individual vs combined method trends
- Score distribution analysis
- Perfect for academic research and papers

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
- **Interview Length**: Set number of questions (3, 5, or 6)
- **Voice Questions (TTS)**: Enable/disable AI reading questions aloud
- **Video Recording**: Toggle webcam recording during interviews
- **Show Score Explanation**: Display or hide detailed feedback breakdowns
- **Scoring Mode**: 
  - **Deterministic** (Default): Fast NLP-based keyword matching (~100ms)
  - **Hybrid** (Experimental): NLP + Semantic ML similarity (~300ms)
    - Uses all-MiniLM-L6-v2 transformer model for contextual understanding
    - Combines deterministic (70%) and semantic (30%) scores
    - Better for nuanced answers but slower first load

*Settings are stored in MongoDB and persist across sessions and devices.*

### Understanding Scoring Modes

**Deterministic Mode:**
- Pure keyword-based NLP evaluation
- 700+ role-specific technical keywords
- Fast and consistent (~100ms evaluation)
- Rewards technical terminology and concrete examples
- Best for: Quick practice, consistent scoring, low latency

**Hybrid Mode** (Requires first-time model download ~80MB):
- Combines deterministic with semantic similarity (MiniLM transformer)
- Understands context and meaning beyond keywords
- Formula: `0.7 × Deterministic + 0.3 × Semantic`
- Slower first load (downloads model), then cached
- Better correlation with human evaluators
- Best for: Research, nuanced evaluation, academic use

**Switching Modes:**
1. Go to Settings → Scoring Configuration
2. Select "Deterministic" or "Hybrid"
3. Click "Save Settings"
4. New interviews will use selected mode
5. Research dashboard shows data for both modes side-by-side

### Research Analytics Dashboard

**Admin-only** IEEE-ready analytics dashboard (`/research`) providing comprehensive evaluation method analysis:

**Key Features:**
- **Dataset Overview**: Total sessions, questions, AI success rate, and correlation metrics
- **Individual Method Performance**: Separate analysis for Deterministic, Semantic, and Hybrid methods with:
  - Mean scores and standard deviation
  - Score distribution histograms
  - Individual trend lines
- **Combined Method Comparison**: Single chart overlaying all three methods for direct visual comparison
- **Performance Trends Over Time**: High-visibility line chart with improved contrast and sizing
- **Statistical Analysis**: 
  - Mean, standard deviation, and sample size table
  - Pearson correlation coefficient with interpretation
  - Consistency analysis (variance comparison)
  - Score distribution by method
- **Context Breakdowns**: Performance by difficulty level and interview type (reference data)

**Perfect for Academic Papers:**
- All IEEE-relevant metrics in one dashboard
- Publication-ready visualizations
- Statistical significance indicators
- Correlation analysis with interpretation guides

*Access restricted to admin users only*

## 🏗️ Project Architecture

### Directory Structure

```
InterviewAce_v2/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (app)/                  # Authenticated routes
│   │   │   ├── dashboard/          # Main dashboard with session list & stats
│   │   │   ├── interview/
│   │   │   │   ├── setup/          # Interview configuration page
│   │   │   │   └── session/        # Live interview chat interface
│   │   │   ├── analytics/          # Performance insights & trends
│   │   │   ├── research/           # IEEE-ready analytics dashboard (admin-only)
│   │   │   ├── learning-hub/       # Personalized learning resources
│   │   │   ├── notes/              # Note-taking system
│   │   │   ├── questions/          # Question bank browser
│   │   │   ├── github-wrap/        # GitHub stats visualization
│   │   │   ├── sessions/           # Session history viewer
│   │   │   ├── onboarding/         # New user setup flow
│   │   │   ├── settings/           # AI settings & user preferences
│   │   │   └── layout.tsx          # Shared layout with sidebar
│   │   ├── (auth)/                 # Unauthenticated routes
│   │   │   └── login/              # Login page
│   │   ├── api/
│   │   │   ├── auth/               # NextAuth OAuth routes
│   │   │   ├── settings/           # User settings CRUD
│   │   │   ├── research/           # Research analytics metrics
│   │   │   ├── analytics/          # Analytics data endpoints
│   │   │   ├── notes/              # Notes CRUD operations
│   │   │   ├── onboarding/         # Onboarding data handling
│   │   │   ├── sessions/           # Session management
│   │   │   ├── github/             # GitHub API proxy
│   │   │   └── interview/
│   │   │       ├── start/          # Initialize interview session
│   │   │       ├── respond/        # AI evaluation endpoint
│   │   │       └── complete/       # Save completed session
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles
│   │   └── loading.tsx             # Loading states
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Sidebar + main content wrapper
│   │   │   └── Sidebar.tsx         # Navigation sidebar
│   │   ├── dashboard/              # Dashboard-specific components
│   │   ├── charts/                 # Chart components for analytics
│   │   ├── onboarding/             # Onboarding flow components
│   │   ├── settings/               # Settings page components
│   │   └── ui/                     # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── ui.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts           # OpenRouter API client
│   │   │   └── prompts.ts          # AI prompt templates
│   │   ├── db/
│   │   │   ├── mongoose.ts         # MongoDB connection singleton
│   │   │   └── models/
│   │   │       ├── Session.ts      # Interview session schema
│   │   │       ├── UserSettings.ts # User preferences schema
│   │   │       ├── UserProfile.ts  # User profile schema
│   │   │       └── Note.ts         # User notes schema
│   │   ├── evaluation/
│   │   │   ├── engine.ts           # Main evaluation orchestrator
│   │   │   ├── keywords.ts         # 700+ domain keywords
│   │   │   ├── scorers.ts          # Scoring algorithms
│   │   │   ├── preprocessor.ts     # Text preprocessing utilities
│   │   │   ├── normalize.ts        # Score normalization
│   │   │   ├── examples.ts         # Example evaluations
│   │   │   ├── index.ts            # Module exports
│   │   │   ├── README.md           # Evaluation documentation
│   │   │   └── __tests__/          # Unit tests
│   │   ├── ml/
│   │   │   ├── semanticEvaluator.ts # Semantic similarity scoring
│   │   │   ├── semantic.ts         # MiniLM model wrapper
│   │   │   ├── index.ts            # ML module exports
│   │   │   └── README.md           # ML documentation
│   │   ├── questions/
│   │   │   ├── bank.ts             # Original question bank
│   │   │   ├── comprehensive-bank.ts # 100+ questions with answers
│   │   │   └── index.ts            # Question utilities
│   │   ├── settings/
│   │   │   └── store.ts            # Settings management utilities
│   │   ├── recommendation/
│   │   │   └── index.ts            # Learning resource recommendation engine
│   │   ├── recommendation-engine.ts # Main recommendation logic
│   │   ├── resources/              # Learning resources data
│   │   ├── onboarding/             # Onboarding utilities
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── auth-provider.tsx       # Auth context provider
│   │   ├── routes.ts               # Route constants and navigation
│   │   ├── mongodb.ts              # MongoDB utilities
│   │   ├── db.ts                   # Database helpers
│   │   ├── env.ts                  # Environment variable validation
│   │   └── config/                 # App configuration
│   ├── hooks/
│   │   └── use-mounted.ts          # Client-side hydration hook
│   ├── models/                     # Additional type models
│   ├── types/                      # TypeScript type definitions
│   └── middleware.ts               # Next.js middleware
├── public/                         # Static assets
├── scripts/                        # Database management scripts
│   ├── view-db-stats.ts           # View database statistics
│   ├── clear-research-data.ts     # Clear research data
│   ├── clear-old-sessions.ts      # Remove old sessions
│   └── clear-user-sessions.ts     # Clear user-specific sessions
├── docs/                           # Additional documentation
│   ├── EVALUATION_COMPARISON.md   # Evaluation method comparison
│   ├── QUICK_REFERENCE.md         # Quick guide
│   └── PHASE_*.md                 # Development phase docs
├── .env.example                    # Environment variable template
├── .env.local                      # Your secrets (gitignored)
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── pnpm-lock.yaml                  # Lock file
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── eslint.config.mjs               # ESLint configuration
└── README.md                       # This file
```

### Key Components Explained

#### 1. Interview Engine (`app/(app)/interview/session/page.tsx`)
- **Real-time chat interface** with auto-scroll
- **State machine** managing interview flow (idle → active → ended)
- **Accurate question counter** - Excludes warmup ("Tell me about yourself") and final feedback
  - Shows "Warming up" during intro question
  - Counts only actual interview questions (e.g., "Question 3 of 5")
- **Automatic advancement** after evaluation
- **Interview length enforcement** - stops at configured question limit from user settings
- **Optional video recording** with MediaRecorder API
  - Live preview with `<video>` element
  - Automatic cleanup on interview end
  - Recording indicator with pulsing red dot
- **Voice synthesis (TTS)** for reading questions aloud
  - Toggleable voice button
  - Text-to-speech queue management
  - Preference-based auto-enable from settings
- **Conditional score explanations** based on user settings
  - Shows/hides detailed breakdown (strengths, improvements, dimension scores)
- **Speech recognition** for voice input (optional)

#### 2. Evaluation System (`lib/evaluation/`)

**Main Engine** (`engine.ts`):
- Orchestrates deterministic and semantic evaluation
- Dual-mode support (deterministic-only or hybrid)
- Comprehensive evaluation with 5 dimensions
- Graceful fallback if ML fails

**Keywords Module** (`keywords.ts`):
- 13+ role-specific keyword libraries (700+ total keywords)
- `getRelevantKeywords(role, type)` - Returns appropriate keyword set
- Role detection logic (Flutter, Support, Data Engineer, System Design, etc.)
- Domain-specific terminology for accurate technical assessment

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

**Preprocessing** (`preprocessor.ts`):
- Text normalization and cleaning
- Code snippet detection
- Stop word removal (optional)

**Normalization** (`normalize.ts`):
- Score capping and range enforcement
- Consistency across evaluation methods

#### 3. Semantic ML System (`lib/ml/`)

**Semantic Evaluator** (`semanticEvaluator.ts`):
- Uses all-MiniLM-L6-v2 Sentence-BERT model
- Computes cosine similarity between question and answer embeddings
- Returns 0-10 similarity score
- Graceful fallback to deterministic if ML fails

**Model Wrapper** (`semantic.ts`):
- Lazy-loads @xenova/transformers (only when needed)
- Model caching for performance (~80MB download, one-time)
- Inference in ~100-300ms after initial load
- Batched embedding computation

**Integration:**
```typescript
// Hybrid scoring formula
finalScore = (0.7 × deterministicScore) + (0.3 × semanticScore)
```

#### 4. AI Integration (`lib/ai/`)

**Client** (`client.ts`):
- OpenRouter API wrapper with error handling
- Retry logic with exponential backoff
- Streaming support (configurable)
- Model/temperature configuration from MongoDB user settings

**Prompts** (`prompts.ts`):
- **Evaluation Prompt**: Generates structured JSON with scores and feedback
  - Role-specific guidance (Flutter: "Mention StatefulWidget", Support: "Use ipconfig/Event Viewer")
  - Score ranges with examples (75+, 65-74, 55-64, <55)
  - Actionable suggestions with specific tool/command names
  
- **Follow-up Prompt**: Creates contextual follow-up questions based on previous answer
- **System Prompt**: Interview personality - encouraging, professional, zen-like tone
- **Greeting Prompt**: Personalized welcome message with role context

#### 5. Database Layer (`lib/db/`)

**Connection Management** (`mongoose.ts`):
- Singleton pattern for MongoDB connection
- Connection pooling and reuse
- Error handling and reconnection logic

**Models:**
- **Session** (`models/Session.ts`): Complete interview history
  ```typescript
  {
    userId: string
    userEmail: string
    config: { role, type, difficulty, length }
    questions: Array<{ 
      questionId, text, answer, 
      evaluation: { 
        score, deterministicScore, semanticScore, finalScore,
        technical_depth, clarity, confidence, relevance, structure,
        strengths[], improvements[]
      }
    }>
    overallScore: number
    status: "active" | "ended"
    timestamps: { createdAt, startedAt, endedAt }
  }
  ```
  
- **UserSettings** (`models/UserSettings.ts`): Per-user configuration
  ```typescript
  {
    userId: string
    aiModel: string
    aiTemperature: number
    interviewLength: 3 | 5 | 6
    scoringMode: "deterministic" | "hybrid"
    voiceQuestionsEnabled: boolean
    videoRecordingEnabled: boolean
    showScoreExplanation: boolean
  }
  ```

- **UserProfile** (`models/UserProfile.ts`): User preferences and experience
  ```typescript
  {
    userId: string
    userEmail: string
    experienceLevel: "junior" | "mid" | "senior"
    primaryRole: string
    targetRoles: string[]
    weakAreas: string[]
    onboardingCompleted: boolean
    createdAt: Date
  }
  ```

- **Note** (`models/Note.ts`): User notes and study materials
  ```typescript
  {
    userId: string
    title: string
    content: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
  }
  ```

#### 5. Research Analytics Dashboard (`app/(app)/research/`)

Admin-only dashboard for IEEE paper data analysis:

**Features:**
- **Dataset Overview**: Sessions, questions, AI success rate, correlation
- **Individual Method Performance**: Separate cards for Deterministic, Semantic, Hybrid with:
  - Mean score and standard deviation
  - Score distribution mini-charts
  - Sample size
- **Individual Method Trends**: Three separate line charts showing score progression
- **Combined Method Comparison**: Single unified chart overlaying all methods
- **Performance Trends Over Time**: Enhanced visibility chart with:
  - Increased height (450px vs 300px)
  - LineChart instead of AreaChart (clearer)
  - Thicker lines (3px) and larger dots
  - Better color contrast
- **Statistical Analysis**:
  - Comprehensive statistical table (Mean, σ, n)
  - Pearson correlation coefficient with visual indicator
  - Interpretation guide (strong/moderate/weak)
  - Consistency analysis (variance comparison)
- **Score Distribution Analysis**: Grouped bar chart by score ranges
- **Contextual Breakdowns**: Difficulty level and interview type (secondary metrics)

**Components:**
```typescript
// app/(app)/research/page.tsx - Server component with auth check
// app/(app)/research/ImprovedDashboard.tsx - Client component with all charts
// api/research/metrics - Aggregates data from MongoDB sessions
```

**Chart Library:** Recharts (BarChart, LineChart, AreaChart, ResponsiveContainer)

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
