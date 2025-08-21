import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import path from 'path'
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import streamifier from 'streamifier';
import multer from 'multer';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
 
// upload on cloudinary memory based
export async function uploadToCloudinary (req, res,fileName = "mypage.html", folder = "express_uploads"
){ 
  try {
     if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      // Convert buffer into stream and upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
         folder: folder,
         resource_type: "auto",
         public_id:fileName,
         },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
          
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });
   const downloadUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/${result.resource_type}/upload/fl_attachment:${req.file.originalname}/${result.public_id}`;
    return ({
      message: "File uploaded successfully!",
      url: result.secure_url,         // Normal view link
      download_url: downloadUrl,      // Direct download link
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// disk based upload to cloudinary
const uploadCloudinary=async (file)=>{
    try{
        const localFilePath = await path.normalize(file.path);
        console.log('localfilepath---',localFilePath)
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, 
            {public_id: file.filename,})
        if (uploadResult){
            fs.unlinkSync(localFilePath)
        }
        return uploadResult;
    }
  catch(error){
       fs.unlinkSync(localFilePath)
       return null;
 }
}

export default  uploadCloudinary;
