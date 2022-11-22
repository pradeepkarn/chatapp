module.exports = (Sequelize, DataTypes) => {
    const Room = Sequelize.define("room",{
        room_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        users: {
            type: DataTypes.JSON,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,              
        },
        first_name: {
            type: DataTypes.STRING,        
        },
        last_name: {
            type: DataTypes.STRING,     
        },
        creator_image: {
            type: DataTypes.TEXT,   
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })
    return Room
}