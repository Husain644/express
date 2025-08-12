import express from 'express'
import userRouter from './user/user.js'
import HtmlRouter from '../html_upload/route.js'

const router= express.Router();
router.use('/user',userRouter);
router.use('/html',HtmlRouter);


export default router