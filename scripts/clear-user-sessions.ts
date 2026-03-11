/**
 * Clear User Sessions Script
 * Removes all interview sessions for a specific user
 * Run with: npx tsx scripts/clear-user-sessions.ts [email]
 * Example: npx tsx scripts/clear-user-sessions.ts user@example.com
 */

import mongoose from 'mongoose'
import { connectDB } from '../src/lib/db/mongoose'
import { SessionModel } from '../src/lib/db/models/Session'
import readline from 'readline'

async function clearUserSessions() {
  const emailArg = process.argv[2]

  if (!emailArg) {
    console.error('❌ Email required. Usage: npx tsx scripts/clear-user-sessions.ts [email]')
    process.exit(1)
  }

  console.log(`🧹 Clearing sessions for user: ${emailArg}\n`)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    await connectDB()

    const count = await SessionModel.countDocuments({
      userEmail: emailArg
    })

    if (count === 0) {
      console.log(`✅ No sessions found for ${emailArg}`)
      rl.close()
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log(`⚠️  Found ${count} session(s) for ${emailArg}`)
    console.log(`⚠️  This will DELETE all sessions for this user!\n`)

    rl.question('Type "DELETE" to confirm: ', async (answer) => {
      try {
        if (answer === 'DELETE') {
          const result = await SessionModel.deleteMany({
            userEmail: emailArg
          })
          console.log(`\n✅ Deleted ${result.deletedCount} session(s)`)
          console.log('📊 User sessions cleared')
        } else {
          console.log('\n❌ Deletion cancelled')
        }
      } catch (error) {
        console.error('❌ Error:', error)
      } finally {
        rl.close()
        await mongoose.disconnect()
        process.exit(0)
      }
    })
  } catch (error) {
    console.error('❌ Error:', error)
    rl.close()
    await mongoose.disconnect()
    process.exit(1)
  }
}

clearUserSessions()
