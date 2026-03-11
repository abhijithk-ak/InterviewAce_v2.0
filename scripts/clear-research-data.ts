/**
 * Clear Research Data Script
 * Removes all interview sessions from database for fresh testing
 * Run with: npx tsx scripts/clear-research-data.ts
 */

import mongoose from 'mongoose'
import { connectDB } from '../src/lib/db/mongoose'
import { SessionModel } from '../src/lib/db/models/Session'
import readline from 'readline'

async function clearResearchData() {
  console.log('🧹 Research Data Cleanup Tool\n')
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    await connectDB()

    const count = await SessionModel.countDocuments()
    
    if (count === 0) {
      console.log('✅ Database is already empty. No sessions to delete.')
      rl.close()
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log(`⚠️  Found ${count} interview session(s) in database`)
    console.log('⚠️  This will DELETE ALL interview sessions permanently!\n')

    rl.question('Type "DELETE" to confirm: ', async (answer) => {
      try {
        if (answer === 'DELETE') {
          const result = await SessionModel.deleteMany({})
          console.log(`\n✅ Deleted ${result.deletedCount} session(s) successfully`)
          console.log('📊 Database is now clean and ready for fresh research data collection')
        } else {
          console.log('\n❌ Deletion cancelled')
        }
      } catch (error) {
        console.error('❌ Error deleting sessions:', error)
      } finally {
        rl.close()
        await mongoose.disconnect()
        process.exit(0)
      }
    })
  } catch (error) {
    console.error('❌ Connection error:', error)
    rl.close()
    await mongoose.disconnect()
    process.exit(1)
  }
}

clearResearchData().catch(async (error) => {
  console.error('Script error:', error)
  await mongoose.disconnect()
  process.exit(1)
})
