import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Subscriber from "@/app/(models)/Subscriber";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import twilio from "twilio";

// Helper to check admin status
const isAdmin = async (session) => {
  return session && session.user.role === "Admin";
};

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!await isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    await connectDB();
    const { messageContent } = await req.json();

    if (!messageContent) {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 });
    }
    
    // Fetch all subscribers who have a phone number
    const subscribers = await Subscriber.find({ phone: { $exists: true, $ne: null } }, 'phone');

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers with a phone number found." }, { status: 200 });
    }

    const sendingPromises = subscribers.map(sub => {
      return twilioClient.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `whatsapp:${sub.phone}`, // Format the number for WhatsApp
        body: messageContent,
      });
    });

    await Promise.all(sendingPromises);

    return NextResponse.json({ 
      message: `WhatsApp message sent to ${subscribers.length} subscribers successfully!`,
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Send WhatsApp API Error:", error);
    return NextResponse.json({ 
      message: "Failed to send WhatsApp messages. Check Twilio credentials or server logs.", 
      details: error.message 
    }, { status: 500 });
  }
}