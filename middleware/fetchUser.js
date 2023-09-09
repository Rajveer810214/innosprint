const jwt = require('jsonwebtoken')
const JWT_Token=process.env.JWT_TOKEN;
const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token')

    if(!token){
       return res.status(400).json("Please try to enter the correct token")
    }
    try {
        console.log(token);
        const data=jwt.verify(token,JWT_Token);
        console.log(data)
        req.student=data.student;
        next();
        
    } catch (error) {
        console.log(error)
        res.status(400).json("Please try to enter the correct token")
    }
}
module.exports=fetchuser;