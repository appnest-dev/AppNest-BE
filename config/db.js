require("dotenv").config();
const { Sequelize } = require("sequelize");

const DATABASE = {
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
};

const sequelize = new Sequelize(
  DATABASE.name,
  DATABASE.username,
  DATABASE.password,
  {
    host: DATABASE.host,
    dialect: DATABASE.dialect,
  }
);

module.exports = sequelize;
