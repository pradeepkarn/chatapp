module.exports = (Sequelize, DataTypes) => {
    const Post = Sequelize.define("post",{
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true
        },
        likes: {
            type: DataTypes.JSON,
            allowNull: true
        },
        comments: {
            type: DataTypes.JSON,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,              
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })
    return Post
}