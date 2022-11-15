module.exports = (Sequelize, DataTypes) => {
    const Product = Sequelize.define("product",{
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE
        },
        description: {
            type: DataTypes.TEXT
        },
        published: {
            type: DataTypes.BOOLEAN
        }
    })

    return Product
}