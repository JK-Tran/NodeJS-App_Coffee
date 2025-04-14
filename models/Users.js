const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    phoneNumber: { type: String, require: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true }, // sẽ lưu password đã mã hoá
    email: { type: String },
    dob: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);