const sequelize = require('sequelize');
const db = require('../config/database.js');

const { DataTypes } = sequelize;

const users = db.define('users', {
    username:{type: DataTypes.STRING},
    email:{type: DataTypes.STRING},
    password:{type: DataTypes.STRING},
    refreshToken:{type: DataTypes.TEXT}
}, {
    freezeTableName : true
});

module.exports = users;