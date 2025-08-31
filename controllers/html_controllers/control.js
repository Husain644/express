import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import {  FolderDetailsInObject } from '../../utils/utilsFunction.js';
import { uploadToCloudinary } from '../../utils/cloudinaryFunction.js';

const SavedContent = path.join(__dirname, "../../../savedcontent");  // for linux server

export async function getAllCategories(req, res) {   /// get all categories or details of a specific category and send  to frontend
    if (req.params.folderName) {
        const folderName = req.params.folderName;
        const folderPath = path.join(SavedContent, "all_files", folderName);
        if (fs.existsSync(folderPath)) {
            const details = FolderDetailsInObject(folderPath);
            return res.json({ data: details,"folderPath is":folderPath });
        }
        return res.status(404).json({
            data: [],
            error: "Folder not found"
        });
    }
    const folderPath = path.join(SavedContent, `all_files`)
    const categories = fs.readdirSync(folderPath).filter(file => {
        return fs.statSync(path.join(folderPath, file)).isDirectory();
    });
    res.json({
        allCategories: categories
    })
}

// ===== Route to save HTML + files =====
export function SaveData(req, res) {
    const fileName = req.body.fileName
    const folderName = req.body.folderName
    const subFolder = req.body.subFolder
    const textData = req.body.textData
           if ( !folderName) {
          return res.status(400).json({ error: "Missing required fields","folderName":folderName });
            } 
    
         const folderPath = path.join( SavedContent, 'all_files', folderName, subFolder )

    try {


    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    if (req.file) {
        const myFilesPath = path.join(folderPath, req.file.originalname);
        fs.writeFileSync(myFilesPath, req.file.buffer);
        res.send({
            folderName: folderName, uploadedFiles: req.file.originalname
        });
    } else {
        const filePath = path.join(folderPath, `${fileName}`);
        if (fs.existsSync(filePath)) {
            return res.send({ reply: '', msg: 'File already exists. Try a different name.' });
        }
        fs.writeFileSync(filePath, textData, 'utf8');
        res.send({
            fileName,
            folderName:folderName,
        })
    }
} catch (error) {
        res.status(500).send({ reply: '', msg: error.message || 'Error saving file' });
    }
}

export function getFile(req, res) {
    const fileName = req.params.fileName 
    const folderName = req.params.folderName
    const subFolder = req.params.subFolder

    let folderPath=path.join(SavedContent,`all_files/${folderName}`)
    folderName === subFolder?folderPath=folderPath:folderPath=path.join(SavedContent,`all_files/${folderName}/${subFolder}`)
    let filePath=path.join(SavedContent, `all_files/${subFolder}/${fileName}`);
    folderName === subFolder ? filePath = filePath : 
    filePath = path.join(SavedContent, `all_files/${folderName}/${subFolder}/${fileName}`)

    if (req.method === "DELETE") { 
        console.log('delete call ', filePath)
        if(fileName==="deleteFolder"){
                if (!fs.existsSync(folderPath)) { return res.status(404).json({ error: 'folder not found'}); }
                 fs.rm(folderPath,{ recursive: true, force: true },(err)=>{
                    if(err){  return res.status(404).json({error:err})}
                    else{
                        return res.json({ message: 'Folder deleted successfully' })
                    }
                    
                 })
        }
       else{
        if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath}); }
        fs.unlinkSync(filePath);
        return res.json({ message: 'File deleted successfully' });
       }
    }
    else {
        if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath }); }
        res.sendFile(filePath)
    }
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
export function AllFilesApi(req, res) {

    const folderPath = path.join(SavedContent, `all_files`)
    const files = getAllFiles(folderPath);
    const lst = [];
    for (let filePath of files) {
        if (fs.statSync(filePath).isFile()) {
            const fileName = path.basename(filePath);
            const folderName = path.basename(path.dirname(path.dirname(filePath)));
            const subFolder = path.basename(path.dirname(filePath));
            if (folderName === "all_files") {
               const fileUrl = `/html/getFile/${subFolder}/${subFolder}/${fileName}`;
                lst.push({ fileName,fileUrl});// Add subFolder to the response
            }else{  const fileUrl = `/html/getFile/${folderName}/${subFolder}/${fileName}`;
            lst.push({ fileName,fileUrl});
        }}
    }
    res.json({
        allFiles: lst
    })
}

export async function uploadPic(req, res) {
    const result = await uploadToCloudinary(req = req, res = res);
    res.json({ result })
}

export async function uploadHtml(req, res) {
    const result = await uploadToCloudinary(req = req, res = res);
    const response = await axios.get(result.url, { responseType: "text" });
    res.setHeader("Content-Type", "text/html");
    res.send(response.data);
}
// streamming 
export function getReactFile(req, res) {
    const folderName = 'view'
    const filePath = path.join(__dirname, `/static/staticreact/${folderName}/index.html`)
    if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath }); }
    res.sendFile(filePath)
}