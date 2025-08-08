// packages/database/src/create-tables.ts
import Database from 'better-sqlite3'
import { sql } from 'drizzle-orm'
import * as fs from 'fs'
import * as path from 'path'

const createTables = () => {
  console.log('🔨 Creating database tables manually...')

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log('📁 Created data directory')
  }

  const sqlite = new Database('./data/blog.db')

  try {
    // Users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'editor', 'author')),
        avatar TEXT,
        bio TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Posts table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image TEXT,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        featured INTEGER NOT NULL DEFAULT 0,
        view_count INTEGER NOT NULL DEFAULT 0,
        reading_time INTEGER,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        author_id TEXT NOT NULL REFERENCES users(id),
        published_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Categories table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT DEFAULT '#3B82F6',
        post_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Tags table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        post_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Post Categories junction table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS post_categories (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Post Tags junction table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS post_tags (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Media table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        width INTEGER,
        height INTEGER,
        url TEXT NOT NULL,
        alt_text TEXT,
        caption TEXT,
        uploaded_by TEXT NOT NULL REFERENCES users(id),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('✅ All tables created successfully')
    
    // Verify tables were created
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    console.log('📊 Created tables:', tables.map(t => t.name).join(', '))

  } catch (error) {
    console.error('❌ Failed to create tables:', error)
    throw error
  } finally {
    sqlite.close()
  }
}

createTables()