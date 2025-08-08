// packages/database/src/migrate.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'

const sqlite = new Database('./data/blog.db')
const db = drizzle(sqlite, { schema })

async function runMigrations() {
  console.log('⏳ Running migrations...')
  
  try {
    // Ensure data directory exists
    const fs = require('fs')
    const path = require('path')
    
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log('📁 Created data directory')
    }

    // Run migrations
    await migrate(db, { migrationsFolder: './migrations' })
    console.log('✅ Migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    sqlite.close()
  }
}

runMigrations().catch((error) => {
  console.error('Migration script failed:', error)
  process.exit(1)
})