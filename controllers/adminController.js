const {User}=require("../models")

const deleteUser=async(req,res)=>{
    const id=req.params.id;
    if(!id){
        return res.status(404).json({msg:'User id not found'})
    }
    const user=await User.findByPk(id);

    if(!user){
        return res.status(404).json({msg:"User not found"});
    }

    await user.destroy();
    res.json({msg:"User deleted successfully"});
}

const promoteTOModerator=async(req,res)=>{
    const id=req.params.id;
    if(!id){
        return res.status(404).json({msg:'User id not found'})
    }
    const user=await User.findByPk(id);

    if(!user){
        return res.status(404).json({msg:"User not found"});
    }
    user.role='moderator';
    await user.save();
    res.json({
        msg:`User ${user.name} has been promoted to moderator`
    })
}

const demoteToUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  user.role = "user";
  await user.save();

  res.json({
    msg: `User ${user.name} demoted to user`,
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "createdAt"],
  });

  res.json(users);
};

module.exports={promoteTOModerator,deleteUser,demoteToUser,getAllUsers}