import jwt from 'jsonwebtoken'

const tokenVerify=async(req,res,next)=>{
    console.log( 'token is ',req.headers.authorization)
    const token=req.headers.authorization?.split(' ').pop()
    if (!token){
        return res.status(401).send({"messages":"please provide token"})
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(decoded){
            console.log(decoded._id)
            req.body.id=decoded._id
            next()
        }
        else{
            res.status(401).send({"messages":"please provide valid  token"})
        }
    } catch (error) {
        res.send(error)
    }

}
export {tokenVerify}