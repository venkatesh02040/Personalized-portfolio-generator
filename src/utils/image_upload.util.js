import cloudinary from "cloudinary";

/* ---------- CLOUDINARY CONFIG ---------- */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ---------- IMAGE UPLOAD FUNCTION ---------- */
export const uploadImageToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      {
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};
