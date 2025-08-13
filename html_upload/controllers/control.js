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
    const html=req.body.html;
    const fileName=req.body.fileName;
    const filePath=path.join(__dirname, `../html_files/${fileName}.html`);
    if (fs.existsSync(filePath)) {
     res.send({"reply":'',msg:'file is exist try to diffrent name'})
    } else {
    fs.writeFileSync(filePath,html)
    res.send({"reply":fileName})
    }

}
export function htmlFile(req,res){
    const fileName=req.params.fileName
    const filePath=path.join(__dirname, `../html_files/${fileName}.html`)
    res.sendFile(filePath)
}
export function AllHtmlPage(req,res){
       const folderPath=path.join(__dirname, `../html_files`)
      const files = fs.readdirSync(folderPath);
      console.log('Files in folder:', files);
      let str=""
      for (let fe of files){
      if ( fs.statSync(path.join(folderPath,fe)).isFile()){
        const fileName=fe.split('.')[0]
     str= str+`<p style="margin:0px"><a href="/html/file/${fileName}" target="_blank" style="margin:5px;font-size:16px">File name is <span style="color:red;
      font-size:20px;text-decoration:underline"> ${fe}</span></a></p>`
      }}
    res.send(`
        <div style="width:100%;max-width:500px;background: linear-gradient(to right,#ccc,#fff,#000, #fff, blue);border-radius:10px;padding:10px;margin:auto">
           ${str}
        </div>
        `)
}