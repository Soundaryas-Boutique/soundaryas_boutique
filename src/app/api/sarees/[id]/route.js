import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const saree = await Saree.findById(id);

    if (!saree) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }

    return NextResponse.json(saree);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch saree" },
      { status: 500 }
    );
  }
}
