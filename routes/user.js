import express from 'express'
import user from '../models/user/account.js'
const router=express.Router()

import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const dataFolder=path.join(__dirname,"../static")
const filePath=path.join(dataFolder,'md.jpg');

router.get('/img',(req,res)=>{
    //res.send('hello img')
    res.download(filePath)
})

// router.get('/alluser',async(req,res)=>{
//     const data=await user.find({})
//     console.log(await user.countDocuments({isActive:false}));
//     res.json(data)
// })

export default router;