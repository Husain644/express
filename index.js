import express from  'express'
import { createServer } from "http";
import { WebSocketServer } from "ws";
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())  //cors policy
app.use(limiter) // rate limiter
app.use(bodyParser.json())
app.use('/static',express.static(path.join(__dirname, 'static')));  //static files  handling
app.set('view engine', 'ejs');                                      //ejs engine
app.set('views','./views')
app.use('/',router) //Routings ###################  

server.listen(8000, () => {
  console.log("HTTP + WebSocket running at http://localhost:8000");
});

const wss = new WebSocketServer({ server }); // WebSocket server
wss.on("connection", (ws) => {
  console.log("Client connected");
  let i = 1;
  const interval = setInterval(() => {
    if (i > 100) {
      clearInterval(interval);
      ws.close(); // close websocket after sending all numbers
      return;
    }
    ws.send(i.toString()); // send number as string
    i++;
  }, 60); // adjust speed
});
dbConnect();