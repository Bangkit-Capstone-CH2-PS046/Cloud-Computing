const express = require('express');
const verifyToken = require('../middleware/verify')
const refreshToken = require('../handler/refreshToken')
const { getUser, register, login, logout } = require('../handler/users');

const router = express.Router();

router.get('/users', verifyToken, getUser);
router.post('/register', register);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logout);

module.exports = router;