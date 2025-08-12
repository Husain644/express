import User from "../../models/user/account.js"
async function userGet(req,res){
const id=req.body.id
console.log('id is ',id)
try {
    if (id !== undefined){
    const data=await User.findById(id) 
    res.send(data)
    }
    else{
        const data=await User.find()
        res.send(data)
    }
   
} catch (error) {
    res.send(error.message || 'something went wrong')
}
}

async function userPost(req,res){
   try {
    const data=req.body
    const responce=await User.create(data)
    const token=await responce.generateAccessToken()
    res.send({"Resp":responce,"token":token})
   } catch (error) {
    res.send(error)
   }
}
const userDel=async (req,res)=>{
try {
const userId=req.params.id
const Responce=await User.findByIdAndDelete(userId)
res.send(Responce)
} catch (error) {
    res.send(error)
}
}

const login=async (req,res)=>{
    try {
        const username=await User.findOne({email:req.body.email})
        if (username){
            if (await username.isPasswordCorrect(req.body.password)){
                res.send({"messages":`${username.name} Login Successully`})
            }else{
                res.status(401).send({"messages":"password is Incorrect"})
            }
        }
        else{res.status(404).send({"messages":"user not found"})}
    } catch (error) {
        return error
    }
}



export {userGet,userPost,userDel,login}
