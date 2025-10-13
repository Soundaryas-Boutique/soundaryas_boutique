// Make sure this path is correct for your project
import { connectDB } from "../../../lib/mongoose"; 
// Make sure this path is correct for your project
import Appointment from "../../../(models)/Appointment";
import { NextResponse } from 'next/server';

// --- Function to UPDATE the status of an appointment ---
export async function PUT(request, { params }) {
  const { id } = params;
  const { status } = await request.json();

  if (!status || !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
  }

  try {
    await connectDB();
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id, 
      { status }, // Only update the status field
      { new: true } // Return the updated document
    );
    
    if (!updatedAppointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Status updated!', appointment: updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: 'Error updating status' }, { status: 500 });
  }
}