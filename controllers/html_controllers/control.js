import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import {  FolderDetailsInObject } from '../../utils/utilsFunction.js';
import { uploadToCloudinary } from '../../utils/cloudinaryFunction.js';
import Task from './../../models/accountModels/htmlModels.js'
import { Packages } from './../../models/accountModels/htmlModels.js';

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


export async function getAllSubCategories(req,res){
try {
    const folderName = req.params.folderName;
    const folderPath = path.join(SavedContent, "all_files", folderName);
    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: "Folder not found" });
    }
    const subFolders = fs.readdirSync(folderPath).map(file => {
       const newFolderPath= fs.statSync(path.join(folderPath, file));
         if (newFolderPath.isDirectory()) { 
            const subFolderPath=path.join(folderPath,file)
            const subFiles=fs.readdirSync(subFolderPath).filter(f=>{return fs.statSync(path.join(subFolderPath,f)).isFile()})
            return { folderName: file, type: "folder", files:subFiles };
            } else {
            return { folderName: file, type: "file" };
            }
    });
    res.json({subFolders})
} catch (error) {
     res.status(500).json({error:error.message||"Error fetching subcategories"}) 
}
}
// createCatogery function
export function createCatogery(req, res) {
    const folderName = req.params.folderName;
    const subFolderName=req.params.subFolderName
    if (!folderName) { return res.status(400).json({ error: "Missing required fields" }) };
    if (subFolderName==="none"){
            const folderPath = path.join(SavedContent, 'all_files', folderName)
            try {
            if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            return res.status(201).json({ message: `folder ${folderName} successfully created` });
            }
            else {
            return res.status(409).json({ message: 'Category already exists. Try a different name.' });
            }
            } catch (error) {
            return res.status(500).json({ error: error.message || 'Error creating category' });
            }
    }else{
            const folderPath = path.join(SavedContent, 'all_files',folderName,subFolderName)
            try {
            if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            return res.status(201).json({ message: `folder ${subFolderName} created successfully in ${folderName}`});
            }
            else {
            return res.status(409).json({ message: `folder ${subFolderName} allready exist in ${folderName}` });
            }
            } catch (error) {
            return res.status(500).json({ error: error.message || 'Error creating category' });
            }
            }
        }
// ===== Route to save HTML + files =====
export function SaveData(req, res) {
    const fileName = req.body.fileName
    const folderName = req.body.folderName
    const subFolder = req.body.subFolder
    const textData = req.body.textData

    if ( !folderName) {return res.status(400).json({error: "Missing required fields" })}; 
    const folderPath = path.join( SavedContent, 'all_files', folderName, subFolder )
    try {
    if (!fs.existsSync(folderPath)) {fs.mkdirSync(folderPath, { recursive: true });}
    if (req.file) {
        try {
        const myFilesPath = path.join(folderPath, req.file.originalname);
        fs.writeFileSync(myFilesPath, req.file.buffer);
        res.send({folderName: folderName, uploadedFiles: req.file.originalname,
            path:`/html/getFile/${folderName}/${subFolder}/${req.file.originalname}`
        });
        } catch (error) {
         res.status(500).send({ reply: '', msg: error.message || 'Error saving file' });
        }
 
    } else {
        
        const filePath = path.join(folderPath, `${fileName}`);
        if (fs.existsSync(filePath)) {
            return res.send({ reply: '', msg: 'File already exists. Try a different name.' });
        }
        fs.writeFileSync(filePath, textData, 'utf8');
        res.send({ path:`/html/getFile/${folderName}/${subFolder}/${fileName}`})
    }
} catch (error) {
        res.status(500).send({ reply: '', msg: error.message || 'Error saving file' });
    }
}

export function getFile(req, res) {
    const fileName = req.params.fileName 
    const folderName = req.params.folderName
    const subFolder = req.params.subFolder
    const ext = fileName.includes('.') ? fileName.split('.').pop() : '';
    console.log(ext)

    let folderPath=path.join(SavedContent,`all_files/${folderName}`)
    folderName === subFolder?folderPath=folderPath:folderPath=path.join(SavedContent,`all_files/${folderName}/${subFolder}`)
    let filePath=path.join(SavedContent, `all_files/${subFolder}/${fileName}`);
    folderName === subFolder ? filePath = filePath : filePath = path.join(SavedContent, `all_files/${folderName}/${subFolder}/${fileName}`)
    
    if(ext==='jsx'||ext==='tsx'){
         if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath}); }
         try {
              const code = fs.readFileSync(filePath, 'utf8') ||'code does not exist'
              res.render("html_project/code_view.ejs",{code:code})
         } catch (error) {
              res.send("something went wrong")
         }
    }

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

export function readFileContent(req, res) {
    console.log('okk read fileContent run')
    const folderName = req.params.folderName
    const subFolder = req.params.subFolder
    const fileName = req.params.fileName
    const filePath = path.join(SavedContent, `all_files/${folderName}/${subFolder}/${fileName}`)
    if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath }); }
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content })
}

export function updateFileContent(req, res) {
    console.log(req.body)
    const oldFolderName = req.params.folderName
    const oldSubFolder = req.params.subFolder
    const oldFileName = req.params.fileName
    const newFolderName = req.body.folderName || oldFolderName
    const newSubFolder = req.body.subFolder || oldSubFolder
    const newFileName = req.body.fileName || oldFileName
    const newTextData = req.body.textData  ||" "
    const filePath=path.join(SavedContent,`all_files/${oldFolderName}/${oldSubFolder}/${oldFileName}`)
    const updatedFilePath=path.join(SavedContent,`all_files/${newFolderName}/${newSubFolder}/${newFileName}`)
    if (!fs.existsSync(filePath)) { return res.status(404).json({ error: 'File not found', filePath }); }
    try {
        fs.unlinkSync(filePath) // delete old file
        fs.writeFileSync(updatedFilePath,newTextData,'utf8') // create new file
        res.json({message:"file updated successfully",path:`/html/getFile/${newFolderName}/${newSubFolder}/${newFileName}`})
    } catch (error) {
        res.status(500).json({error:error.message||"Error updating file"})
    }
}
export function ejsView(req,res){
  const code=`<View>hello1235</View>`
  res.render("html_project/code_view.ejs",{code:code})

}

export async function TaskView(req,res){
  
  if (req.method==="POST"){
   try {
    const { taskName, description, status, dueDate } = req.body;
    if(!taskName){res.status(401).json({message:"Taks name is required"})}
     const result=new Task({
      taskName,
      description,
      status,
      dueDate
    })
      result.save()
      res.status(201).json({
      success: true,
      message: "Task created successfully",
      result
    });
   } catch (error) {
       // 🔍 Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Task already exists with this name",
      });
    }
       res.status(400).json({
      success: false,
      message: "Failed to create task",
      error: error.message
    });
   }
  }
  else if(req.method==="DELETE"){
    const {id}=req.body;
    try {
        if (!id) {
            return res.status(400).json({ success: false, message: "Task ID is required" });
        }
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Task deleted successfully", deletedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete task", error: error.message });
    }
  }
else if (req.method === "PUT") {
    const { id, taskName, description, status, dueDate } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, message: "Task ID is required" });
    }
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskName, description, status, dueDate },
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Task updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update task", error: error.message });
    }
}
  else{
    try {
    const tasks = await Task.find()
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
  }
}
// async function readTree() {
//   const items = await fs.readdir(BASE_DIR, { withFileTypes: true });
//   const folders = [];
//   const files = [];

//   for (const it of items) {
//     if (it.isDirectory()) {
//       folders.push(it.name);
//       // include folder files
//       const sub = await fs.readdir(safePath(it.name), { withFileTypes: true });
//       for (const s of sub) {
//         if (s.isFile()) files.push({ name: s.name, folder: it.name });
//       }
//     } else if (it.isFile()) {
//       files.push({ name: it.name, folder: null });
//     }
//   }

//   return { folders: folders.sort(), files: files.sort((a, b) => (a.name > b.name ? 1 : -1)) };
// }


// export async function notepad(req,res){
//     const {folder}=req.params
//     if (!folder){res.status(400).send({message:"plaese enter folderName"})}
//     if(req.method==="GET"){
//     try {
//         const tree = await readTree();
//         res.render("html_project/notepad.ejs", { tree });
//     } catch (err) {
//         res.status(500).send('Error reading notes: ' + err.message);
//     }

//     }
//     else if(req.method==="POST"){
//     try {
//     const name = String(req.body.name || '').trim();
//     if (!name) return res.redirect('/');
//     // simple validation
//     if (name.includes('..') || name.includes('/')) return res.status(400).send('Invalid folder name');
//     const dir = safePath(name);
//     await fs.mkdir(dir, { recursive: false }).catch(e => { if (e.code !== 'EEXIST') throw e;});
//     res.redirect('/');
//   } catch (err) {
//     res.status(400).send('Error creating folder: ' + err.message);
//   }
//     }
//     else if(req.method==="PATCH"){
//          res.send({folder,method:'patch'})
//     }
//     else if(req.method==="DELETE"){
//         try {
//     const name = req.params.name;
//     const dir = safePath(name);
//     // remove recursively
//     await fs.rm(dir, { recursive: true, force: true });
//     res.redirect('/');
//   } catch (err) {
//     res.status(400).send('Error deleting folder: ' + err.message);
//   }
//     }
// }

export function library(req,res){
    const {framework}=req.params
    if (!framework){res.status(400).send({message:"plaese enter framework"})}
    if(req.method==="GET"){
        const filePath=path.join(__dirname,'../../static')
        // res.sendFile(filePath)
         res.send({framework,method:'get'})
    }
    else if(req.method==="POST"){
         res.send({framework,method:'post'})
    }
    else if(req.method==="PATCH"){
         res.send({framework,method:'patch'})
    }
    else if(req.method==="DELETE"){
         res.send({framework,method:'delete'})
    }
}

export async function packageView(req,res){
  
if (req.method==="POST"){
    try {
    const {frameWork,PackagesList}=req.body;  
    if(!frameWork || !PackagesList){return res.status(401).json({message:"all field required"})}
    const existing=await Packages.findOne({frameWork})
    if (existing) {
        return res.status(400).json({ message: "Package already exists" });
      }
    const obj=new Packages({frameWork,PackagesList})
    await obj.save()
    if(obj){res.send(obj)}
    else{return res.status(500).json({message:"something went wrong"})}
    } 
    catch (error) {return res.status(401).send(error)}
}
else if (req.method==="GET"){
    const allObj=await Packages.find()
    console.log(allObj)
    return res.json({allObj})
}
else if(req.method==="DELETE"){
   try {
    const {frameWork,PackagesList}=req.body;
     const Obj=await Packages.deleteOne({frameWork})
     if(!Obj){return res.status(400).json({message:"not found"})}
     return res.status(200).json({message:"data deleted"})
   } catch (error) {
     return res.status(500).json({message:"some thing wrong"})
   }
      
}

}
export async function addPackgeView(req,res) {
  
    const {frameWork,PackagesList}=req.body
    console.log(frameWork,PackagesList)
     if(!frameWork || !PackagesList){return res.status(401).json({message:"all field required"})}
    try {
          const Obj=await Packages.findOne({frameWork})
        if(Obj){
            Obj.PackagesList=[...new Set([...Obj.PackagesList,...PackagesList])]
            await Obj.save()
            return res.json({messages:"updated data",Obj})
        }
        else{
           return res.status(400).json({message:"not found"})
        }
    } catch (error) {
        if(error){return res.json(error)}
    }
}