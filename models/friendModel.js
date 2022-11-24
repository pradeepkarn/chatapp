module.exports = (Sequelize, DataTypes) => {
    const Friend = Sequelize.define("friend",{
        myid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        friend_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        info: {
            type: DataTypes.STRING,
            defaultValue: "friendship"
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "pending"
        }
    })

    return Friend
}