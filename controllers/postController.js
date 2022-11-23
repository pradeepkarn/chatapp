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
            likes: [],
            comments: [],
            active : true,
        });
        const data = {status:true,msg:"Post created",data:post}
        res.status(200).json(data)
}

const getPost = async (req,res)=>{
    // console.log(req.params.id)
    let id = req.params.id
    if (id) {
        let post = await Post.findOne({where : {id:id}})
        const allComments = JSON.parse(post.comments)
        
        let commentData = []; 
            const loopComment = async ()=>{
            for (const item of allComments) {
                var userCmt = await User.findOne({where : {id:item.userid}})
                 loopData = {
                     userid: item.userid,
                     message: item.message,
                     first_name: userCmt.first_name,
                     last_name: userCmt.last_name,
                     image: userCmt.image,
                     createdAt: "2022-11-22T09:49:45.000Z",
                     updatedAt: "2022-11-22T09:49:45.000Z"
                 }
                 commentData.push(loopData)
               }
            }
            await loopComment()

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
                        likes: [],
                        comments: commentData,
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

const addCoomentOnPost = async (req, res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    let msg = req.body.message
    // console.log("This is post: "+ postid)
    if (postid && userid) {
        try {
            let post = await Post.findOne({where : {id:postid}})
            let user = await User.findOne({where : {id:userid}})
            const getUser = async (id) => {
                return await User.findOne({where : {id:id}})
            }
            const comment = {
                userid : userid,
                message: msg,
                createdAt: Date(),
                updatedAt: Date()
            }
           
            const allComments = JSON.parse(post.comments)
            allComments.push(comment)
            await Post.update({comments:allComments}, {where : {id:postid}})
            

            let commentData = []; 
            const loopComment = async ()=>{
            for (const item of allComments) {
                var userCmt = await User.findOne({where : {id:item.userid}})
                 loopData = {
                     userid: item.userid,
                     message: item.message,
                     first_name: userCmt.first_name,
                     last_name: userCmt.last_name,
                     image: userCmt.image,
                     createdAt: "2022-11-22T09:49:45.000Z",
                     updatedAt: "2022-11-22T09:49:45.000Z"
                 }
                 commentData.push(loopData)
               }
            }
            await loopComment()

            const data = {status:true,msg:"Comment added",data:commentData}
            res.status(200).json(data)
            return;
        } catch (error) {
            const data = {status:false,msg:"Post not found",data:null}
            res.status(200).json(data)
            return;
        }
    }
    const data = {status:false,msg:"Soemthing went wrong",data:null}
    res.status(200).json(data)
    return;
}

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
    getAllPost,
    addCoomentOnPost
}