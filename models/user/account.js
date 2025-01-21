import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  name:String,
  email:String,
  city:String,
  phone:String,
  age:Number,
  password:String,
  token:String,
  isActive:Boolean,
  created:Date
})
const user=mongoose.model('User',userSchema);
export default user;