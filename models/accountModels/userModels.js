import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 

const userSchema=new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,trim:true,uniq:true},
  city:{type:String,required:true,trim:true},
  phone:{type:String,required:true,trim:true},
  age:{type:Number,required:true},
  password:{type:String,required:true,trim:true},
  isActive:{type:Boolean,default:false},
},{timestamps:true})


userSchema.pre("save", async function(next) {
 if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);next()
})

userSchema.methods.isPasswordCorrect=async function(password){
  const isOk= await bcrypt.compare(password,this.password)
  return isOk
}
userSchema.methods.generateAccessToken=async function () {
   return jwt.sign({_id:this.id,
   },process.env.ACCESS_TOKEN_SECRET,
   {expiresIn:process.env.ACCESS_TOKEN_EXPIRE})
}
userSchema.methods.generateRefreshToken=async function () {
  return jwt.sign({_id:this.id,
  },process.env.REFRESH_TOKEN_SECRET,
  {expiresIn:process.env.REFRESH_TOKEN_EXPIRE})
}
const User=mongoose.model('User',userSchema);
export default User;