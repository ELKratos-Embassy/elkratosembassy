import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getBlogs, getSermons } from "@/src/sanity/sanityUtil";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { subscribed: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, message: "No active subscribers." });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const blogs = (await getBlogs()).filter((blog) => new Date(blog.publishedAt) > oneWeekAgo);
    const sermons = (await getSermons()).filter(
      (sermon) => new Date(sermon.eventDate) > oneWeekAgo
    );

    if (blogs.length === 0 && sermons.length === 0) {
      return NextResponse.json({ message: "No new content this week." });
    }

    const blogRows = blogs
      .map(
        (blog) => `
    <tr>
      <td style="padding: 10px 10px;">
        <a href="https://elkratosembassy.org/blogs/${blog.slug.current}" style="color: #A54E2B; text-decoration: underline;">
          ${blog.title}
        </a>
      </td>
    </tr>
  `
      )
      .join("");

    const sermonRows = sermons
      .map(
        (sermon) => `
    <tr>
      <td style="padding: 10px 10px;">
        <a href="https://elkratosembassy.org/sermons/${sermon.slug.current}" style="color: #A54E2B; text-decoration: underline;">
          ${sermon.title}
        </a>
      </td>
    </tr>
  `
      )
      .join("");

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
          ${
            blogs.length > 0
              ? `
            <h3 style="color: #A54E2B; margin-bottom: 8px;">New Blogs</h3>
            <table style="width: 100%; font-size: 16px; color: #222; border-collapse: collapse; background: #f6f6f6; border-radius: 8px; margin-bottom: 24px;">
              ${blogRows}
            </table>
          `
              : ""
          }
          ${
            sermons.length > 0
              ? `
            <h3 style="color: #A54E2B; margin-bottom: 8px;">New Sermons</h3>
            <table style="width: 100%; font-size: 16px; color: #222; border-collapse: collapse; background: #f6f6f6; border-radius: 8px;">
              ${sermonRows}
            </table>
          `
              : ""
          }
        </div>
        <div style="padding: 0 24px 24px 24px;">
          <p style="font-size: 13px; color: #888; margin: 0;">
            If you wish to unsubscribe, <a href="https://elkratosembassy.org/unsubscribe?email=__EMAIL__" style="color: #A54E2B;">click here</a>.<br>
            <em>This message was sent from the EL Kratos Embassy newsletter system.</em>
          </p>
        </div>
      </div>
    </div>
  `;

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: "EL Kratos Embassy <newsletter@elkratosembassy.org>",
          to: [subscriber.email],
          subject: "Your Weekly Digest from EL Kratos Embassy",
          html: html.replace("__EMAIL__", encodeURIComponent(subscriber.email)),
        });
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error(`[newsletter-cron] failed to send to ${subscriber.email}:`, error);
      }
    }

    return NextResponse.json({ message: "Newsletter sent!", sent, failed, total: subscribers.length });
  } catch (error) {
    console.error("[newsletter-cron]", error);
    return NextResponse.json({ error: "Cron job failed." }, { status: 500 });
  }
}
