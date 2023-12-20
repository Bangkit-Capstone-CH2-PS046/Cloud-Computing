const { Sequelize } = require('sequelize');

const db = new Sequelize({
    dialect: 'mysql',
    host: '34.101.47.161',
    port: 3306,
    database: 'auth_db',
    username: 'root',
    password: 'kingcrimson101'
    });
module.exports = db;

