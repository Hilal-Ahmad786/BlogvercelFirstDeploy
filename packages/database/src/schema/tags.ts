// packages/database/src/schema/tags.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  postCount: integer('post_count').notNull().default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})