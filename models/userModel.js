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
            type: DataTypes.TEXT(),
            allowNull : true
            // type: DataTypes.BLOB('long'),
        },
        cover_image: {
            type: DataTypes.TEXT(),
            allowNull : true
        },
        friend_list : {
            type: DataTypes.JSON,
            allowNull : true
        },
        follower_list : {
            type: DataTypes.JSON,
            allowNull : true
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
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })

    return User
}