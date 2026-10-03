import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Missing token or password" }),
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase()
      .from("users")
      .select("id")
      .eq("resetToken", token)
      .gt("resetTokenExpiry", new Date().toISOString())
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase()
      .from("users")
      .update({
        password: await bcrypt.hash(password, 10),
        resetToken: null,
        resetTokenExpiry: null,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

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
