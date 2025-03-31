import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // ✅ Correct usage

// ✅ Proper Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, 
});


export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.error("Error in uploading media to Cloudinary:", error);
    throw error; 
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("Successfully deleted media:", publicId);
  } catch (error) {
    console.error("Failed to delete media from Cloudinary:", error);
    throw error; 
  }
};


export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    console.log("Successfully deleted video:", publicId);
  } catch (error) {
    console.error("Failed to delete video from Cloudinary:", error);
    throw error;
  }
};
