import express from 'express'
import uploadMulter from '../../middleware/multer.js';
import { userGet,userPost,userDel,login,userPatch,all,sendOtpToMail, subscribe,checkOtp,smsotp
 } from '../../controllers/accountController/userControle.js'
import { tokenVerify,refreshTokenVerify } from '../../middleware/middle.js';  //First verify access token from header(frontend)


const userRouter=express.Router()
userRouter.route('/user')  
.post(userPost)                    // Register new user url is post('http://localhost:8000/account/user')
.get(tokenVerify,userGet)          // Get user Data or Profile by Token from header(frontend) url is get('http://localhost:8000/account/user')
.patch(tokenVerify,userPatch)      // Update user by Token from header(frontend) url is patch('http://localhost:8000/account/user')
.delete(tokenVerify,userDel)       // Delete user by Token from header(frontend) url is delete('http://localhost:8000/account/user')
userRouter.post('/user/login',login)    // Login user url is post('http://localhost:8000/account/login')
userRouter.get('/user/refreshToken',refreshTokenVerify)
userRouter.post('/check-otp',checkOtp)
userRouter.get('/all',all)         // Get all users url is get('http://localhost:8000/account/all')  it not for production only for testing
userRouter.post('/sendmail',uploadMulter.array("files", 10),sendOtpToMail)
userRouter.get('/emailsubscribe',subscribe)
userRouter.post('/smsotp',smsotp)
export default userRouter;

