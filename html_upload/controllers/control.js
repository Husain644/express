import express from 'express'
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import path from 'path'
import multer from 'multer';
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
dotenv.config(); // Load environment variables from .env file
// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage(); // store in memory
export const upload = multer({ storage: storage });

export function AddHtmlFile (req,res){
    const filePath=path.join(__dirname, 'comps/add.html')
    res.sendFile(filePath);
}

 


// ===== Route to save HTML + files =====
export function getHtml(req, res) {
    const html = req.body.html
    const fileName = req.body.fileName 
    const category = req.body.category 

    const folderPath = path.join(__dirname, '../html_files', category);
    if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });}
    if(req.file){
          const myFilesPath = path.join(folderPath, req.file.originalname);
          fs.writeFileSync(myFilesPath, req.file.buffer);
               res.send({folderName: category,uploadedFiles: req.file.originalname
    });
    }else{
    const filePath = path.join(folderPath, `${fileName}`);
        if (fs.existsSync(filePath)) {
      return res.send({ reply:'', msg: 'File already exists. Try a different name.' });
    }
    fs.writeFileSync(filePath, html, 'utf8');
       res.send({
      fileName,
      folderName: category,
    })}
}



export function htmlFile(req,res){
    const fileName=req.params.fileName
    const folderName=req.params.folderName
    const filePath=path.join(__dirname, `../html_files/${folderName}/${fileName}`)
    res.sendFile(filePath)
}

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Recursively read sub-folder
            getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}
export function AllFilesApi(req,res){

      const folderPath=path.join(__dirname, `../html_files`)
      const files = getAllFiles(folderPath);
      const lst =[];
      for (let filePath of files){
      if ( fs.statSync(filePath).isFile()){
        const fileName=path.basename(filePath);
        const catogary = path.basename(path.dirname(filePath));
        lst.push({fileName,catogary});
      }}
    res.json({
        allFiles:lst
    })
}

// upload on cloudinary 
export async function uploadToCloudinary (req, res){ 
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Convert buffer into stream and upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "express_uploads",
         resource_type: "auto"
         },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
          
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });
   const downloadUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/${result.resource_type}/upload/fl_attachment:${req.file.originalname}/${result.public_id}`;
    res.json({
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