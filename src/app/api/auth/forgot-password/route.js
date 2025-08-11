import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    console.log("Email received:", email);

    // ✅ Step 1: Validate email before anything else
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(
        JSON.stringify({ message: "Invalid email address" }),
        { status: 400 }
      );
    }

    // ✅ Step 2: Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Security best practice: don't reveal if email exists
      return new Response(
        JSON.stringify({ message: "If that email exists, a reset link has been sent." }),
        { status: 200 }
      );
    }

    // ✅ Step 3: Generate reset token + expiry
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // ✅ Step 4: Build reset URL safely
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
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

    return new Response(
      JSON.stringify({ message: "If that email exists, a reset link has been sent." }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Forgot password error:", err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
