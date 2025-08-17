import dbConnect from "@/app/lib/mongoose_subb";
import Subscriber from "@/app/(models)/Subscriber";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, phone, exclusive } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    const subscriber = new Subscriber({ name, email, phone, exclusive });
    await subscriber.save();

    return new Response(
      JSON.stringify({ success: true, message: "Subscribed successfully!" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Subscription error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
