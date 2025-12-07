import { client } from '../lib/client'
import {
  blogsQuery,
  blogQuery,
  sermonsQuery,
  sermonQuery,
  featuredBlogQuery,
  featuredSermonQuery
} from './sanity-queries'
import { SanityBlog, SanitySermon } from '@/types/sanity'

export async function getBlogs(): Promise<SanityBlog[]> {
  try {
    const result = await client.fetch(blogsQuery)
    return result || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export async function getBlog(slug: string): Promise<SanityBlog | null> {
  try {
    const result = await client.fetch(blogQuery, { slug })
    return result || null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export async function getSermons(): Promise<SanitySermon[]> {
  try {
    const result = await client.fetch(sermonsQuery)
    return result || []
  } catch (error) {
    console.error('Error fetching sermons:', error)
    return []
  }
}

export async function getSermon(slug: string): Promise<SanitySermon | null> {
  try {
    const result = await client.fetch(sermonQuery, { slug })
    return result || null
  } catch (error) {
    console.error('Error fetching sermon:', error)
    return null
  }
}

export async function getFeaturedBlog(): Promise<SanityBlog | null> {
  try {
    const result = await client.fetch(featuredBlogQuery)
    return result || null
  } catch (error) {
    console.error('Error fetching featured blog:', error)
    return null
  }
}

export async function getFeaturedSermon(): Promise<SanitySermon | null> {
  try {
    const result = await client.fetch(featuredSermonQuery)
    return result || null
  } catch (error) {
    console.error('Error fetching featured sermon:', error)
    return null
  }
}

// Utility function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Utility function to get day and month for sermon cards
export function getDateParts(dateString: string) {
  const date = new Date(dateString)
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString('en-US', { month: 'long' }),
    year: date.getFullYear().toString()
  }
}