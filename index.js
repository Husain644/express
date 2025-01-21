import express from  'express'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 
import dbConnect from './db/db.js';
import router from './routes/user.js';


const app = express()
//routings
app.use('/user',router)
app.get('/',(req,res)=>{
  console.log('hello world get function executed')
  res.send('<h1>hello world123 </h1>')
})
const port=8000;
app.listen(port,console.log(`Example app listening on port ${port}`));
dbConnect();