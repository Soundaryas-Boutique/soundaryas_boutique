import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: sarees, error } = await supabase()
      .from("sarees")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
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

  try {
    const data = await request.json();
    const { id, ...insertData } = data;

    const { data: newSaree, error } = await supabase()
      .from("sarees")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
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

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing saree id" }, { status: 400 });
    }

    const { data: updatedSaree, error } = await supabase()
      .from("sarees")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updatedSaree) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSaree);
  } catch (err) {
    console.error("API PUT Error:", err);
    return NextResponse.json({ error: "Failed to update saree", details: err.message }, { status: 500 });
  }
}
