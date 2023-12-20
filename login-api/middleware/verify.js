const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.email = decoded.email;
        next();
    });
};

module.exports = verify;