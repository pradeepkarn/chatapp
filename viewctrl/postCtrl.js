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
          
            let im_as_follower = await Friend.findAll({where : {friend_id: me.id, group:"follow",status:"accepted"}})
            // console.log(im_as_friend)
            if ((im_as_follower).length>0) {
                const im_loopFollowing = async ()=>{
                for (const item of im_as_follower) {
                    var userFrnd = await User.findOne({where : {id:item.myid}})
                     friendsIds.push(userFrnd.id)
                   }
                }
                await im_loopFollowing()
                // console.log(im_as_friend+ " i m as frnd")
            }
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

const getPost = async (postid)=>{
    // console.log(req.params.id)
    let id = postid
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

const getAllPost = async ()=>{
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
       await loopPost();
    return postData
}


/*
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
  */