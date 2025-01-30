

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);        // get the name of the directory
const dataFolder=path.join(__dirname,"../static")
const filePath=path.join(dataFolder,'md.jpg');



router.get('/img',(req,res)=>{
    //res.send('hello img')    //download files
    res.download(filePath)
})

router.get('/about',(req,res)=>{    //static files handling
    const name='Husain'
    res.render('./allejs/about',{name:name})
})
router.get('/contact',(req,res)=>{   //static files handlings
    res.render('./allejs/contact')
})
//  Routing
// router.get('/users',userGet)
// router.get('/user',tokenVerify,userGet)
// router.post('/user',userPost)
// router.delete('/user/:id',userDel)
// router.get('/login',login)