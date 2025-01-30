import jwt from 'jsonwebtoken'

const tokenVerify=async(req,res,next)=>{
    const token=req.headers.authorization.split(' ').pop()
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(decoded){
            console.log(decoded._id)
            req.body.id=decoded._id
            next()
        }
        else{
            res.status(401).send({"messages":"please provide token"})
        }
    } catch (error) {
        res.send(error)
    }

}
export {tokenVerify}