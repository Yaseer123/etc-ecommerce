import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
// Function to convert ReadableStream<Uint8Array> to Buffer
async function streamToBuffer(
  stream: ReadableStream<Uint8Array>,
): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Get form data
    const file = req.body ?? "";
    const filename = req.headers.get("x-vercel-filename") ?? "file.txt";
    const contentType = req.headers.get("content-type") ?? "text/plain";
    const fileType = `.${contentType.split("/")[1]}`;

    // construct final filename based on content-type if not provided
    const finalName = filename.includes(fileType)
      ? filename
      : `${filename}${fileType}`;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the ReadableStream to Buffer
    const buffer = await streamToBuffer(file);

    // Upload buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) reject(new Error(error.message ?? "Upload failed"));
          else resolve(result);
        })
        .end(buffer);
    });

    const { secure_url, public_id } = uploadResult as {
      secure_url: string;
      public_id: string;
    };

    return NextResponse.json({ secure_url, public_id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
