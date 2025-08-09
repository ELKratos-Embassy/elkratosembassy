import { Resend } from 'resend'
import clientPromise from '@/lib/mongodb'
import { getBlogs, getSermons } from '@/sanity/sanityUtil'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function sendWeeklyNewsletter() {
  const client = await clientPromise
  const db = client.db('church_website')
  const subscribers = await db.collection('subscribers').find({ subscribed: true }).toArray()

  // Get blogs and sermons from the past week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const blogs = (await getBlogs()).filter(b => new Date(b.publishedAt) > oneWeekAgo)
  const sermons = (await getSermons()).filter(s => new Date(s.eventDate) > oneWeekAgo)
  // const blogs = (await getBlogs())
  // const sermons = (await getSermons())

  if (blogs.length === 0 && sermons.length === 0) return

  const blogList = blogs.map(b => `<li><a href="https://elkratosembassy.org/blogs/${b.slug.current}">${b.title}</a></li>`).join('')
  const sermonList = sermons.map(s => `<li><a href="https://elkratosembassy.org/sermons/${s.slug.current}">${s.title}</a></li>`).join('')

  const html = `
    <h2>EL Kratos Embassy Weekly Digest</h2>
    ${blogs.length > 0 ? `<h3>New Blogs</h3><ul>${blogList}</ul>` : ''}
    ${sermons.length > 0 ? `<h3>New Sermons</h3><ul>${sermonList}</ul>` : ''}
    <p>If you wish to unsubscribe, <a href="https://elkratosembassy.org/unsubscribe?email=__EMAIL__">click here</a>.</p>
  `

  
  console.log("Subscribers", subscribers);
  for (const sub of subscribers) {
    console.log("Sub", sub)
    await resend.emails.send({
      from: 'El Kratos Embassy <newsletter@elkratosembassy.org>',
      to: [sub.email],
      subject: 'Your Weekly Digest from El Kratos Embassy',
      html: html.replace('__EMAIL__', encodeURIComponent(sub.email)),
    })
  }
}

sendWeeklyNewsletter().then(() => {
  console.log('Newsletter sent!')
  // process.exit(0)
})
