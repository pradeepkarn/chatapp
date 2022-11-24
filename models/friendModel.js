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
        group: {
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