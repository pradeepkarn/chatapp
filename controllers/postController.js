const db = require("../models/index.js");
//create main models
const Post = db.posts
const User = db.users

const addPost = async (req, res)=>{
    let imageName = null;
    let token = null;
    if (req.file) {
        imageName = req.file.filename;
    }else{
        imageName = null;
    }
    if (req.body.token) {
        token = req.body.token;
    }
    console.log(imageName)
    let user = await User.findOne({where : {token:token}})
        if (!user) {
            const data = {status:false,msg:"Invalid user token, post not created",data:null}
            res.status(200).json(data)
            return;
        }
        const post = await Post.create({
            title : req.body.title,
            body : req.body.body,
            tags : req.body.tags,
            created_by : user.id,
            image : imageName,
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
               const wrapPost = async ()=>{
               const item = post;
                    var user = await User.findOne({where : {id:item.created_by}});
                    wrapData = {
                        id: item.id,
                        title : item.title,
                        body : item.body,
                        tags : item.tags,
                        image : item.image,
                        likes: item.likes,
                        comments: item.comments,
                        created_by: item.created_by,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        creator_image: user.image,
                        image: item.image,
                        info: null,
                        active: true,
                        createdAt: "2022-11-22T09:49:45.000Z",
                        updatedAt: "2022-11-22T09:49:45.000Z"
                    }
                    return wrapData;
                 
               }
               const postData  = await wrapPost();

            const data = {status:true,msg:"Post found",data:postData}
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
    let postData = []; 
       const loopPost = async ()=>{
        for (const item of posts) {
            var user = await User.findOne({where : {id:item.created_by}});
            loopData = {
                id: item.id,
                title : item.title,
                body : item.body,
                tags : item.tags,
                image : item.image,
                likes: item.likes,
                comments: item.comments,
                created_by: item.created_by,
                first_name: user.first_name,
                last_name: user.last_name,
                creator_image: user.image,
                image: item.image,
                info: null,
                active: true,
                createdAt: "2022-11-22T09:49:45.000Z",
                updatedAt: "2022-11-22T09:49:45.000Z"
            }
            postData.push(loopData)
          }
       }
       await loopPost()
    const data = {status:true,msg:"Post found",data:postData}
    res.status(200).json(data)
}


module.exports = {
    addPost,
    getPost,
    getAllPost
}