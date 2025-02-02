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

router.post('/upload',  uploadMulter.single('file'), async(req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      res.send({
        "cloudinary file destination":req.file.filename
      });
    } catch (err) {
      res.status(500).send('Error uploading file.');
    }
  });
export default router;