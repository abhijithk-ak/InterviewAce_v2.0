# Settings Integration Fix & Database Management Guide

## Critical Fix: AI Model & Temperature Now Working ✅

### The Problem
You were RIGHT! The settings weren't actually being used. The AI was using hardcoded defaults instead of your MongoDB settings.

**What was broken:**
```typescript
// BEFORE (WRONG):
const aiResponse = await callAI(prompt)  // ❌ No model or temperature!

// Settings in MongoDB:
{
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",
  aiTemperature: 0.7
}
// ☝️ These were IGNORED!
```

### The Fix Applied

**Files Modified:**
1. `src/lib/interview/start.ts` - Now accepts and uses aiModel + aiTemperature
2. `src/lib/interview/respond.ts` - Now accepts and uses aiModel + aiTemperature  
3. `src/app/api/interview/respond/route.ts` - Passes settings to handler

**After Fix:**
```typescript
// NOW (CORRECT):
const aiResponse = await callAI(prompt, {
  model: params.aiModel,        // ✅ From MongoDB!
  temperature: params.aiTemperature  // ✅ From MongoDB!
})

// Console logs now show:
// 📋 Using model: meta-llama/llama-3.2-3b-instruct:free, temperature: 0.7
```

### How It Works Now

**Complete Settings Flow:**

```
Settings Page
    ↓ (Save)
MongoDB UserSettings Collection
    ↓ (Interview Start)
API: /api/interview/start
    ├─ Loads: UserSettingsModel.getOrCreate(email)
    └─ Passes to: startInterview(config, userName, aiModel, aiTemperature)
        ↓
AI Client (callAI)
    ├─ model: "meta-llama/llama-3.2-3b-instruct:free" ✅
    ├─ temperature: 0.7 ✅
    └─ OpenRouter API receives YOUR settings!
```

**For Each Interview Response:**

```
User Answers Question
    ↓
API: /api/interview/respond
    ├─ Loads: UserSettingsModel.getOrCreate(email)
    └─ Passes to: handleAnswer({
        aiModel: userSettings.aiModel,
        aiTemperature: userSettings.aiTemperature,
        scoringMode: userSettings.scoringMode
      })
        ↓
AI Client (callAI)
    └─ Uses YOUR model & temperature for every response!
```

### Verification

**Test Your Settings:**

1. **Go to Settings Page** (`/settings`)
   - Change AI Model to different option
   - Change Temperature (e.g., 0.9 for creative)
   - Save

2. **Start New Interview**
   - Open browser console
   - Look for logs:
     ```
     📋 Using model: [YOUR MODEL], temperature: [YOUR TEMP]
     ```

3. **Check MongoDB**
   ```bash
   # Run stats script
   npm run db:stats
   
   # Should show:
   # AI Models:
   #   llama-3.2-3b-instruct: 1 user(s)
   ```

---

## Database Management Tools

### Quick Commands

```bash
# View database statistics
npm run db:stats

# Clear ALL sessions (requires confirmation)
npm run db:clear

# Clear sessions older than 30 days (default)
npm run db:clear-old

# Clear sessions older than 7 days
npm run db:clear-old 7

# Clear sessions for specific user
npm run db:clear-user user@example.com
```

### Tool Details

#### 1. **View Database Stats** 
   ```bash
   npm run db:stats
   ```
   
   **Shows:**
   - Total sessions and unique users
   - Date range of sessions
   - Scoring mode distribution (deterministic vs hybrid)
   - Interview length preferences (3/5/6 questions)
   - Most popular AI models
   - Top users by session count
   
   **Example Output:**
   ```
   ═══════════════════════════════════════
   📝 SESSIONS
   ═══════════════════════════════════════
   Total Sessions: 12
   Unique Users: 3
   Date Range: 3/10/2026 - 3/11/2026
   
   ═══════════════════════════════════════
   ⚙️  USER SETTINGS
   ═══════════════════════════════════════
   Total Users with Settings: 3
   
   Scoring Modes:
     deterministic: 1 user(s)
     hybrid: 2 user(s)
   
   Interview Lengths:
     3 questions: 1 user(s)
     5 questions: 2 user(s)
   
   AI Models:
     llama-3.2-3b-instruct: 2 user(s)
     llama-3.1-8b-instruct: 1 user(s)
   ```

#### 2. **Clear All Sessions**
   ```bash
   npm run db:clear
   ```
   
   **Use When:**
   - Starting fresh research data collection
   - Testing new features
   - Cleaning up test data
   
   **Safety:**
   - Requires typing "DELETE" to confirm
   - Shows count before deleting
   - Cannot be undone!

#### 3. **Clear Old Sessions**
   ```bash
   # Clear sessions older than 30 days (default)
   npm run db:clear-old
   
   # Clear sessions older than 7 days
   npm run db:clear-old 7
   
   # Clear sessions older than 1 day
   npm run db:clear-old 1
   ```
   
   **Use When:**
   - Removing outdated test data
   - Keeping only recent sessions for research
   - Managing database size
   
   **Behavior:**
   - Automatic deletion (no confirmation)
   - Shows cutoff date and count
   - Keeps recent sessions intact

#### 4. **Clear User Sessions**
   ```bash
   npm run db:clear-user ak.abhijithk@gmail.com
   ```
   
   **Use When:**
   - Removing one user's test data
   - User requests data deletion
   - Cleaning up specific user's sessions
   
   **Safety:**
   - Requires typing "DELETE" to confirm
   - Shows count for that user
   - Only affects specified user

---

## Settings Storage in MongoDB

### UserSettings Collection Schema

```typescript
{
  _id: ObjectId("..."),
  userEmail: "ak.abhijithk@gmail.com",
  
  // AI Configuration (NOW USED!)
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",  // ✅ USED in callAI()
  aiTemperature: 0.7,                                 // ✅ USED in callAI()
  
  // Interview Configuration (USED!)
  interviewLength: 3,        // ✅ USED for question count
  voiceQuestionsEnabled: true,
  videoRecordingEnabled: true,
  
  // Scoring Configuration (USED!)
  scoringMode: "hybrid",     // ✅ USED for evaluation
  showScoreExplanation: true,
  
  // UI Preferences
  theme: "dark",
  
  // Research Tracking
  scoringModeHistory: [
    {
      mode: "deterministic",
      changedAt: ISODate("2026-03-10T10:00:00Z"),
      sessionCount: 0
    },
    {
      mode: "hybrid",
      changedAt: ISODate("2026-03-11T14:30:00Z"),
      sessionCount: 6
    }
  ],
  
  createdAt: ISODate("2026-03-10T10:00:00Z"),
  updatedAt: ISODate("2026-03-11T14:30:00Z")
}
```

### OpenRouter Model Format

**You asked about the model format - it's CORRECT!**

OpenRouter expects the exact format we store:
```
"meta-llama/llama-3.2-3b-instruct:free"
```

**Format Breakdown:**
- `meta-llama/` - Provider namespace
- `llama-3.2-3b-instruct` - Model name
- `:free` - Pricing tier

**OpenRouter API Call:**
```typescript
fetch("https://openrouter.ai/api/v1/chat/completions", {
  body: JSON.stringify({
    model: "meta-llama/llama-3.2-3b-instruct:free",  // ✅ Correct format
    messages: [...],
    temperature: 0.7,
    max_tokens: 800
  })
})
```

**Other Valid Models:**
- `"meta-llama/llama-3.1-8b-instruct:free"`
- `"google/gemini-flash-1.5"`
- `"anthropic/claude-3-haiku"`

**NOT to be confused with:**
- OpenAI format: `"gpt-4"` (different)
- Ollama format: `"llama3.2:3b"` (different)

Our format is **OpenRouter-specific** and **correct** ✅

---

## Testing Guide

### 1. Verify Settings Are Used

**Steps:**
1. Open Settings page
2. Change AI model to `Llama 3.1 8B Instruct`
3. Change temperature to `0.9`
4. Change interview length to `3`
5. Save settings
6. Start new interview
7. **Check browser console for:**
   ```
   🤖 Attempting AI session start...
   📋 Using model: meta-llama/llama-3.1-8b-instruct:free, temperature: 0.9
   ```
8. **Verify:** Interview has exactly 3 questions

### 2. Verify Scoring Mode

**Steps:**
1. Settings → Change to "Hybrid"
2. Save
3. Start interview and answer a question
4. **Check console for:**
   ```
   🧠 Running hybrid evaluation (deterministic + semantic)...
   ✅ Hybrid score: 72 (det: 68, sem: 85)
   ```

### 3. Verify Research Dashboard

**Steps:**
1. Complete 2-3 interviews with different settings
2. Go to `/research`
3. **Check:**
   - Semantic scores in 0-100 range (not 238)
   - AI Success Rate > 0% (if AI working)
   - Individual Method Trends show zoom brushes
4. **Run stats:**
   ```bash
   npm run db:stats
   ```
5. **Verify:** Shows your AI model selection

---

## Common Issues & Solutions

### Issue: Settings not applied
**Symptom:** Interview still has 6 questions even though you set 3

**Solution:**
1. Check MongoDB connection is working
2. Verify you're logged in (session.user.email exists)
3. Check server console for errors
4. Clear browser cache and reload

**Verify:**
```bash
npm run db:stats
# Should show your settings
```

### Issue: AI using wrong model
**Symptom:** Console shows "default" instead of your model

**Solution:**
1. Ensure OPENROUTER_API_KEY is set in `.env.local`
2. Restart dev server: `npm run dev`
3. Check settings saved correctly in MongoDB
4. Look for error logs in server console

### Issue: Semantic scores still wrong
**Symptom:** Research shows 238 instead of 68

**Solution:**
1. This was a BUG in research metrics (now fixed)
2. OLD sessions may still have wrong data
3. Clear old data: `npm run db:clear-old 30`
4. Do new interview - should show correct scores

### Issue: Can't delete sessions
**Symptom:** Script fails with connection error

**Solution:**
1. Check `.env.local` has `MONGODB_URI`
2. Ensure MongoDB Atlas is accessible
3. Check network connection
4. View error in console output

---

## Best Practices

### For Development
```bash
# Before testing new features:
npm run db:stats          # See current state
npm run db:clear          # Clear old data (type DELETE)
# Do testing...
npm run db:stats          # Verify new data
```

### For Research
```bash
# Weekly cleanup:
npm run db:clear-old 7    # Remove sessions > 7 days

# Check progress:
npm run db:stats          # View adoption rates

# Export data (future feature):
# npm run db:export export.json
```

### For Production
```bash
# Monthly cleanup:
npm run db:clear-old 90   # Keep 3 months

# Monitor growth:
npm run db:stats
```

---

## What's Fixed Now

✅ **AI Model Selection** - Your choice from settings is used  
✅ **AI Temperature** - Your creativity setting is applied  
✅ **Interview Length** - 3/5/6 questions work correctly  
✅ **Scoring Mode** - Deterministic/Hybrid applied properly  
✅ **Semantic Scores** - Research shows correct 0-100 values  
✅ **Database Scripts** - Easy management tools added  
✅ **Console Logging** - Shows what settings are being used

---

## Next Steps

1. **Test the fix:**
   ```bash
   npm run dev
   # Go to /settings, change model, save
   # Start interview, check console logs
   ```

2. **Clear old data:**
   ```bash
   npm run db:clear
   # Type: DELETE
   ```

3. **Do fresh interviews:**
   - Try different models
   - Try different temperatures
   - Try different interview lengths

4. **Check research:**
   ```bash
   npm run db:stats
   # Verify your settings are tracked
   ```

---

**The settings integration is NOW fully working!** 🚀

Your MongoDB settings (aiModel, aiTemperature, interviewLength, scoringMode) are properly loaded and used throughout the interview flow.
