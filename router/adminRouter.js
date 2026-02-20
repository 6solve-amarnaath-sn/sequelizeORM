const {Router}=require("express");
const verify = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {
  deleteUser,
  promoteTOModerator,
  demoteToUser,
  getAllUsers,
} = require("../controllers/adminController");

const adminRouter=Router();


adminRouter.use(verify,authorize(["admin"]));

adminRouter.get("/users", getAllUsers);

adminRouter.delete("/users/:id", deleteUser);

adminRouter.put("/users/:id/promote", promoteTOModerator);

adminRouter.put("/users/:id/demote", demoteToUser);

module.exports = adminRouter;