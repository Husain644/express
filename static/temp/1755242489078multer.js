import multer from 'multer'
import fs from 'fs'
import path from 'path'
import uploadCloudinary from '../utils/cloudinary.js';

const dir = './static/temp';

if (!fs.existsSync(dir)) 
  fs.mkdirSync(dir)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, dir); // Specify the directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // Rename the file to avoid conflicts
     }});
  
const uploadMulter = multer({ storage: storage });
export default uploadMulter;