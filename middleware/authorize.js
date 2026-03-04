const {User}=require("../models")

module.exports=function authorize(allowedRoles=[]){
    return async(req,res,next)=>{
        const user =await User.findByPk(req.user.id);
        //const user = req.user;
        req.user.role=user.role;
        if(!user) return res.status(401).json({msg:"unauthorized"});
        if(!allowedRoles.includes(user.role)) return res.status(401).json({msg:"Forbidden: insufficient permissions"});

        next();
    }
}