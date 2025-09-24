import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// GET: fetch all sarees (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
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

// POST: add new saree (admin only)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  try {
    const data = await request.json();

    // 🐛 DEBUGGING STEP 1: Log the raw data received from the client
    console.log("Received payload for POST:", data);

    // 🐛 DEBUGGING STEP 2: Explicitly check for the images field
    if (!data.images || !Array.isArray(data.images)) {
      console.error("Validation Error: 'images' field is missing or not an array.");
      return NextResponse.json({ error: "Image data is missing or invalid. Please upload at least one image." }, { status: 400 });
    }

    // 🐛 DEBUGGING STEP 3: Check each image object
    for (const image of data.images) {
      if (!image.url) {
        console.error("Validation Error: An image is missing its URL.");
        return NextResponse.json({ error: "An image is missing a URL." }, { status: 400 });
      }
    }

    const newSaree = await Saree.create(data);

    console.log("Product saved successfully:", newSaree);
    return NextResponse.json(newSaree, { status: 201 });
  } catch (err) {
    // 🐛 DEBUGGING STEP 4: Log the full error to the server console
    console.error("API POST Error:", err);
    return NextResponse.json({ error: "Failed to add saree", details: err.message }, { status: 500 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const data = await request.json();
    console.log("Received payload for PUT:", data);

    // 🐛 DEBUGGING STEP 2: Explicitly check for the images field
    if (!data.images || !Array.isArray(data.images)) {
      console.error("Validation Error: 'images' field is missing or not an array.");
      return NextResponse.json({ error: "Image data is missing or invalid." }, { status: 400 });
    }
    
    const { _id, ...updateData } = data;
    const updatedSaree = await Saree.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedSaree) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    console.log("Product updated successfully:", updatedSaree);
    return NextResponse.json(updatedSaree);
  } catch (err) {
    console.error("API PUT Error:", err);
    return NextResponse.json({ error: "Failed to update saree", details: err.message }, { status: 500 });
  }
}