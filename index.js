import express from  'express'
import path from 'path'
import dbConnect from './db/db.js';
import router from './routes/user/user.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);         // get the name of the directory

const app = express()

app.use(express.json())
app.use('/static',express.static(path.join(__dirname, 'static')));  //static files  handling
app.set('view engine', 'ejs');                                      //ejs engine
app.set('views','./views')

app.use('/',router) //Routings ###################  
 
const port=8000;
app.listen(port,console.log(`Example app listening on port ${port}`));
dbConnect();