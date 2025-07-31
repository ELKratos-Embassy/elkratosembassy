import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, query, message } = await req.json()

  try {
    const data = await resend.emails.send({
      from: 'El Kratos Embassy <contact@elkratosembassy.org>',
      to: ['info@elkratosembassy.org'],
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 0; margin: 0;">
          <div style="max-width: 600px; margin: 24px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; overflow: hidden;">
            <div style="padding: 24px 24px 0 24px;">
              <h2 style="color: #A54E2B; margin-bottom: 12px;">New Contact Form Submission</h2>
              <p style="font-size: 14px; color: #888; margin-bottom: 0;">
                You are receiving this because someone filled out the contact form on the El Kratos Embassy website.
              </p>
              <p style="font-size: 13px; color: #888; margin: 8px 0 0 0;">
                <strong>When you reply to this email, your response will go directly to:</strong><br>
                <span style="color: #222;">${name} &lt;${email}&gt;</span>
              </p>
            </div>
            <hr style="margin: 24px 0 0 0; border: none; border-top: 1px solid #eee;" />
            <div style="padding: 24px;">
              <div style="font-size: 15px; color: #555; margin-bottom: 16px;">
                <strong>Below is a copy of the original message:</strong>
              </div>
              <div style="background: #f6f6f6; border-radius: 6px; padding: 16px;">
                <table style="width: 100%; font-size: 16px; color: #222; border-collapse: collapse;">
                  <tr>
                    <td style="font-weight: bold; padding: 8px 0; width: 120px; vertical-align: top; word-break: break-word;">Name:</td>
                    <td style="padding: 8px 0; word-break: break-word;">${name}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px 0; vertical-align: top; word-break: break-word;">Email:</td>
                    <td style="padding: 8px 0; word-break: break-word;">${email}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px 0; vertical-align: top; word-break: break-word;">Query:</td>
                    <td style="padding: 8px 0; word-break: break-word;">${query}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px 0; vertical-align: top; word-break: break-word;">Message:</td>
                    <td style="padding: 8px 0; white-space: pre-line; word-break: break-word;">${message}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div style="padding: 0 24px 24px 24px;">
              <p style="font-size: 13px; color: #888; margin: 0;">
                <em>This message was sent from the El Kratos Embassy website contact form.</em>
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
      `,
      text: `
        Name: ${name}
        Email: ${email}
        Query: ${query}
        Message: ${message}
      `,
    })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}