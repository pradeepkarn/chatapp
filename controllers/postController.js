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

            const allLikes = JSON.parse(post.likes)
            let likeData = []; 
            const loopLike = async ()=>{
            for (const item of allLikes) {
                var userLike = await User.findOne({where : {id:item.userid}})
                 loopData = {
                     userid: item.userid,
                     first_name: userLike.first_name,
                     last_name: userLike.last_name,
                     image: userLike.image,
                     createdAt: "2022-11-22T09:49:45.000Z",
                     updatedAt: "2022-11-22T09:49:45.000Z"
                 }
                 likeData.push(loopData)
               }
            }
            await loopLike()

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
                        likes: likeData,
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

const addCommentOnPost = async (req, res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    let msg = req.body.message
    // console.log("This is post: "+ postid)
    if (postid && userid) {
        try {
            let post = await Post.findOne({where : {id:postid}})
            // let user = await User.findOne({where : {id:userid}})
            const getUser = async (id) => {
                return await User.findOne({where : {id:id}})
            }
            const d = new Date();
            let dateText = d.toISOString();
            const comment = {
                userid : userid,
                message: msg,
                createdAt:  dateText,
                updatedAt:  dateText
            }
           
            const allComments = JSON.parse(post.comments)
            allComments.push(comment)
            await Post.update({comments:allComments}, {where : {id:postid}})
            

            let commentData = []; 
            const loopComment = async ()=>{
            for (const item of allComments) {
                var userCmt = await User.findOne({where : {id:item.userid}})
                const d = new Date();
                var dateText = d.toISOString();
                 loopData = {
                     userid: item.userid,
                     message: item.message,
                     first_name: userCmt.first_name,
                     last_name: userCmt.last_name,
                     image: userCmt.image,
                     createdAt: dateText,
                     updatedAt: dateText
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

const addLikeOnPost = async (req, res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    // console.log("This is post: "+ postid)
    if (postid && userid) {
        try {
            let post = await Post.findOne({where : {id:postid}})
            // let user = await User.findOne({where : {id:userid}})
            const getUser = async (id) => {
                return await User.findOne({where : {id:id}})
            }
            const d = new Date();
            let dateText = d.toISOString();
            const like = {
                userid : userid,
                createdAt: dateText,
                updatedAt: dateText 
            }
           
            const allLikes = JSON.parse(post.likes)
            var removeLike = function(arr, attr, value){
                var i = arr.length;
                
                if (i==0) {
                    console.log(i+" arr length ")
                    return false;
                }
                while(i--){
                   if( arr[i] 
                       && arr[i].hasOwnProperty(attr) 
                       && (arguments.length > 2 && arr[i][attr] === value ) ){ 
                       arr.splice(i,1);
                       return true;
                   }else{
                    return false;
                   }
                }
                
            }
            if (removeLike(allLikes,'userid',userid)==false) {
                allLikes.push(like)
            }
            
            await Post.update({likes:allLikes}, {where : {id:postid}})

            let likeData = []; 
            const loopLike = async ()=>{
            for (const item of allLikes) {
                var userLike = await User.findOne({where : {id:item.userid}})
                 loopData = {
                     userid: item.userid,
                     first_name: userLike.first_name,
                     last_name: userLike.last_name,
                     image: userLike.image,
                     createdAt: item.createdAt,
                     updatedAt: item.updatedAt
                 }
                 likeData.push(loopData)
               }
            }
            await loopLike()

            const data = {status:true,msg:"You like this post",data:likeData}
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
            var loopCmtData = []
            
            var cmtDatas = []
            for (var cmt of JSON.parse(item.comments)) {
                var userCmt = await User.findOne({where : {id:cmt.userid}})
                cmtDatas = 
                    {
                        userid: cmt.userid,
                        message: cmt.message,
                        first_name: userCmt.first_name,
                        last_name: userCmt.last_name,
                        image: userCmt.image,
                        createdAt: cmt.createdAt,
                        updatedAt: cmt.updatedAt
                    }
                    loopCmtData.push(cmtDatas)
                }
            var loopLikeData = []
            var likeDatas = []
            for (var like of JSON.parse(item.likes)) {
                var userCmt = await User.findOne({where : {id:like.userid}})
                likeDatas = 
                    {
                        userid: like.userid,
                        first_name: userCmt.first_name,
                        last_name: userCmt.last_name,
                        image: userCmt.image,
                        createdAt: like.createdAt,
                        updatedAt: like.updatedAt
                    }
                    loopLikeData.push(likeDatas)
                }
            
            loopData = {
                id: item.id,
                title : item.title,
                body : item.body,
                tags : item.tags,
                image : item.image,
                likes: loopLikeData,
                comments: loopCmtData,
                created_by: item.created_by,
                first_name: user.first_name,
                last_name: user.last_name,
                creator_image: user.image,
                image: item.image,
                info: null,
                active: true,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
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
    addCommentOnPost,
    addLikeOnPost
}