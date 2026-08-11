import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;

    // Target folder: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save file to disk
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Relative public URL
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Local Upload Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}