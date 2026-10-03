import { supabase } from "@/app/lib/supabase";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // ✅ Step 1: Validate email before anything else
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(
        JSON.stringify({ message: "Invalid email address" }),
        { status: 400 }
      );
    }

    // Same response whether or not the address is registered, so this cannot be
    // used to enumerate accounts.
    const sent = JSON.stringify({
      message: "If that email exists, a reset link has been sent.",
    });

    // ✅ Step 2: Check if user exists
    const { data: user, error } = await supabase()
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return new Response(sent, { status: 200 });
    }

    // ✅ Step 3: Generate reset token + expiry
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    const { error: updateError } = await supabase()
      .from("users")
      .update({ resetToken: token, resetTokenExpiry: tokenExpiry })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // ✅ Step 4: Build reset URL safely
    const baseUrl = process.env.NEXTAUTH_URL;
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    // ✅ Step 5: Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✅ Step 6: Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });

    return new Response(sent, { status: 200 });

  } catch (err) {
    console.error("Forgot password error:", err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
