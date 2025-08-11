import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Missing token or password" }),
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password reset successful" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
