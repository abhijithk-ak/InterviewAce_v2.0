# Testing Guide - Hybrid Scoring & Research Analytics

## Overview
This guide explains how to test the hybrid scoring system and verify research analytics data collection for the IEEE paper.

---

## Prerequisites

### 1. Clean Database (Optional)
If you want to start fresh:

```bash
npx tsx scripts/clear-research-data.ts
```

Type `DELETE` when prompted to remove all existing sessions.

### 2. Verify Environment
Ensure you have:
- MongoDB running (connection string in `.env.local`)
- OpenRouter API key configured (optional, system works without it)
- Account logged in with admin email: `ak.abhijithk@gmail.com`

---

## Testing Workflow

### Step 1: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Step 2: Configure Scoring Mode

1. Navigate to **Settings** page
2. Under "Scoring Configuration":
   - Select **"Deterministic"** for first batch of tests
   - Select **"Hybrid (Experimental)"** for second batch
3. Click **Save Settings**

### Step 3: Run Interview Sessions

For meaningful research data, run **multiple sessions** with different configurations:

#### Batch 1: Deterministic Mode (n=10 sessions)
- Settings → Scoring Mode: **Deterministic**
- Run 10 interviews with varied:
  - Roles: Software Engineer, Data Scientist, Product Manager
  - Types: Technical, Behavioral, System Design
  - Difficulties: Easy, Medium, Hard

#### Batch 2: Hybrid Mode (n=10 sessions)
- Settings → Scoring Mode: **Hybrid (Experimental)**
- Run 10 interviews with same configurations as Batch 1
- This allows direct comparison

### Step 4: Verify Data Collection

#### Check Session Storage
After each interview:
1. Go to **Sessions** page
2. Verify session appears with correct score
3. Click session to view detailed breakdown

#### Monitor Console Logs
During interviews, check browser console (F12):
```
📊 Running deterministic evaluation (pure NLP)...
🧠 Running hybrid evaluation (deterministic + semantic)...
✅ Hybrid score: 76 (det: 68, sem: 72)
```

### Step 5: Access Research Analytics

1. **Login as Admin**: `ak.abhijithk@gmail.com`
2. **Navigate to Research Page**: Click purple "RESEARCH" link in sidebar
3. **Verify Charts Display**:
   - Dataset Overview (sessions, questions, correlation)
   - Method Comparison Bar Chart
   - Score Distribution
   - Performance Over Time
   - Difficulty & Type Breakdowns
   - System Reliability Metrics

---

## Expected Data Flow

### Question-Level Metrics (Stored in DB)

Each answer generates:

```typescript
metrics: {
  deterministicScore: 68,   // Rule-based NLP (0-100)
  semanticScore: 7.2,       // MiniLM similarity (0-10)
  finalScore: 76,           // Hybrid weighted (0-100)
  answerLength: 245,        // Character count
  responseTime: 1834,       // Processing time (ms)
  timestamp: "2026-03-11T10:23:15.000Z"
}
```

### Research API Aggregation

`GET /api/research/metrics` processes:
- All sessions across all users
- Question-level metrics aggregation
- Statistical calculations (avg, stddev, correlation)
- Time series grouping (daily averages)

---

## Chart Validation for IEEE Paper

### Currently Implemented ✅

1. **Bar Chart**: Method Comparison
   - Shows deterministic vs semantic vs hybrid averages
   - Includes standard deviation annotations
   - ✅ IEEE Standard (common in comparative studies)

2. **Grouped Bar Chart**: Score Distribution
   - Histogram across 5 score ranges
   - Three methods per range
   - ✅ IEEE Standard (distribution analysis)

3. **Line Chart**: Performance Over Time
   - Temporal trend analysis (last 30 days)
   - Three series (one per method)
   - ✅ IEEE Standard (longitudinal studies)

4. **Progress Bars**: Breakdown Analysis
   - Difficulty levels (easy/medium/hard)
   - Interview types (technical/behavioral/etc)
   - ✅ Acceptable (summary statistics)

### Additional Charts for Stronger IEEE Paper

Consider adding:

5. **Scatter Plot**: Correlation Analysis
   - X-axis: Deterministic scores
   - Y-axis: Semantic scores
   - Shows relationship strength visually
   - ✅ IEEE Standard (correlation studies)

6. **Box Plot**: Distribution with Quartiles
   - Shows median, quartiles, outliers
   - One box per method
   - ✅ IEEE Standard (statistical comparison)

7. **Violin Plot**: Distribution Shape
   - Combines box plot + density
   - ✅ IEEE Standard (advanced statistics)

8. **Heatmap**: Score Correlation Matrix
   - Deterministic × Semantic correlation
   - ✅ IEEE Standard (multi-variable analysis)

---

## Sample Testing Script

For automated data generation (testing only):

```typescript
// Run this in browser console on /interview/setup page
async function runTestBatch(count = 5, scoringMode = 'deterministic') {
  console.log(`Starting ${count} test sessions (${scoringMode} mode)`)
  
  const configs = [
    { role: 'Software Engineer', type: 'technical', difficulty: 'medium' },
    { role: 'Data Scientist', type: 'technical', difficulty: 'hard' },
    { role: 'Product Manager', type: 'behavioral', difficulty: 'easy' },
    { role: 'DevOps Engineer', type: 'system-design', difficulty: 'medium' },
    { role: 'Frontend Developer', type: 'technical', difficulty: 'easy' }
  ]
  
  for (let i = 0; i < count; i++) {
    const config = configs[i % configs.length]
    console.log(`Session ${i + 1}/${count}:`, config)
    // Navigate to /interview/session and complete manually
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

// Usage:
// runTestBatch(10, 'deterministic')  // Batch 1
// runTestBatch(10, 'hybrid')         // Batch 2
```

---

## Verification Checklist

### ✅ Hybrid Scoring Working
- [ ] Settings page shows "Deterministic" and "Hybrid" options
- [ ] Interview session logs show semantic scoring when hybrid enabled
- [ ] Scores differ between deterministic and hybrid modes
- [ ] Semantic score is on 0-10 scale in console logs
- [ ] Final score is weighted correctly (70% det + 30% sem)

### ✅ Data Collection Working
- [ ] Sessions appear in Sessions page after interviews
- [ ] Each session has `overallScore` stored
- [ ] Questions have `metrics` field with all 6 values
- [ ] Research API returns non-zero metrics
- [ ] Charts display real data (not "No data available")

### ✅ Research Dashboard Working
- [ ] Dataset overview shows correct totals
- [ ] Method comparison chart has 3 bars
- [ ] Score distribution shows non-empty ranges
- [ ] Performance over time has data points
- [ ] Correlation value is calculated (not null)
- [ ] Difficulty/type breakdowns show your test data

### ✅ Admin Access Control Working
- [ ] Research link visible only to `ak.abhijithk@gmail.com`
- [ ] Other users redirected to `/dashboard`
- [ ] API returns 403 for non-admin users

---

## Troubleshooting

### Issue: "No data available" in Research page

**Cause**: Database has no sessions yet

**Solution**:
```bash
# Verify MongoDB connection
npm run dev
# Check terminal for "Connected to MongoDB" message

# Run at least 5 interviews to generate data
```

### Issue: Charts show gaps (empty ranges)

**Cause**: Real data doesn't span all score ranges yet

**Solution**: This is normal with limited data. Run more varied interviews:
- Easy questions → should score 70-90 range
- Hard questions → should score 30-60 range
- Behavioral vs technical → different distributions

### Issue: Semantic score always 0

**Cause**: MiniLM model not loading or hybrid mode not enabled

**Solution**:
```bash
# Test semantic scoring directly
npx tsx test-semantic.ts

# Should show:
# Semantic: 61.1
# If shows 0, check @xenova/transformers installation
```

### Issue: Correlation shows null

**Cause**: Need at least 2 data points

**Solution**: Run minimum 2 interview sessions

---

## Research Data Best Practices

### For IEEE Paper Validity

1. **Sample Size**: Minimum 30 sessions (15 deterministic + 15 hybrid)
2. **Diversity**: Mix of difficulties, types, and roles
3. **Consistency**: Same questions across both modes when possible
4. **Documentation**: Log all configurations used
5. **Statistical Significance**: Run t-test on final results:

```python
# Example statistical analysis (Python)
import scipy.stats as stats

deterministic_scores = [68, 72, 65, 70, 69, ...]  # n=30
hybrid_scores = [76, 79, 71, 75, 74, ...]         # n=30

t_stat, p_value = stats.ttest_ind(deterministic_scores, hybrid_scores)
print(f"p-value: {p_value}")  # < 0.05 = statistically significant
```

---

## Exporting Research Data

To export data for external analysis:

```bash
# MongoDB export (requires mongosh/mongoexport)
mongoexport --uri="your_connection_string" --collection=sessions --out=research_data.json

# Or use MongoDB Compass GUI:
# 1. Connect to database
# 2. Select 'sessions' collection
# 3. Export → JSON
```

---

## Quick Start Summary

```bash
# 1. Clear database (optional)
npx tsx scripts/clear-research-data.ts

# 2. Start server
npm run dev

# 3. Login as admin (ak.abhijithk@gmail.com)

# 4. Run 5 interviews in DETERMINISTIC mode
#    (Settings → Scoring Mode → Deterministic)

# 5. Run 5 interviews in HYBRID mode
#    (Settings → Scoring Mode → Hybrid)

# 6. Visit /research to see charts

# 7. Verify data:
#    - Method comparison shows 3 bars
#    - Score distribution has data
#    - Correlation calculated
#    - Performance over time trending
```

---

## Expected Timeline

- **Initial Setup**: 5 minutes
- **Data Collection**: 10 interviews × 5 min = 50 minutes
- **Verification**: 10 minutes
- **Total**: ~65 minutes for basic research dataset

For IEEE paper submission, allocate:
- **Full Dataset**: 50+ sessions = ~4 hours
- **Analysis**: 2 hours
- **Chart generation**: 1 hour
- **Statistical testing**: 1 hour
- **Total**: ~8 hours for complete research study

---

## Support

If issues persist:
1. Check browser console for errors (F12)
2. Check terminal logs for API errors
3. Verify MongoDB connection string
4. Ensure admin email matches exactly
5. Test semantic scoring: `npx tsx test-semantic.ts`
