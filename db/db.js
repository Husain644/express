import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const dbConnect=()=>{
const url=process.env.MONGO_URL
mongoose.connect(`${url}/users`).then(()=>{console.log('db connected')}).catch((err)=>{console.log(err);})
}
export default dbConnect;