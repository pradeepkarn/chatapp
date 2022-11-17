module.exports = (Sequelize, DataTypes) => {
    const Room = Sequelize.define("room",{
        room_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        users: {
            type: DataTypes.JSON,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,              
        },
        image: {
            type: DataTypes.TEXT,
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