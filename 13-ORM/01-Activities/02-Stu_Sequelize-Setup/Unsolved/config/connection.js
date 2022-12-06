const Sequelize = require("sequelize");
require("dotenv").config();
console.log(process.env);

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.USER,
	process.env.PASSWORD,
	{
		host: "localhost",
		dialect: "mysql",
		port: 3306,
	}
);

module.exports = sequelize;
