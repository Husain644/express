import express from  'express'
import { createServer } from "http";
import { Server } from "socket.io";
import multer from 'multer'
import path from 'path'
import dbConnect from './utils/db/db.js';
import router from './routes/main.js';
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import cors from 'cors'
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);         // get the name of the directory
import { limiter } from './utils/utilsFunction.js';

const app = express()
const server = createServer(app); // create raw HTTP server
app.use(bodyParser.urlencoded({ limit: "20mb",extended: true }));
app.use(cors())  //cors policy
app.use(limiter) // rate limiter
app.use(bodyParser.json({ limit: "10mb" }))
app.use('/static',express.static(path.join(__dirname, 'static')));  //static files  handling
app.set('view engine', 'ejs');                                      //ejs engine
app.set('views','./views')
app.use('/',router) //Routings ###################  


// Attach socket.io to server
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins (change in production)
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  // Listen for events from client
  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Send back response
     socket.emit("reply", `Server got your message: ${data}`);
    for(let i=0;i<=100;i++){
    setTimeout(()=>{socket.emit("reply", `Server got your message:number is${i}`)},i*100)
    
    }
   
  });
  // Handle disconnect 
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(8000, () => {
  console.log("HTTP + WebSocket running at http://localhost:8000");
});
dbConnect() //DB connection