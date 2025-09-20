import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// DELETE: remove saree by id (admin only)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const { id } = params;
    const deleted = await Saree.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete saree" }, { status: 500 });
  }
}
