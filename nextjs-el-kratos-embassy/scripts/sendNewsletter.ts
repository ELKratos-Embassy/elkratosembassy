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

  if (blogs.length === 0 && sermons.length === 0) return

  const blogRows = blogs.map(b => `
    <tr>
      <td style="padding: 10px 10px;">
        <a href="https://elkratosembassy.org/blogs/${b.slug.current}" style="color: #A54E2B; text-decoration: underline;">
          ${b.title}
        </a>
      </td>
    </tr>
  `).join('')

  const sermonRows = sermons.map(s => `
    <tr>
      <td style="padding: 10px 10px;">
        <a href="https://elkratosembassy.org/sermons/${s.slug.current}" style="color: #A54E2B; text-decoration: underline;">
          ${s.title}
        </a>
      </td>
    </tr>
  `).join('')

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 10px; margin: 0;">
      <div style="max-width: 600px; margin: 24px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; overflow: hidden;">
        <div style="padding: 24px 24px 0 24px;">
          <h2 style="color: #A54E2B; margin-bottom: 18px;">EL Kratos Embassy Weekly Digest</h2>
          <p style="font-size: 15px; color: #555; margin-bottom: 24px;">
            Here are the latest updates from EL Kratos Embassy this week.
          </p>
        </div>
        <div style="padding: 0 24px 24px 24px;">
          ${blogs.length > 0 ? `
            <h3 style="color: #A54E2B; margin-bottom: 8px;">New Blogs</h3>
            <table style="width: 100%; font-size: 16px; color: #222; border-collapse: collapse; background: #f6f6f6; border-radius: 8px; margin-bottom: 24px;">
              ${blogRows}
            </table>
          ` : ''}
          ${sermons.length > 0 ? `
            <h3 style="color: #A54E2B; margin-bottom: 8px;">New Sermons</h3>
            <table style="width: 100%; font-size: 16px; color: #222; border-collapse: collapse; background: #f6f6f6; border-radius: 8px;">
              ${sermonRows}
            </table>
          ` : ''}
        </div>
        <div style="padding: 0 24px 24px 24px;">
          <p style="font-size: 13px; color: #888; margin: 0;">
            If you wish to unsubscribe, <a href="https://elkratosembassy.org/unsubscribe?email=__EMAIL__" style="color: #A54E2B;">click here</a>.<br>
            <em>This message was sent from the EL Kratos Embassy newsletter system.</em>
          </p>
        </div>
      </div>
      <style>
        @media only screen and (max-width: 600px) {
          table, tr, td {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box;
          }
          td {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      </style>
    </div>
  `

  for (const sub of subscribers) {
    await resend.emails.send({
      from: 'EL Kratos Embassy <newsletter@elkratosembassy.org>',
      to: [sub.email],
      subject: 'Your Weekly Digest from EL Kratos Embassy',
      html: html.replace('__EMAIL__', encodeURIComponent(sub.email)),
    })
  }
}

sendWeeklyNewsletter().then(() => {
  console.log('Newsletter sent!')
  process.exit();
})
