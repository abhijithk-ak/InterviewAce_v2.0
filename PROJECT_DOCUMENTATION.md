# InterviewAce v2.0 - Complete Project Documentation

**Last Updated:** March 11, 2026  
**Version:** 2.0  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Core Features](#core-features)
5. [Evaluation System](#evaluation-system)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Deployment](#deployment)
9. [Recent Improvements](#recent-improvements)
10. [Testing Guide](#testing-guide)

---

## 📖 Project Overview

### What is InterviewAce?

InterviewAce is an AI-enhanced mock interview platform designed to help developers prepare for technical interviews across 13+ specialized roles. It combines algorithmic precision with AI intelligence to provide fair, personalized, and actionable feedback.

### Core Philosophy

**Hybrid Evaluation Approach:**
- **Algorithmic Scoring**: Deterministic, fast, role-specific keyword matching
- **AI Enhancement**: Contextual feedback, natural follow-up questions
- **Fair & Encouraging**: Reward-based scoring that recognizes incremental knowledge
- **Privacy-First**: All data belongs to the user, stored securely in MongoDB

### Key Differentiators

1. **13+ Specialized Roles**: Not just generic coding questions
   - Mobile (Flutter, React Native, iOS, Android)
   - Backend (Java Spring, Node.js, Python)
   - Data (Engineer, Scientist, ML Engineer)
   - QA, DevOps, Technical Support, System Design

2. **700+ Domain Keywords**: Role-specific technical term libraries
   - Flutter: StatefulWidget, Provider, BLoC, Navigator, etc.
   - Support: Event Viewer, ipconfig, Active Directory, etc.
   - Data Engineering: Spark, Airflow, Kafka, ETL, etc.

3. **Intelligent Scoring**: 5-dimensional evaluation
   - Technical Depth (25%): Domain expertise
   - Clarity (20%): Communication skills
   - Confidence (15%): Conviction and experience
   - Relevance (30%): Answer-question alignment
   - Structure (10%): Logical organization

4. **Actionable Feedback**: Role-specific suggestions
   - "Consider using 'ipconfig /all' to check IP configuration"
   - "Add systematic approach: First X, Then Y, Finally Z"
   - "Mention specific tools like Event Viewer or Task Manager"

---

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router, React Server Components)
- **Language**: TypeScript 5.9.3 (strict mode, full type safety)
- **Styling**: Tailwind CSS 4.1.18 (dark mode, utility-first)
- **Icons**: Lucide React 0.563.0
- **State Management**: React useState, Context API
- **Real-time**: Server-side evaluation with client updates

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes (serverless functions)
- **Database**: MongoDB 7.1.0 + Mongoose 9.1.5
- **Authentication**: NextAuth v4.24.13 (OAuth, JWT)
- **AI Integration**: OpenRouter API (multiple models)

### DevOps
- **Package Manager**: pnpm (fast, efficient)
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions (optional)
- **Deployment**: Vercel (recommended) or self-hosted
- **Monitoring**: Built-in Next.js analytics

### AI Models (via OpenRouter)
- **Default**: Meta Llama 3.1 8B Instruct (free)
- **Alternative**: Llama 3.2 3B, GPT-4o-mini, Claude 3.5 Haiku
- **Customizable**: Users can select model and temperature

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  - Next.js Frontend (React)                              │
│  - Tailwind CSS UI                                       │
│  - Interview Chat Interface                              │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTPS
                    v
┌─────────────────────────────────────────────────────────┐
│              Next.js Application Server                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │          API Routes (Serverless)                 │    │
│  │  - /api/auth/*        (NextAuth)                 │    │
│  │  - /api/interview/*   (Start, Respond)           │    │
│  │  - /api/settings/*    (User Preferences)         │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │        Evaluation Engine (Hybrid)                │    │
│  │  - Keywords Library (700+ terms)                 │    │
│  │  - Scoring Algorithms (5 dimensions)             │    │
│  │  - Code Snippet Detection                        │    │
│  └─────────────────────────────────────────────────┘    │
└───────┬─────────────────────────┬───────────────────────┘
        │                         │
        v                         v
┌───────────────────┐   ┌──────────────────────┐
│  MongoDB Atlas    │   │  OpenRouter API       │
│  - User Sessions  │   │  - Llama 3.1 8B       │
│  - Settings       │   │  - Other models       │
│  - Profiles       │   │  - Evaluation         │
└───────────────────┘   └──────────────────────┘
```

### Directory Structure (Detailed)

```
InterviewAce_v2/
│
├── src/                                  # Source code
│   ├── app/                              # Next.js App Router
│   │   ├── (app)/                        # Authenticated routes (layout wrapper)
│   │   │   ├── dashboard/                # User dashboard
│   │   │   │   └── page.tsx              # Session list, stats
│   │   │   ├── interview/
│   │   │   │   ├── setup/                # Interview configuration
│   │   │   │   │   └── page.tsx          # Role, type, difficulty selection
│   │   │   │   └── session/              # Live interview
│   │   │   │       └── page.tsx          # Chat interface, real-time scoring
│   │   │   ├── analytics/                # Performance insights
│   │   │   │   └── page.tsx              # Charts, trends, breakdowns
│   │   │   ├── settings/                 # User preferences
│   │   │   │   └── page.tsx              # AI model, temperature, length
│   │   │   ├── sessions/[id]/            # Session detail view
│   │   │   │   └── page.tsx              # Detailed Q&A review
│   │   │   └── layout.tsx                # Sidebar + main content
│   │   ├── (auth)/                       # Public routes
│   │   │   └── login/                    # Sign-in page
│   │   ├── api/                          # API routes
│   │   │   ├── auth/[...nextauth]/       # NextAuth OAuth
│   │   │   ├── settings/
│   │   │   │   └── route.ts              # GET/PUT user settings
│   │   │   └── interview/
│   │   │       ├── start/route.ts        # POST - Initialize session
│   │   │       ├── respond/route.ts      # POST - Evaluate answer
│   │   │       └── sessions/
│   │   │           ├── route.ts          # GET - List sessions
│   │   │           └── [id]/route.ts     # GET - Session details
│   │   ├── layout.tsx                    # Root layout, providers
│   │   └── page.tsx                      # Landing page
│   │
│   ├── components/                       # React components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx             # Main app layout wrapper
│   │   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   │   └── PageTransition.tsx        # Page animations
│   │   ├── charts/                       # Data visualization
│   │   │   ├── ScoreTrendChart.tsx       # Performance over time
│   │   │   ├── SkillBreakdownChart.tsx   # 5D score radar
│   │   │   └── ...
│   │   └── ui/                           # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── ...
│   │
│   ├── lib/                              # Library code
│   │   ├── ai/
│   │   │   ├── client.ts                 # OpenRouter API client
│   │   │   └── prompts.ts                # AI prompt templates
│   │   │       - Evaluation prompts (role-specific)
│   │   │       - Follow-up generation
│   │   │       - Scoring guidance
│   │   ├── db/
│   │   │   ├── mongoose.ts               # MongoDB connection
│   │   │   └── models/
│   │   │       ├── Session.ts            # Interview session schema
│   │   │       ├── UserSettings.ts       # User preferences
│   │   │       └── UserProfile.ts        # User profile
│   │   ├── evaluation/
│   │   │   ├── keywords.ts               # 700+ domain keywords
│   │   │   │   - 13+ role categories
│   │   │   │   - getRelevantKeywords()
│   │   │   └── scorers.ts                # Scoring algorithms
│   │   │       - technicalScore()
│   │   │       - clarityScore()
│   │   │       - confidenceScore()
│   │   │       - relevanceScore()
│   │   │       - structureScore()
│   │   ├── questions/
│   │   │   ├── bank.ts                   # Original question bank
│   │   │   └── comprehensive-bank.ts     # 100+ questions + answers
│   │   │       - All 13+ roles covered
│   │   │       - Sample answers included
│   │   │       - selectComprehensiveQuestions()
│   │   ├── auth.ts                       # NextAuth configuration
│   │   └── routes.ts                     # Route constants
│   │
│   └── hooks/                            # React hooks
│       └── use-mounted.ts                # Client-side hydration
│
├── public/                               # Static assets
├── scripts/                              # Database scripts
│   ├── clear-research-data.ts
│   └── ...
├── docs/                                 # Documentation
├── .env.example                          # Environment template
├── .env.local                            # Secrets (gitignored)
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── tailwind.config.ts                    # Tailwind config
└── README.md                             # Main documentation
```

---

## ✨ Core Features

### 1. Authentication & User Management
- **GitHub OAuth**: Secure, passwordless sign-in
- **Session Management**: JWT tokens with NextAuth
- **User Profiles**: GitHub data integration
- **Persistent Settings**: MongoDB-stored preferences

### 2. Interview Configuration
- **Role Selection**: 13+ specialized roles
  - Flutter Developer
  - Mobile Developer (React Native, iOS, Android)
  - Backend Java Developer
  - Backend Developer (Node.js, Python)
  - Data Engineer
  - ML Engineer
  - Data Scientist
  - QA Engineer
  - Technical Support Engineer
  - DevOps Engineer
  - System Design Specialist
  - Frontend Developer
  - Fullstack Developer

- **Interview Types**: 4 categories
  - Technical (coding, problem-solving)
  - Behavioral (soft skills, experience)
  - System Design (architecture)
  - HR (culture fit, background)

- **Difficulty Levels**: 3 tiers
  - Easy (entry-level)
  - Medium (mid-level)
  - Hard (senior-level)

- **Interview Length**: Configurable (3-10 questions)

### 3. Real-time Interview Interface
- **Chat-style UI**: Natural conversation flow
- **Auto-scroll**: Automatic scroll to latest message
- **Thinking Indicators**: Shows when AI is processing
- **Question Counter**: Progress tracking (e.g., "Question 3 of 5")
- **Interview Length Enforcement**: Stops at configured limit
- **Instant Feedback**: Real-time evaluation results

### 4. Intelligent Evaluation

**5-Dimensional Scoring:**

1. **Technical Depth (25%)**
   - Domain keyword matching (700+ terms)
   - Code snippet detection
   - Diversity bonuses (breadth of knowledge)
   - Role-specific criteria

2. **Clarity (20%)**
   - Word complexity analysis
   - Sentence structure
   - Readability metrics

3. **Confidence (15%)**
   - Action verb detection
   - Systematic approach indicators
   - Specific tool/command mentions

4. **Relevance (30%)**
   - Answer-question alignment
   - Keyword overlap
   - Contextual fit

5. **Structure (10%)**
   - Logical organization
   - Transition words
   - Coherent flow

**Overall Score Calculation:**
```typescript
overallScore = (
  technicalScore * 0.25 +
  clarityScore * 0.20 +
  confidenceScore * 0.15 +
  relevanceScore * 0.30 +
  structureScore * 0.10
) * 10  // Convert to 0-100 scale
```

### 5. AI-Powered Feedback
- **Role-Specific Guidance**: Tailored to interview role
  - Flutter: "Add Provider or BLoC for state management"
  - Support: "Mention Event Viewer or ipconfig commands"
  - System Design: "Consider load balancer and caching strategy"

- **Actionable Suggestions**: Specific improvements
  - Not: "Add more technical depth"
  - But: "Consider mentioning 'ipconfig /all' or 'Event Viewer'"

- **Score-Based Feedback**:
  - 75+: Excellent depth, minor polish suggestions
  - 65-74: Strong answer, add specific examples
  - 55-64: Good foundation, expand technical details
  - <55: Needs depth, include tools and approaches

### 6. Analytics Dashboard
- **Performance Trends**: Score progression over time
- **Skill Breakdown**: Radar chart of 5 dimensions
- **Session History**: Detailed Q&A review
- **Difficulty Distribution**: Easy/Medium/Hard breakdown
- **Role Performance**: Best/worst roles identified

---

## 🧠 Evaluation System (Deep Dive)

### Keyword Libraries (700+ Terms)

**Flutter (80+ keywords):**
```typescript
"flutter", "dart", "widget", "stateless", "stateful", "provider",
"bloc", "riverpod", "navigator", "hot reload", "future", "stream",
"firestore", "firebase", "buildcontext", "setstate", ...
```

**Technical Support (100+ keywords):**
```typescript
"troubleshooting", "event viewer", "task manager", "ipconfig",
"ping", "tracert", "active directory", "group policy", "dns",
"dhcp", "firewall", "router", "rdp", "servicenow", "jira", ...
```

**Data Engineer (60+ keywords):**
```typescript
"spark", "airflow", "kafka", "etl", "pipeline", "bigquery",
"redshift", "snowflake", "dbt", "data lake", "data warehouse",
"batch processing", "streaming", "partitioning", ...
```

### Technical Scoring Algorithm

```typescript
function technicalScore(answer: string, domainKeywords: string[]): number {
  // Step 1: Keyword matching
  const matchedKeywords = new Set<string>()
  const answerLower = answer.toLowerCase()
  
  for (const keyword of domainKeywords) {
    if (answerLower.includes(keyword.toLowerCase())) {
      matchedKeywords.add(keyword)
    }
  }
  
  const matches = matchedKeywords.size
  
  // Step 2: Base score (30 points for any technical knowledge)
  let score = 30
  
  // Step 3: Linear reward (5 points per keyword, up to 50)
  const keywordPoints = Math.min(matches * 5, 50)
  score += keywordPoints
  
  // Step 4: Diversity bonuses
  if (matchedKeywords.size >= 3) score += 10  // Breadth bonus
  if (matchedKeywords.size >= 5) score += 10  // Strong breadth
  if (matchedKeywords.size >= 7) score += 5   // Excellent breadth
  
  // Step 5: Code/command detection
  const hasCode = detectCodeSnippet(answer)
  if (hasCode.detected) score += 10
  if (hasCode.isFunctional) score += 5
  
  return Math.min(score, 100)
}
```

**Example Calculation (Technical Support):**

Answer: "I'd check ipconfig, ping the gateway, review Event Viewer logs, and check firewall settings using Windows Firewall."

```
Matched Keywords: ["ipconfig", "ping", "gateway", "event viewer", "firewall", "windows firewall"]
Count: 6 keywords

Base Score: 30
Keyword Points: 6 × 5 = 30
Diversity Bonus: 5 keywords ≥ 3 → +10, ≥ 5 → +10
No code detected: 0

Total: 30 + 30 + 10 + 10 = 80/100 → 8.0/10
```

### AI Prompt Engineering

**Evaluation Prompt Structure:**

```typescript
const evaluationPrompt = `
You are an expert {ROLE} interviewer evaluating candidate answers.

QUESTION: {question}
CANDIDATE ANSWER: {answer}

SCORING GUIDANCE (ROLE-SPECIFIC):
{roleSpecificGuidance}

IMPORTANT:
- Be fair and encouraging
- Award partial credit
- Provide specific, actionable feedback
- Rate 0-10 on each dimension

Return JSON:
{
  "technicalDepth": 7,
  "clarity": 8,
  "confidence": 6,
  "relevance": 9,
  "structure": 7,
  "strengths": ["Used specific tools X, Y"],
  "improvements": ["Add systematic approach: First A, Then B"],
  "overallFeedback": "Strong answer! To improve, consider XYZ."
}
`
```

**Role-Specific Guidance Examples:**

*Flutter:*
```
TECHNICAL DEPTH SCORING:
✅ HIGH (7-10/10) when answer includes:
  - State management: Provider, BLoC, Riverpod
  - Lifecycle: initState, dispose, build
  - Async: Future, Stream, async/await
  - Navigation: Navigator, routes
  - Performance: const widgets, RepaintBoundary
```

*Technical Support:*
```
TECHNICAL DEPTH SCORING:
✅ HIGH (7-10/10) when answer includes:
  - Windows tools: Event Viewer, Task Manager, Services
  - Networking: ping, tracert, ipconfig, nslookup
  - Systematic approach: "First check X, then Y"
  - Specific commands with parameters
```

---

## 🗄️ Database Schema

### MongoDB Collections

**1. sessions**
```typescript
{
  _id: ObjectId,
  userId: String,              // GitHub user ID
  config: {
    role: String,              // "Flutter Developer"
    type: String,              // "Technical"
    difficulty: String,        // "Medium"
    maxQuestions: Number       // 5
  },
  questions: [
    {
      questionId: String,      // "flutter-medium-1"
      text: String,            // Question text
      answer: String,          // User's answer
      evaluation: {
        scores: {
          technicalDepth: Number,     // 0-10
          clarity: Number,            // 0-10
          confidence: Number,         // 0-10
          relevance: Number,          // 0-10
          structure: Number           // 0-10
        },
        overallScore: Number,         // 0-100
        feedback: String,
        strengths: [String],
        improvements: [String]
      }
    }
  ],
  overallScore: Number,        // Average across all questions
  status: String,              // "active" | "ended"
  createdAt: Date,
  endedAt: Date
}
```

**2. usersettings**
```typescript
{
  _id: ObjectId,
  userId: String,              // GitHub user ID (unique)
  aiModel: String,             // "meta-llama/llama-3.1-8b-instruct:free"
  temperature: Number,         // 0.0 - 1.0
  maxQuestionsPerSession: Number, // 3-10
  createdAt: Date,
  updatedAt: Date
}
```

**3. userprofiles**
```typescript
{
  _id: ObjectId,
  userId: String,              // GitHub user ID (unique)
  experienceLevel: String,     // "junior" | "mid" | "senior"
  primaryRole: String,         // "Flutter Developer"
  areasToFocus: [String],      // ["state management", "performance"]
  pastInterviews: Number,      // Count
  averageScore: Number,        // Overall average
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// sessions
db.sessions.createIndex({ userId: 1, createdAt: -1 })
db.sessions.createIndex({ status: 1 })

// usersettings
db.usersettings.createIndex({ userId: 1 }, { unique: true })

// userprofiles
db.userprofiles.createIndex({ userId: 1 }, { unique: true })
```

---

## 🌐 API Endpoints

### Authentication
```
GET  /api/auth/signin        # GitHub OAuth sign-in
GET  /api/auth/signout       # Sign out
GET  /api/auth/session       # Get current session
POST /api/auth/callback/github  # OAuth callback
```

### Interview
```
POST /api/interview/start    # Initialize new interview session
POST /api/interview/respond  # Evaluate answer and get feedback
GET  /api/interview/sessions # List user's interview sessions
GET  /api/interview/sessions/[id]  # Get specific session details
```

### Settings
```
GET  /api/settings           # Get user settings
PUT  /api/settings           # Update user settings
```

### Analytics (Future)
```
GET  /api/analytics/overview # Performance stats
GET  /api/analytics/trends   # Score trends over time
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

2. **Configure Environment Variables** in Vercel dashboard
   - All variables from `.env.local`
   - Especially: `NEXTAUTH_URL` (set to your production URL)

3. **Deploy**
   ```bash
   git push origin master  # Auto-deploys on Vercel
   ```

### Self-Hosted (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t interviewace .
docker run -p 3000:3000 --env-file .env.local interviewace
```

### Environment Checklist
- [ ] `NEXTAUTH_SECRET` set to production value
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `MONGODB_URI` points to production cluster
- [ ] `OPENROUTER_API_KEY` active and has credits
- [ ] GitHub OAuth callback URL updated

---

## 🎯 Recent Improvements (March 2026)

### ✅ Completed Enhancements

**1. Comprehensive Question Bank**
- Created `comprehensive-bank.ts` with 100+ questions
- Added sample answers for all questions
- Coverage: All 13+ roles × 3 difficulty levels × 4 interview types

**2. Technical Support Role**
- Added 100+ support-specific keywords
- Networking: ping, tracert, ipconfig, DNS, DHCP
- Windows: Event Viewer, Task Manager, Active Directory
- Troubleshooting: systematic approach, root cause analysis
- Ticketing: ServiceNow, Jira, SLA, knowledge base

**3. Improved Technical Scoring**
- Changed from logarithmic to linear reward-based
- Base score: 30 points (recognizes any technical knowledge)
- +5 points per keyword (encouraging)
- Diversity bonuses for breadth
- Code/command detection bonuses

**4. Role-Specific AI Guidance**
- Flutter evaluation prompts
- System Design evaluation prompts
- Technical Support evaluation prompts
- Actionable feedback examples for each role

**5. Enhanced Confidence Scoring**
- Added support action verbs: "I diagnosed", "I troubleshot"
- Systematic approach indicators: "first", "then", "step by step"
- Customer service language recognition

**6. Security Improvements**
- Enhanced `.gitignore` with explicit `.env.local` exclusion
- Added `.env.example` template
- Security comments in config files

**7. Documentation**
- Complete README.md rewrite with 20+ sections
- Architecture diagrams
- Usage guides for all roles
- API documentation
- Deployment instructions
- Contributing guidelines

---

## 🧪 Testing Guide

### Pre-Deployment Testing

**1. Environment Setup**
```bash
# Verify all env vars
cat .env.local
# Should have all required vars

# Test database connection
pnpm db:stats
```

**2. Interview Flow Testing**

Test each role with appropriate answers:

**Flutter:**
```
Q: "Explain StatefulWidget lifecycle"
A: "StatefulWidget has lifecycle methods: initState() for initialization, 
    build() for rendering, setState() to trigger rebuilds, and dispose() 
    for cleanup. I use Provider for state management across widgets."

Expected: Technical 7-8/10 (keywords: StatefulWidget, initState, build, setState, dispose, Provider)
```

**Technical Support:**
```
Q: "User can't connect to internet, how do you troubleshoot?"
A: "I use systematic approach: First ping 127.0.0.1 to test TCP/IP stack. 
    Then ping gateway using ipconfig. Run ipconfig /flushdns to clear DNS cache. 
    Check Event Viewer for errors. Verify firewall settings aren't blocking."

Expected: Technical 8-9/10 (keywords: ping, TCP/IP, ipconfig, DNS, Event Viewer, firewall, systematic)
```

**Data Engineer:**
```
Q: "How would you design a data pipeline?"
A: "I'd use Apache Airflow for orchestration with DAGs. Extract data with Spark, 
    transform in PySpark, load to data warehouse like Snowflake or BigQuery. 
    Use Kafka for real-time streaming. Implement data quality checks with dbt."

Expected: Technical 9/10 (keywords: Airflow, DAG, Spark, PySpark, data warehouse, Snowflake, Kafka, streaming, dbt)
```

**3. Scoring Validation**

Verify fair scoring:
- 1-2 keywords: 35-45 (3.5-4.5/10) ✅ Shows knowledge
- 3-4 keywords: 55-65 (5.5-6.5/10) ✅ Decent answer
- 5-6 keywords: 75-85 (7.5-8.5/10) ✅ Strong answer
- 7+ keywords + code: 90-95 (9.0-9.5/10) ✅ Excellent

**4. Edge Cases**

Test error handling:
- Empty answer → Should show low scores but not crash
- Very long answer (5000+ chars) → Should process without timeout
- Special characters in answer → Should handle gracefully
- Network failure → Should show user-friendly error

---

## 📊 Performance Metrics

### Current Stats (March 2026)

- **Total Roles**: 13+
- **Total Keywords**: 700+
- **Total Questions**: 100+
- **Evaluation Speed**: <100ms (algorithmic) + ~1-2s (AI)
- **Database Queries**: Optimized with indexes
- **Bundle Size**: <500KB (frontend)

### Optimization Targets

- [ ] Reduce AI response time to <1s (model optimization)
- [ ] Add Redis caching for frequent queries
- [ ] Implement lazy loading for large question banks
- [ ] Optimize MongoDB queries with aggregation pipeline
- [ ] Add CDN for static assets

---

## 🛠️ Troubleshooting

### Common Issues

**1. "NEXTAUTH_URL mismatch"**
```
Solution: Ensure NEXTAUTH_URL matches your domain
Development: http://localhost:3000
Production: https://yourdomain.com
```

**2. "MongoDB connection failed"**
```
Solution: Check MONGODB_URI is correct
- Verify username/password
- Check IP whitelist (allow 0.0.0.0/0 for development)
- Ensure cluster is running
```

**3. "Technical scores too low"**
```
Solution: Check keyword matching
- Verify role detection in keywords.ts
- Test with sample answers in comprehensive-bank.ts
- Check if keywords are lowercase normalized
```

**4. "Question counter showing wrong number"**
```
Solution: Verify interview length enforcement
- Check maxQuestions setting
- Ensure intro message isn't counted
- Verify session/page.tsx counter logic
```

---

## 📚 Additional Resources

### Documentation Files
- **README.md** - Main documentation (you are here)
- **ARCHITECTURE.md** - System architecture details
- **EVALUATION_ENGINE.md** - Scoring algorithm deep dive
- **API.md** - API endpoint reference
- **DATABASE.md** - MongoDB schema and queries
- **DEPLOYMENT.md** - Deployment guides

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Manual](https://docs.mongodb.com)
- [NextAuth Documentation](https://next-auth.js.org)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🎓 Academic Context

This project was developed as part of a software engineering course to demonstrate:

1. **Full-stack development** with modern frameworks
2. **AI integration** with practical applications
3. **Database design** and optimization
4. **Algorithm development** (scoring engine)
5. **User experience** design
6. **Testing** and quality assurance
7. **Documentation** and code organization
8. **Security** best practices
9. **Deployment** and DevOps

---

## 📝 License

MIT License - Free for personal and commercial use.

---

**Last Updated:** March 11, 2026  
**Maintained by:** [@abhijithk-ak](https://github.com/abhijithk-ak)  
**Version:** 2.0 (Production Ready)
