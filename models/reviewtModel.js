module.exports = (Sequelize, DataTypes) => {
    const Review = Sequelize.define("review",{
        rating: {
            type: DataTypes.INTEGER
        },
        discription: {
            type: DataTypes.TEXT
        },
        published: {
            type: DataTypes.BOOLEAN
        }
    })

    return Review
}