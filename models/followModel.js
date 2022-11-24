module.exports = (Sequelize, DataTypes) => {
    const Follow = Sequelize.define("follow",{
        myid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        follower_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        group: {
            type: DataTypes.STRING,
            defaultValue: "follow"
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "approved"
        }
    })

    return Follow
}