import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Saree from "@/app/(models)/Saree";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// GET: fetch a single saree by ID (admin only)
export async function GET(req, context) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Unwrap params
  const { id } = await context.params;

  try {
    const saree = await Saree.findById(id);
    if (!saree) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }
    return NextResponse.json(saree);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch saree" }, { status: 500 });
  }
}

// PUT: update a saree by ID (admin only)
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const body = await req.json();
    const updated = await Saree.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update saree" }, { status: 500 });
  }
}

// DELETE: remove saree by id (admin only)
export async function DELETE(req, context) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Unwrap params
  const { id } = await context.params;

  try {
    const deleted = await Saree.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete saree" }, { status: 500 });
  }
}
