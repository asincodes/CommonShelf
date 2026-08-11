import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';

// PUT /api/tools/[id] - Update a tool by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedTool = await Tool.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
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

// DELETE /api/tools/[id] - Remove a tool from MongoDB
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedTool = await Tool.findByIdAndDelete(id);

    if (!deletedTool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
      data: deletedTool,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}