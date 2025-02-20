"use server";

import { v2 as cloud, type UploadApiResponse } from "cloudinary";

cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadFile = async (
  data: FormData
): Promise<UploadApiResponse | undefined> => {
  const file = data.get("file");
  if (file instanceof File && file.type.startsWith("image")) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
      cloud.uploader
        .upload_stream({ folder: "rich-editor" }, (error, result) => {
          if (error) reject(new Error(error.message ?? 'Upload failed'));
          else resolve(result);
        })
        .end(buffer);
    });
  }
};

export const readAllImages = async () => {
  try {
    const { resources } = (await cloud.api.resources({
      prefix: "rich-editor",
      resource_type: "image",
      type: "upload",
    })) as { resources: UploadApiResponse[] };

    return resources.map(({ secure_url }) => secure_url);
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const removeImage = async (id: string) => {
  await cloud.uploader.destroy(id);
};
