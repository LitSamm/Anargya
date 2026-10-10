import { NextResponse } from 'next/server';
import { isRequestAuthenticatedAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Check admin authentication in production, permit in dev or if authed
    const isAuthed = isRequestAuthenticatedAdmin(request);
    if (!isAuthed && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate mime type and extension
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'image/avif',
    ];
    const originalName = file.name || 'product-image.webp';
    const ext = (path.extname(originalName) || '.webp').toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif'];

    const isValidType = allowedTypes.includes(file.type);
    const isValidExt = allowedExts.includes(ext);

    if (!isValidType && !isValidExt) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${file.type || ext}. Allowed: JPG, PNG, WEBP, SVG, GIF`,
        },
        { status: 400 }
      );
    }

    // Max size: 15MB
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 15MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize file name and create unique name
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}-${baseName}${ext}`;

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${fileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
        size: file.size,
      });
    } catch {
      // In serverless environments like Vercel, the filesystem is read-only (EROFS).
      // Fallback: convert file to a Data URL (base64) so it works seamlessly!
      const mime = file.type || 'image/webp';
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mime};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName,
        size: file.size,
        isDataUrl: true,
      });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to return available local media from public/images and public/uploads
export async function GET() {
  const available: { name: string; url: string; category: string }[] = [];

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Core merchandise images
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      for (const file of files) {
        if (/\.(webp|png|jpe?g|svg)$/i.test(file)) {
          available.push({
            name: file.replace(/\.[^/.]+$/, ''),
            url: `/images/${file}`,
            category: 'Team Assets',
          });
        }
      }
    }

    // Uploaded images
    if (fs.existsSync(uploadsDir)) {
      const uploads = fs.readdirSync(uploadsDir);
      for (const file of uploads) {
        if (/\.(webp|png|jpe?g|svg)$/i.test(file)) {
          available.push({
            name: file.replace(/^\d+-/, '').replace(/\.[^/.]+$/, ''),
            url: `/uploads/${file}`,
            category: 'Uploaded Files',
          });
        }
      }
    }
  } catch {
    // Ignore fs errors in serverless
  }

  // Ensure core team assets are always present even on serverless
  if (available.length === 0) {
    available.push(
      { name: 'Blueprint Tee', url: '/images/Tee.webp', category: 'Team Assets' },
      { name: 'Sticker Pack', url: '/images/Sticker Pack.webp', category: 'Team Assets' },
      { name: 'Achievement Tumbler', url: '/images/Tumbler.webp', category: 'Team Assets' },
      { name: 'Logo Enamel Pin', url: '/images/enamel.webp', category: 'Team Assets' },
    );
  }

  return NextResponse.json({ success: true, items: available });
}
