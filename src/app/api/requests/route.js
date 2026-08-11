import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Request from '@/models/Request';

// GET /api/requests - Fetch all requests
export async function GET() {
  try {
    await dbConnect();
    const requests = await Request.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests || [] }, { status: 200 });
  } catch (error) {
    console.error('GET /api/requests Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

// POST /api/requests - Create a new request
export async function POST(request) {
  try {
    await dbConnect();
    
    // Safely parse JSON payload
    const body = await request.json().catch(() => ({}));

    if (!body || !body.toolId) {
      return NextResponse.json(
        { success: false, error: 'Missing toolId in payload' },
        { status: 400 }
      );
    }

    const newRequest = await Request.create({
      toolId: String(body.toolId),
      toolTitle: String(body.toolTitle || 'Tool Listing'),
      borrowerName: String(body.borrowerName || 'Guest User'),
      startDate: String(body.startDate || ''),
      endDate: String(body.endDate || ''),
      deposit: Number(body.deposit || 0),
      status: body.status || 'Pending',
    });

    return NextResponse.json(
      { success: true, data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/requests Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}