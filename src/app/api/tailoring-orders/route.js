import { connectDB } from "../../lib/mongoose";
import TailoringOrder from "../../(models)/TailoringOrder";
import { NextResponse } from 'next/server';

// --- Function to GET ALL tailoring orders (for the admin dashboard) ---
export async function GET() {
    try {
        await connectDB();
        // Find all tailoring orders and sort them by the newest submitted date
        const orders = await TailoringOrder.find({}).sort({ submittedDate: -1 }); 
        return NextResponse.json({ orders });
    } catch (error) {
        console.error("GET All Tailoring Orders Error:", error);
        return NextResponse.json({ message: 'Error fetching tailoring orders' }, { status: 500 });
    }
}

// --- Function to CREATE a new tailoring order from the customer form ---
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, garmentType, measurements, orderId } = body;

    // Basic validation for required fields
    if (!name || !email || !garmentType || !measurements || !orderId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newOrder = await TailoringOrder.create(body);
    
    return NextResponse.json(
      { message: 'Measurements submitted successfully!', order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Tailoring Order POST Error:", error);
    return NextResponse.json({ message: 'Error submitting measurements' }, { status: 500 });
  }
}