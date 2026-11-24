import { NextRequest, NextResponse } from "next/server";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import sharp from "sharp";
import { authServer } from "@/lib/auth/guard";
import { uploadTaxonImage } from "@/lib/db";

const publicAssets = new Files({ adapter: neon({ bucket: "public-assets" }) });

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await authServer(true);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const taxonId = formData.get("taxonId") as string;

    // 2. Validation
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images" }, { status: 400 });
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // 3. Transform: resize to max dimension + quality control
    const buffer = Buffer.from(await file.arrayBuffer());
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    const resized = await sharpInstance
      .resize({ width: 1920, height: 1920, fit: "inside" }) // max width
      .jpeg({ quality: 85 })
      .toBuffer();

    // 4. Generate key
    const ext = ".jpg";
    const key = `${crypto.randomUUID()}${ext}`;

    // 5. Upload
    await publicAssets.upload(key, resized, {
      contentType: "image/jpeg",
    });

    // 6. Create DB record (Postgres/Neon)
    const result = await uploadTaxonImage(session, taxonId, key, file.size, metadata.width, metadata.height);

    // 7. Return structured response
    return NextResponse.json({
      success: true,
      id: result[0]?.id,
      url: `/api/files/taxon_images/${encodeURIComponent(key)}`,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
