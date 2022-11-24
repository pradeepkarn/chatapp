const dbConfig = require("../config/dbConfig.js");

const {Sequelize, DataTypes, UUID} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        port:dbConfig.port,
        dialect: dbConfig.dialect,
        operatorAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
    
)

sequelize.authenticate()
.then(()=>{
    // console.log()
})
.catch((err)=>{
    console.log('Error'+err)
})

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize

// db.products = require('./productModel.js')(sequelize, DataTypes)
// db.reviews = require('./reviewtModel.js')(sequelize, DataTypes)
db.users = require('./userModel.js')(sequelize, DataTypes)
db.rooms = require('./roomModel.js')(sequelize, DataTypes)
db.posts = require('./postModel.js')(sequelize, DataTypes)
db.friends = require('./friendModel.js')(sequelize, DataTypes)

db.sequelize.sync( {force: false} )
.then(()=>{
    // console.log('Yes re-sync done!')
})

module.exports = db