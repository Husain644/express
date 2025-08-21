import express from  'express'
import multer from 'multer'
import path from 'path'
import dbConnect from './db/db.js';
import router from './routes/main.js';
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);         // get the name of the directory

const app = express()
// const forms = multer();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(forms.array());
app.use(bodyParser.json())
app.use('/static',express.static(path.join(__dirname, 'static')));  //static files  handling
app.set('view engine', 'ejs');                                      //ejs engine
app.set('views','./views')

app.use('/',router) //Routings ###################  
 
const port=8080;
app.listen(port,console.log(`Example app listening on port ${port}`));
dbConnect();