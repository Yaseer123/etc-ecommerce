"use server";

import { v2 as cloud, type UploadApiResponse } from "cloudinary";

cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadFile = async (
  data: FormData,
  filter = "",
): Promise<UploadApiResponse | undefined> => {
  const file = data.get("file");

  if (file instanceof File && file.type.startsWith("image")) {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
      cloud.uploader
        .upload_stream(
          { folder: filter, timeout: 120000 }, // Increased timeout
          (error, result) => {
            if (error) {
              console.error("Upload Error:", error);
              reject(new Error(error.message ?? "Upload failed"));
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });
  } else {
    throw new Error("Invalid file type. Only images are allowed.");
  }
};

export const readImagesBulk = async (imageIds: string[]) => {
  try {
    const results = await Promise.all(
      imageIds.map(async (id) => {
        try {
          const { secure_url } = (await cloud.api.resource(
            id,
          )) as UploadApiResponse;
          return { id, secure_url };
        } catch (error) {
          console.error(`Error fetching image ${id}:`, error);
          return null;
        }
      }),
    );
    return results.filter(
      (result): result is { id: string; secure_url: string } => result !== null,
    );
  } catch (error) {
    console.error("Bulk fetch error:", error);
    return [];
  }
};

export const readAllImages = async (filter: string) => {
  try {
    const { resources } = (await cloud.api.resources({
      prefix: filter,
      resource_type: "image",
      type: "upload",
    })) as { resources: UploadApiResponse[] };

    return resources
      .sort((a, b) => a.public_id.localeCompare(b.public_id))
      .map(({ secure_url, public_id }) => ({ secure_url, public_id }));
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const readImage = async (id: string) => {
  const { secure_url } = (await cloud.api.resource(id)) as UploadApiResponse;
  return secure_url;
};

export const removeImage = async (id: string) => {
  await cloud.uploader.destroy(id);
};

export const renameImages = async (images: { id: string; src: string }[]) => {
  for (let i = 0; i < images.length; i++) {
    const publicId = images[i]?.id;
    if (!publicId) continue;
    const parts = publicId.split("/");
    const prefix = parts.slice(0, -1).join("/");
    const newPublicId = `${prefix}/${String(i + 1).padStart(3, "0")}_${parts.pop()}`;
    await cloud.uploader.rename(publicId, newPublicId);
  }
};

// remove image with prefix
export const removeImageByPrefix = async (prefix: string) => {
  const { resources } = (await cloud.api.resources({
    type: "upload",
    prefix: prefix,
    max_results: 100,
  })) as { resources: UploadApiResponse[] };

  // 2. Extract public IDs
  const publicIds = resources.map((resource) => resource.public_id);

  // 3. Delete images by public ID
  await cloud.api.delete_resources(publicIds);
};
