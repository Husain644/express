import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)

export function AddHtmlFile (req,res){
    res.sendFile(path.join(__dirname, '../html_files/add.html'));
}
export function getHtml(req,res){
    const html=req.body.html
    const filePath=path.join(__dirname, `../html_files/${req.body.fileName}.html`)
     fs.writeFileSync(filePath,html)
     res.send({"reply":'ok'})
}