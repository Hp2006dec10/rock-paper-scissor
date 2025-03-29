const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    email: String,
    scoreHistory: [[Number]],
    inputHistory: [[String]],
    gameStart: Date,
    gameEnd: Date
})

module.exports = mongoose.model("History", historySchema);