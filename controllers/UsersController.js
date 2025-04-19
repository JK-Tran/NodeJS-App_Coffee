const Users = require("../models/User")
const Token = require("../models/Token");

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt");

dotenv.config();

exports.registerUser = async (req, res) => {
    const { uid, phoneNumber, firstName, lastName, password } = req.body;
  
    try {
      // Kiểm tra user đã tồn tại
      const existingUser = await Users.findOne({ uid });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists!" });
      }
  
      // Mã hoá mật khẩu với SECRET_KEY
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password + process.env.SECRET_KEY, salt);
  
      // Tạo user mới
      const newUser = new Users({
        uid,
        phoneNumber,
        firstName,
        lastName,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: "User registered successfully!",
        user: {
          uid: newUser.uid,
          phoneNumber: newUser.phoneNumber,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
    } catch (err) {
      console.error("❌ Register error:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  };

  exports.LoginUser  = async (req, res) =>{
    const{ phoneNumber, password } = req.body;

    try {
      const user = await Users.findOne({ phoneNumber });
      if (!user) return res.status(404).json({ error: "User not found" });
    
      const isMatch = await bcrypt.compare(password + process.env.SECRET_KEY, user.password);
      if (!isMatch) return res.status(400).json({ error: "Wrong Password" });
    
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
    
      await Token.create({ user: user._id, token: refreshToken });
      const { password: _, ...userWithoutPassword } = user._doc;

      res.status(200).json({uid: user.uid, accessToken, refreshToken });
    } catch (error) {
      console.error("❌ Login error:", error); // In chi tiết lỗi
      res.status(500).json({ error: "Login failed", message: error.message });
    }
  };

  exports.logoutUser = async (req, res) => {
    const { refreshToken } = req.body;
    
    try {
      if (!refreshToken) {
        return res.status(400).json({ error: "No refresh token provided" });
      }
  
      // Xóa refresh token khỏi database
      await Token.findOneAndDelete({ token: refreshToken });
  
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("❌ Logout error:", err);
      res.status(500).json({ error: "Logout failed" });
    }
  };
  
  exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token" });
  
    try {
      // Check tồn tại trong DB
      const savedToken = await Token.findOne({ token: refreshToken });
      if (!savedToken) return res.status(403).json({ error: "Invalid token" });
  
      const decoded = verifyRefreshToken(refreshToken);
  
      const user = await Users.findById(decoded.id);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
  
      // Xoá token cũ, lưu token mới
      await Token.deleteOne({ token: refreshToken });
      await Token.create({ user: user._id, token: newRefreshToken });
  
      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      res.status(403).json({ error: "Invalid or expired token" });
    }
  };

// Xoá người dùng theo UID
  exports.deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
  
      const user = await Users.findOneAndDelete({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("❌ Delete error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.getAllUsers = async(req,res)=>{
    try{
        const users = await Users.find({},"-password");

        res.status(200).json({
            message: "Fetched users successfully",
            users:users
        });
    }catch(error){
        console.error("❌ Delete error:", error);
        res.status(500).json({ message: "Server error" });
    }
};