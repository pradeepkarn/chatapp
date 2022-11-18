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
        like: {
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
        first_name: {
            type: DataTypes.STRING,        
        },
        last_name: {
            type: DataTypes.STRING,     
        },
        creator_image: {
            type: DataTypes.STRING,     
        },
        image: {
            type: DataTypes.TEXT,
        },
        info: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    })
    return Post
}