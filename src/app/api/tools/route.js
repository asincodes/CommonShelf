import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';

// GET /api/tools - Fetch all tool listings
export async function GET() {
  try {
    await dbConnect();
    const tools = await Tool.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tools || [] });
  } catch (error) {
    console.error('GET /api/tools Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' },
      { status: 500 }
    );
  }
}

// POST /api/tools - List a new tool
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Listings created from the form do not collect a location yet. Keep them
    // visible on the map by using the map's default Bengaluru center until a
    // location picker is added.
    const toolData = {
      ...body,
      lat: body.lat ?? 12.9716,
      lng: body.lng ?? 77.5946,
    };

    const newTool = await Tool.create(toolData);
    return NextResponse.json({ success: true, data: newTool }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tools Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create tool' },
      { status: 400 }
    );
  }
}
