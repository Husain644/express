import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import { uploadToCloudinary } from '../../utils/cloudinaryFunction.js';

export function AddHtmlFile (req,res){
    const filePath=path.join(__dirname, 'comps/add.html')
    res.sendFile(filePath);
}

 
// ===== Route to save HTML + files =====
export function getHtml(req, res) {
    const html = req.body.html
    const fileName = req.body.fileName 
    const category = req.body.category 

    const folderPath = path.join(__dirname, '../html_files', category);
    if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });}
    if(req.file){
          const myFilesPath = path.join(folderPath, req.file.originalname);
          fs.writeFileSync(myFilesPath, req.file.buffer);
               res.send({folderName: category,uploadedFiles: req.file.originalname
    });
    }else{
    const filePath = path.join(folderPath, `${fileName}`);
        if (fs.existsSync(filePath)) {
      return res.send({ reply:'', msg: 'File already exists. Try a different name.' });
    }
    fs.writeFileSync(filePath, html, 'utf8');
       res.send({
      fileName,
      folderName: category,
    })}
}



export function htmlFile(req,res){
    const fileName=req.params.fileName
    const folderName=req.params.folderName
    const filePath=path.join(__dirname, `../html_files/${folderName}/${fileName}`)
    res.sendFile(filePath)
}

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Recursively read sub-folder
            getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}
export function AllFilesApi(req,res){

      const folderPath=path.join(__dirname, `../html_files`)
      const files = getAllFiles(folderPath);
      const lst =[];
      for (let filePath of files){
      if ( fs.statSync(filePath).isFile()){
        const fileName=path.basename(filePath);
        const catogary = path.basename(path.dirname(filePath));
        lst.push({fileName,catogary});
      }}
    res.json({
        allFiles:lst
    })
}

export async function  uploadPic(req, res) {
     const result = await uploadToCloudinary(req=req,res=res);
     res.json({ result})
}

export async function  uploadHtml(req, res) {
     const result = await uploadToCloudinary(req=req,res=res);
    const response = await axios.get(result.url,{ responseType: "text" });
    res.setHeader("Content-Type", "text/html");
    res.send(response.data);
}
