
module.exports=function authorize(allowedRoles=[]){
    return (req,res,next)=>{
        const user = req.user;
        if(!user) return res.status(401).json({msg:"unauthorized"});
        if(!allowedRoles.includes(user.role)) return res.status(401).json({msg:"Forbidden: insufficient permissions"});

        next();
    }
}