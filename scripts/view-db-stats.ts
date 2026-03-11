/**
 * View Database Stats Script
 * Shows statistics about sessions and users in the database
 * Run with: npx tsx scripts/view-db-stats.ts
 */

import mongoose from 'mongoose'
import { connectDB } from '../src/lib/db/mongoose'
import { SessionModel } from '../src/lib/db/models/Session'
import { UserSettingsModel } from '../src/lib/db/models/UserSettings'

async function viewStats() {
  console.log('📊 Database Statistics\n')

  try {
    await connectDB()

    // Session stats
    const totalSessions = await SessionModel.countDocuments()
    const uniqueUsers = await SessionModel.distinct('userEmail')
    
    // Get date range
    const oldestSession = await SessionModel.findOne().sort({ startedAt: 1 })
    const newestSession = await SessionModel.findOne().sort({ startedAt: -1 })

    // Settings stats
    const totalUserSettings = await UserSettingsModel.countDocuments()

    // Group by scoring mode
    const scoringModes = await UserSettingsModel.aggregate([
      {
        $group: {
          _id: '$scoringMode',
          count: { $sum: 1 }
        }
      }
    ])

    // Group by interview length
    const interviewLengths = await UserSettingsModel.aggregate([
      {
        $group: {
          _id: '$interviewLength',
          count: { $sum: 1 }
        }
      }
    ])

    console.log('═══════════════════════════════════════')
    console.log('📝 SESSIONS')
    console.log('═══════════════════════════════════════')
    console.log(`Total Sessions: ${totalSessions}`)
    console.log(`Unique Users: ${uniqueUsers.length}`)
    
    if (oldestSession && newestSession) {
      console.log(`Date Range: ${new Date(oldestSession.startedAt).toLocaleDateString()} - ${new Date(newestSession.startedAt).toLocaleDateString()}`)
    }

    console.log('\n═══════════════════════════════════════')
    console.log('⚙️  USER SETTINGS')
    console.log('═══════════════════════════════════════')
    console.log(`Total Users with Settings: ${totalUserSettings}`)
    
    console.log('\nScoring Modes:')
    scoringModes.forEach(mode => {
      console.log(`  ${mode._id || 'undefined'}: ${mode.count} user(s)`)
    })

    console.log('\nInterview Lengths:')
    interviewLengths.sort((a, b) => a._id - b._id).forEach(length => {
      console.log(`  ${length._id} questions: ${length.count} user(s)`)
    })

    // Most popular AI models
    const aiModels = await UserSettingsModel.aggregate([
      {
        $group: {
          _id: '$aiModel',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    console.log('\nAI Models:')
    aiModels.forEach(model => {
      const modelName = model._id?.split('/').pop()?.split(':')[0] || 'default'
      console.log(`  ${modelName}: ${model.count} user(s)`)
    })

    console.log('\n═══════════════════════════════════════')
    console.log('👥 TOP USERS BY SESSIONS')
    console.log('═══════════════════════════════════════')
    
    const topUsers = await SessionModel.aggregate([
      {
        $group: {
          _id: '$userEmail',
          sessionCount: { $sum: 1 },
          totalQuestions: { $sum: { $size: { $ifNull: ['$questions', []] } } }
        }
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 }
    ])

    topUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user._id}`)
      console.log(`   Sessions: ${user.sessionCount}, Questions: ${user.totalQuestions}`)
    })

    console.log('\n═══════════════════════════════════════\n')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

viewStats()
