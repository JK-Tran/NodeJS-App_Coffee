const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const verifyToken = require("../middleware/verifyToken");

router.post('/check-phone', UsersController.checkPhoneNumber);
router.post('/register', UsersController.registerUser);
// Đăng nhập -> trả về accessToken và refreshToken
router.post('/login', UsersController.LoginUser);
// Làm mới accessToken khi accessToken hết hạn
router.post('/refresh-token', UsersController.refreshToken);
router.post('/logout', UsersController.logoutUser);

router.delete('/delete/:uid', UsersController.deleteUser);
router.get("/", verifyToken, UsersController.getAllUsers); 
module.exports = router;