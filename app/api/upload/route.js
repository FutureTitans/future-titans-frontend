import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Log the file details silently; the client logic will pass this string to Express
        console.log('Vercel Blob EDGE: uploaded successfully ->', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
