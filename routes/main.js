import express from 'express'
import userRouter from './account/routing.js';
import HtmlRouter from '../html_upload/route.js'
import { NotFound } from '../utils/notFound.js';
import { usege } from '../utils/utilsFunction.js';

const router= express.Router();
router.use('/account',userRouter);
router.use('/html',HtmlRouter);
router.use('/usage',usege)
router.use('/',NotFound);

export default router;