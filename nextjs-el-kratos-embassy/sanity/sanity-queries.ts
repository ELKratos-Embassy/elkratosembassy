import { groq } from 'next-sanity'

export const blogsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    tag,
    message,
    author,
    publishedAt,
    featuredImage,
    additionalImage,
    content,
    featured
  }
`

export const blogQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tag,
    message,
    author,
    publishedAt,
    featuredImage,
    additionalImage,
    content,
    featured
  }
`

export const sermonsQuery = groq`
  *[_type == "sermon"] | order(eventDate desc) {
    _id,
    title,
    slug,
    description,
    eventDate,
    times,
    location,
    featuredImage,
    featured,
    status
  }
`

export const sermonQuery = groq`
  *[_type == "sermon" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    eventDate,
    times,
    location,
    featuredImage,
    featured,
    status
  }
`

export const featuredBlogQuery = groq`
  *[_type == "blog" && featured == true] | order(publishedAt desc)[0] {
    _id,
    title,
    slug,
    tag,
    message,
    author,
    publishedAt,
    featuredImage,
    additionalImage,
    content,
    featured
  }
`

export const featuredSermonQuery = groq`
  *[_type == "sermon" && featured == true && status == "upcoming"] | order(eventDate asc)[0] {
    _id,
    title,
    slug,
    description,
    eventDate,
    times,
    location,
    featuredImage,
    featured,
    status
  }
`