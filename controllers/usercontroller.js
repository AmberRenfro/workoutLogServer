const router = require("express").Router();
const {UserModel} = require("../models");
const {UniqueConstraintError} = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    let {username, passwordhash} = req.body.user
    try{
        const User = await UserModel.create({ 
            username, 
            passwordhash: bcrypt.hashSync(passwordhash, 13),
        })

        const token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24  })
        res.status(201).json({ 
            message: "Account Created!",
            user: User,
            sessionToken: token

        })
    } catch(e) {
        if(e instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "username already exists"
            })
        } else {
        res.status(500).json({
            message: "Account creation failed!"
        })
        }
    }
})

router.post("/login", async (req, res) => {
    let {username, passwordhash} = req.body.user;

    try{
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        })
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash)
        
            if(passwordComparison) {
            let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});     
            res.status(200).json({
                user: loginUser,
                message: "Login successful!",
                sessionToken: token
            });
        } else {
            res.status(401).json({
            message: "Incorrect username or password"
            })
        }
    } else { 
        res.status(401).json({
            message: "Incorrect username or password"
            })        
    }
    } catch(e) {
        res.status(500).json({
            message: "Login failed!"
        })
    }
});

module.exports = router;