const {Sequelize} = require("sequelize");
const db = new Sequelize("postgres://postgres:password123@localhost:5432/workout-server");
module.exports = db;