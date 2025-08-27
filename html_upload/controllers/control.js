import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import { FolderDetails, FolderDetailsInObject } from '../../utils/utilsFunction.js';
import { uploadToCloudinary } from '../../utils/cloudinaryFunction.js';
import { error } from 'console';


export async function getAllCategories(req, res) {
    if (req.params.folderName) {
        const folderName = req.params.folderName;
        const folderPath = path.join(__dirname, "../html_files", folderName);
       
        if (fs.existsSync(folderPath)) {
            const details = FolderDetailsInObject(folderPath);
            return res.json({ data: details,folderPath });
        }

        return res.status(404).json({
            data: [],
            error: "Folder not found"
        });
    }
    const folderPath = path.join(__dirname, `../html_files`)
    const categories = fs.readdirSync(folderPath).filter(file => {
        return fs.statSync(path.join(folderPath, file)).isDirectory();
    });
    res.json({
        allCategories: categories
    })
}

export function AddHtmlFile(req, res) {
    const filePath = path.join(__dirname, 'comps/add.html')
    res.sendFile(filePath);
}


// ===== Route to save HTML + files =====
export function getHtml(req, res) {
    const html = req.body.html
    const fileName = req.body.fileName
    const category = req.body.category
    const subCategory = req.body.subCategory || '';

    const folderPath = path.join(__dirname, '../html_files', category, subCategory);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    if (req.file) {
        const myFilesPath = path.join(folderPath, req.file.originalname);
        fs.writeFileSync(myFilesPath, req.file.buffer);
        res.send({
            folderName: category, uploadedFiles: req.file.originalname
        });
    } else {
        const filePath = path.join(folderPath, `${fileName}`);
        if (fs.existsSync(filePath)) {
            return res.send({ reply: '', msg: 'File already exists. Try a different name.' });
        }
        fs.writeFileSync(filePath, html, 'utf8');
        res.send({
            fileName,
            folderName: category,
        })
    }
}

export function getFile(req, res) {
    const fileName = req.params.fileName
    const folderName = req.params.folderName
    const subFolder = req.params.subFolder
    const filePath = path.join(__dirname, `../html_files/${folderName}/${subFolder}/${fileName}`)
    if (folderName === subFolder) {
        const newFilePath = path.join(__dirname, `../html_files/${folderName}/${fileName}`)
        if (!fs.existsSync(newFilePath)) {
            return res.status(404).json({
                error: 'File not found in same folder',
                newFilePath
            });
        }
        res.sendFile(newFilePath)
    }
    else {

        if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath }); }
        res.sendFile(filePath)
    }
}

export function htmlFile(req, res) {
    const fileName = req.params.fileName
    const folderName = req.params.folderName
    const filePath = path.join(__dirname, `../html_files/${folderName}/${fileName}`)
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
export function AllFilesApi(req, res) {

    const folderPath = path.join(__dirname, `../html_files`)
    const files = getAllFiles(folderPath);
    const lst = [];
    for (let filePath of files) {
        if (fs.statSync(filePath).isFile()) {
            const fileName = path.basename(filePath);
            const catogary = path.basename(path.dirname(filePath));
            lst.push({ fileName, catogary });
        }
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