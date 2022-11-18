const db = require("../models/index.js");
//create main models
const Post = db.posts

const addPost = async (req, res)=>{
        const post = await Room.create({
            title : req.body.title,
            body : req.body.body,
            created_by : req.body.created_by,
            first_name: req.body.first_name,
            last_name: req.body.first_name,
            creator_image: req.body.creator_image,
            image : req.body.image,
            active : true,
        });
        const data = {status:true,msg:"Post created",data:post}
        res.status(200).send(data)
}

const getPost = async (req, res)=>{
    const post = await Room.create({
        title : req.body.title,
        body : req.body.body,
        created_by : req.body.created_by,
        first_name: req.body.first_name,
        last_name: req.body.first_name,
        creator_image: req.body.creator_image,
        image : req.body.image,
        active : true,
    });
    const data = {status:true,msg:"Post created",data:post}
    res.status(200).send(data)
}



module.exports = {
    addPost
}