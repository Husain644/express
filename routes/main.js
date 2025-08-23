import express from 'express'
import userRouter from './account/routing.js';
import HtmlRouter from '../html_upload/route.js'
import { NotFound } from '../utils/notFound.js';

const router= express.Router();
router.use('/account',userRouter);
router.use('/html',HtmlRouter);
router.use('/',NotFound);

export default router;