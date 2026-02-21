import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Subscriber from "@/app/(models)/Subscriber";
import nodemailer from "nodemailer";
import { isAdmin } from "@/app/lib/authUtils";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateContent = (category, productName) => {
  switch (category) {
    case 'special_offer':
      return {
        subject: "🎉 Exclusive Sale Alert! 20% Off All Silk Sarees!",
        body: "Hello Subscriber,\n\nDon't miss out! For a limited time, enjoy 20% off our entire collection of exquisite Silk Sarees. Use code SILK20 at checkout.\n\nShop now: [Link to your site]",
      };
    case 'new_product':
      return {
        subject: `✨ New Product: ${productName} Just Dropped!`,
        body: `Hello Subscriber,\n\nWe've just updated our collection with the beautiful new product: ${productName}. Be the first to see it!\n\nView Collection: [Link to your new products page]`,
      };
    case 'restocked':
      return {
        subject: `🛍️ Back in Stock! Your Favorite, ${productName}, Is Here!`,
        body: `Hello Subscriber,\n\nGreat news! The highly requested item, ${productName}, is back in stock. Quantities are limited, so grab yours before it sells out again!\n\nCheck availability: [Link to product page]`,
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
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    await connectDB();
    const { category, productName, professionTarget } = await req.json(); // ✅ Get professionTarget

    if (!category) {
      return NextResponse.json({ message: "Missing email category" }, { status: 400 });
    }
    
    // ✅ FIX: Conditionally filter subscribers based on professionTarget
    let query = {};
    if (professionTarget && professionTarget !== 'all') {
      query = { profession: professionTarget };
    }

    const subscribers = await Subscriber.find(query, 'email'); // ✅ Use the query to filter
    const subscriberEmails = subscribers.map(sub => sub.email).join(', ');

    if (subscriberEmails.length === 0) {
        return NextResponse.json({ message: `No subscribers found for profession: ${professionTarget}.` }, { status: 200 });
    }

    const { subject, body } = generateContent(category, productName);

    const mailOptions = {
      from: process.env.SMTP_USER,
      bcc: subscriberEmails,
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