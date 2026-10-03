import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";

// GET: fetch a single saree by ID (admin only)
export async function GET(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { data: saree, error } = await supabase()
      .from("sarees")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!saree) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }
    return NextResponse.json(saree);
  } catch (err) {
    console.error("Error fetching saree:", err);
    return NextResponse.json({ error: "Failed to fetch saree" }, { status: 500 });
  }
}

// PUT: update a saree by ID (admin only)
export async function PUT(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { id: _ignored, ...body } = await req.json();

    const { data: updated, error } = await supabase()
      .from("sarees")
      .update(body)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updated) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating saree:", err);
    return NextResponse.json({ error: "Failed to update saree" }, { status: 500 });
  }
}

// DELETE: remove saree by id (admin only)
export async function DELETE(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { data: deleted, error } = await supabase()
      .from("sarees")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!deleted) {
      return NextResponse.json({ error: "Saree not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("Error deleting saree:", err);
    return NextResponse.json({ error: "Failed to delete saree" }, { status: 500 });
  }
}
