module.exports = (Sequelize, DataTypes) => {
    const Chat = Sequelize.define("chat",{
        room_id: {
            type: DataTypes.INTEGER,
        },
        sender_id: {
            type: DataTypes.INTEGER,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    })
    return Chat
}