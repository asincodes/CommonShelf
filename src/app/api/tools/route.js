import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import { getMemoryTools, addMemoryTool } from '@/lib/store';

// GET /api/tools - Fetch all tool listings
export async function GET() {
  try {
    await dbConnect();
    const tools = await Tool.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    console.warn('Failed to fetch tools from MongoDB, using fallback memory store:', error.message);

    return NextResponse.json({
      success: true,
      data: getMemoryTools(),
      fallback: true,
    });
  }
}

// POST /api/tools - Create a new tool listing
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  try {
    await dbConnect();

    const tool = await Tool.create({
      ...body,
      lat: Number.isFinite(Number(body.lat)) ? Number(body.lat) : 12.9716,
      lng: Number.isFinite(Number(body.lng)) ? Number(body.lng) : 77.5946,
    });

    return NextResponse.json(
      {
        success: true,
        data: tool,
      },
      { status: 201 }
    );
  } catch (error) {
    console.warn('Failed to create tool in MongoDB, using fallback memory store:', error.message);

    const fallbackTool = addMemoryTool(body);
    return NextResponse.json(
      {
        success: true,
        data: fallbackTool,
        fallback: true,
      },
      { status: 201 }
    );
  }
}

