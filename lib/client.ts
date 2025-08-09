import { apiVersion, dataset, projectId } from '@/sanity/env'
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for better performance in production
  perspective: 'published', // Only fetch published documents
})

// For server-side operations that need authentication
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
})
