import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";

export async function GET(request, { params }) {
  await connectDB();
  const { category } = await params;

  const sarees = await Saree.find({ category });

  if (!sarees || sarees.length === 0) {
    return NextResponse.json({ error: "No sarees found" }, { status: 404 });
  }

  return NextResponse.json(sarees);
}
