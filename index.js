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
import { chatController } from './controllers/chat_controllser/chat.js';

const app = express()
const server = createServer(app); // create raw HTTP server
app.use(bodyParser.urlencoded({ limit: "20mb",extended: true }));
app.use(cors())  //cors policy
app.use(limiter) // rate limiter
app.use(bodyParser.json({ limit: "10mb" }))
app.use('/static',express.static(path.join(__dirname, 'static')));  //static files  handling
app.set('view engine', 'ejs');                                      //ejs engine
app.set('views','./static/ejs_templates')
app.use('/',router) //Routings ###################  


// Attach socket.io to server
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins (change in production)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

})

export const AdminNamespace = io.of("/admin");
AdminNamespace.on("connection",chatController) 
export const UserNamespace = io.of("/user");
UserNamespace.on("connection",chatController) 


server.listen(8000, () => {
  console.log("HTTP + WebSocket running at http://localhost:8000");
});
dbConnect() //DB connection