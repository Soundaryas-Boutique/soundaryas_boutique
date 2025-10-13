import { connectDB } from "../../../lib/mongoose";
import TailoringOrder from "../../../(models)/TailoringOrder";
import { NextResponse } from 'next/server';

// --- Function to UPDATE the status of a specific tailoring order ---
export async function PUT(request, { params }) {
  const { id } = params;
  const { status } = await request.json(); // Admin only sends the new status

  // Validate the incoming status to ensure it's one of the allowed values
  if (!status || !['Pending', 'In Progress', 'Alterations', 'Ready'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
  }

  try {
    await connectDB();
    
    const updatedOrder = await TailoringOrder.findByIdAndUpdate(
      id, 
      { status }, // Only update the status field
      { new: true } // This option returns the updated document
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ message: 'Tailoring order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Status updated!', order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Tailoring Order PUT Error:", error);
    return NextResponse.json({ message: 'Error updating order status' }, { status: 500 });
  }
}