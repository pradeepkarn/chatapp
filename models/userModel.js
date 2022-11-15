module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define("user",{
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM({
                values: ['male', 'female','other']
              })
        },
        bio: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT,
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dob: {
            type: 'DATETIME',
            // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            defaultValue: null,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })

    return User
}