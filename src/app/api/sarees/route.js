import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";

export async function GET() {
  await connectDB();
  try {
    const sarees = await Saree.find({});
    return NextResponse.json(sarees);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch sarees" },
      { status: 500 }
    );
  }
}