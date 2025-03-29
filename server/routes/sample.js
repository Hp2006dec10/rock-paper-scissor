const express = require("express");
const sample = express.Router();

sample.get("/",(req,res)=>{
    res.send("Welcome");
});
sample.get("/hi",(req,res)=>{
    res.send("Hi");
});

module.exports = sample;