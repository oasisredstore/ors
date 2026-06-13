import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getSession } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// A5 FIX: Map of MIME type → expected leading magic bytes.
// We validate the raw file bytes instead of trusting the browser-supplied
// Content-Type header, which can be trivially forged.
const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46], // "RIFF" — webp container
  "image/avif": [0x00, 0x00, 0x00], // AVIF/ISOBMFF — partial check
};

function hasValidMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return false;
  return expected.every((byte, i) => buffer[i] === byte);
}

export async function POST(request: NextRequest) {
  // A4 FIX: Require an authenticated session before accepting any upload.
  // Previously this endpoint was completely open to anonymous callers.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP, or AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // A5 FIX: Validate magic bytes before writing anything to disk.
    if (!hasValidMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match the declared type." },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Use a cryptographically random suffix to avoid enumerable filenames.
    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
