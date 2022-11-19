const db = require("../models/index.js");
//create main models
const Post = db.posts

const addPost = async (req, res)=>{
        const post = await Post.create({
            title : req.body.title,
            body : req.body.body,
            created_by : req.body.created_by,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            creator_image: req.body.creator_image,
            image : req.body.image,
            comments: req.body.comments,
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

// const addCoomentOnPost = async (req, res)=>{
//     const signUpData = {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         mobile : req.body.mobile,
//         password : req.body.password,
//         token: null,
//         active: 1
//     }
//     if (req.body.mobile=="") {
//         const data = {status:false,msg:"Empty mobile number is not allowed",data:null}
//         res.status(200).json(data)
//         return;
//     }
//     let userExist = await User.findOne({where : {mobile:req.body.mobile}})
//     if (userExist) {
//         const data = {status:false,msg:"User already registered",data:null}
//         res.status(200).json(data)
//         return;
//     }else{
//         const user = await User.create(signUpData);
//         if (user) {
//             const data = {status:true,msg:"Signup success",data:signUpData}
//             res.status(200).json(data)
//         }else{
//             const data = {status:false,msg:"Signup failed",data:null}
//             res.status(200).json(data)
//         }
//         return;
//     }
// }

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