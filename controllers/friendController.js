const db = require("../models/index.js");
const Friend = db.friends
const User = db.users
//main works

const d = new Date();
let dateText = d.toISOString();


const requestFriendship = async (req,res)=>{
    const token = req.body.token
    const friend_id = req.body.friend_id;
    if (token && friend_id) {
        let user = await User.findOne({where : {token:token}})
        let friend = await User.findOne({where : {id:friend_id}})
        if (!friend) {
            const data = {status:false,msg:"Friend does not exist",data:null}
            res.status(200).json(data)
            return;
        }
        if (friend_id==user.id) {
            const data = {status:false,msg:"You can not send friend request to yourself",data:null}
            res.status(200).json(data)
            return;
        }
        if (user) {
            try {
                const addFriendListData = {
                    myid: user.id,
                    friend_id: friend_id,
                    group: "friendship"
                }
                let friendshipRequestExists = await Friend.findOne({where : {myid: user.id, friend_id:friend_id, group:"friendship"}})
                let friendshipExists = await Friend.findOne({where : {myid: friend_id, friend_id: user.id, group:"friendship"}})
                if (friendshipRequestExists) {
                    var status = friendshipRequestExists.status
                    await Friend.update({updatedAt: dateText}, {where : {id:friendshipRequestExists.id}})
                    const data = {status:false,msg:`You already have sent request and status is ${status}`,data:null}
                    res.status(200).json(data)
                    return;
                }
                if (friendshipExists) {
                    var status = friendshipExists.status
                    await Friend.update({updatedAt: dateText}, {where : {id:friendshipExists.id}})
                    const data = {status:false,msg:`You already have connected with this user and status is ${status}`,data:null}
                    res.status(200).json(data)
                    return;
                }
                const newFriend = Friend.create(addFriendListData)
                if (newFriend) {
                    const data = {status:true,msg:"Request sent, wait for approval",data:null}
                    res.status(200).json(data)
                }else{
                    const data = {status:false,msg:"Not updated",data:null}
                    res.status(200).json(data)
                }
                return;
            } catch (error) {
                console.log(error)
                const data = {status:false,msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false,msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token or friend's id",data:null}
        res.status(200).json(data)
    }
    
}
   

const responseFriendship = async (req,res)=>{
    const token = req.body.token
    const requested_by = req.body.requested_by;
    const accept = req.body.accept;
    var msg = "";
    if (token && requested_by) {
        const me = await User.findOne({where : {token:token}})
        if (me) {
            try {
                let friendship = await Friend.findOne({where : {myid: requested_by, friend_id:me.id,group:"friendship"}})
                if (!friendship) {
                    const data = {status:false,msg:"Friendship does not exist",data:null}
                    res.status(200).json(data)
                    return;
                }
                if (accept==true) {
                    const acceptFriendship = {
                        status: "accepted",
                        updatedAt: dateText
                    }
                    await Friend.update(acceptFriendship, {where : {id:friendship.id}})
                    msg = "accepted"
                }else{
                    await Friend.destroy({where : {id:friendship.id}})
                    msg = "rejected"
                }
                const data = {status:true,msg: `You have ${msg} the friendship`,data:null}
                res.status(200).json(data)
                return;
            } catch (error) {
                console.log(error)
                const data = {status:false,msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false,msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }
    
}


const getFriendshipList = async (req,res)=>{
    if (!req.body.token) {
        const data = {status:false, msg:"User credential needed", data:null}
        res.status(200).json(data)
        return;
    }
    const token = req.body.token
    var msg = "";
    let friendList = []
    if (token) {
        const me = await User.findOne({where : {token:token}})
        if (me) {
            // console.log(me.id)
            try {
                let friendsData = []; 
                let my_friends = await Friend.findAll({where : {myid: me.id, group:"friendship"}})
                // console.log(my_friends)
                if (my_friends.length>0) {
                    const my_loopFriends = async ()=>{
                    for (const item of my_friends) {
                        var userFrnd = await User.findOne({where : {id:item.friend_id}})
                        const d = new Date();
                        var dateText = d.toISOString();
                         loopData = {
                             userid: item.userid,
                             message: item.message,
                             first_name: userFrnd.first_name,
                             last_name: userFrnd.last_name,
                             image: userFrnd.image,
                             createdAt: dateText,
                             updatedAt: dateText
                         }
                         friendsData.push(loopData)
                       }
                    }
                    await my_loopFriends()
                    console.log(my_friends+ " my frnd")
                }
                let im_as_friend = await Friend.findAll({where : {friend_id: me.id, group:"friendship"}})
                console.log(im_as_friend)
                if ((im_as_friend).length>0) {
                    const im_loopFriends = async ()=>{
                    for (const item of im_as_friend) {
                        var userFrnd = await User.findOne({where : {id:item.myid}})
                        const d = new Date();
                        var dateText = d.toISOString();
                         loopData = {
                             userid: item.userid,
                             message: item.message,
                             first_name: userFrnd.first_name,
                             last_name: userFrnd.last_name,
                             image: userFrnd.image,
                             createdAt: dateText,
                             updatedAt: dateText
                         }
                         friendsData.push(loopData)
                       }
                    }
                    await im_loopFriends()
                    // console.log(im_as_friend+ " i m as frnd")
                }
                
                const data = {status:true,msg: `You have ${msg} the friendship`,data:friendsData}
                res.status(200).json(data)
                return;
            } catch (error) {
                console.log(error)
                const data = {status:false,msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false,msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }
    
}


const getFriendshipRequestList = async (req,res)=>{
    const token = req.body.token
    var msg = "";
    let friendList = []
    if (token) {
        const me = await User.findOne({where : {token:token}})
        if (me) {
            // console.log(me.id)
            try {
                let friends_request_sent_data = []; 
                let my_friends = await Friend.findAll({where : {myid: me.id, group:"friendship", status: "pending"}})
                // console.log(my_friends)
                if (my_friends.length>0) {
                    const my_loopFriends = async ()=>{
                    for (const item of my_friends) {
                        var userFrnd = await User.findOne({where : {id:item.friend_id}})
                        const d = new Date();
                        var dateText = d.toISOString();
                         loopData = {
                             userid: userFrnd.id,
                             first_name: userFrnd.first_name,
                             last_name: userFrnd.last_name,
                             image: userFrnd.image,
                             createdAt: dateText,
                             updatedAt: dateText
                         }
                         friends_request_sent_data.push(loopData)
                       }
                    }
                    await my_loopFriends()
                    // console.log(my_friends+ " my frnd")
                }
                let im_as_friend = await Friend.findAll({where : {friend_id: me.id, group:"friendship", status: "pending"}})
                // console.log(im_as_friend)
                let friends_request_received_data = []; 
                if ((im_as_friend).length>0) {
                    const im_loopFriends = async ()=>{
                    for (const item of im_as_friend) {
                        var userFrnd = await User.findOne({where : {id:item.myid}})
                        const d = new Date();
                        var dateText = d.toISOString();
                         loopData = {
                            userid: userFrnd.id,
                             first_name: userFrnd.first_name,
                             last_name: userFrnd.last_name,
                             image: userFrnd.image,
                             createdAt: dateText,
                             updatedAt: dateText
                         }
                         friends_request_received_data.push(loopData)
                       }
                    }
                    await im_loopFriends()
                    // console.log(im_as_friend+ " i m as frnd")
                }
                
                let frndsdata = {
                    request_sent: friends_request_sent_data,
                    request_received: friends_request_received_data
                }
                const data = {status:true,msg: `You have ${msg} the friendship`,data:frndsdata}
                res.status(200).json(data)
                return;
            } catch (error) {
                console.log(error)
                const data = {status:false,msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false,msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }
    
}

const removeFriendship = async (req,res)=>{
    const token = req.body.token
    const friend_id = req.body.friend_id;
    var msg = "";
    if (token && friend_id) {
        const me = await User.findOne({where : {token:token}})
        if (me) {
            try {
                let i_had_requested = await Friend.findOne({where : {myid: me.id, friend_id: friend_id}})
                if (i_had_requested) {
                    await Friend.destroy({where : {id:i_had_requested.id}})
                    msg = "removed him/her from your"
                    const data = {status:true,msg: `You have ${msg} friendship`,data:null}
                    res.status(200).json(data)
                    return;
                }
                let i_was_requested = await Friend.findOne({where : {myid: friend_id, friend_id:me.id}})
                if (i_was_requested) {
                    await Friend.destroy({where : {id:i_was_requested.id}})
                    msg = "left out from his/her"
                    const data = {status:true, msg: `You have ${msg} friendship`,data:null}
                    res.status(200).json(data)
                    return;
                }else{
                    const data = {status:true, msg: `friendship not found`,data:null}
                    res.status(200).json(data)
                    return;
                }
                
            } catch (error) {
                console.log(error)
                const data = {status:false, msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false, msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }
    
}
  
module.exports = {
    requestFriendship,
    responseFriendship,
    getFriendshipList,
    removeFriendship,
    getFriendshipRequestList
}
