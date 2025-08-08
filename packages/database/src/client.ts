// packages/database/src/client.ts
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// Create SQLite database
const sqlite = new Database(join(dataDir, 'blog.db'))
sqlite.exec('PRAGMA foreign_keys = ON')

export const db = drizzle(sqlite, { schema })

// Auto-migrate on startup
try {
  migrate(db, { migrationsFolder: join(__dirname, '../migrations') })
  console.log('✅ Database migrations completed')
} catch (error) {
  console.error('❌ Migration failed:', error)
}

export { sqlite }
export * from './schema'