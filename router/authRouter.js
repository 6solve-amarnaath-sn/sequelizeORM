const {Router}=require("express");
const { register, login, forgotPassword, resetPassword } = require("../controllers/userController");

const authRouter=Router();

authRouter.post("/register",register);

authRouter.post("/login",login);

authRouter.post("/forgotpassword",forgotPassword);

authRouter.post("/resetpassword/:token",resetPassword)

module.exports=authRouter