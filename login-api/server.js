const express = require('express');
const env = require('dotenv');
const cookieParser = require('cookie-parser')
const db = require('./config/database.js');
const router = require('./routes/routes.js');
const users = require('./models/user-model.js');
const app = express();
env.config();

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }

    app.use(cookieParser())
    app.use(express.json());
    app.use(router);
    
    app.listen(5500, () => console.log('Listening on port 5500'));
};

startServer();