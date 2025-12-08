import { SanityImageObject } from "@sanity/image-url"

export interface SanityBlog {
  _id: string
  title: string
  slug: { current: string }
  tag: string
  message: string
  author: string
  publishedAt: string
  featuredImage: SanityImageObject
  additionalImage?: SanityImageObject
  content: Array<{
    title: string
    content: string[]
    quote?: string
    list?: string[]
  }>
  featured: boolean
}

export interface SanitySermon {
  _id: string
  title: string
  slug: { current: string }
  description: string[]
  eventDate: string
  times: string[]
  location: string[]
  featuredImage?: SanityImageObject
  featured: boolean
  status: 'upcoming' | 'completed' | 'cancelled'
}