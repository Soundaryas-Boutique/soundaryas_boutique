import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Subscriber from "@/app/(models)/Subscriber";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import nodemailer from "nodemailer";

// Helper to check admin status
const isAdmin = async (session) => {
  return session && session.user.role === "Admin";
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS (true for 465, false for 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to generate email content based on category
const generateContent = (category) => {
  switch (category) {
    case 'special_offer':
      return {
        subject: "🎉 Exclusive Sale Alert! 20% Off All Silk Sarees!",
        body: "Hello Subscriber,\n\nDon't miss out! For a limited time, enjoy 20% off our entire collection of exquisite Silk Sarees. Use code SILK20 at checkout.\n\nShop now: [Link to your site]",
      };
    case 'new_product':
      return {
        subject: "✨ New Arrivals! Fresh Cotton Sarees Just Dropped!",
        body: "Hello Subscriber,\n\nWe've just updated our collection with beautiful, lightweight Cotton Sarees perfect for any occasion. Be the first to see them!\n\nView Collection: [Link to your new products page]",
      };
    case 'restocked':
      return {
        subject: "🛍️ Back in Stock! Your Favorites Are Here!",
        body: "Hello Subscriber,\n\nGreat news! The highly requested 'Banarasi Crimson' is back in stock. Quantities are limited, so grab yours before it sells out again!\n\nCheck availability: [Link to product page]",
      };
    case 'random_buy':
      return {
        subject: "💌 A Little Something Just For You...",
        body: "Hello Subscriber,\n\nWe hope you're having a wonderful week. Remember to treat yourself! We offer the finest traditional wear with modern flair.\n\nBrowse now: [Link to your site]",
      };
    default:
      return { subject: "Newsletter Update", body: "A general update from Soundarya's Boutique." };
  }
};


export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!await isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    await connectDB();
    const { category } = await req.json();

    if (!category) {
      return NextResponse.json({ message: "Missing email category" }, { status: 400 });
    }
    
    // 1. Get all subscriber emails
    const subscribers = await Subscriber.find({}, 'email');
    const subscriberEmails = subscribers.map(sub => sub.email).join(', '); // Comma-separated string for Nodemailer BCC

    if (subscriberEmails.length === 0) {
        return NextResponse.json({ message: "No subscribers found to send email." }, { status: 200 });
    }

    // 2. Generate content
    const { subject, body } = generateContent(category);

    // 3. Send email using BCC (Blind Carbon Copy)
    const mailOptions = {
      from: process.env.SMTP_USER,
      bcc: subscriberEmails, // Send to all subscribers via BCC
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br>')}</p><p style="margin-top: 20px;">Thank you for subscribing to Soundarya's Boutique!</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);

    return NextResponse.json({ 
        message: `Email sent to ${subscribers.length} subscribers successfully!`, 
        success: true 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Send Email API Error:", error);
    return NextResponse.json({ 
        message: "Failed to send email. Check SMTP credentials or server logs.", 
        details: error.message 
    }, { status: 500 });
  }
}