const db = require("../models/index.js");
//create main models
const Post = db.posts
const User = db.users
const Friend = db.friends

function search(attr,attrValue,myArray){
    for (let i=0; i < myArray.length; i++) {
        if (myArray[i].attr === attrValue) {
            return myArray[i];
        }
    }
}

function uuidv4(any="") {
    return any+"_"+Date.now()+"_"+Math.random()
}
//   console.log(uuidv4())
const myFrndsIds = async (token)=>{
    var msg = "";
    const me = await User.findOne({where : {token:token}})
    if (me) {
            let friendsIds = []; 
            let my_friends = await Friend.findAll({where : {myid: me.id, group:"friendship",status:"accepted"}})
            // console.log(my_friends)
            if (my_friends.length>0) {
                const my_loopFriends = async ()=>{
                for (const item of my_friends) {
                    var userFrnd = await User.findOne({where : {id:item.friend_id}})
                     friendsIds.push(userFrnd.id)
                   }
                }
                await my_loopFriends()
                // console.log(my_friends+ " my frnd")
            }
            let im_as_friend = await Friend.findAll({where : {friend_id: me.id, group:"friendship",status:"accepted"}})
            // console.log(im_as_friend)
            if ((im_as_friend).length>0) {
                const im_loopFriends = async ()=>{
                for (const item of im_as_friend) {
                    var userFrnd = await User.findOne({where : {id:item.myid}})
                     friendsIds.push(userFrnd.id)
                   }
                }
                await im_loopFriends()
                // console.log(im_as_friend+ " i m as frnd")
            }
          
            // let im_as_follower = await Friend.findAll({where : {friend_id: me.id, group:"follow",status:"accepted"}})
           
            // if ((im_as_follower).length>0) {
            //     const im_loopFollowing = async ()=>{
            //     for (const item of im_as_follower) {
            //         var userFrnd = await User.findOne({where : {id:item.myid}})
            //          friendsIds.push(userFrnd.id)
            //        }
            //     }
            //     await im_loopFollowing()
                
            // }

            try {
                return [...new Set(friendsIds)];
            } catch (error) {
                return friendsIds;
            }
            // return friendsIds;
            
    }
    else{
        return []
    }
    
}








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
    // console.log(imageName)
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
        
        typeof(post.comments)=="string"?post.comments=JSON.parse(post.comments):""
        const allComments = post.comments
        let commentData = []; 
            const loopComment = async ()=>{
            for (const item of allComments) {
                var userCmt = await User.findOne({where : {id:item.userid}})
                 loopData = {
                    comment_id: item.comment_id,
                     userid: item.userid,
                     message: item.message,
                     first_name: userCmt.first_name,
                     last_name: userCmt.last_name,
                     image: userCmt.image,
                     createdAt: item.createdAt,
                     updatedAt: item.updatedAt
                 }
                 commentData.push(loopData)
               }
            }
            await loopComment()
            typeof(post.likes)=="string"?post.likes=JSON.parse(post.likes):""
            const allLikes = JSON.parse(post.likes)
            let likeData = []; 
            const loopLike = async ()=>{
            for (const item of allLikes) {
                var userLike = await User.findOne({where : {id:item.userid}})
                 loopData = {
                    like_id: item.like_id,
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
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
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
    if (!req.body.token || !req.body.message || !req.body.postid) {
        const data = {status:false,msg:"Missing parameters",data:null}
        res.status(200).json(data)
        return;
    }
    let token = req.body.token;
    let user = await User.findOne({where : {token:token}})
    if (!user) {
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
        return;
    }
    let userid = user.id
    let postid = req.body.postid
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
                comment_id: uuidv4(userid),
                userid : userid,
                message: msg,
                createdAt:  dateText,
                updatedAt:  dateText
            }

            typeof(post.comments)=="string"?post.comments=JSON.parse(post.comments):""
            const allComments = post.comments;
            allComments.push(comment)
            await Post.update({comments:allComments}, {where : {id:postid}})

            

            let commentData = []; 
            const loopComment = async ()=>{
            for (const item of allComments) {
                var userCmt = await User.findOne({where : {id:item.userid}})
                const d = new Date();
                var dateText = d.toISOString();
                 loopData = {
                    comment_id: item.comment_id,
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
            // Single comment data
            var lastCmt = await User.findOne({where : {id:comment.userid}})
            let lastCommentData = {
                comment_id: comment.comment_id,
                userid: comment.userid,
                message: comment.message,
                first_name: lastCmt.first_name,
                last_name: lastCmt.last_name,
                image: lastCmt.image,
                createdAt: dateText,
                updatedAt: dateText
            }
            //single comment data


            const data = {status:true,msg:"Comment added",data:lastCommentData}
            res.status(200).json(data)
            return;
        } catch (error) {
            console.log(error)
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
                like_id: uuidv4(userid),
                userid : userid,
                createdAt: dateText,
                updatedAt: dateText 
            }
           
            typeof(post.likes)=="string"?post.likes=JSON.parse(post.likes):""
            const allLikes = post.likes
            
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
                   }
                }
                return false;
                
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
                    like_id: item.like_id,
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



const removeCommentOnPost = async (req, res)=>{
    
    if (!req.body.token || !req.body.commentid || !req.body.postid) {
        const data = {status:false,msg:"Missing parameters",data:null}
        res.status(200).json(data)
        return;
    }
    const postid = req.body.postid;
    const commentid = req.body.commentid;
    const token = req.body.token;
    const logged_in_user = await User.findOne({where : {token:token}})
    if (!logged_in_user) {
        const data = {status:false,msg:"You are not logged in",data:null}
        res.status(200).json(data)
        return;
    }
   
    // console.log("This is post: "+ postid)
    if (postid) {
        try {
            let post = await Post.findOne({where : {id:postid}})
            if (!post) {
                const data = {status:false,msg:"Post not found",data:allCmts}
                res.status(200).json(data)
                return;
            }
            typeof(post.comments)=="string"?post.comments=JSON.parse(post.comments):""
            let allCmts = post.comments
            
            const search_cmt =  (attrValue,myArray)=>{
                for (let i=0; i < myArray.length; i++) {
                    if (myArray[i].comment_id === attrValue) {
                        return myArray[i];
                    }
                }
            }
            let commentObj = search_cmt(commentid,allCmts)
            let commented_by = 0;
            try {
                commented_by = commentObj.userid;
                
            } catch (commented_by) {
                commented_by = 0;
            }
            var removeCmnt = async function(arr, attr, value){
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
                   }
                }
                return false;
                
            }
            
            if (post.created_by!=logged_in_user.id && commented_by!=logged_in_user.id) {
                const data = {status:false, msg:"You are not post author or commentetor, you can not delete this comment", data:null}
                res.status(200).json(data)
                return;
            }
            if(await removeCmnt(allCmts,'comment_id',commentid)){
                await Post.update({comments:allCmts}, {where : {id:postid}})
                const data = {status:true,msg:"Deleted",data:null}
                res.status(200).json(data)
                return;
            }else{
                const data = {status:false,msg:"Comment not found",data:null}
                res.status(200).json(data)
                return;
            }
           
            
        } catch (error) {
            const data = {status:false,msg:"Comment not found, something went wrong",data:null}
            res.status(200).json(data)
            return;
        }
    }
    const data = {status:false,msg:"Invalid post id",data:null}
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
            // console.log(item)
            // item ? "": console.log(item)
            typeof(item.comments)=="string"?item.comments=JSON.parse(item.comments):""
            
            for (var cmt of item.comments) {
                var userCmt = await User.findOne({where : {id:cmt.userid}})
                cmtDatas = 
                    {
                        comment_id: cmt.comment_id,
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
            
            typeof(item.likes)=="string"?item.likes=JSON.parse(item.likes):""
            for (var like of item.likes) {
                var userCmt = await User.findOne({where : {id:like.userid}})
                likeDatas = 
                    {
                        like_id: like.like_id,
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


const getPostByUserId = async (req,res)=>{
    if (!req.body.userid) {
        const data = {status:false,msg:"user id is required",data:null}
        res.status(200).json(data)
        return;
    }
    let userId = req.body.userid;
    let posts = await Post.findAll({where: {created_by:userId}});
    let postData = []; 
       const loopPost = async ()=>{

        for (const item of posts) {
            var user = await User.findOne({where : {id:item.created_by}});
            var loopCmtData = []
            
            var cmtDatas = []
            // console.log(item)
            // item ? "": console.log(item)
            typeof(item.comments)=="string"?item.comments=JSON.parse(item.comments):""
            
            for (var cmt of item.comments) {
                var userCmt = await User.findOne({where : {id:cmt.userid}})
                cmtDatas = 
                    {
                        comment_id: cmt.comment_id,
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
            
            typeof(item.likes)=="string"?item.likes=JSON.parse(item.likes):""
            for (var like of item.likes) {
                var userCmt = await User.findOne({where : {id:like.userid}})
                likeDatas = 
                    {
                        like_id: like.like_id,
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


const getMyFriendsPost = async (req,res)=>{
    if (!req.body.token) {
        const data = {status:false,msg:"Login is required",data:null}
        res.status(200).json(data)
        return;
    }
    const token = req.body.token
    let posts = []
    let frndsids = await myFrndsIds(token)
    if (frndsids.length==0) {
        const data = {status:false,msg:"No friends found",data:null}
        res.status(200).json(data)
        return;
    }
    for (const frndid of frndsids) {
        if (frndid!=null) {
            let mypost = await Post.findOne({where : {created_by: frndid}})
            if (mypost) {
                posts.push(mypost);
            }
            
        }
        
    }

    // let posts = await Post.findAll({});
    let postData = []; 
       const loopPost = async ()=>{

        for (const item of posts) {
            // console.log(item)
            var user = await User.findOne({where : {id:item.created_by}});
            var loopCmtData = []
            
            var cmtDatas = []
            // console.log(item)
            // item ? "": console.log(item)
            typeof(item.comments)=="string"?item.comments=JSON.parse(item.comments):""
            
            for (var cmt of item.comments) {
                var userCmt = await User.findOne({where : {id:cmt.userid}})
                cmtDatas = 
                    {
                        comment_id: cmt.comment_id,
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
            
            typeof(item.likes)=="string"?item.likes=JSON.parse(item.likes):""
            for (var like of item.likes) {
                var userCmt = await User.findOne({where : {id:like.userid}})
                likeDatas = 
                    {
                        like_id: like.like_id,
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
                is_friend: true,
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
//delete post 

const deletePost = async (req,res)=>{
    if (!req.body.postid || !req.body.token) {
        const data = {status:false,msg:"All fields are mandetory",data:null}
        res.status(200).json(data)
        return;
    }
    let id = req.body.postid
    let token = req.body.token
    let user = await User.findOne({where : {token:token}})
    if (!user) {
        const data = {status:false,msg:"You are not logged in",data:null}
        res.status(200).json(data)
        return;
    }
    try {
        let post = await Post.findOne({where : {id:id}})
        if (post.created_by==user.id) {
            await Post.destroy({where : {id:id}})
            const data = {status:true,msg:"Deleted successfully",data:null}
            res.status(200).json(data)
            return;
        }else{
            const data = {status:false,msg:"You are not publisher of this post, hence you can not delete this post",data:null}
            res.status(200).json(data)
            return;
        }
    } catch (error) {
        const data = {status:false,msg:"Post not found, something went wrong",data:null}
        res.status(200).json(data)
        return;
    }
}



const getPostWithFrnds = async (req,res)=>{
    if (!req.body.token) {
        const data = {status:false,msg:"Token is required",data:null}
        res.status(200).json(data)
    }
    const token = req.body.token;
    const logged_in_user = await User.findOne({where: {token:token}})
    if (!logged_in_user) {
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }

    let id = req.body.id
    if (id) {
        let post = await Post.findOne({where : {id:id}})
        var myfrndsids = await myFrndsIds(token)
        var is_friend = myfrndsids.includes(post.created_by);

        typeof(post.comments)=="string"?post.comments=JSON.parse(post.comments):""
        const allComments = post.comments
        let commentData = []; 
            const loopComment = async ()=>{
            for (const item of allComments) {
                var userCmt = await User.findOne({where : {id:item.userid}})
                 loopData = {
                    comment_id: item.comment_id,
                     userid: item.userid,
                     message: item.message,
                     first_name: userCmt.first_name,
                     last_name: userCmt.last_name,
                     image: userCmt.image,
                     createdAt: item.createdAt,
                     updatedAt: item.updatedAt
                 }
                 commentData.push(loopData)
               }
            }
            await loopComment()
            typeof(post.likes)=="string"?post.likes=JSON.parse(post.likes):""
            const allLikes = JSON.parse(post.likes)
            let likeData = []; 
            const loopLike = async ()=>{
            for (const item of allLikes) {
                var userLike = await User.findOne({where : {id:item.userid}})
                 loopData = {
                    like_id: item.like_id,
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
                        is_friend: is_friend,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
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


const getAllPostWithFrnds = async (req,res)=>{
    if (!req.body.token) {
        const data = {status:false,msg:"Token is required",data:null}
        res.status(200).json(data)
    }
    const token = req.body.token;
    const logged_in_user = await User.findOne({where: {token:token}})
    if (!logged_in_user) {
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }
    //for all data
    let posts = await Post.findAll({});
    let postData = []; 
       const loopPost = async ()=>{

        for (const item of posts) {
            var user = await User.findOne({where : {id:item.created_by}});
            var loopCmtData = []
            var myfrndsids = await myFrndsIds(token)
            var is_friend = myfrndsids.includes(item.created_by);
            var cmtDatas = []
            // console.log(item)
            // item ? "": console.log(item)
            typeof(item.comments)=="string"?item.comments=JSON.parse(item.comments):""
            
            for (var cmt of item.comments) {
                var userCmt = await User.findOne({where : {id:cmt.userid}})
                cmtDatas = 
                    {
                        comment_id: cmt.comment_id,
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
            
            typeof(item.likes)=="string"?item.likes=JSON.parse(item.likes):""
            for (var like of item.likes) {
                var userCmt = await User.findOne({where : {id:like.userid}})
                likeDatas = 
                    {
                        like_id: like.like_id,
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
                is_friend: is_friend,
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
    addLikeOnPost,
    deletePost,
    removeCommentOnPost,
    getMyFriendsPost,
    getAllPostWithFrnds,
    getPostWithFrnds,
    getPostByUserId
}