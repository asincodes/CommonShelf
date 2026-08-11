import dbConnect from "@/lib/db";
import Tool from "@/models/Tool";
import { NextResponse } from "next/server";

// PUT: Update an existing tool listing
export async function PUT(request, context) {
  try {
    await dbConnect();
    
    // Await params for Next.js App Router compatibility in production (Vercel)
    const params = await context.params;
    const { id } = params;
    
    const body = await request.json();

    const updatedTool = await Tool.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTool) {
      return NextResponse.json(
        { success: false, error: "Tool not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTool });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE: Delete a tool listing
export async function DELETE(request, context) {
  try {
    await dbConnect();
    
    // Await params for Next.js App Router compatibility in production (Vercel)
    const params = await context.params;
    const { id } = params;

    const deletedTool = await Tool.findByIdAndDelete(id);

    if (!deletedTool) {
      return NextResponse.json(
        { success: false, error: "Tool not found" },
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