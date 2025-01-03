const { error } = require("console")
const express=require("express")
const morgan =require("morgan")
const server=express()
//server.use(morgan('default'))
server.use(express.json())
server.use(express.static('static'))
const auth=(req,res,next)=>{
    console.log(req.query.pass)
    if (+req.body.pass===123){
        next()
    }
    else{
        res.json({type:'get',error:'unathorised'})
        res.sendStatus(401) 
    }

}
server.get('/',auth,(req,res)=>{
    res.json({type:'get'})
})
server.post('/',(req,res)=>{
    res.json({type:'post'})
    console.log('get')
})
server.patch('/',(req,res)=>{
    res.json({type:'patch'})
})
server.put('/',(req,res)=>{
    res.json({type:'put'})
})
server.delete('/',(req,res)=>{
    res.json({type:'delete'})
})
server.listen(8000)