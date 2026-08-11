import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Request from '@/models/Request';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedRequest = await Request.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: 'Request record not found' },
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

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, error: 'Request record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully',
      data: deletedRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}