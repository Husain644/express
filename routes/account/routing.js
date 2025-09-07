import express from 'express'
import { userGet,userPost,userDel,login,userPatch,all } from '../../controllers/accountController/userControle.js'
import { tokenVerify } from '../../middleware/middle.js';
import { chatController } from '../../controllers/chat_controllser/chat.js';


const userRouter=express.Router()
userRouter.route('/user')
.get(tokenVerify,userGet)
.post(userPost)
.patch(tokenVerify,userPatch)
.delete(tokenVerify,userDel)
userRouter.get('/login',login)  
userRouter.get('/all',all)

export default userRouter;
