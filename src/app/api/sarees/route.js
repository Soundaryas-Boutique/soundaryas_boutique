import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Saree from "@/app/(models)/Saree";
import { isAdmin } from "@/app/lib/authUtils";

export async function GET(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const sarees = await Saree.find({});
    return NextResponse.json(sarees);
  } catch (err) {
    console.error("API GET Error:", err);
    return NextResponse.json({ error: "Failed to fetch sarees" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const data = await request.json();
    const newSaree = await Saree.create(data);
    return NextResponse.json(newSaree, { status: 201 });
  } catch (err) {
    console.error("API POST Error:", err);
    return NextResponse.json({ error: "Failed to add saree", details: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const data = await request.json();
    const { _id, ...updateData } = data;
    const updatedSaree = await Saree.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedSaree);
  } catch (err) {
    console.error("API PUT Error:", err);
    return NextResponse.json({ error: "Failed to update saree", details: err.message }, { status: 500 });
  }
}