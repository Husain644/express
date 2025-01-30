import express from  'express'
import path from 'path'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker';
import dbConnect from './db/db.js';
import router from './routes/user/user.js';

const app = express()

app.use(express.json())
app.use('/static',express.static(path.join(process.cwd(),'static')))  //static files  handling
app.set('view engine', 'ejs');                                        //ejs engine
app.set('views','./views')

app.use('/',router) //Routings #############################
 
const port=8000;
app.listen(port,console.log(`Example app listening on port ${port}`));
dbConnect();