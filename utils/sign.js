const jwt=require("jsonwebtoken")



async function genToken(payload){
    const jwtSecret=process.env.JWT_SECRET;

if(!jwtSecret){
    console.log("please check jwt")
}
    return jwt.sign(payload,jwtSecret,{expiresIn:1000*60*60*24,algorithm:"HS256"})
}

module.exports=genToken;