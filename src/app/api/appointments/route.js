// Make sure this path is correct for your project
import { connectDB } from "../../lib/mongoose"; 
// Make sure this path is correct for your project
import Appointment from "../../(models)/Appointment";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, appointmentType, preferredDate, timeSlot } = body;
    if (!fullName || !email || !phone || !appointmentType || !preferredDate || !timeSlot) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    await connectDB();
    const newAppointment = await Appointment.create(body);
    return NextResponse.json({ message: 'Appointment request submitted!', appointment: newAppointment }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: 'Error submitting appointment' }, { status: 500 });
  }
}

export async function GET() {
    try {
        await connectDB();
        const appointments = await Appointment.find({}).sort({ preferredDate: -1 }); 
        return NextResponse.json({ appointments });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: 'Error fetching appointments' }, { status: 500 });
    }
}