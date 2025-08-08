// packages/database/src/schema/index.ts
export * from './users'
export * from './posts'
export * from './categories'
export * from './tags'
export * from './postCategories'
export * from './postTags'
export * from './media'

// Relations
import { relations } from 'drizzle-orm'
import { users, posts, categories, tags, postCategories, postTags, media } from '.'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  media: many(media),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  categories: many(postCategories),
  tags: many(postTags),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(postCategories),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}))

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}))

export const mediaRelations = relations(media, ({ one }) => ({
  uploader: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
}))