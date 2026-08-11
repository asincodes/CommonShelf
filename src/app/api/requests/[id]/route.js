import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import { NextResponse } from "next/server";

// PUT: Update an existing borrowing request (e.g., update status or mark returned)
export async function PUT(request, context) {
  try {
    await dbConnect();
    
    // Await params for Next.js App Router compatibility on Vercel
    const params = await context.params;
    const { id } = params;
    
    const body = await request.json();

    const updatedRequest = await Request.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE: Delete a borrowing request
export async function DELETE(request, context) {
  try {
    await dbConnect();
    
    // Await params for Next.js App Router compatibility on Vercel
    const params = await context.params;
    const { id } = params;

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}