const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: { type: String, required: true},
    expiresAt: {type: Date, default: Date.now,expires: '7d'},

},{ timestamps: true });

module.exports = mongoose.model("Token", TokenSchema);