import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import { updateMemoryTool, deleteMemoryTool } from '@/lib/store';

// PUT /api/tools/[id] - Update a tool by ID
export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    await dbConnect();
    const updatedTool = await Tool.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (updatedTool) {
      return NextResponse.json({ success: true, data: updatedTool });
    }
  } catch (error) {
    console.warn('MongoDB PUT tool failed, using fallback store:', error.message);
  }

  const updatedMemoryTool = updateMemoryTool(id, body);
  if (updatedMemoryTool) {
    return NextResponse.json({ success: true, data: updatedMemoryTool, fallback: true });
  }

  return NextResponse.json(
    { success: false, error: 'Tool not found' },
    { status: 404 }
  );
}

// DELETE /api/tools/[id] - Remove a tool from MongoDB or fallback store
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();
    const deletedTool = await Tool.findByIdAndDelete(id);

    if (deletedTool) {
      return NextResponse.json({
        success: true,
        message: 'Listing deleted successfully',
        data: deletedTool,
      });
    }
  } catch (error) {
    console.warn('MongoDB DELETE tool failed, using fallback store:', error.message);
  }

  const deletedMemoryTool = deleteMemoryTool(id);
  if (deletedMemoryTool) {
    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
      data: deletedMemoryTool,
      fallback: true,
    });
  }

  return NextResponse.json(
    { success: false, error: 'Tool not found' },
    { status: 404 }
  );
}