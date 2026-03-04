const { User } = require("../models");
const transporter = require("../utils/mailer");
//const jwt = require("jsonwebtoken");
const genToken = require("../utils/sign");
const crypto = require("crypto")
const { Op } = require('sequelize');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter name, email, and password" });
  }
  let user = await User.findOne({ where: { email } });
  
  if (user) {
    return res.status(400).json({ msg: "Email already exists" });
  }
  user = await User.create({ name, email, password });

  const token = await genToken({ id: user.id, name: user.name, role: user.role })
  
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 1000 * 60 * 60 * 24,
  // });

  res.json({ msg: "User created successfully", token });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "please enter name, email, password" });
    return;
  }
  let user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ msg: "Incorrect email or password" });
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = await genToken({ id: user.id, name: user.name, role: user.role });

  
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 1000 * 60 * 60 * 24,
  // });
  
  res.json({ msg: "Login successfully", token })
}

const forgotPassword = async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ msg: "Email not found" });
  }


  const token = crypto.randomBytes(20).toString('hex');


  await user.update({
    resetPasswordToken: token,
    resetPasswordExpires: Date.now() + 3600000
  });


  const resetUrl = `http://localhost:3000/forgotpassword/${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Reset your password',
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account. Click the button below to choose a new one:</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
           Reset Password
        </a>
      </div>
      <p style="font-size: 0.9em; color: #666;">
        This link will expire in 1 hour. If you didn't request this, you can safely ignore this email; your password will remain unchanged.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
      <p style="font-size: 0.8em; color: #999;">
        If you're having trouble clicking the button, copy and paste the link below into your web browser:<br>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
    </div>
  `
  });
  res.status(200).json({ msg: "Reset link sent to email." });

};

const resetPassword = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;


  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: Date.now() }
    }
  });

  if (!user) {
    return res.status(400).json({ msg: "Token is invalid or expired." });
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json({ msg: "Password updated successfully!" });

};

module.exports = { register, login, forgotPassword, resetPassword }