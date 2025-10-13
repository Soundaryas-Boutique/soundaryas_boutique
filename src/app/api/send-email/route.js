import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// This function will handle sending an email from the admin's contact modal
export async function POST(request) {
    try {
        const { to, subject, message } = await request.json();

        // This uses the SMTP credentials from your .env.local file
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS, // This must be a Google App Password
            },
        });

        // Define the email content
        const mailOptions = {
            from: `"Soundarya's Boutique Admin" <${process.env.SMTP_USER}>`, // Sender address
            to: to, // The customer's email address
            subject: subject, // The subject line from the form
            html: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <p>Hello,</p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <p>Sincerely,</p>
                    <p><strong>Soundarya's Boutique</strong></p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Email Sending Error:", error);
        return NextResponse.json({ message: "Failed to send email." }, { status: 500 });
    }
}