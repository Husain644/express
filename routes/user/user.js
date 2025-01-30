import express from 'express'
import { userGet,userPost,userDel,login } from '../../controllers/user/user.js';
import { tokenVerify } from '../../middleware/middle.js';
const router=express.Router()



router.route('/user')
.get(tokenVerify,userGet)
.post(userPost)
.delete(userDel)

router.get('/login',login)
export default router;