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
            type: DataTypes.TEXT('long'),   
        },
        image: {
            type: DataTypes.TEXT('long'),
        },
        info: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })
    return Room
}