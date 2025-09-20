import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// POST: add new saree (admin only)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const data = await request.json();
    const newSaree = await Saree.create(data);
    return NextResponse.json(newSaree, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add saree" }, { status: 500 });
  }
}

// PUT: edit saree (admin only)
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const data = await request.json();
    const { _id, ...updateData } = data;
    const updatedSaree = await Saree.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedSaree);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update saree" }, { status: 500 });
  }
}
