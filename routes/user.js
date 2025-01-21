import express from 'express'
import user from '../models/user/account.js'
const router=express.Router()

router.get('/alluser',async(req,res)=>{
    const data=await user.find({})
    console.log(await user.countDocuments({isActive:false}));
    res.json(data)
})

export default router;