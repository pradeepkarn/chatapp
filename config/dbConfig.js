const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "NODE9572",
    DB: "node_learn",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "",
//     DB: "node_learn",
//     dialect: 'mysql',
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// }