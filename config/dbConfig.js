const dotenv = require("dotenv");
// dotenv.config();
module.exports = {
    HOST: "148.72.88.25",
    USER: "node_learn",
    PASSWORD: "DSX-QT]sFF%s",
    DB: "node_learn",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}