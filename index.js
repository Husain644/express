import express from  'express'
import { createServer } from "http";
import { WebSocketServer } from "ws";
import multer from 'multer'
import path from 'path'
import dbConnect from './db/db.js';
import router from './routes/main.js';
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);         // get the name of the directory

const app = express()
const server = createServer(app); // create raw HTTP server
// const forms = multer();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(forms.array());
app.use(bodyParser.json())
app.use('/static',express.static(path.join(__dirname, 'static')));  //static files  handling
app.set('view engine', 'ejs');                                      //ejs engine
app.set('views','./views')
app.use('/',router) //Routings ###################  

server.listen(8080, () => {
  console.log("HTTP + WebSocket running at http://localhost:8080");
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