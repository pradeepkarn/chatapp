const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    HOST: process.env.DB_HOST || "148.72.88.25",
    USER: process.env.DB_USER || "node_learn",
    PASSWORD: process.env.DB_PASS || "DSX-QT]sFF%s",
    DB: process.env.DB_NAME || "node_learn",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}