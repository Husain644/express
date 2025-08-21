import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import { AddHtmlFile,getHtml,htmlFile,AllFilesApi,upload,uploadToCloudinary } from './controllers/control.js';


const HtmlRouter =express.Router();
HtmlRouter.use('/static',express.static(path.join(__dirname, 'controllers/comps'))); 
HtmlRouter.get('/add',AddHtmlFile);
HtmlRouter.get('/folderName/:folderName/file/:fileName',htmlFile)
HtmlRouter.get('/allFilesApi',AllFilesApi)
HtmlRouter.post('/gethtml',upload.single('myFiles'),getHtml)
HtmlRouter.post('/tocloudinary',upload.single('myFiles'),uploadToCloudinary)


export default HtmlRouter;
