import { connectDB } from "../../../../lib/mongoose";
import TailoringOrder from "../../../../(models)/TailoringOrder";
import { NextResponse } from 'next/server';

// This function fetches all tailoring orders for a specific user by their email
export async function GET(request, { params }) {
    const { email } = params;

    if (!email) {
        return NextResponse.json({ message: 'User email is required' }, { status: 400 });
    }

    try {
        await connectDB();
        // Find all orders that match the user's email and sort by the newest first
        const orders = await TailoringOrder.find({ email }).sort({ submittedDate: -1 });
        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Fetch Tailoring Orders GET Error:", error);
        return NextResponse.json({ message: 'Error fetching tailoring orders' }, { status: 500 });
    }
}