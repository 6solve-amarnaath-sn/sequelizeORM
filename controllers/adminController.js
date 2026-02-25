const { User } = require("../models");
const { Op } = require('sequelize');

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: 'User id not found' })
  }
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  if (user.role === "admin") {
    return res.status(403).json({ "msg": "cannot deleted the admin user" })
  }

  await user.destroy();
  res.json({ msg: "User deleted successfully" });
}

const promoteTOModerator = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({ msg: 'User id not found' })
  }
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  if (user.role === "admin") {
    return res.status(403).json({ msg: "user is Admin" });
  }
  user.role = 'moderator';
  await user.save();
  res.json({
    msg: `User ${user.name} has been promoted to moderator`
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
    where: {
      role: { [Op.not]: "admin" },
    },
  });

  res.json(users);
};

module.exports = { promoteTOModerator, deleteUser, demoteToUser, getAllUsers }