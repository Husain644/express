import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
import { userGet,userPost,userDel,login } from '../../controllers/user/user.js';
import { tokenVerify } from '../../middleware/middle.js';
import uploadCloudinary from '../../utils/cloudinary.js'
import uploadMulter from '../../middleware/multer.js';
const router=express.Router()


router.route('/user')
.get(tokenVerify,userGet)
.post(userPost)
.delete(userDel)
router.get('/login',login)  

router.post('/upload',  
    uploadMulter.array('files', 10), async(req, res) => {
    try {
      if (!req.files) {
        return res.status(400).send('No file uploaded.');
      }
      const uploadResult=[]
      
      for(const file of req.files){
        const resp=await uploadCloudinary(file)
        uploadResult.push(resp)
      }
      
      res.send({
        "file url":uploadResult
      });
    } catch (err) {
    console.log(err)
      res.status(500).send('Error uploading file.');
    }
  });
router.post('/test',(req,res)=>{
    const data = req.body
    res.send(data)
})
router.get('/test',(req,res)=>{
    const data = {"name":"husain"}
    res.send(data)
})
export default router;