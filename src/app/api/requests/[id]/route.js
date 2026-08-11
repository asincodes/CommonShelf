import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import { NextResponse } from "next/server";
import { updateMemoryRequest, deleteMemoryRequest } from "@/lib/store";

// PUT: Update an existing borrowing request
export async function PUT(request, context) {
  const params = await context.params;
  const { id } = params;
  const body = await request.json().catch(() => ({}));

  try {
    await dbConnect();
    const updatedRequest = await Request.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (updatedRequest) {
      return NextResponse.json({ success: true, data: updatedRequest });
    }
  } catch (error) {
    console.warn('MongoDB PUT request failed, using fallback store:', error.message);
  }

  const updatedMemoryReq = updateMemoryRequest(id, body);
  if (updatedMemoryReq) {
    return NextResponse.json({ success: true, data: updatedMemoryReq, fallback: true });
  }

  return NextResponse.json(
    { success: false, error: "Request not found" },
    { status: 404 }
  );
}

// DELETE: Delete a borrowing request
export async function DELETE(request, context) {
  const params = await context.params;
  const { id } = params;

  try {
    await dbConnect();
    const deletedRequest = await Request.findByIdAndDelete(id);

    if (deletedRequest) {
      return NextResponse.json({ success: true, data: {} });
    }
  } catch (error) {
    console.warn('MongoDB DELETE request failed, using fallback store:', error.message);
  }

  deleteMemoryRequest(id);
  return NextResponse.json({ success: true, data: {}, fallback: true });
}