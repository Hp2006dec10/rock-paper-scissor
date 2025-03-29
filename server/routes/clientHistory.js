const express = require("express");
const Game = require("../models/history");
const clientHistory = express.Router();

clientHistory.post("/game", async(req,res)=>{
    try{
    const {email, scoreHistory, inputHistory, gameStart, gameEnd} = req.body;
    const newGame = new Game({email, scoreHistory, inputHistory, gameStart, gameEnd});
    await newGame.save();
    return res.status(200).json({message: "Game saved successfully", error:""});
    }
    catch (err){
        return res.status(400).json({message:"",error:`Saving failed:  ${err}`});
    }
})

module.exports = clientHistory;