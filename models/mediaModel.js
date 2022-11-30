module.exports = (Sequelize, DataTypes) => {
    const Media = Sequelize.define("media",{
        obj_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        obj: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        group: {
            type: DataTypes.STRING,
            defaultValue: "banner"
        },
        detail: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })

    return Media
}