import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { title, category, image_url, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        const emailContent = `
            <h2>New User Contribution</h2>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Category:</strong> ${category}</p>
            ${image_url ? `<p><strong>Image:</strong> <a href="${image_url}">${image_url}</a></p>` : ''}
            <hr />
            <h3>Content (Markdown):</h3>
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${content}</pre>
            <hr />
            <p><small>Sent from iRacing Wiki User Contribution Form</small></p>
        `;

        // Send to yourself (or a configured admin email)
        // Since we don't have a verified domain yet, we can't send to arbitrary emails if testing with 'onboarding@resend.dev'
        // But for production with a verified domain, 'from' should be 'no-reply@yourdomain.com'
        // For now, assuming you might be verifying or testing, we'll try to send.
        // NOTE: If using the 'onboarding@resend.dev' domain, you can ONLY send to the email address you signed up with.

        const data = await resend.emails.send({
            from: 'iRacing Wiki Contribution <wiki_contribute@mail.congdeng.me>',
            to: [process.env.ADMIN_EMAIL || 'dcdb723@gmail.com'],
            subject: `[Wiki Contribution] ${title}`,
            html: emailContent,
        });

        if (data.error) {
            console.error("Resend Error:", data.error);
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("Contribution API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
