import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

   cloudinary.config({ 
    cloud_name: 'dps5apupd', 
    api_key: '244523994221617', 
    api_secret: '0YCO5riKszy2LPEBCTNoniHs55M' 
})

const uploadCloudinary=async (localFilePath)=>{
    try{
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {public_id: 'new',})
        return uploadResult;
    }
  catch(error){
       fs.unlinkSync(localFilePath)
       return null;
      }
}

export default  uploadCloudinary;
