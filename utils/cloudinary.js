import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import path from 'path'

   cloudinary.config({ 
    cloud_name: 'dps5apupd', 
    api_key: '244523994221617', 
    api_secret: '0YCO5riKszy2LPEBCTNoniHs55M' 
})



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
