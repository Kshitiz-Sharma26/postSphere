import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const cloud_name = process.env.CLOUDINARY_CLOUD;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_SECRET;

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
};

// Throws expection that needs to be handled at point of usage.
export const uploadImageToCloudinary = async (pathname) => {
  const uploadResult = await cloudinary.uploader.upload(pathname);
  return uploadResult.secure_url;
};
