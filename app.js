//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const md5 = require("md5");
const app = express();
dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2");
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("user",userSchema);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const new_user = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    new_user.save(function(err){
        if(err){
            res.render(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req,res){
    const details = {
        email: req.body.username,
        password: md5(req.body.password)
    }
    User.findOne({email : details.email}, function(err,user){
        if(err){
            res.send(err);
        }else{
            if(user){
                if(user.password === details.password){
                    res.render("secrets");
                }
            }else{
                res.send("<h1>user details not found</h1>");
            }
        }
    })
});

app.listen(3000, function(err){
    if(!err){
        console.log("succesfully connected to port 3000");
    }else{
        console.log(err);
    }
});