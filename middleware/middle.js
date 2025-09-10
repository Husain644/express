import jwt from 'jsonwebtoken'


const tokenVerify=async(req,res,next)=>{
    const token=req.headers.authorization?.split(' ').pop()
    if (!token){
        return res.status(401).send({"messages":"please provide token"})
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(decoded){
            req.body.id=decoded._id
            next()
        }
        else{
            res.status(401).send({"messages":"please provide valid  token"})
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.send({ "message": "jwt expired", "expiredAt": error.expiredAt });
        }
        else{
            res.status(401).send({"messages":"token is not valid"})
        }
    }

}
async function refreshTokenVerify(req,res){
    const token=req.headers.authorization?.split(' ').pop()
        if (!token){
        return res.status(401).send({"messages":"please provide refresh token"})
    }
        try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        if(decoded){  
            const token= jwt.sign({_id: decoded._id,},process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRE})
            res.json({accessToken:token})
        }
        else{
            res.status(401).send({"messages":"please provide valid  token"})
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.send({ "message": "jwt expired", "expiredAt": error.expiredAt });
        }
        else{
            res.status(401).send({"messages":"token is not valid"})
        }
    }
}



export {tokenVerify,refreshTokenVerify}