import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import twilio from "twilio";
import { isAdmin } from "@/app/lib/authUtils";

// Initialize Twilio client lazily, so a missing/invalid SID doesn't throw at
// module evaluation (which happens during `next build` page-data collection).
function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function POST(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { messageContent } = await req.json();

    if (!messageContent) {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 });
    }
    
    // Fetch all subscribers who have a phone number
    const { data: subscribers, error } = await supabase()
      .from("subscribers")
      .select("phone")
      .not("phone", "is", null)
      .neq("phone", "");

    if (error) throw error;

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers with a phone number found." }, { status: 200 });
    }

    const twilioClient = getTwilioClient();

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