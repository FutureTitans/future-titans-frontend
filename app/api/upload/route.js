import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Automatically allow standard assets since we're using JWTs in other microservices.
        // The tokenPayload string ensures the blob payload has identifiable info if needed later.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'],
          tokenPayload: JSON.stringify({
            // could insert getAuthToken() claims here if needed
          }),
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
