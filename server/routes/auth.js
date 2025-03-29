const express = require("express");
const auth = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt=require("jsonwebtoken");
require("dotenv").config();

auth.post("/login",async (req,res)=>{
    try{
        const {email, password} = req.body;
        
        const currentUser = await User.findOne({email: email});
        if (!currentUser) return res.status(400).json({message: "", error:"User not found"});

        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) return res.status(400).json({message: "", error:"Password incorrect"});

        const token = jwt.sign(
            { userId: currentUser._id, email: currentUser.email, name:currentUser.name },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }    
        );
        currentUser.isActive = true;
        currentUser.lastLogin = new Date();
        currentUser.save();

        return res.status(200).json({message: "Login successful", error:"",token});
    }
    catch (err){
        console.log("Login unsuccessful", err);
        return res.status(400).json({message:"",error:`Login unsuccessful. ${err}`});
    }
});

auth.post("/logout",async(req,res)=>{
    try{
        const {email} = req.body;
        const currentUser = await User.findOne({email: email});
        if (currentUser.isActive) currentUser.isActive = false;
        else res.status(400).json({message:"",error:"User is not at all logged in"});
        console.log(currentUser);
        currentUser.save();
        return res.status(200).json({message: "Logged out successfully"});
    }
    catch(err){
        return res.status(400).json({error: `Failed to logout ${err}`});
    }
        
})

auth.post("/signup",async (req,res)=>{
    try{
        const {name, email, phone, password} = req.body;

        const existingUserEmail = await User.findOne({email: email});
        const existingUserPhone = await User.findOne({phone: phone});
        if (existingUserEmail || existingUserPhone) return res.status(400).json({message:"", error:"User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phone, email, password: hashedPassword});

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, name:newUser.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }    
        );
        await newUser.save();
        res.json({ success: true, message: "User registered successfully", token});
    }
    catch (err){
        return res.status(400).json({message:"", error:`Signup failed, ${err}`})
    }   
});

module.exports = auth;