import User from "../../models/accountModels/userModels.js"

async function userGet(req,res){
const id=req.body.id
try {
    if (id !== undefined){
    const data=await User.findById(id) 
    res.send(data)
    }
    else{
        res.json({message:"id is required"})
    }
   
} catch (error) {
    res.send(error.message || 'something went wrong')
}
}

async function userPost(req,res){
    if (!req.body.name || !req.body.email || !req.body.password){
        return res.status(400).send({"messages":"name, email and password are required"})
    }
    const existingUser = await User.find ({ email: req.body.email });
    if (existingUser.length > 0) {
        return res.status(400).send({"messages":"User already exists with this email"});
    }
    if (req.body.password.length < 6){
        return res.status(400).send({"messages":"password must be at least 6 characters"})
    }
    if (req.body.name.length < 3){
        return res.status(400).send({"messages":"name must be at least 3 characters"})
    }
    if (!req.body.email.includes('@')){
        return res.status(400).send({"messages":"email must be valid"})
    }
   try {
    const data=req.body
    const responce=await User.create(data)
    const token=await responce.generateAccessToken()
    res.send({"Resp":responce,"token":token})
   } catch (error) {
    res.send(error)
   }
}

async function userPatch(req,res){
    const id=req.body.id
    try {
        const data=req.body
        const responce=await User.findByIdAndUpdate(id,data,{new:true})
        res.send({"Resp":responce})
    } catch (error) {
        res.send(error)
    }
}

const userDel=async (req,res)=>{
    const userId=req.body.id
    if (!userId){
        return res.status(400).send({"messages":"id is required"})
    }
try {
const Responce=await User.findByIdAndDelete(userId)
if (!Responce){
    return res.status(404).send({"messages":"user not found"})
}
res.json({"messages":"user deleted successfully","Resp":Responce})
} catch (error) {
    res.send(error)
}}

const all=async (req,res)=>{
    try {
        const users=await User.find()
        res.send(users)
    }
    catch (error) {
        res 
         .status(500)
            .send({ message: error.message || "Some error occurred while retrieving users." });
    }
}   


const login=async (req,res)=>{
    try {
        const username=await User.findOne({email:req.body.email})
        if (username){
            if (await username.isPasswordCorrect(req.body.password)){
                const token=await username.generateAccessToken()
                res.cookie('token',token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV==='production',
                    sameSite:'strict',
                    maxAge:60*24*60*60*1000 // 60 days
                })
                res.json({
                    "messages":`${username.name} Login Successully`,
                    "token":token})
            }else{
                res.status(401).send({"messages":"password is Incorrect"})
            }
        }
        else{res.status(404).send({"messages":"user not found"})}
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
async function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logout successful' });
}
async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;  
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newAccessToken = await user.generateAccessToken();
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
    }
}
async function passwordReset(req, res) {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = newPassword; 
        await user.save(); 
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


export {userGet,userPost,userDel,login, userPatch,all,logout,refreshToken ,passwordReset};
