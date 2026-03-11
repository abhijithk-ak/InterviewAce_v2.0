/**
 * Clear Old Research Data Script
 * Removes interview sessions older than a specified number of days
 * Run with: npx tsx scripts/clear-old-sessions.ts [days]
 * Example: npx tsx scripts/clear-old-sessions.ts 7  (deletes sessions older than 7 days)
 */

import mongoose from 'mongoose'
import { connectDB } from '../src/lib/db/mongoose'
import { SessionModel } from '../src/lib/db/models/Session'

async function clearOldSessions() {
  const daysArg = process.argv[2]
  const days = daysArg ? parseInt(daysArg) : 30

  if (isNaN(days) || days < 1) {
    console.error('❌ Invalid number of days. Usage: npx tsx scripts/clear-old-sessions.ts [days]')
    process.exit(1)
  }

  console.log(`🧹 Clearing sessions older than ${days} days...\n`)

  try {
    await connectDB()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const count = await SessionModel.countDocuments({
      startedAt: { $lt: cutoffDate }
    })

    if (count === 0) {
      console.log(`✅ No sessions older than ${days} days found.`)
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log(`⚠️  Found ${count} session(s) older than ${days} days`)
    console.log(`⚠️  Cutoff date: ${cutoffDate.toLocaleDateString()}`)
    
    const result = await SessionModel.deleteMany({
      startedAt: { $lt: cutoffDate }
    })

    console.log(`\n✅ Deleted ${result.deletedCount} old session(s)`)
    console.log('📊 Database cleanup complete')
    
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

clearOldSessions()
