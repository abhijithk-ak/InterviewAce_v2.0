# MongoDB Settings Migration Complete ✅

## Overview
Successfully migrated interview settings from browser localStorage to MongoDB for cross-device synchronization and research tracking.

## What Changed

### 1. Database Layer
**File**: `src/lib/db/models/UserSettings.ts` (NEW)
- Created Mongoose schema for user preferences
- 8 settings fields: aiModel, aiTemperature, interviewLength, voiceQuestionsEnabled, videoRecordingEnabled, scoringMode, showScoreExplanation, theme
- Research tracking via `scoringModeHistory` array
- Static method: `getOrCreate(userEmail)` for automatic user creation
- Instance method: `trackScoringModeChange(mode, sessionCount)` for research

### 2. API Layer
**File**: `src/app/api/settings/route.ts` (NEW)
- **GET /api/settings**: Fetch user settings from MongoDB
  - Requires authentication (NextAuth session)
  - Returns user-specific settings or creates defaults
- **PUT /api/settings**: Update settings
  - Validates all fields before saving
  - Tracks scoring mode changes with session count
  - Logs research events: `📊 Scoring mode changed: deterministic → hybrid (after 6 sessions)`

### 3. Settings Store
**File**: `src/lib/settings/store.ts` (UPDATED)
- Added `loadSettingsFromAPI()` - PRIMARY method to fetch from MongoDB
- Added `saveSettingsToAPI()` - PRIMARY method to save to MongoDB
- Added `resetSettingsToAPI()` - Reset to defaults in MongoDB
- Kept old localStorage functions for backward compatibility (cache only)
- Automatic cache sync: MongoDB → localStorage for fast access

### 4. Settings UI
**File**: `src/app/(app)/settings/page.tsx` (UPDATED)
- Now uses async API methods instead of sync localStorage
- Loading states with spinner animation
- Save button shows "Saving to Database..." during API calls
- Success/error messages with color-coded feedback
- Disabled state prevents duplicate saves
- Better error handling for network failures

### 5. Research Dashboard
**File**: `src/app/(app)/research/ImprovedDashboard.tsx` (UPDATED)
- Updated info panel: "Settings are now stored in MongoDB" ✅
- Removed localStorage warning
- Emphasized cross-device sync capability
- Clarified both settings AND session data in MongoDB

## Benefits

### For Users
- ✅ **Cross-Device Sync**: Settings persist across all devices and browsers
- ✅ **No Data Loss**: Settings survive browser cache clearing
- ✅ **Better UX**: Loading indicators and clear feedback messages

### For Research
- ✅ **Track Mode Adoption**: See when users switch from deterministic to hybrid scoring
- ✅ **Session Correlation**: Link settings changes to session performance
- ✅ **Behavioral Analysis**: scoringModeHistory shows usage patterns
- ✅ **IEEE Paper Data**: Can analyze hybrid mode adoption rate over time

## Database Structure

### UserSettings Collection
```typescript
{
  _id: ObjectId,
  userEmail: "ak.abhijithk@gmail.com", // Unique, indexed
  
  // AI Configuration
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",
  aiTemperature: 0.7,
  
  // Interview Configuration
  interviewLength: 5, // 3 | 5 | 6
  voiceQuestionsEnabled: true,
  videoRecordingEnabled: true,
  
  // Scoring Configuration
  scoringMode: "hybrid", // "deterministic" | "hybrid"
  showScoreExplanation: true,
  
  // UI Preferences
  theme: "dark", // "dark" | "light"
  
  // Research Tracking
  scoringModeHistory: [
    {
      mode: "deterministic",
      changedAt: ISODate("2025-06-01T10:00:00Z"),
      sessionCount: 0
    },
    {
      mode: "hybrid",
      changedAt: ISODate("2025-06-03T14:30:00Z"),
      sessionCount: 6
    }
  ],
  
  // Timestamps
  createdAt: ISODate("2025-06-01T10:00:00Z"),
  updatedAt: ISODate("2025-06-03T14:30:00Z")
}
```

## Testing Guide

### 1. Login and Load Settings
```bash
# 1. Start development server
npm run dev

# 2. Login as ak.abhijithk@gmail.com
# 3. Navigate to Settings page
# 4. Watch for: "Loading settings from database..." spinner
# 5. Verify settings load correctly
```

### 2. Modify and Save Settings
```bash
# 1. Change any setting (e.g., AI model, scoring mode, interview length)
# 2. Click "Save Settings"
# 3. Watch for: "Saving to Database..." spinner
# 4. Verify success message: "✓ Settings saved to database successfully"
```

### 3. Verify MongoDB Storage
```javascript
// In MongoDB Compass or shell:
db.usersettings.find({ userEmail: "ak.abhijithk@gmail.com" })

// Expected output:
{
  _id: ObjectId("..."),
  userEmail: "ak.abhijithk@gmail.com",
  scoringMode: "hybrid", // Your chosen mode
  aiModel: "...",
  // ... other fields
  createdAt: ISODate("..."),
  updatedAt: ISODate("...") // Should be recent
}
```

### 4. Test Scoring Mode Change Tracking
```bash
# 1. Login and complete 1-2 interview sessions
# 2. Go to Settings page
# 3. Change scoring mode from "Deterministic" to "Hybrid"
# 4. Click Save
# 5. Check browser console for log:
#    "📊 Scoring mode changed: deterministic → hybrid (after 2 sessions)"
# 6. Verify in MongoDB:
db.usersettings.findOne(
  { userEmail: "ak.abhijithk@gmail.com" },
  { scoringModeHistory: 1 }
)
# Expected: Array with 2 entries (original + change)
```

### 5. Test Cross-Device Sync
```bash
# 1. Save settings on Device A (e.g., Chrome)
# 2. Open app on Device B (e.g., Firefox) with same login
# 3. Go to Settings page
# 4. Verify settings match Device A
```

### 6. Test Error Handling
```bash
# 1. Disconnect from internet
# 2. Try to save settings
# 3. Verify error message: "✗ Network error: Could not save settings"
# 4. Reconnect and save again
# 5. Verify success
```

### 7. Research Dashboard Check
```bash
# 1. Navigate to /research (admin only)
# 2. Scroll to "Database Storage Information" panel (blue banner)
# 3. Verify text: "Interview settings are now stored in MongoDB"
# 4. Confirm no localStorage warnings present
```

## Research Query Examples

### Track Hybrid Mode Adoption
```javascript
// Count users by scoring mode
db.usersettings.aggregate([
  {
    $group: {
      _id: "$scoringMode",
      count: { $sum: 1 }
    }
  }
])

// Example output:
// { _id: "deterministic", count: 12 }
// { _id: "hybrid", count: 8 }
```

### Analyze Mode Switching Behavior
```javascript
// Find users who switched modes multiple times
db.usersettings.aggregate([
  {
    $project: {
      userEmail: 1,
      switchCount: { $size: "$scoringModeHistory" }
    }
  },
  {
    $match: { switchCount: { $gt: 1 } }
  },
  {
    $sort: { switchCount: -1 }
  }
])
```

### Correlate Settings with Performance
```javascript
// Join settings with session scores
db.usersettings.aggregate([
  {
    $lookup: {
      from: "sessions",
      localField: "userEmail",
      foreignField: "userEmail",
      as: "sessions"
    }
  },
  {
    $project: {
      userEmail: 1,
      scoringMode: 1,
      avgScore: { $avg: "$sessions.overallScore" },
      sessionCount: { $size: "$sessions" }
    }
  }
])
```

## Rollback Plan (if needed)

If you need to revert to localStorage:

1. **Settings Page**: Change imports back to `loadSettings`, `saveSettings` (old methods still exist)
2. **Research Panel**: Update text back to "stored in localStorage"
3. **Keep MongoDB Data**: Data remains in database for future use

**Note**: Not recommended - MongoDB provides better features for research.

## Migration Checklist

- [x] Create UserSettings MongoDB model
- [x] Create GET/PUT API endpoints
- [x] Update settings store with API methods
- [x] Update Settings page UI (async, loading states)
- [x] Update Research dashboard info panel
- [x] Fix TypeScript errors (getOrCreate typing)
- [x] Add scoringModeHistory tracking
- [ ] Test settings load on first login
- [ ] Test settings save and verify in MongoDB
- [ ] Test scoring mode change tracking
- [ ] Test cross-device synchronization
- [ ] Test error handling (network failures)
- [ ] Verify research queries work correctly

## Next Steps

1. **Test Complete Flow**: Follow testing guide above
2. **Run Interview Session**: Verify settings persist during interview
3. **Check MongoDB**: Confirm data in `usersettings` collection
4. **Switch Scoring Mode**: Track mode change with session count
5. **Research Analysis**: Use scoringModeHistory for IEEE paper data

## Files Modified

1. ✅ `src/lib/db/models/UserSettings.ts` (CREATED - 138 lines)
2. ✅ `src/app/api/settings/route.ts` (CREATED - 150 lines)
3. ✅ `src/lib/settings/store.ts` (UPDATED - added API methods)
4. ✅ `src/app/(app)/settings/page.tsx` (UPDATED - async UI)
5. ✅ `src/app/(app)/research/ImprovedDashboard.tsx` (UPDATED - info panel)

## Support

If issues arise:
1. Check browser console for error logs
2. Verify MongoDB connection in server logs
3. Check network tab for API responses
4. Confirm authentication session exists
5. Review this guide's testing section

---

**Migration Status**: ✅ COMPLETE
**Ready for Testing**: YES
**Backward Compatible**: YES (localStorage cache still works)
