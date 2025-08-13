import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import { AddHtmlFile,getHtml,htmlFile,AllHtmlPage } from './controllers/control.js';

const HtmlRouter =express.Router();

HtmlRouter.use('/static',express.static(path.join(__dirname, './html_files'))); 
HtmlRouter.get('/add',AddHtmlFile);
HtmlRouter.get('/file/:fileName',htmlFile)
HtmlRouter.get('/all',AllHtmlPage)
HtmlRouter.post('/gethtml',getHtml)


export default HtmlRouter;
