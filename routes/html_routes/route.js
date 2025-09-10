import express from 'express'
import path from 'path'
import { upload } from '../../middleware/multer.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename)
import {AllFilesApi,uploadPic,uploadHtml,getAllCategories,getFile,SaveData,createCatogery,getAllSubCategories,
  readFileContent,updateFileContent} from '../../controllers/html_controllers/control.js';

const reactBuildPath = path.join(__dirname,"../../controllers/html_controllers/","static/reactBuild/view")
const HtmlRouter =express.Router();
HtmlRouter.use('/static',express.static(path.join(__dirname, "../../controllers/html_controllers/", "static")));
HtmlRouter.use("/view", express.static(reactBuildPath)); // Serve static files from the React build directory
HtmlRouter.get('/allFilesApi',AllFilesApi) // get all files with catogary
HtmlRouter.get('/categories',getAllCategories) // get all categories
HtmlRouter.post('/createCategory/:folderName/:subFolderName',upload.none(),createCatogery)
HtmlRouter.get('/categories/:folderName',getAllSubCategories)  // get specific category details with files
HtmlRouter.post('/gethtml',upload.single('myFiles'),SaveData)// save html + files  Save Data  // ===== Route to save HTML + files =====
HtmlRouter.patch('/updateFile/:folderName/:subFolder/:fileName',upload.single('myFiles'),updateFileContent)// update html + files  Save Data  // ===== Route to save HTML + files =====
HtmlRouter.get('/getFile/:folderName/:subFolder/:fileName',getFile) // get specific html file
HtmlRouter.delete('/deleteFile/:folderName/:subFolder/:fileName',getFile) // delete specific html file
HtmlRouter.get('/readFile/:folderName/:subFolder/:fileName',readFileContent) // get specific html file

HtmlRouter.get("/view/*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

HtmlRouter.post('/tocloudinary',upload.single('myFiles'),uploadPic)
HtmlRouter.post('/uploadHtml',upload.single('myFiles'),uploadHtml)



export default HtmlRouter;
