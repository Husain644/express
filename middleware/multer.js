import multer from 'multer'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import path from 'path'
import uploadCloudinary from '../utils/cloudinaryFunction.js';


const storageMemory = multer.memoryStorage();
export const upload = multer({ storageMemory }); // Store files in memory 

const dir = './static/temp';

if (!fs.existsSync(dir)) 
  fs.mkdirSync(dir)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, dir); // Specify the directory where files will be saved
    },
    filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);// Rename the file to avoid conflicts
     }
    
    });
  
const uploadMulter = multer({ storage: storage });
export default uploadMulter;

