import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const uri=process.env.MONGO_URL
//const uri = "mongodb+srv://mylocal:localpass789520@cluster1.h0oe3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function dbConnect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
 catch(error){
    console.log('error is ', error)
 }
  finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
export default dbConnect;




// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// dotenv.config()
// const dbConnect=()=>{
// const url=process.env.MONGO_URL
// mongoose.connect("mongodb://username:password@ac-abcd.mongodb.net:27017,myDatabase?ssl=true&replicaSet=atlas-xxx-shard-0&authSource=admin&retryWrites=true&w=majority");

// //mongoose.connect(`${url}/users`).then(()=>{console.log('db connected')}).catch((err)=>{console.log(err);})
// }
// export default dbConnect;