const mongoose = require("../dbconnection");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    createdAt: { type: Date, default: Date.now },  
    isActive: { type: Boolean, default: false },
    lastLogin : Date
});

module.exports = mongoose.model("User", userSchema);