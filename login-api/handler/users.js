const Users = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'username', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

const register = async(req, res) => {
    const {username, email, password} = req.body;

    if (!username) {
        return res.status(400).json({
            "Status": false,
            "Message": "Empty Name"
        });
    }

    if (!email) {
        return res.status(400).json({
            "Status": false,
            "Message": "Empty Email"
        });
    }

    if (!password) {
        return res.status(400).json({
            "Status": false,
            "Message": "Empty Password"
        });
    }

    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({
            "Status": false,
            "Message": "Invalid Email Format. Email must end with @gmail.com"
        });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            username: username,
            email: email,
            password: hashPassword
        });
        res.json({
            "Status" : true,
            "Message" : "Berhasil menambahkan Akun"
        });
        res.status(200);
    } catch (error) {
        
    }
}

const login = async(req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({
            "Status": false,
            "Message": "Empty Email"
        });
    }

    if (!password) {
        return res.status(400).json({
            "Status": false,
            "Message": "Empty Password"
        });
    }

    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({
            "Status": false,
            "Message": "Invalid Email Format"
        });
    }
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) {
            return res.status(400).json({
                "Status" : false,
                "Message" : "Password Tidak Cocok"
            });
        }

        const userId = user[0].id;
        const userName = user[0].username;
        const userEmail = user[0].email;
        const accessToken = jwt.sign({userId, userName, userEmail}, process.env.ACCESS_TOKEN, {
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({userId, userName, userEmail}, process.env.REFRESH_TOKEN, {
            expiresIn: '1d'
        });

        await Users.update({refreshToken:refreshToken},{
            where:{
                id:userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        });
        res.json({ accessToken })

    } catch (error) {
        res.json({
            "Status" : false,
            "Message" : "Email Tidak Ditemukan"
        });
        res.status(404);
    }
}

const logout = async(req, res) => {
    const refresh_Token = req.cookies.refreshToken;
    if (!refresh_Token) {
        return res.sendStatus(204);
    }
    const user = await Users.findAll({
        where: {
            refreshToken : refresh_Token
        }
    });
    if (!user[0]) {
        return res.sendStatus(204);
    }

    const userId = user[0].id;
    await Users.update ({refreshToken: null},{
        where:{
            id:userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

module.exports = {getUser, register, login, logout};