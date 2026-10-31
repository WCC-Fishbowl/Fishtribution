import { NextRequest, NextResponse } from "next/server";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const files = new Files({ adapter: neon({ bucket: "taxon-images" }) });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const storedFile = await files.download(decodeURIComponent(key));
  
  // Adjust based on what StoredFile actually exposes
  const bytes = await storedFile.arrayBuffer();
  const contentType = storedFile.contentType || "image/jpeg";

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

