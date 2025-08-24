import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)


export function NotFound(req,res){
  res.sendFile(path.join(__dirname, '../static/temp/notfound.html'))
}
