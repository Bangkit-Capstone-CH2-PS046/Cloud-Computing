const Users = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/routes');

const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(401);
        }

        const user = await Users.findAll({
            where:{
                refreshToken: refreshToken
            }
        });

        if (!user[0]) {
            return res.sendStatus(403)
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                res.sendStatus(403);
            }

            const userId = user[0].id;
            const userName = user[0].username;
            const userEMail = user[0].email;
            const accessToken = jwt.sign({userId, userName, userEMail}, process.env.ACCESS_TOKEN, {
                expiresIn: '5m'
            });
            res.json({accessToken})
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = refreshToken;