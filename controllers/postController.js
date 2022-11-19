const db = require("../models/index.js");
//create main models
const Post = db.posts

const addPost = async (req, res)=>{
        const post = await Post.create({
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
        res.status(200).json(data)
}

const getPost = async (req,res)=>{
    let id = req.params.id
    if (id) {
        let post = await Post.findOne({where : {id:id}})
        if (post) {
            const data = {status:true,msg:"Room found",data:post}
            res.status(200).json(data)
        }else{
            const data = {status:false,msg:"Post not found",data:null}
            res.status(200).json(data)
        }
        
    }else{
        res.status(200).json("Please provide post id")
    }
    
}

const getAllPost = async (req,res)=>{
    //for all data
    let posts = await Post.findAll({});
    const data = {status:true,msg:"Post found",data:posts}
    res.status(200).json(data)
}


module.exports = {
    addPost,
    getPost,
    getAllPost
}