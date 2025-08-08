// packages/database/drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/blog.db',
  },
  verbose: true,
  strict: true,
} satisfies Config