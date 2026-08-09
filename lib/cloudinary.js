import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryReady = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

export const CLOUDINARY_FOLDERS = {
  audio: "vibeflow/audio",
  covers: "vibeflow/covers",
};

export function uploadToCloudinary(
  buffer,
  { folder, resourceType, ...options } = {}
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (result) => {
        if (result && result.error) {
          reject(result.error);
        } else {
          resolve(result);
        }
      },
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...options,
      }
    );
    stream.end(buffer);
  });
}

export function deleteFromCloudinary(publicId, resourceType = "video") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
      { resource_type: resourceType }
    );
  });
}

export async function deleteCloudinaryAssets(assets = []) {
  if (!cloudinaryReady) return [];

  const results = [];
  for (const asset of assets) {
    if (!asset.publicId) continue;
    try {
      const result = await deleteFromCloudinary(
        asset.publicId,
        asset.resourceType || "video"
      );
      results.push(result);
    } catch (error) {
      console.error(`Cloudinary delete failed for ${asset.publicId}:`, error);
    }
  }
  return results;
}

export default cloudinary;
