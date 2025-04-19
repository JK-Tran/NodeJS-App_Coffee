const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { uid: user.uid, phoneNumber: user.phoneNumber }, // Payload dùng uid thay vì _id
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { uid: user.uid }, // Payload dùng uid thay vì _id
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
